import { UserService } from '../../service/user.service';
import { Component, OnInit, HostListener } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-exam-master',
  templateUrl: './exam-master.component.html',
  styleUrls: ['./exam-master.component.css']
})
export class ExamMasterComponent implements OnInit {

  redirectUrl: string;
  model: any = {};
  qSelect = [];
  qRemove = [];
  course = new FormControl('', [Validators.required]);
  examName = new FormControl('', [Validators.required]);
  maxMarks = new FormControl('', [Validators.required]);
  passMarks = new FormControl('', [Validators.required]);
  duration = new FormControl('', [Validators.required]);
  difficultyLevel = new FormControl('', [Validators.required]);
  publisher = new FormControl('', [Validators.required]);
  topic = new FormControl('', [Validators.required]);
  totalQuestions = new FormControl('', [Validators.required]);
  showChecked = false;
  examMasterId = null;
  isTopicExam = false;
  headerQuestionIdx = 1;
  subQuestionIdx = 1; 
  
  examMasterRequest =         
  {
            id: null,
            name: null,
            maxMarks: null,
            passMarks: null,
            questionIds: [],
            duration: null,
            examType: null,
            subjectId: null,
            topicId: null,
            totalQuestions: null,
            action: null,
            publisher: null,
            previousExamName: null,
            year: null,
            examId: null,
            isPaid: true
    };
  
  constructor(private router: Router,
              private userService: UserService,
              public snackBar: MatSnackBar,
              private activatedRoute: ActivatedRoute) { 
    this.redirectUrl = this.activatedRoute.snapshot.queryParams['redirectTo'];
    
  }

  ngOnInit() {
      this.model.isPaid = true;
    this.activatedRoute.params.subscribe((params: Params) => {
        this.model.examType = params['examType'];
        this.model.subject = params['subjectid'];
        if(this.model.examType === "TOPIC") {
          this.model.topic = params['topicid'];
        } 
        this.model.subjecttext = params['subjecttext'];
        this.model.topictext = params['topictext'];
        this.model.domain = params['domain'];
        this.examMasterId = params['exammaster'];
      
        this.init();
      });
    
    
  }
  
  init() {
    this.fetchCourses();
    if(this.model.examType === "MOCK") {
      this.isTopicExam = false;
      this.userService.executeGetRequest("topic/" + this.model.subject).subscribe (
            res => {
              this.model.topics = res;
            }
         );
    } else if(this.model.examType === "TOPIC") {
      this.model.topics = [{
          id : this.model.topic,
          description : this.model.topictext
      }];
      this.isTopicExam = true;
    }
  }

  fetchCourses() {
    this.userService.executeGetRequest("exams/" + this.model.domain).subscribe(
      resp => {
        this.model.course = resp
        this.getTopicWiseCount();
      }
    )
  }
  
  getTopicWiseCount() {
    if(this.examMasterId != null && this.examMasterId != "null") {
      this.userService.executeGetRequest("questioncount/" + this.examMasterId).subscribe (
          res => {
            this.model.topicWiseQuestionCount = res.topicWiseQuestionCount;
            this.model.totalAdded = res.totalAdded;
            this.model.totalMarks = res.totalMarks;
            this.model.name = res.name;
            this.model.maxMarks = res.maxMarks;
            this.model.passMarks = res.passMarks;
            this.model.duration = res.duration;
            this.model.totalQuestions = res.totalQuestions;
            this.model.publisher = res.publisher;
            this.model.selcourse = ""+res.examId;
            this.model.isPaid = res.isPaid;
          }
       );
    } else {
      this.model.totalAdded = 0;
    }
  }
  
  getErrorMessage() {
    return this.course.hasError('required') || this.totalQuestions.hasError('required') || this.topic.hasError('required') || this.difficultyLevel.hasError('required') || this.examName.hasError('required') || this.maxMarks.hasError('required') || this.passMarks.hasError('required') || this.duration.hasError('required')  ? 'You must enter a value' : '';
  }
  
  search(newQuestions) {
    if(this.isSearchCriteriaValid()) {
      this.snackBar.open ("Loading Questions, please wait!!", "", {
        duration: 10000, panelClass: 'snack-error'
      });
      this.showChecked = !newQuestions; 
      this.qSelect = [];
      this.qRemove = [];
        if(this.model.topic  == undefined || this.model.topic == "-1") {
          this.model.topic = -1;
        }
        if(this.model.difficultyLevel == undefined || this.model.difficultyLevel == "-1") {
          this.model.difficultyLevel = -1;
        }
        if(!this.model.previousExamName || this.model.previousExamName == "") {
          this.model.previousExamName = null;
        }
        if(!this.model.year || this.model.year == "") {
          this.model.year = null;
        }
        const uri = "questionstoadd/" + this.model.examType + "/" + this.model.subject + "/" + this.model.topic + "/" + this.model.difficultyLevel + "/" + newQuestions + "/" + this.examMasterId + "?previousExamName=" + this.model.previousExamName + "&year=" + this.model.year;
        
        this.userService.executeGetRequest(uri).subscribe (
            res => {
              this.snackBar.dismiss();
              this.model.questions = res;
              if(res.length === 0) {
                this.snackBar.open ("No questions for the given combination!!!", "", {
                    duration: 3000, panelClass: 'snack-error'
                });
              }
            }
         );
    }
  }
  
