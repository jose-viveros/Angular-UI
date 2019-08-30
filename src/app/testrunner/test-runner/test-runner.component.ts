import {Component, OnInit, Query, OnDestroy, HostListener, Inject, NgModule} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {Injectable, Pipe, PipeTransform, Predicate} from '@angular/core';
import {DataService} from '../../service/data-api.service';
import {UserService} from '../../service/user.service';
import {TimerComponent} from '../../timer/timer.component';
import {MatDialogRef, MatDialog, MAT_DIALOG_DATA, MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition} from '@angular/material';
import {Observable} from 'rxjs/Observable';
import {ISubscription} from 'rxjs/Subscription';
import {timer} from 'rxjs/observable/timer';
import {SafeHtmlPipe} from '../../service/auth.constant';
import {Ng4LoadingSpinnerService} from 'ng4-loading-spinner';

export interface DialogData {
  timeOver: boolean;
}

export interface ProblemData {
  examName: string;
  desc: string;
}


@Component({
  selector: 'app-test-runner',
  templateUrl: './test-runner.component.html',
  styleUrls: ['./test-runner.component.css']
})
@NgModule({
  imports: [
    SafeHtmlPipe
  ]
})
export class TestRunnerComponent implements OnInit, OnDestroy {

  selectedOptions = null;
  currentTimer$: Observable<number>;
  question = null;
  questions = {};
  answersGiven = new Array(0);
  id: any = {};
  draftTestId: any = {};
  action: any = {};
  isLastQuestion = false;
  disableSubmit = false;
  disableNext = true;
  disablePrev = true;
  booleanResult = false;
  timerComponent = null;
  errorMessage = null;
  timerCount = 10;
  private subscription: ISubscription;
  maxExamDuration = 10;
  isLoggedIn$: Observable<boolean>;
  testTimeTaken = 0;
  showTimer = false;
  timerObject: any = {};
  navigateToCheckAnswer = false;
  examName = null;
  questionsTimeTaken: any = {};
  subjectName = null;
  marks = 0;
  duration = 0;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  ngOnDestroy() {
      this.userService.setShowTestRunnerMenu(false);
    this.stopQuestionTimer();
    this.stopTestTimer();
    /*
    To prevent calling when navigting to checkanswer after test completion
    */
    if (!this.navigateToCheckAnswer) {
      this.question.action = 'SAVE';
      this.performSaveAndSubmitAction(false);
    }
  }

  constructor(private router: Router,
    private dataService: DataService,
    private userService: UserService,
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    public snackBar: MatSnackBar,
    public spinner: Ng4LoadingSpinnerService) {

    /*this.activatedRoute.params.subscribe((params: Params) => {
      this.id = params['id'];
      this.action = params['type'];
    });*/
    this.userService.setShowTestRunnerMenu(true);
    this.activatedRoute.queryParams.subscribe(params => {
      this.id = params.id;
      this.action = params.type;
      this.examName = params.examName;
      this.subjectName = params.subjectName;
      this.marks = params.marks;
      this.duration = params.duration;
    });


    this.question = {
      userExamId: this.action === "RESUME" ? null : this.id,
      //testType: this.testType,
      testType: null,
      testId: this.action === "RESUME" ? this.id : null,
      subjectId: null,
      topicId: null,
      headerQuestionId: null,
      headerQuestionDescription: null,
      questionType: null,
      difficultyLevel: 0,
      questionSequence: 0,
      navigateToQuestionSequence: null,
      action: this.action,
      isDirtyObject: false,
      errorDescription: null,
      examMasterId: null,
      isCorrect: null,
      completedIn: null,
      isGroupQuestion: false,
      isLastQuestion: null,
      testQuestions: null,
      previousExamName: null,
      year: null,
      timeTaken: null,
      isTimeOut: false
    };
    /*if (this.testType == 'MOCK') {
      this.question.subjectId = this.id;
      this.question.topicId = null;
    } else {
      this.question.subjectId = null;
      this.question.topicId = this.id;
    }*/
    this.timerComponent = new TimerComponent(dataService);
  }

  ngOnInit() {
    this.navigateToCheckAnswer = false;
    this.isLoggedIn$ = this.userService.isLoggedIn;
    if (this.question.action === 'RESUME') {
      this.checkInprogressExam();
    } else {
      this.testRunner();
      this.testTimeTaken = 0;
    }
  }

  startTestTimer() {
    //this.timerComponent.startTimer(this.testTimeTaken);
    this.showTimer = true;
  }

  @HostListener('click', ['$event'])
    clickEvent(event) {
        event.srcElement.setAttribute('disabled', true);
            setTimeout(function(){
            event.srcElement.removeAttribute('disabled');
            }, 1000);
    }

  stopTestTimer() {
    // this.timerComponent.stopTimer();
    this.dataService.getSub.unsubscribe();
    this.subscription.unsubscribe();
  }


