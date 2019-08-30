import { Component, OnInit } from '@angular/core';
import {
    FormGroup,
    FormControl,
    Validators,
    FormBuilder
} from '@angular/forms';

import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { UserService } from '../../../service/user.service';
import { DOMAIN } from '../../../service/auth.constant';


@Component({
    selector: 'app-write-up-exam-add',
    templateUrl: './write-up-exam-add.component.html',
    styleUrls: ['./write-up-exam-add.component.css']
})
export class WriteUpExamAddComponent implements OnInit {

    model: any = {};

    horizontalPosition: MatSnackBarHorizontalPosition = 'center';
    verticalPosition: MatSnackBarVerticalPosition = 'top';

    examDetailsForm: FormGroup;

    [x: string]: any;

    emailmessage: string;

    exam_validation_messages = {

        'freestyle': [
            { type: 'required', message: 'Write-Up Type is required' }

        ],
        'examName': [
            { type: 'required', message: 'Write-Up Topic Name is required' }

        ],
        'marks': [
            { type: 'required', message: 'Marks is required' }
        ]

    }
    
    constructor(
        private fb: FormBuilder,
        public snackBar: MatSnackBar,
        private userService: UserService ) { }

    ngOnInit() {
        this.model.seldomain = this.userService.getAttribute(DOMAIN);
        this.fetchFreeStyleTopics();
        this.examForm();
    }

    fetchFreeStyleTopics() {
        this.userService.executeGetRequest("freestyletopics/" + this.model.seldomain).subscribe (
            res => {
                this.model.freestyletopics = res;
            }
        );
    }

    examForm() {
        this.examDetailsForm = this.fb.group({
            freestyle: new FormControl('', Validators.compose([Validators.required])),
            examName: new FormControl('', Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z ]*$')])),
            marks: new FormControl('', Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z ]*$')]))
        });
    }

    onSubmitExamDetails(value) {
        if(value.freestyle === "" || value.marks === "" || value.examName === "") {
            this.snackBar.open("Mandatory Fields Left Blank", "", {
                        duration: 5000,
                        horizontalPosition: this.horizontalPosition,
                        verticalPosition: this.verticalPosition
                    });
            return false;
        }
        const examMasterRequest = {
            topicId: value.freestyle,
            maxMarks: value.marks,
            name: value.examName
        };

        this.userService.executePostRequest("addWriteUpExam", examMasterRequest).subscribe
            (data => {
                this.model.data = data;
                if (this.model.data.ERROR) {
                    this.snackBar.open(this.model.data.ERROR[0].defaultMessage, "", {
                        duration: 5000,
                        horizontalPosition: this.horizontalPosition,
                        verticalPosition: this.verticalPosition
                    });
                }
                else {
                    this.snackBar.open("Record added Successfully", "", {
                        duration: 5000,
                        horizontalPosition: this.horizontalPosition,
                        verticalPosition: this.verticalPosition
                    });

                    this.examDetailsForm.reset();
                }
            }
        );
    }
}
