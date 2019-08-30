import { AUTHORITIES } from '../../service/auth.constant';
import { UserService } from '../../service/user.service';
import { HttpUrlEncodingCodec } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Router, ActivatedRoute, NavigationExtras } from "@angular/router";


@Component({
  selector: 'app-content-feeder-main',
  templateUrl: './content-feeder-main.component.html',
  styleUrls: ['./content-feeder-main.component.css']
})
export class ContentFeederMainComponent implements OnInit {

  model: any = {};
  loading = true;
  searchbtn = true;
  error = '';
  redirectUrl: string;
  isSubjectHidden = true;
  isTopicHidden = true;
  isDomainHidden = true;
  alignright = "right";
  noOptions = false;
  isGroupQuestion = false;
  domain = new FormControl('', [Validators.required]);
  subject = new FormControl('', [Validators.required]);
  topic = new FormControl('', [Validators.required]);
  headerQuestionIdx = 1;
  subQuestionIdx = 1;
  currentPage = 1;
  previousDisabled = true;
  nextDisabled = true;
  
  constructor(private router: Router,
              private userService: UserService,
              public snackBar: MatSnackBar,
              private enc: HttpUrlEncodingCodec,
              private activatedRoute: ActivatedRoute) {
    this.redirectUrl = this.activatedRoute.snapshot.queryParams['redirectTo'];
  }

  ngOnInit() {
      //this.model.seltopic = "0,0";
      
      this.userService.executeGetRequest("domain").subscribe (
        res => {
          this.model.domain = res;
          this.isDomainHidden = false;
        }
      );
   }
  
   reset() {
      this.previousDisabled = true;
      this.nextDisabled = true;
      this.currentPage = 1;
   }

  fetchSubjects() {
      this.model.subject = null;
      this.model.topic = null;
      this.model.selsubject = null;
    this.reset();   
    this.userService.executeGetRequest("subject/" + this.model.seldomain.split(",")[0]).subscribe (
        res => {
          this.model.subject = res;
          this.isSubjectHidden = false;
        }
      );
  }
  
  fetchTopics() {
    this.reset();
    this.model.topic = null;
    this.model.seltopic = null;
    this.userService.executeGetRequest("topic/" + this.model.selsubject.split(",")[0]).subscribe (
        res => {
          this.model.topic = res;
          this.isTopicHidden = false;
        }
      );
  }

  topicChange() {
      this.loading = false;
      this.currentPage = 1;
      this.reset();
  }
  
  next() {
      const navigationNext: NavigationExtras = {
          queryParams: {
              topQuestion: 0,
              domain: this.model.seldomain,
              subject: this.model.selsubject,
              topic: this.model.seltopic
          }
      }
      this.router.navigate(['content-feeder-list'], navigationNext);
  }
  
  search() {
    if(this.model.seldomain && this.model.selsubject) {
        this.previousDisabled = true;
        this.currentPage = 1;
      this.fetchQuestions();
    }
  }
  
  fetchQuestions() {
    
      const reqJSON = {
        subject: null,
        topic: null,
        description: null,
        noOptions: null,
        year: null,
        isGroupQuestion: null,
        page: null
      };
    
      let qdesc = "null";
      if(this.model.questionDesc) {
        qdesc = this.model.questionDesc;
      }
    
      const uri = "search";
      reqJSON.subject = this.model.selsubject.split(",")[0];
      reqJSON.description = qdesc;
      reqJSON.noOptions = this.noOptions;
      reqJSON.isGroupQuestion = this.isGroupQuestion;
      reqJSON.page = this.currentPage;

      if(this.model.year != null) {
        reqJSON.year = this.model.year;
      } else {
        reqJSON.year = "";
      }

      if(this.model.seltopic != "0,0") {
        reqJSON.topic = this.model.seltopic.split(",")[0];
      }

      this.snackBar.open ("Loading Questions, please wait!!", "", {
              duration: 50000
      });

      this.userService.executePostRequest(uri, reqJSON).subscribe (
          res => {
            this.model.questions = res;
            this.snackBar.dismiss();
            if(this.model.questions.length == 0) {
                this.nextDisabled = true;
                this.snackBar.open ("No Record found!!", "", {
                    duration: 3000
                });      
            } else {
                this.nextDisabled = false;
            }
          }
      );
  }

  nextPage() {
      this.previousDisabled = false;
      this.currentPage = this.currentPage + 1;
      this.fetchQuestions();
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
  
  questionDescChange() {
      this.reset();
    if((this.model.questionDesc && this.model.questionDesc != "") || this.noOptions) {
      this.searchbtn = false;
    } else {
      this.searchbtn = true;
    }
  }

  setGroupQuestionSearch() {
      this.previousDisabled = true;
      this.currentPage = 1;
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
  
  goToExamMaster () {
    const url = "exam-master-summary/null";
    this.router.navigate([url]);
  }
  
  getErrorMessage() {
    return this.domain.hasError('required') ? 'You must enter a value' : this.subject.hasError('required') ? 'You must enter a value' : this.topic.hasError('required') ? 'You must enter a value' : '';
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
}