  checkTestTimer() {
    const timer = Observable.timer(1, 1000);
    this.subscription = timer.subscribe(
      t => {
        const ct = this.dataService.getTime();
        //if(ct >= this.maxExamDuration) {
        if (ct === 0) {
          this.stopQuestionTimer();
          this.stopTestTimer();
          this.disableNext = true;
          this.disablePrev = true;
          this.disableSubmit = false;
          this.showTimeOverDialog();
        }
      }
    );
  }

  showTimeOverDialog() {
    const dialogRef = this.dialog.open(DialogConfirmTestSubmission, {
      width: '25%',
      data: {"timeOver": true}
    });

    dialogRef.afterClosed().subscribe(req => {
      this.question.action = 'SAVE_AND_COMPLETE';
      this.question.isTimeOut = true;
      this.performSaveAndSubmitAction(true);
    });
  }

  checkInprogressExam() {

    //this.dataService.checkPreviousExam(this.id, this.action).subscribe(
    this.userService.executeGetRequest("resumetest/" + this.id).subscribe(
      data => {
       
        this.question = data;
        this.maxExamDuration = this.question.maxExamDuration;
        this.questionsTimeTaken = this.question.questionsTimeTaken; 
        if (this.question.testId == null) {
          this.testRunner();
        } else {
          this.testTimeTaken = this.question.timeTaken;
          this.startTestTimer();
          this.startQuestionTimer();
          this.errorMessage = "<strong>Note:</strong> You have existing test in progress, the test will resume from your last attempted question no. " + this.question.questionSequence + ". The message will close in " + this.timerCount + " secs";
          setTimeout(() => {this.updateMessage()}, 1);
          this.checkTestTimer();
        }
        this.handleButton();
      },
      error => {
        alert('Request Failed :' + error);
      });
  }

  updateMessage() {
    if (this.timerCount > 0) {
      setTimeout(() => {
        this.timerCount = this.timerCount - 1;
        this.errorMessage = "<strong>Note:</strong> You have existing test in progress, the test will resume from your last attempted question no. " + this.question.questionSequence + ". The message will close in " + this.timerCount + " secs";
        this.updateMessage();
      }, 1000);
    } else {
      this.errorMessage = false;
    }

  }
  handleError() {
    if (this.question.errorDescription != null) {
      this.errorMessage = this.question.errorDescription;
      this.disableNext = true;
      this.disablePrev = true;
    } else {
      this.errorMessage = false;
    }
  }

  handleButton() {
    if (this.question.questionSequence > 1) {
      this.disablePrev = false;
    }
    this.disableNext = false;
    if (this.question.testType == 'MOCK') {
      this.disableSubmit = false;
    }
    if (this.question.isLastQuestion) {
      this.disableSubmit = false;
      this.disableNext = true;
      this.isLastQuestion = true;
    }
    if (this.question.questionSequence == '1') {
      this.disablePrev = true;
    }


  }
  testRunner() {
    this.dataService.testRunner(this.question).subscribe(
      data => {

        this.question = data;
        this.maxExamDuration = this.question.maxExamDuration;
        this.startTestTimer();
        this.checkTestTimer();
        this.startQuestionTimer();
        this.handleButton();
        this.handleError();
        this.refreshQuestionStats();
      },
      error => {
        alert('Request Failed :' + error);
      });
  }

  previousQuestion() {
    if(this.question.questionSequence == 1 && this.question.navigateToQuestionSequence == null) {
        this.disablePrev = true;
        return;
    }
    this.disableSubmit = true;
    this.question.action = 'PREVIOUS';
    this.question.isDirtyObject = true;
    this.stopQuestionTimer();
    this.dataService.previousQuestion(this.question).subscribe(
      data => {
        this.question = data;
        this.startQuestionTimer();
        this.handleError();
        this.handleButton();
        this.refreshQuestionStats();
        window.scroll(0, 0);
      },
      error => {
        alert('Request Failed :' + error);
      });
  }


  nextQuestion() {
    if(this.question.isLastQuestion && this.question.navigateToQuestionSequence == null) {
        this.disableNext = true;
        return;
    }
    this.question.action = 'NEXT';
    this.question.isDirtyObject = true;
    this.disablePrev = false;
    this.stopQuestionTimer();
    this.dataService.nextQuestion(this.question).subscribe(
      data => {
        this.question = data;
        this.startQuestionTimer();
        this.handleError();
        this.handleButton();
        window.scroll(0, 0);
        this.refreshQuestionStats();
      },
      error => {
        alert('Request Failed :' + error);
      });
  }

  refreshQuestionStats() {
    this.userService.executeGetRequest("refreshQuestionStats/" + this.question.testId).subscribe(
      data => {
        this.questionsTimeTaken = data;
      },
      error => {
        alert('Request Failed :' + error);
      });
  }

