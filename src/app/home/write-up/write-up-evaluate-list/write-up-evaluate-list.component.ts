import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSnackBar, MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, MatSort, Sort, PageEvent } from '@angular/material';
import { Router } from '@angular/router';
import { UserService } from '../../../service/user.service';
import { DOMAIN, TOKEN_NAME, SERVER_URL } from '../../../service/auth.constant';
import { fromMatSort, fromMatPaginator, sortRows, paginateRows } from '../../table-utils';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { of } from "rxjs/observable/of";
import { map } from "rxjs/operators";

export interface DialogData {
  freeStyleTestId: string;
  studentName: string;
  writeupType: string;
  topicName: string;
}
export  interface writeupExamList {
  studentName: string;
  writeupType: string;
  topicName:string;
  assignedDate: Date;
  assignmentUrl: string;
  uploadedOn: Date;
  status: string;
  reviewedOn: Date;
  responseUrl: string;
}

@Component({
  selector: 'app-write-up-evaluate-list',
  templateUrl: './write-up-evaluate-list.component.html',
  styleUrls: ['./write-up-evaluate-list.component.css','../../../styles/home.component.css', '../../../styles/dashboard.css', '../../../styles/parent.css', '../../../styles/registration.css']
})
export class WriteUpEvaluateListComponent implements OnInit {

    displayedColumns: string[] = ['studentName', 'writeupType', 'topicName', 'assignedDate', 'assignmentUrl', 'uploadedOn', 'status', 'reviewedOn', 'responseUrl'];

    dataSource = null;

    model: any = {};
    noOfRows = 0;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    displayedRows$: Observable<writeupExamList[]>;
    totalRows$: Observable<number>;
  
    constructor(
        private router: Router,
        public snackBar: MatSnackBar,
        public dialog: MatDialog,
        private userService: UserService ) { }

    ngOnInit() {
        this.model.seldomain = this.userService.getAttribute(DOMAIN);
        this.model.status = "ALL";
        this.fetchFreeStyleTopics();
        
    }

    fetchFreeStyleTopics() {
        this.userService.executeGetRequest("freestyletopics/" + this.model.seldomain).subscribe (
            res => {
                this.model.freestyletopics = res;
                this.model.selfreestyle = "-1";
                this.fetchEvaluationStatuses();
            }
        );
    }

    fetchEvaluationStatuses() {
        this.userService.executeGetRequest("fetchEvaluationStatuses/" + this.model.selfreestyle + "/" + this.model.status).subscribe (
            res => {
                this.noOfRows=res.length;
                this.dataSource = new MatTableDataSource(res);
                this.dataSource.paginator = this.paginator;
                this.assignTableData(res);
            }
        );
    }

    upload(ele) {

        const dialogRef = this.dialog.open(DialogUploadReviewComponent, {
            width: '450px',
            height: '350px',
            data: {
                freeStyleTestId: ele.freeStyleTestId,
                studentName: ele.studentName,
                writeupType: ele.writeupType,
                topicName: ele.topicName,
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            this.fetchEvaluationStatuses();
        });
    }
     assignTableData(data){
    const tab_data: writeupExamList[] = data;
    const sortEvents$: Observable<Sort> = fromMatSort(this.sort);
    const pageEvents$: Observable<PageEvent> = fromMatPaginator(this.paginator);
    const rows$ = of(tab_data);
    this.totalRows$ = rows$.pipe(map(rows => rows.length));
    this.displayedRows$ = rows$.pipe(sortRows(sortEvents$), paginateRows(pageEvents$));
  }
    
    
}



@Component({
  selector: 'app-dialog-upload-review',
  templateUrl: 'dialog-upload-review.component.html',
})
export class DialogUploadReviewComponent {

    freeStyleFile: File = null;
    sizeErrorLogo = false;
    response: any = {};
    horizontalPosition: MatSnackBarHorizontalPosition = 'center';
    verticalPosition: MatSnackBarVerticalPosition = 'top';
    evaluation_messagesmarks = {
        'marks': [
            {type: 'required', message: 'Marks are required'},
            {type: 'pattern', message: 'Enter a valid first name'}            
        ]
    };

    freeStyleFormGroup: FormGroup;

    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<DialogUploadReviewComponent>,
        private userService: UserService,
        private http: HttpClient,
        public snackBar: MatSnackBar,
        @Inject(MAT_DIALOG_DATA) public data: DialogData) {
            this.freeStyleForm();
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    freeStyleForm() {
    	const numericNumberReg = '^-?[0-9]\\d*(\\.\\d{1,2})?$';
        this.freeStyleFormGroup = this.fb.group({
            freeStyleImage: new FormControl(''),
            marks: new FormControl('',Validators.compose([Validators.required,Validators.pattern(numericNumberReg)])),
        })
    }

    handleFreeStyleFile(files: FileList) {
        this.sizeErrorLogo = false;
        if(files && files.length > 0) {
            if(this.userService.verifyLength(files[0].size)) {
                this.freeStyleFile = files[0];
            } else {
                this.sizeErrorLogo = true;
            }
        } else {
            this.sizeErrorLogo = false;
            this.freeStyleFile = null;
        }
    }

    uploadFile(value) {
        let headers = new HttpHeaders();
        headers.set('Content-Type', null);
        headers.set('Accept', "multipart/form-data");
        headers = headers.append(TOKEN_NAME, this.userService.getToken());

        const formData = new FormData();
        formData.append("assignedId", this.data.freeStyleTestId);
        formData.append("fileType", "REVIEW");
        formData.append('assignmentFile', this.freeStyleFile, this.freeStyleFile.name);
        formData.append("marks", value.marks);

        this.http.post(SERVER_URL + "freeStyleUpload", formData, { headers }).subscribe((data) => {
            this.response = data;
            if (this.response.ERROR) {
                this.snackBar.open(this.response.ERROR, "", {
                    duration: 5000,
                    horizontalPosition: this.horizontalPosition,
                    verticalPosition: this.verticalPosition
                });
            } else {
                this.snackBar.open("Assignment Uploaded Successfully!!!", "", {
                    duration: 5000,
                    horizontalPosition: this.horizontalPosition,
                    verticalPosition: this.verticalPosition
                });
            }
        });

    }

}