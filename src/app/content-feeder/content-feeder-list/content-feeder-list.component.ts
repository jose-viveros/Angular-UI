import { AUTHORITIES, SafeHtmlPipe } from '../../service/auth.constant';
import { UserService } from '../../service/user.service';
import { Component, OnInit, Inject, NgModule, PipeTransform, Pipe } from '@angular/core';
import { MatSnackBarModule, MatSnackBar } from '@angular/material';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource, MatPaginator } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router, Params, NavigationExtras } from "@angular/router";

declare var $: any;

export interface DialogData {
  questionId: string;
  typeOfChange: string;
  currentValue: string;
  newValueText: string;
  subjectId: string;
}

@Component({
  selector: 'app-content-feeder-list',
  templateUrl: './content-feeder-list.component.html',
  styleUrls: ['./content-feeder-list.component.css']
})
  
@NgModule({
    imports: [
    BrowserAnimationsModule,
    MatSnackBarModule,
    SafeHtmlPipe
  ]
})
  
export class ContentFeederListComponent implements OnInit {

  model: any = {};
  roles: any = {};
  loading = false;
  error = '';
  redirectUrl: string;
  token: any = {};
  confirmDelete = false;
  questionCounter = 0;
  counter = 0;
  isCFAdmin: boolean = false;
  noOptions = false;
  headerQuestionIdx = 1;
  subQuestionIdx = 1;
  reqData : DialogData;
  currentPage = 1;
  previousDisabled = true;
  nextDisabled = true;
  
  constructor(private router: Router,
              private userService: UserService,
              public snackBar: MatSnackBar,
              public dialog: MatDialog,
              private activatedRoute: ActivatedRoute) {
    this.redirectUrl = this.activatedRoute.snapshot.queryParams['redirectTo'];
    this.questionCounter = 0;
  }
  
    ngOnInit() {
      this.model.user = 0;
      this.model.active = "0";
      this.roles = JSON.parse(this.userService.getAttribute(AUTHORITIES));
      for(var i = 0; i < this.roles.length; i = i + 1) {
        if(this.roles[i].authority == "ROLE_ADMIN") {
          this.isCFAdmin = true;    
        }
      }
      
      this.model.topquestion = null;
      this.questionCounter = 0;
      this.activatedRoute.queryParams.subscribe((params: Params) => {
        this.init(params);
        this.token = this.userService.getToken();
        this.currentPage = 1;
        this.previousDisabled = true;         
        this.fetchQuestions();
        if(this.isCFAdmin) {
          this.fetchUsers();
        }
      });
  }
  
  fetchUsers() {
    this.userService.executeGetRequest("contentfeeders").subscribe (
        res => {
          this.model.users = res
        }
    );
  }
  
  init (params) {
  
  /*
  this.activatedRoute.queryParams.subscribe(params => {

      this.status = params.status;
      this.examType = params.examType;

    });
  
    topQuestion: 0,
              domain: this.model.seldomain,
              subject: this.model.selsubject,
              topic: this.model.seltopic

  */
    this.model.seldomain = params.domain.split(",")[0];
    this.model.selsubject = params.subject.split(",")[0];
    this.model.seltopic = params.topic.split(",")[0];
    
    this.model.seldomaintext = params.domain.split(",")[1];
    this.model.selsubjecttext = params.subject.split(",")[1];
    this.model.seltopictext = params.topic.split(",")[1];
    
    this.model.topquestionid = params.topQuestion;
    this.fetchTopics();
  }
  
  noOptionChange() {
      this.previousDisabled = true;
      this.currentPage = 1;
      this.fetchQuestions();
  }
  
  yearChange() {
      this.previousDisabled = true;
        this.currentPage = 1;
        this.fetchQuestions();
  }
  
  fetchQuestions() {
      this.snackBar.open ("Loading Questions, please wait!!", "", {
              duration: 50000
      });
    
      var reqJSON = {
        id: null,
        subject: null,
        topic: null,
        description: null,
        noOptions: null,
        year: null,
        userId: null,
        active: null,
        page: null
      };
      
      reqJSON.subject = this.model.selsubject;
      reqJSON.topic = this.model.seltopic;
      reqJSON.id = this.model.topquestionid;
      reqJSON.noOptions = this.noOptions;
      reqJSON.userId = this.model.user;
      reqJSON.active = this.model.active;
      reqJSON.page = this.currentPage;

      if(this.model.year != null) {
        reqJSON.year = this.model.year;
      } else {
        reqJSON.year = "";
      }
    
      this.userService.executePostRequest("questions", reqJSON).subscribe (
        res => {
          this.questionCounter = 0;
          this.model.questions = res;
          //this.snackBar.dismiss();
          if(this.model.questions.length == 0) {
          	this.nextDisabled = true;
            this.snackBar.open ("No Result found!!", "", {
              duration: 3000
            });      
          } else {
          	this.nextDisabled = false;
            this.snackBar.open (this.model.questions.length + " questions loaded!!", "", {
              duration: 3000
            });      
          }
        }
    );
  }
  
