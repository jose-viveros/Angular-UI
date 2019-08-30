import { UserService } from '../../service/user.service';
import { Component, OnInit, Inject, ViewChild, QueryList, ViewChildren } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource, MatPaginator } from '@angular/material';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, Params } from '@angular/router';

export interface DialogData {
  srcExamName: string;
  targetExamName: string;
}

@Component({
  selector: 'app-exam-master-summary',
  templateUrl: './exam-master-summary.component.html',
  styleUrls: ['./exam-master-summary.component.css']
})
export class ExamMasterSummaryComponent implements OnInit {

  model: any = {};
  redirectUrl: string;
  step = 0;
  display='none'; 
  srcExamName: string;
  targetExamName: string;
  topicDisable = true;
  displayedColumns: string[] = ['name', 'package', 'maxMarks', 'totalQuestions', 'createdBy', 'createdDate', 'active', 'edit', 'copy'];
  dataSource = null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  

  copyExamMasterRequest =         
  {
            id: null,
            name: null,
            maxMarks: null,
            passMarks: null,
            questionIds: [],
            duration: null,
            examType: null,
            subjectId: null,
            totalQuestions: null,
            action: null,
            publisher: null
    };
    
  constructor(private router: Router,
              private userService: UserService,
              public snackBar: MatSnackBar,
              public dialog: MatDialog,
              private activatedRoute: ActivatedRoute) { 
    this.redirectUrl = this.activatedRoute.snapshot.queryParams['redirectTo'];
  }

  ngOnInit() {
    this.model.examType = "MOCK";
    this.model.seltopic = null;
    this.userService.executeGetRequest("domain").subscribe (
        res => {
          this.model.domain = res;
          this.init();
        }
     );
  }
  