  public onOptionChange(ques, answerId, e) {
    if (e.value) {
      this.selectedOptions = new Array(0);
      this.selectedOptions.push(answerId);
      ques.selectedOptions = this.selectedOptions;
      this.question.isDirtyObject = true;
    } else if (e.checked) {
      this.selectedOptions = ques.selectedOptions;
      if (this.selectedOptions == null) {
        this.selectedOptions = new Array(0);
      }
      this.selectedOptions.push(answerId);
      ques.selectedOptions = this.selectedOptions;
      this.question.isDirtyObject = true;
    } else if (!e.checked) {
      this.selectedOptions = ques.selectedOptions;
      var idx = this.selectedOptions.indexOf(answerId);
      this.question.answersGiven = this.selectedOptions.splice(idx, 1);
      ques.selectedOptions = this.selectedOptions;
      this.question.isDirtyObject = true;
    }
  }

  public onChange(q, e) {
    if (e.length > 0) {
      if (this.question.isLastQuestion) {
        this.disableNext = true;
      } else {
        this.disableNext = false;
      }
      q.answerText = e;
      this.question.isDirtyObject = true;
    }
  }

  fetchQuestion(itm) {

  }


  saveAndSubmit() {
    this.showConfirmation();
  }

  saveAndExit() {
    this.router.navigate(['my-activity']);
  }

  showConfirmation() {
    const dialogRef = this.dialog.open(DialogConfirmTestSubmission, {
      width: '25%',
      data: {"timeOver": false}
    });

    dialogRef.afterClosed().subscribe(req => {
      if (req) {
        this.question.action = 'SAVE_AND_COMPLETE';
        this.performSaveAndSubmitAction(true);
      }
    });
  }

  performSaveAndSubmitAction(redirectToCheckAnswer) {
    this.question.isDirtyObject = true;
    this.question.completedIn = this.dataService.getTime();
    this.stopQuestionTimer();
    this.dataService.saveAndSubmit(this.question).subscribe(
      data => {
        this.questions = data;
        if (!this.subscription.closed) {
          this.subscription.unsubscribe();
        }
        if (!this.dataService.getSub.closed) {
          this.dataService.getSub.unsubscribe();
        }
        if (redirectToCheckAnswer) {
          this.navigateToCheckAnswer = true;
          this.router.navigate(['check-answer/' + this.question.testId]);
        }
        /*this.isLoggedIn$.subscribe((isLogged) => {
          if (!isLogged) {
            this.userService.clearSessionOnLogout();
          }
        });*/
        if(!this.userService.getIsLoggedIn) {
            this.userService.clearSessionOnLogout();
        }
      },
      error => {
        this.booleanResult = false;
        alert('Request Failed :' + error);
      });
  }


  save() {
    this.question.action = 'SAVE';
    this.dataService.saveAndSubmit(this.question).subscribe(
      data => {
        alert('Saved Successfully');
        this.questions = data;
        const jsonResponse = JSON.stringify(this.questions);
        this.question = JSON.parse(jsonResponse);
      },
      error => {
        alert('Request Failed :' + error);
      });
  }

  startQuestionTimer() {
    const source = timer(0, 1000);
    this.timerObject = source.subscribe(val => {
      this.question.timeTaken = val;
    });
  }

  stopQuestionTimer() {
    try {
      if (this.timerObject) {
        this.timerObject.unsubscribe();
      }
    } catch (e) {}
  }

  openDescriptionBox() {
    const dialogRef = this.dialog.open(DialogReportProblem, {
      width: '55%',
      height: '45%',
      data: {"examName": this.examName}
    });

    dialogRef.afterClosed().subscribe(req => {
      if (req) {
        this.spinner.show();
        this.sendProblemMail(req);
      }
    });
  }

  reloadQuestion(qSequence) {
        this.question.navigateToQuestionSequence = qSequence - 1; 
        this.nextQuestion();
  }

  sendProblemMail(message) {
    const problemData = {
      "testId": this.question.testId, "examMasterId": this.question.examMasterId, "headerQuestionId": this.question.headerQuestionId,
      "testQuestions": this.question.testQuestions, "errorDescription": message
    }
    this.userService.executePostRequest('sendProblemMail', problemData).subscribe(
      res => {
        this.spinner.hide();
        this.snackBar.open("Problem Reported", "", {
          duration: 3000,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition
        });
      }
    );
  }

  // triggers just before unloadHandler()
  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHander(event) {
    this.stopQuestionTimer();
    this.stopTestTimer();
    this.question.action = 'SAVE';
    this.performSaveAndSubmitAction(false);
  }
}


@Component({
  selector: 'dialog-confirm-test-submission',
  templateUrl: 'dialog-confirm-test-submission.component.html',
})
export class DialogConfirmTestSubmission {

  confirm: boolean = true;

  constructor(
    public dialogRef: MatDialogRef<DialogConfirmTestSubmission>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    //console.log(data);
    //console.log(data.timeOver);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'dialog-report-problem',
  templateUrl: 'dialog-report-problem.html',
})
export class DialogReportProblem {

  confirm: boolean = true;

  constructor(
    public dialogRef: MatDialogRef<DialogReportProblem>,
    @Inject(MAT_DIALOG_DATA) public data: ProblemData) {
    //console.log(data);

  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
