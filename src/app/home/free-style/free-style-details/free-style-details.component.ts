import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { UserService } from '../../../service/user.service';
import { TOKEN_NAME, SERVER_URL } from '../../../service/auth.constant';

@Component({
  selector: 'app-free-style-details',
  templateUrl: './free-style-details.component.html',
  styleUrls: ['./free-style-details.component.css']
})
export class FreeStyleDetailsComponent implements OnInit {

    id: any = {};
    model: any = {};
    examName = null;
    action = null;
    response: any = {};
    horizontalPosition: MatSnackBarHorizontalPosition = 'center';
    verticalPosition: MatSnackBarVerticalPosition = 'top';
    freeStyleFile: File = null;
    sizeErrorLogo = false;

    freeStyleFormGroup: FormGroup;

    constructor(
        private fb: FormBuilder,
        private userService: UserService,
        private http: HttpClient,
        public snackBar: MatSnackBar,
        private activatedRoute: ActivatedRoute) {
    }

    ngOnInit() {
        this.freeStyleForm();
        this.activatedRoute.queryParams.subscribe(params => {
            this.id = params.id;
            this.action = params.type;
            this.examName = params.examName;
            if(this.action !== "START") {
                this.fetchPendingDetails(this.id);
            }
        });
    }

    fetchPendingDetails(testId) {
        this.userService.executeGetRequest('fetchFreeStyleTestDetails/' + testId).subscribe(
            res => {
                this.model = res;
            }
        );
    }

    freeStyleForm() {
        this.freeStyleFormGroup = this.fb.group({
            freeStyleImage: new FormControl(''),
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
        formData.append("testId", this.id);
        formData.append('assignmentFile', this.freeStyleFile, this.freeStyleFile.name);

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