  init() {
      this.activatedRoute.params.subscribe((params: Params) => {
        this.model.seldomain = params['domain'];
        if(this.model.seldomain != null && this.model.seldomain !== "null" && this.model.examType != null) {
          this.fetchSubjects();
        }
      });
  }
  
  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }
  
  fetchSubjects() {
    this.dataSource = null;
    this.model.topic = null;
    this.model.selsubject = null;
    this.model.seltopic = null;
    this.model.filterText = null;
    this.userService.executeGetRequest("subject/" + this.model.seldomain).subscribe (
        res => {
          this.model.subject = res;
        }
      );
  }
  
  onExamTypeChange(e){
    this.model.seltopic = null;
    this.model.topic = null;
    this.paginator.pageIndex = 0;
    this.paginator.length = 0;
    if(this.model.examType === "MOCK") {
      this.topicDisable = true;
      if(this.model.selsubject != null) {
        this.getExamMasterForSubject();
      }
    } else {
      this.topicDisable = false;
      this.dataSource = null;
      if(this.model.selsubject != null) {
        this.fetchTopics();
      }
    }
  }
  
  fetchExamMastersOrTopics(e) {
    const target = e.source.selected._element.nativeElement;
    this.model.subjectText = target.innerText.trim();
    if(this.model.examType === "MOCK") {
      this.fetchExamMasters();
    } else if(this.model.examType === "TOPIC") {
      this.fetchTopics();
    } 
  }
  
  fetchExamMasters() {
    this.dataSource = null;
    this.model.filterText = null;
    this.getExamMasterForSubject();
    
  }
  
  fetchExamMastersForTopic(e){
    if(e != null) {
      const target = e.source.selected._element.nativeElement;
      this.model.topicText = target.innerText.trim();
    }
    this.userService.executeGetRequest("exammaster/" + this.model.examType + "/" + this.model.seltopic).subscribe (
        res => {
          this.model.exammasters = res;
          this.dataSource = new MatTableDataSource(this.model.exammasters);
          this.dataSource.paginator = this.paginator;  
          
        }
     );  
  }
  
  fetchTopics() {
    this.userService.executeGetRequest("topic/" + this.model.selsubject).subscribe (
        res => {
          this.model.topic = res;
        }
      );
  }
  
  getExamMasterForSubject() {
    this.userService.executeGetRequest("exammaster/" + this.model.examType + "/" + this.model.selsubject).subscribe (
        res => {
          this.model.exammasters = res;
          this.dataSource = new MatTableDataSource(this.model.exammasters);
          this.dataSource.paginator = this.paginator;  
          
        }
     );  
  }

  createExam(){
     if(this.model.examType === "MOCK") {
        if(!this.model.subjectText) {
            this.snackBar.open ("Please select Subject!!", "", {
              duration: 2000
            });
        } else {
            const url = "exam-master/null/" + this.model.examType + "/" + this.model.selsubject + "/" + this.model.subjectText + "/null/null/" + this.model.seldomain;
            this.router.navigate([url]);
        }  
     } else {
        if(!this.model.topicText) {
            this.snackBar.open ("Please select topic!!", "", {
              duration: 2000
            });
        } else {
            const url = "exam-master/null/" + this.model.examType + "/" + this.model.selsubject + "/" + this.model.subjectText + "/" + this.model.seltopic + "/" + this.model.topicText + "/" + this.model.seldomain;
            this.router.navigate([url]);
        }
     }
  }
  
  editExam (examMasterId) {
     if(this.model.examType === "MOCK") {
        const url = "exam-master/" + examMasterId + "/" + this.model.examType + "/" + this.model.selsubject + "/" + this.model.subjectText + "/null/null/" + this.model.seldomain;
        this.router.navigate([url]);  
     } else {
        const url = "exam-master/" + examMasterId + "/" + this.model.examType + "/" + this.model.selsubject + "/" + this.model.subjectText + "/" + this.model.seltopic + "/" + this.model.topicText + "/" + this.model.seldomain;
        this.router.navigate([url]);
     }
  }
  
  changeQuestionState(e, ele) {
    this.userService.executeGetRequest("activateexammaster/" + ele.id + "/" + e.checked).subscribe (
        res => {
            if(res && res.error) {
                e.source.checked = false;
                ele.active = false;
                this.snackBar.open (res.error, "", {
                        duration: 5000
                });
            } else {
                if(e.checked) {
                    this.snackBar.open ("Exam Master Activated Successfully!!!", "", {
                        duration: 2000
                    });
                } else {
                    this.snackBar.open ("Exam Master De-Activated Successfully!!!", "", {
                        duration: 2000
                    });
                }
            }
          
        }, error => {
         alert(error.error.text);
       }
    );
  }
  
  copyExam(srcId) {
    if(this.targetExamName) {
      this.copyExamMasterRequest.id = srcId;
      this.copyExamMasterRequest.name = this.targetExamName; 
      this.userService.executePostRequest("copyExamMaster", this.copyExamMasterRequest).subscribe (
          res => {
          	if(res && res.error) {
          		this.snackBar.open ("Duplicate Exam Name, please use unique exam name!!!", "", {
	                duration: 2000
	            });
          	} else {
	            this.snackBar.open ("Exam Copied Successfully!!!", "", {
	                duration: 2000
	            });
	            if(this.model.examType === "MOCK") {
	              this.getExamMasterForSubject();
	            } else {
	              this.fetchExamMastersForTopic(null);
	            }
	         }
          }
       );
    }
  }
  
  openDialog(srcId, examName): void {
    this.targetExamName = null;
    this.srcExamName = examName;
    const dialogRef = this.dialog.open(DialogExamNameComponent, {
      width: '25%',
      data: {srcExamName: this.srcExamName, targetExamName: this.targetExamName}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.targetExamName = result;
      this.copyExam(srcId);
    });
  }
  
  applyFilter(e) {
    this.dataSource.filter = e.trim().toLowerCase();   
  }
}


@Component({
  selector: 'app-dialog-exam-name',
  templateUrl: 'dialog-exam-name.html',
})
export class DialogExamNameComponent {

  constructor(
    public dialogRef: MatDialogRef<DialogExamNameComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}