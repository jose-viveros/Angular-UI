import { UserService } from '../../service/user.service';
import { Component, OnInit, NgModule, Pipe, PipeTransform } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params, NavigationExtras } from "@angular/router";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatButtonModule, MatCheckboxModule, MatSnackBarModule, MatSnackBar} from '@angular/material';
import {MatExpansionModule} from '@angular/material/expansion';
import { DomSanitizer } from '@angular/platform-browser';
import { S3Service } from '../../service/s3.service';
import { SafeHtmlPipe } from '../../service/auth.constant';

declare var $: any;

@Component({
  selector: 'app-content-feeder-subquestion',
  templateUrl: './content-feeder-subquestion.component.html',
  styleUrls: ['./content-feeder-subquestion.component.css']
})
  
@NgModule({
    imports: [
    BrowserAnimationsModule,
    MatButtonModule, MatCheckboxModule, MatExpansionModule, MatSnackBarModule, SafeHtmlPipe
  ]
})
  
export class ContentFeederSubquestionComponent implements OnInit {

  marks = new FormControl('', [Validators.required]);
  difficultyLevel = new FormControl('', [Validators.required]);
  
  error = ''; 
  lastChar = null;
  optionsIdx = 3;
  addOptionBtnToogleBool = false;
  saveBtnToogleBool = false;
  data = ' ';
  isEdit = true;
  isAdd = false;
  token: any = {};
  temp: any = {};
  topQuestionId = 0;
  atleastOneCorrectSelected = false;
  redirectUrl: string;
  chkIsCorrect0 = false;
  chkIsCorrect1 = false;
  chkIsCorrect2 = false;
  chkIsCorrect3 = false;
  chkIsCorrect4 = false;
  chkIsCorrect5 = false;
  chkIsCorrect6 = false;
  chkIsCorrect7 = false;
  chkIsCorrect8 = false;
  chkIsCorrect9 = false;
  questionRequest =         
        {
            requestType: null,
            id: null,
            code: null,
            description: null,
            topic: null,
            answers: [],
            difficultyLevel: null,
            marks: null,
            isGroupQuestion: null,
            groupQuestionId: null,
            explanation: null
    };
  
  // If you want add editors bindings to some model
  model: any = {
    data: this.data
  
  }
  
  // OnSubmit add current editors bindings to some model
  onSubmit() {
    this.model.data = this.data;
  }

  constructor(private router: Router,
              private userService: UserService,
              public snackBar: MatSnackBar,
              private s3: S3Service,
              private activatedRoute: ActivatedRoute) {
    this.redirectUrl = this.activatedRoute.snapshot.queryParams['redirectTo'];
  }
  
  ngOnInit() {
    this.chkIsCorrect0 = false;
    this.chkIsCorrect1 = false;
    this.chkIsCorrect2 = false;
    this.chkIsCorrect3 = false;
    this.chkIsCorrect4 = false;
    this.chkIsCorrect5 = false;
    this.chkIsCorrect6 = false;
    this.chkIsCorrect7 = false;
    this.chkIsCorrect8 = false;
    this.chkIsCorrect9 = false;

    this.activatedRoute.queryParams.subscribe((params: Params) => {
        this.token = this.userService.getToken();
        this.init(params);
      });
  }
  
  init (params) {
    this.model.domain = params.domain;
    this.model.subject = params.subject;
    this.model.topic = params.topic;
    this.model.questionid = params.questionId;
    this.model.grpquestionid = params.grpQuestionId;
    this.model.subquestionIdx = 1;
    this.model.grpquestiontext = "";
    this.fetchGroupQuestionText();
    if(this.model.questionid == "null") {
      this.renderRichTextEditor();
    } else {
      this.fetchQuestion();
    }
  }
  
  fetchGroupQuestionText(){
    
    this.userService.executeGetRequest("headerquestion/" + this.model.grpquestionid).subscribe (
        res => {
          this.temp = res;
          this.model.grpquestiontext = this.temp.QUESTION_DESC;
          this.model.subquestionIdx = this.temp.NO_OF_SUBQUESTIONS;
          if(this.temp.LST_OF_QUESTION_IDS != "") {
            this.model.lstquestions = this.temp.LST_OF_QUESTION_IDS.split("_");
          }
        }
    );
  }
  
