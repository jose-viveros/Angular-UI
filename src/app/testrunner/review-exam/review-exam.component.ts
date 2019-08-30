
import { PagerService } from '../../service';
import { Component, OnInit, ViewChild, NgModule } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Injectable, Pipe, PipeTransform, Inject } from '@angular/core';
import { DataService } from '../../service/data-api.service' ;
import { DomSanitizer } from '@angular/platform-browser';
import { SafeHtmlPipe } from '../../service/auth.constant';
import { UserService } from '../../service/user.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
//import { MatPaginator } from '@angular/material';

export interface ProblemData {
  examName: string;
  desc: string;
}
@Component({
  selector: 'app-review-exam',
  templateUrl: './review-exam.component.html',
  styleUrls: ['./review-exam.component.css']
})
@NgModule({
    imports: [
      SafeHtmlPipe
  ]
})

export class ReviewExamComponent implements OnInit {

  testId: null;
  paginationData: any = {};
  question: any = {};
  testRequest: any = {};
  p = 1;
  model: any = {};

  allItems: any[];
  // pager object
    pager: any = {};

    // paged items
    pagedItems: any[];
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  // @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private router: Router, private activatedRoute: ActivatedRoute,private userService: UserService,
             private dataService: DataService, private pagerService: PagerService,public dialog: MatDialog,
               public snackBar: MatSnackBar, public spinner: Ng4LoadingSpinnerService) {

    this.activatedRoute.params.subscribe((params: Params) => {
      this.testId = params['testid'];
    });
    this.model.mode = 'side';
    this.testRequest =
    {
       testType: null,
       subjectId: null,
       topicId: null,
       testId:  this.testId,
       questionId:   null,
       difficultyLevel: 0,
       questionSequence:   0,
       navigateToQuestionSequence: 0,
       questionDescription:   null,
       answerOptions: null,
       answersGiven:   null,
       action: null,
       dirtyObject:   false,
       errorDescription:   null,
       examMasterId:   null,
       isNonVerbal: false,
       figure: null,
       isMultiChoice:   null,
       isCorrect:   null,
       correctAnswerText:   null,
       completedIn:   null,
       previousExamName: null,
       year: null,
       attempted: null
    } ;
  }

  ngOnInit() {
     this.getTestResult();
  }

  setPage(page: number) {
        // get pager object from service
        this.pager = this.pagerService.getPager(this.allItems.length, page);

        // get current page of items
        this.pagedItems = this.allItems.slice(this.pager.startIndex, this.pager.endIndex + 1);
    }

  getTestResult() {
    this.dataService.getTestResult(this.testRequest).subscribe(
      data => {
        this.question = data;
        this.question = this.question.QUESTION;
        this.paginationData = data;
        this.allItems = this.paginationData.QUESTION_RESULT;
        if (this.paginationData != null) {
          this.p = -1;
          for (var i = 0; i < this.paginationData.QUESTION_RESULT.length; i = i + 1) {
            if (this.paginationData.QUESTION_RESULT[i].isCorrect != "correct") {
              this.p = i + 1;
              this.setPage(this.p);
              break;
            }
          }
          if(this.p == -1) {
            this.p = 1;
            this.setPage(this.p);
          }
        }
      },
      error => {
        alert('Request Failed :' + error);
      });
  }

  getNextTestResult() {
    this.dataService.getTestResult(this.testRequest).subscribe(
      data => {
        this.question = data;
        this.question = this.question.QUESTION;
      },
      error => {
        alert('Request Failed :' + error);
      });
  }

  pageChange(event){
    this.p = event;
    this.testRequest.navigateToQuestionSequence = this.p;
    this.testRequest.action = 'PREVIOUS' ;
    this.getNextTestResult();
  }

  pageChangeNew(page) {
    this.p = page;
    this.testRequest.navigateToQuestionSequence = page;
    this.testRequest.action = 'PREVIOUS' ;
    this.getNextTestResult();
  }

  getCss(page) {
    return this.paginationData.QUESTION_RESULT[page - 1].isCorrect + "-css";
  }

  onLeft() {
    this.setPage(this.pager.currentPage - 1);
    this.pageChangeNew(this.pager.currentPage);
  }

  onRight() {
    this.setPage(this.pager.currentPage + 1);
    this.pageChangeNew(this.pager.currentPage);
  }
  openDescriptionBox() {
    const dialogRef = this.dialog.open(DialogReviewProblem, {
      width: '55%',
      height: '45%',
      data: {"examName": this.paginationData.testName}
    });

    dialogRef.afterClosed().subscribe(req => {
      if (req) {
       // this.spinner.show();
        this.sendProblemMail(req);
      }
    });
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
}
@Component({
  selector: 'dialog-review-problem',
  templateUrl: 'dialog-review-problem.html',
})
export class DialogReviewProblem {

  confirm: boolean = true;

  constructor(
    public dialogRef: MatDialogRef<DialogReviewProblem>,
    @Inject(MAT_DIALOG_DATA) public data: ProblemData) {
    console.log(data);

  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
