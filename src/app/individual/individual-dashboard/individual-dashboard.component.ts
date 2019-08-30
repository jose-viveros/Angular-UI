import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {UserService} from '../../service/user.service';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import {Router, NavigationExtras} from '@angular/router';
import {Ng4LoadingSpinnerService} from 'ng4-loading-spinner';

@Component({
  selector: 'app-individual-dashboard',
  templateUrl: './individual-dashboard.component.html',
  styleUrls: ['./individual-dashboard.component.css', '../../styles/home.component.css', '../../styles/dashboard.css', '../../styles/parent.css', '../../styles/registration.css']
})
export class IndividualDashboardComponent implements OnInit {

  Total_MockExams = 0;
  MocksInProgress = 0;
  Total_TopicExams = 0;
  TopicExamsInProgress = 0;
  PendingMocks = 0;
  PendingTopicTests = 0;
  Wrong_Answers = 0;
  unattemptedAnswers = 0;
  incorrectQuestionCount = 0;
  result = 0;
  submenus: any = {};
  incorrectQuestionTestId = 0;
  unattemptedQuestionTestId = 0;
  carelessQuestions = 0;
  overtimeCorrectQuestions = 0;
  overtimeInCorrectQuestions = 0;

   horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';


  @Output() selectedMenu = new EventEmitter<any>();
  constructor(private userService: UserService,
    private router: Router,
     public snackBar: MatSnackBar,
    private spinnerService: Ng4LoadingSpinnerService) {
  }

  ngOnInit() {
    
    this.spinnerService.show();
    this.getStudentDashboradData();
  }

  getStudentDashboradData() {
    this.userService.executeGetRequest('studentDashboard').subscribe(
      res => {
        //alert(JSON.stringify(res));
        this.Total_MockExams = res.Total_MockExams;
        this.MocksInProgress = res.MocksInProgress;
        this.PendingMocks = res.PendingMocks;
        this.Total_TopicExams = res.Total_TopicExams;
        this.TopicExamsInProgress = res.TopicExamsInProgress;
        this.PendingTopicTests = res.PendingTopicTests;
        this.Wrong_Answers = res.Wrong_Answers;
        this.unattemptedAnswers = res.unattemptedAnswersCount;
        this.incorrectQuestionCount = res.incorrectQuestionCount;
        this.carelessQuestions = res.carelessQuestions;
        this.overtimeCorrectQuestions = res.overtimeCorrectQuestions;
        this.overtimeInCorrectQuestions = res.overtimeInCorrectQuestions;
        this.result = res.result;
        this.getSubMenus();

      });

  }

  getSubMenus() {

    this.userService.executeGetRequest("submenus/" + 12).subscribe(
      res => {
        //console.log(JSON.stringify(res))
        this.submenus = res;
        this.spinnerService.hide();
        for (let i = 0; i < this.submenus.length; i++) {
          if (this.submenus[i].menuName === 'Start Topic Test') {
            // alert( this.PendingTopicTests);
            this.submenus[i]["count"] = this.PendingTopicTests;
          }
          else if (this.submenus[i].menuName === 'Resume Topic Test') {
            this.submenus[i]["count"] = this.TopicExamsInProgress;
          }
          if (this.submenus[i].menuName === 'Start Mock Test') {
            this.submenus[i]["count"] = this.PendingMocks;
          }
          else if (this.submenus[i].menuName === 'Resume Mock Test') {
            this.submenus[i]["count"] = this.MocksInProgress;
          }
          else if (this.submenus[i].menuName === 'Retry Incorrect Questions') {
            this.submenus[i]["count"] = this.incorrectQuestionCount;
          }
          else if (this.submenus[i].menuName === 'Retry Unattempted Questions') {
            this.submenus[i]["count"] = this.unattemptedAnswers;
          } else if (this.submenus[i].menuName === 'View Results') {
            this.submenus[i]["count"] = this.result;
          }
        }

        // console.log(JSON.stringify(this.submenus)   
      }
    );
  }

  selectMenu() {
    this.selectedMenu.emit(true);
  }

  getIncorrectQuetionTest() {
    if(this.incorrectQuestionCount===0){
      this.snackBar.open("There are no any incorrect questions", "", {
          duration: 5000,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition
        });
      
    }else{
    this.userService.executeGetRequest('getIncorrectQuestionsTest').subscribe(
      data => {
        //   alert(JSON.stringify(data));
        this.incorrectQuestionTestId = data;
        //this.router.navigate(['testrunner/' + this.incorrectQuestionTestId + '/START']);

        const navigationTest: NavigationExtras = {
          queryParams: {
            id: this.incorrectQuestionTestId,
            type: "START",
            examName: "Retry Incorrect Questions"
          }
        }
        this.router.navigate(['testrunner'], navigationTest);


      })
    }
  }
  getUnattemptedQuetionTest() {
    if(this.unattemptedAnswers===0){
      this.snackBar.open("There are no any unattempted questions", "", {
          duration: 5000,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition
        });
      
    }else{
    this.userService.executeGetRequest('getUnattemptedQuestionsTest').subscribe(
      data => {
        //   alert(JSON.stringify(data));
        this.unattemptedQuestionTestId = data;
        //this.router.navigate(['testrunner/' + this.unattemptedQuestionTestId + '/START']);
        const navigationTest: NavigationExtras = {
          queryParams: {
            id: this.unattemptedQuestionTestId,
            type: "START",
            examName: "Retry Unattempted Questions"
          }
        }
        this.router.navigate(['testrunner'], navigationTest);
      })
    }
  }

  navigateTo(url) {
    //alert(url);
    switch (url) {
      case "startTopic":

        let navigationStartTopic: NavigationExtras = {
          queryParams: {
            examType: 'TOPIC',
            status: 'PENDING'
          }
        }
        this.router.navigate(['individual-activity'], navigationStartTopic);
        break;
      case "resumeTopic":

        let navigationResumeTopic: NavigationExtras = {
          queryParams: {
            examType: 'TOPIC',
            status: 'INPROGRESS'
          }
        }
        this.router.navigate(['individual-activity'], navigationResumeTopic);
        break;
      case "startMock":

        let navigationStartMock: NavigationExtras = {
          queryParams: {
            examType: 'MOCK',
            status: 'PENDING'
          }
        }
        this.router.navigate(['individual-activity'], navigationStartMock);
        break;
      case "resumeMock":

        let navigationResumeMock: NavigationExtras = {
          queryParams: {
            examType: 'MOCK',
            status: 'INPROGRESS'
          }
        }
        this.router.navigate(['individual-activity'], navigationResumeMock);
        break;

      case "retryIncorrectQuestions":
        this.getIncorrectQuetionTest();
        break;

      case "retryUnattemptedQuestions":
        this.getUnattemptedQuetionTest();
        break;

      case "result":
        let navigationResult: NavigationExtras = {
          queryParams: {
            examType: 'ANY',
            status: 'COMPLETE'
          }
        }
        this.router.navigate(['individual-activity'], navigationResult);
        break;
      default:
        this.router.navigate(['individual-activity']);
        break

    }
  }

}