  fetchQuestion() {
    this.userService.executeGetRequest("question/" + this.model.questionid).subscribe (
        res => {
          this.model.question = res;
          this.model.topic = res.topic.id + "," + res.topic.description;
          this.renderRichTextEditor();
        }
    );
  }
  
  renderRichTextEditor() {
      const currentObject = this;
     $('#question').summernote({
        placeholder: 'Question',
        tabsize: 2,
        height: 150,
        toolbar: [
                ['style', ['style', 'bold', 'italic', 'underline', 'clear', 'strikethrough', 'superscript', 'subscript']],
                ['font', ['fontname', 'fontsize']],
                ['color', ['color','forecolor', 'backcolor']],
                ['para', ['ul', 'ol', 'paragraph', 'height']],
                ['attach', ['math', 'picture', 'link', 'video', 'table', 'hr']],
                ['edit', ['fullscreen', 'codeview', 'undo', 'redo']]                 
        ],
        callbacks: {
            onImageUpload: function(files) {
                currentObject.s3.sendFile(files[0], $('#question'), 'Q');
            }
        }
      });
    
    $('#answer1').summernote({
        placeholder: 'Option 1',
        tabsize: 2,
        height: 60,
        toolbar: [
                ['style', ['style', 'bold', 'italic', 'underline', 'clear', 'strikethrough', 'superscript', 'subscript']],
                ['font', ['fontname', 'fontsize']],
                ['color', ['color','forecolor', 'backcolor']],
                ['para', ['ul', 'ol', 'paragraph', 'height']],
                ['attach', ['math', 'picture', 'link', 'video', 'table', 'hr']],
                ['edit', ['fullscreen', 'codeview', 'undo', 'redo']]                 
        ],
        callbacks: {
            onImageUpload: function(files) {
                currentObject.s3.sendFile(files[0], $('#answer1'), 'A');
            }
        }
      });
    
    $('#answer2').summernote({
        placeholder: 'Option 2',
        tabsize: 2,
        height: 60,
        toolbar: [
                ['style', ['style', 'bold', 'italic', 'underline', 'clear', 'strikethrough', 'superscript', 'subscript']],
                ['font', ['fontname', 'fontsize']],
                ['color', ['color','forecolor', 'backcolor']],
                ['para', ['ul', 'ol', 'paragraph', 'height']],
                ['attach', ['math', 'picture', 'link', 'video', 'table', 'hr']],
                ['edit', ['fullscreen', 'codeview', 'undo', 'redo']]                 
        ],
        callbacks: {
            onImageUpload: function(files) {
                currentObject.s3.sendFile(files[0], $('#answer2'), 'A');
            }
        }
      });
    
    $('#answer3').summernote({
        placeholder: 'Option 3',
        tabsize: 2,
        height: 60,
        toolbar: [
                ['style', ['style', 'bold', 'italic', 'underline', 'clear', 'strikethrough', 'superscript', 'subscript']],
                ['font', ['fontname', 'fontsize']],
                ['color', ['color','forecolor', 'backcolor']],
                ['para', ['ul', 'ol', 'paragraph', 'height']],
                ['attach', ['math', 'picture', 'link', 'video', 'table', 'hr']],
                ['edit', ['fullscreen', 'codeview', 'undo', 'redo']]                 
        ],
        callbacks: {
            onImageUpload: function(files) {
                currentObject.s3.sendFile(files[0], $('#answer3'), 'A');
            }
        }
      });
    
    $('#explanation').summernote({
        placeholder: 'Explanation',
        tabsize: 2,
        height: 150,
        toolbar: [
                ['style', ['style', 'bold', 'italic', 'underline', 'clear', 'strikethrough', 'superscript', 'subscript']],
                ['font', ['fontname', 'fontsize']],
                ['color', ['color','forecolor', 'backcolor']],
                ['para', ['ul', 'ol', 'paragraph', 'height']],
                ['attach', ['math', 'picture', 'link', 'video', 'table', 'hr']],
                ['edit', ['fullscreen', 'codeview', 'undo', 'redo']]                 
        ],
        callbacks: {
            onImageUpload: function(files) {
                currentObject.s3.sendFile(files[0], $('#explanation'), 'A');
            }
        }
      });
    
    if(this.model.question && this.model.question.description) {
      $('#question').summernote("code", this.model.question.description);
      $('#explanation').summernote("code", this.model.question.explanation);
      this.questionRequest.difficultyLevel = this.model.question.difficultyLevel;
      this.questionRequest.marks = this.model.question.marks;
      if(this.model.question.answers) {
        for(let i = 0; i < this.model.question.answers.length; i = i + 1) {
          if(i < 3) {
            $('#answer' + (i + 1)).summernote("code", this.model.question.answers[i].answer);
          } else { 
            this.addOption();
            $('#answer' + (i + 1)).summernote("code", this.model.question.answers[i].answer);
          }
          if(i === 0) {
            this.chkIsCorrect0 = this.model.question.answers[i].correct;
          } else if(i === 1) {
            this.chkIsCorrect1 = this.model.question.answers[i].correct;
          } else if(i === 2) {
            this.chkIsCorrect2 = this.model.question.answers[i].correct;
          } else if(i === 3) {
            this.chkIsCorrect3 = this.model.question.answers[i].correct;
          } else if(i === 4) {
            this.chkIsCorrect4 = this.model.question.answers[i].correct;
          } else if(i === 5) {
            this.chkIsCorrect5 = this.model.question.answers[i].correct;
          } else if(i === 6) {
            this.chkIsCorrect6 = this.model.question.answers[i].correct;
          } else if(i === 7) {
            this.chkIsCorrect7 = this.model.question.answers[i].correct;
          } else if(i === 8) {
            this.chkIsCorrect8 = this.model.question.answers[i].correct;
          } else if(i === 9) {
            this.chkIsCorrect9 = this.model.question.answers[i].correct;
          } 
        }
      }
    }
  }
  
