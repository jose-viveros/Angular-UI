import { SERVER_URL } from '../../service/auth.constant';
import {PasswordValidator} from '../../validators/password.validator';
import {HttpClient} from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';
import {MatIconRegistry, MatSnackBar, MatDialog, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition} from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';
import {ActivatedRoute, Router, Params} from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.component.html',
  styleUrls: ['./new-password.component.css']
})
export class NewPasswordComponent implements OnInit {
  [x: string]: any;
  userName: string;
  userDetailsForm: FormGroup;
  matching_passwords_group: FormGroup;
  passworErrorMessage: string;
  confPassErrorMsg: string;
  isConfirmPassword: boolean;
  isPassword: boolean;
  loading = false;
  error: any = {};
   redirectUrl: string;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private http: HttpClient,
    public snackBar: MatSnackBar,
    private spinnerService: Ng4LoadingSpinnerService,
    public dialog: MatDialog) {}

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      
        this.userName = params['username'];
     
      });
    this.userform();
  }

  userform() {

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

    this.userDetailsForm = this.fb.group({


      matching_passwords: this.matching_passwords_group,



    })
  }


  passworChange(event) {

    const pass = event.target.value;
    // alert(pass);
    if (pass === '') {
      this.passworErrorMessage = 'Password is required';
    } else {
      this.isPassword = (pass.length < 8);
      this.passworErrorMessage = (this.isPassword) ? 'Password must be at least 8 characters long' : ''
    }
  }

  confirmPassworChange(event) {
    const confPass = event.target.value;
    if (confPass === '') {
      this.isConfirmPassword = true;
      this.confPassErrorMsg = 'Confirm password is required';
    } else {
      this.isConfirmPassword = (confPass !== this.userDetailsForm.value.matching_passwords.password);
      this.confPassErrorMsg = (this.isConfirmPassword) ? 'Password mismatch' : ''
    }
  }

  resetPassword(value) {
    this.spinnerService.show();
    const body = {
      username: this.userName,
      password: value.matching_passwords.password

    };
    this.http.post(SERVER_URL + "reset-password", body).subscribe
      (data => {
       
        this.error = data;
        if (this.error.ERROR) {
        this.spinnerService.hide();
          const message = this.error.ERROR;
          this.snackBar.open(message, "", {
            duration: 5000,
                   horizontalPosition: this.horizontalPosition,
                   verticalPosition: this.verticalPosition
          });

        }
        else {
        //  this.errorMessage = false;
          this.spinnerService.hide();
          this.snackBar.open(" Password reset successfully ", "", {
            duration: 5000,
                   horizontalPosition: this.horizontalPosition,
                   verticalPosition: this.verticalPosition
          });

          this.userDetailsForm.reset();
          this.redirectUrl = "/login";
          this.router.navigate([this.redirectUrl]);
        }
      },
      error => {
        this.spinnerService.hide();
        this.loading = false;
      }
      );
  }
}