  fetchTopics() {
    this.userService.executeGetRequest("topic/" + this.model.selsubject).subscribe (
        res => {
          this.model.topics = res;
        }
      );
  }
  
  fetchByTopic(e) {
    const target = e.source.selected._element.nativeElement;
    this.model.seltopictext = target.innerText.trim();
    this.model.topquestionid = 0;
    this.previousDisabled = true;
    this.currentPage = 1;
    this.fetchQuestions();  
  }

  nextPage() {
      this.currentPage = this.currentPage + 1;
      this.fetchQuestions();
      this.previousDisabled = false;
  }

  previousPage() {
      if(this.currentPage > 1) {
        this.currentPage = this.currentPage - 1;
        this.fetchQuestions();
      } 
      
      if(this.currentPage === 1) {
          this.previousDisabled = true;
      }
      
  }
  
  navigateEditQuestion (questionId, groupQuestionId) {
    if(groupQuestionId != null && questionId != groupQuestionId) {
        const navigationEdit: NavigationExtras = {
            queryParams: {
                domain: this.model.seldomain + "," + this.model.seldomaintext,
                subject: this.model.selsubject + "," + this.model.selsubjecttext,
                topic: this.model.seltopic + "," + this.model.seltopictext,
                questionId: questionId,
                grpQuestionId: groupQuestionId
            }
        }
        this.router.navigate(['content-feeder-subquestion'], navigationEdit);

    } else {
        const navigationEdit: NavigationExtras = {
            queryParams: {
                domain: this.model.seldomain + "," + this.model.seldomaintext,
                subject: this.model.selsubject + "," + this.model.selsubjecttext,
                topic: this.model.seltopic + "," + this.model.seltopictext,
                questionId: questionId,
                grpQuestionId: groupQuestionId
            }
        }
        this.router.navigate(['content-feeder-question'], navigationEdit);
    }
  }
  
  addQuestion () {
        const navigationAdd: NavigationExtras = {
          queryParams: {
              topQuestion: 0,
              domain: this.model.seldomain + "," + this.model.seldomaintext,
              subject: this.model.selsubject  + "," + this.model.selsubjecttext,
              topic: this.model.seltopic  + "," + this.model.seltopictext,
              questionId: "null",
              grpQuestionId: "null"
          }
      }
      this.router.navigate(['content-feeder-question'], navigationAdd);
  }
  
  breadCrumbAction(action) {
    if(action == "QB") {
      const navigationNext: NavigationExtras = {
          queryParams: {
              topQuestion: 0,
              domain: this.model.domain,
              subject: this.model.subject,
              topic: this.model.topic
          }
      }
      this.router.navigate(['content-feeder-list'], navigationNext);


    } else {
      const url = "content-feeder";
      this.router.navigate([url]);
    }
  }
  
  deleteQuestion(questionId) {
    
    this.userService.executeDeleteRequest("question/" + questionId).subscribe (
        res => {
          this.snackBar.open ("Question Deleted Successfully!!!", "Reloading", {
              duration: 5000
            });
          this.model.topquestionid = 0;
          this.previousDisabled = true;
          this.currentPage = 1;
          this.fetchQuestions();
        }, error => {
         alert(error.error.text);
       }
    );
  }
  
  getQuestionIndex() {
    this.questionCounter = this.questionCounter + 1;
    return this.questionCounter;
  }
  
  changeQuestionState(e, questionId){
    this.userService.executeGetRequest("changestatus/" + questionId + "/" + e.checked).subscribe (
        res => {
          this.snackBar.open ("Question Updated Successfully!!!", "", {
              duration: 2000
            });
        }, error => {
         alert(error.error.text);
       }
    );
  }
  
  fetchByUser() {
      this.previousDisabled = true;
    this.currentPage = 1;
    this.fetchQuestions();
  }
  
  fetchByActive() {
      this.previousDisabled = true;
    this.currentPage = 1;
    this.fetchQuestions();
  }
  
  setQuestionIdx(idx) {
    this.headerQuestionIdx = idx;
    this.subQuestionIdx = 0;
    return this.headerQuestionIdx;    
  }
  
  getSubQuestionIdx() {
    this.subQuestionIdx = this.subQuestionIdx + 1;
    return this.headerQuestionIdx + "." + this.subQuestionIdx;
  }
    
  updateDifficultyLevel(qid, e) {
    this.updateQuestionDetails(qid, e.value, 'DIFFICULTY_LEVEL');
  }
  
  updateTopic(qid, e) {
    this.updateQuestionDetails(qid, e.value, 'TOPIC');
  }
  
  updateQuestionDetails(qid, newValue, typChange) {
      this.userService.executePostRequest("updateQuestion", {id: qid, difficultyLevel: newValue, topic: newValue, typeOfChange: typChange}).subscribe (
      res => {
          this.snackBar.open ("Question Updated Successfully", "", {
              duration: 3000
          });
      });
  }
}