  isSearchCriteriaValid() {
    if((this.model.topic == null || this.model.topic === -1) && (this.model.previousExamName == null || this.model.previousExamName === "") && (this.model.year == null || this.model.year === "")) {
      this.snackBar.open ("At-least one of the filter is mandatory: Topic, Exam name or Year!!!", "", {
        duration: 3000, panelClass: 'snack-error'
      });
      return false;
    }
    return true;
  }
  
  validated() {
    if(this.model.selcourse == undefined || this.model.totalQuestions == undefined || this.model.name == undefined || this.model.maxMarks == undefined || this.model.passMarks == undefined || this.model.duration == undefined) {
      return false;
    }
    return true;
  }
  save() {
    if(!this.validated()) {
      return;
    }
      
    if(this.examMasterId != null) {
      this.examMasterRequest.id = this.examMasterId;
    }
    this.examMasterRequest.duration = this.model.duration;
    this.examMasterRequest.examType = this.model.examType;
    this.examMasterRequest.maxMarks = this.model.maxMarks;
    this.examMasterRequest.name = this.model.name;
    this.examMasterRequest.passMarks = this.model.passMarks;
    this.examMasterRequest.subjectId = this.model.subject;
    this.examMasterRequest.isPaid = this.model.isPaid;
    if(this.model.examType == "TOPIC") {
      this.examMasterRequest.topicId = this.model.topic;
    }
    this.examMasterRequest.publisher = this.model.publisher;
    if(this.showChecked) {
      this.examMasterRequest.questionIds = this.qRemove;
      this.examMasterRequest.action = "REMOVE";
    } else {
      this.examMasterRequest.questionIds = this.qSelect;
      this.examMasterRequest.action = "ADD";
    }
    this.examMasterRequest.totalQuestions = this.model.totalQuestions;
    this.examMasterRequest.examId = this.model.selcourse;
    
    this.userService.executePostRequest("examMaster", this.examMasterRequest).subscribe (
        res => {
          this.model.res = res;
          if(this.model.res.error === "DUPLICATE_EXAM_NAME") {
            this.snackBar.open ("Exam Master with same exam name already exists", "RETRY", {
                  duration: 3000
            });
          } else {
            this.examMasterId = this.model.res.id;
            this.snackBar.open ("Exam Master Saved Successfully!!!", "Reloading..", {
                    duration: 3000
            });
            if(this.qSelect.length > 0 || this.qRemove.length > 0) {
              this.qSelect = [];
              this.qRemove = [];
              this.getTopicWiseCount();
              this.search(!this.showChecked);    
            }
          }
        }
     );
  }
  
  back() {
    const url = "exam-master-summary/" + this.model.domain;
    this.router.navigate([url]);
  }
  
  editExam (topicId, difficultyLevel) {
    this.model.topic = topicId;
    this.model.difficultyLevel = difficultyLevel;
    this.search(false);
  }
  
  removeQuestion(id, groupQuestionId, e, marks){
    if(!e.checked) {
      this.qRemove.push(id);    
    } else {
      var idx = this.qRemove.indexOf(id);
      if(idx > -1)  {
        this.qRemove.splice(idx, 1);
      }
    }
  }
  
  addQuestion(id, groupQuestionId, e, marks){
    var tempCount = 1;
    if(groupQuestionId != null) {
      this.userService.executeGetRequest("subquestioncount/" + groupQuestionId).subscribe (
          res => {
            tempCount = res.noOfSubGrpQuestions;
            this.updateQuestionArray(e, id, tempCount, res.totalMarksForQuestion);
          }
       );
    } else {
      this.updateQuestionArray(e, id, tempCount, marks);
    }
  }
  
  updateQuestionArray(e, id, cnt, marks) {
    if(e.checked) {
      if(this.model.totalAdded + cnt > this.model.totalQuestions) {
        e.source.checked = false;
        this.snackBar.open ("Maximum question already seleted, no new questions can be added!!!", "", {
                    duration: 3000
        });
      } else if(this.model.totalMarks + marks > this.model.maxMarks) {
          e.source.checked = false;
          this.snackBar.open ("Maximum marks already seleted, no new questions can be added!!!", "", {
                      duration: 3000
          });
      } else {
        this.qSelect.push(id);
        this.model.totalAdded = this.model.totalAdded + cnt;
        this.model.totalMarks = this.model.totalMarks + marks;
      }
    } else {
      var idx = this.qSelect.indexOf(id);
      if(idx > -1)  {
        this.qSelect.splice(idx, 1);
        this.model.totalAdded = this.model.totalAdded - cnt;
      }
      this.model.totalMarks = this.model.totalMarks - marks;
    }
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
