import { UserService } from '../../service/user.service';
import { Component, OnInit } from '@angular/core';
import {
    FormGroup,
    FormControl,
    Validators,
    FormBuilder
} from '@angular/forms';

import { PasswordValidator } from '../../validators/password.validator';
import { ParentErrorStateMatcher } from '../../validators/password.validator';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

@Component({
    selector: 'app-add-assistant',
    templateUrl: './add-assistant.component.html',
    styleUrls: ['./add-assistant.component.css']
})
export class AddAssistantComponent implements OnInit {

    horizontalPosition: MatSnackBarHorizontalPosition = 'center';
    verticalPosition: MatSnackBarVerticalPosition = 'top';

    assistantDetailsForm: FormGroup;

    matching_passwords_group: FormGroup;

    [x: string]: any;

    model: any = {};
    
    tutor = false;

    parentErrorStateMatcher = new ParentErrorStateMatcher();

    redirectUrl: string;

    showSchoolnameField = false;

    studentTypeerrorMessage = false;
    
    errorMessage = false;

    message: string;

    emailerrorMessage = false;

    emailmessage: string;

    assiatant_validation_messages = {

        'firstName': [
            { type: 'required', message: 'first name is required' },
            { type: 'pattern', message: 'Enter a valid first name' }

        ],
        'lastName': [
            { type: 'required', message: 'last name is required' },
            { type: 'pattern', message: 'Enter a valid last name' }

        ],
        'email': [
            { type: 'pattern', message: 'Enter a valid email' }
        ],
        'password': [
            { type: 'required', message: 'Password is required' },
            { type: 'minlength', message: 'Password must be at least 8 characters long' }
        ],
        'confirm_password': [
            { type: 'required', message: 'Confirm password is required' },
            { type: 'areEqual', message: 'Password mismatch' }
        ]

    }
    
    constructor(private fb: FormBuilder,
        private activatedRoute: ActivatedRoute,
        private userService: UserService,
        public snackBar: MatSnackBar
    ) {

        this.redirectUrl = this.activatedRoute.snapshot.queryParams['redirectTo'];
    }

    ngOnInit() {
        this.getParameters();
    }

    getParameters() {
        this.activatedRoute.queryParams.subscribe(params => {
            this.assistantform();
        });
    }
    
    assistantform() {
        // matching passwords validation
        this.matching_passwords_group = new FormGroup({
            password: new FormControl('', Validators.compose([
                Validators.required,
                Validators.minLength(8)
            ])),
            confirm_password: new FormControl('', Validators.required)
        }, (formGroup: FormGroup) => {
            return PasswordValidator.areEqual(formGroup);
        });

        this.assistantDetailsForm = this.fb.group({

            firstName: new FormControl('', Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z ]*$')])),
            lastName: new FormControl('', Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z ]*$')])),
            email: new FormControl('', Validators.compose([Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$')])),
            matching_passwords: this.matching_passwords_group,
        })
    }

    onSubmitAssistantDetails(value) {

        const body = {
            id: this.assistantId,
            firstName: value.firstName,
            lastName: value.lastName,
            username: value.email,
            email: value.email,
            password: value.matching_passwords.password
        };

        this.userService.executePostRequest("assistant", body).subscribe
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

                    this.assistantDetailsForm.reset();
                }
            }
        );
    }
}