  breadCrumbAction(action) {
    if(action === "QB") {
        const navigationNext: NavigationExtras = {
            queryParams: {
                topQuestion: this.topQuestionId,
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
  
  addOption() {
      const currentObject = this;
    this.optionsIdx = this.optionsIdx + 1;
    const questionTbl = $('#questionTbl')[0];
    const matTmpl = $('#matTmpl' + this.optionsIdx)[0];
    const innerOptionIdx = this.optionsIdx;
    matTmpl.style.display = "block";
     $("#answer" + this.optionsIdx).summernote({
        placeholder: 'Option ' + this.optionsIdx,
        tabsize: 2,
        height: 60,
        toolbar: [
                ['style', ['style', 'bold', 'italic', 'underline', 'clear', 'strikethrough', 'superscript', 'subscript']],
                ['font', ['fontname', 'fontsize']],
                ['color', ['color','forecolor', 'backcolor']],
                ['para', ['ul', 'ol', 'paragraph', 'height']],
                ['attach', ['math', 'picture', 'link', 'video', 'table', 'hr']],
                ['edit', ['fullscreen', 'codeview', 'undo', 'redo']]                 
        ],
        callbacks: {
            onImageUpload: function(files) {
                currentObject.s3.sendFile(files[0], $('#answer' + innerOptionIdx), 'A');
            }
        }
      });
    if(this.optionsIdx === 10) {
      this.addOptionBtnToogleBool = true;
    }
  }
  
  validate() {
    const isEmpty = $('#question').summernote('isEmpty');
    if(isEmpty) {
      alert("Provide Question Description");
      return false;
    } else if(this.questionRequest.difficultyLevel == null || this.questionRequest.marks == null) {
      alert("Select mandatory fields");
      return false;
    } 
    return true;
  }
  
  save() {
    if(!this.validate()) {
      return;  
    }
    
    if(this.model.questionid != "null") {
        this.questionRequest.id = this.model.questionid;
    }
    this.questionRequest.topic =  this.model.topic.split(",")[0];
    this.questionRequest.description = $('#question').summernote('code');
    if(!$('#explanation').summernote('isEmpty')) {
      this.questionRequest.explanation = $('#explanation').summernote('code');
    }
    this.questionRequest.groupQuestionId = this.model.grpquestionid;
    this.questionRequest.isGroupQuestion = true;

      const answersLst = new Array(0);
      for(let i = 0; i < this.optionsIdx; i = i + 1) {
          const ans: any = {};
          const isEmpty = $('#answer' + (i + 1)).summernote('isEmpty');
        
          if(this.model.questionid != "null" && this.model.question.answers[i]) {
              ans.id = this.model.question.answers[i].id;
              if(isEmpty) {
                ans.mode="DELETE";
                answersLst.push(ans);
              }
          }
          
          if(!isEmpty) {
              ans.answer = $('#answer' + (i + 1)).summernote('code');
              if(i === 0) {
                ans.correct = this.chkIsCorrect0;
              } else if(i === 1) {
                ans.correct = this.chkIsCorrect1;
              } else if(i === 2) {
                ans.correct = this.chkIsCorrect2;
              } else if(i === 3) {
                ans.correct = this.chkIsCorrect3;
              } else if(i === 4) {
                ans.correct = this.chkIsCorrect4;
              } else if(i === 5) {
                ans.correct = this.chkIsCorrect5;
              } else if(i === 6) {
                ans.correct = this.chkIsCorrect6;
              } else if(i === 7) {
                ans.correct = this.chkIsCorrect7;
              } else if(i === 8) {
                ans.correct = this.chkIsCorrect8;
              } else if(i === 9) {
                ans.correct = this.chkIsCorrect9;
              }
              if(ans.correct) {
                this.atleastOneCorrectSelected = true;
              }
              answersLst.push(ans);
          }
        }
      
        if(!this.atleastOneCorrectSelected) {
          alert("Atleast one answer should be provided and should be correct");
          return false;
        }
        this.questionRequest.answers = answersLst;
      
      
      this.userService.executePostRequest("question", this.questionRequest).subscribe (
        res => {
            this.model.temp = res;
                this.model.questionid = this.model.temp.id;
                this.topQuestionId = this.questionRequest.groupQuestionId;
                this.model.temp = null;
                this.snackBar.open ("Question Saved Successfully!!!", "Done", {
                  duration: 5000
                });
                /*const url = "content-feeder-list/" + this.model.domain + '/' + this.model.subject + '/' + this.model.topic;
                this.router.navigate([url]);
                 * */ 
             }, error => {
               this.snackBar.open ("Error while saving!!!", error, {
                  duration: 5000
                });
             }
      );
  }
  
  getErrorMessage() {
    return this.marks.hasError('required') ? 'You must enter a value' : 
      this.difficultyLevel.hasError('required') ? 'You must enter a value' : '';
  }
  
  addSubQuestion() {
    if(!this.model.questionid) {
      alert("Save Question Header before addding a Sub Question!!");
      return false;
    }
    
    const navigationEdit: NavigationExtras = {
            queryParams: {
                domain: this.model.domain,
                subject: this.model.subject,
                topic: this.model.topic,
                grpQuestionId: this.model.grpquestionid
            }
        }
        this.router.navigate(['routing'], navigationEdit);


  }
    
  getNumber (num) {
    const arr = [];
    arr.push(String.fromCharCode(97 + num));
    
    this.lastChar = String.fromCharCode(97 + arr.length);
    
    return arr;   
  }
  
  getLastNumber (num) {
    let n = 0;
    if(num) {
      n = num.length;
    }
    const arr = [];
    arr.push(String.fromCharCode(97 + n));
    
    this.lastChar = String.fromCharCode(97 + arr.length);
    
    return arr;   
  }
  
  
  navigateToSubQuestion(qid) {
        const navigationEdit: NavigationExtras = {
            queryParams: {
                domain: this.model.domain,
                subject: this.model.subject,
                topic: this.model.topic,
                questionId: qid,
                grpQuestionId: this.model.grpquestionid
            }
        }
        this.router.navigate(['content-feeder-subquestion'], navigationEdit);


  }
}
