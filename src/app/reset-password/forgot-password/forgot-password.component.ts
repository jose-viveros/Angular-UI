import { SERVER_URL } from '../../service/auth.constant';
import { UserService } from '../../service/user.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { MatIconRegistry, MatSnackBar, MatDialog, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  [x: string]: any;
  userDetailsForm: FormGroup;

  redirectUrl:string;
  loading = false;
  isInValidEmail: boolean;
  isEmail: string;
  emailErrorMessage: string;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  user_validation_messages = {
    
    'email': [
      { type: 'required', message: 'Email is required' },
      { type: 'pattern', message: 'Enter a valid email' }
     
    ]
  }
  constructor(private fb: FormBuilder,
      private router: Router,
      private activatedRoute: ActivatedRoute,
      private iconRegistry: MatIconRegistry,
      private sanitizer: DomSanitizer,
      private http: HttpClient,
      public snackBar: MatSnackBar,
      private spinnerService: Ng4LoadingSpinnerService,
            public dialog: MatDialog) { }

  ngOnInit() {
   this.userDetailsForm = this.fb.group({
      
         email: new FormControl('', Validators.compose([
            Validators.required,
            Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$')

         ]))
  })
  
  }
  
  emailChange(event) {
    this.isInValidEmail = false;
    this.isEmail = event.target.value;

    if (this.isEmail === '') {
      this.isInValidEmail = true;
      this.emailErrorMessage = 'Email is required';
    } else if (this.isEmail.match('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$') === null) {
      this.isInValidEmail = true;
      this.emailErrorMessage = 'Enter Valid Email';

    }
  }

  sendLink(value){
    this.spinnerService.show();
    this.isInValidEmail = false;
    const body={email:value.email}
    this.http.post(SERVER_URL + "forgotpassword",body).subscribe
          ( res => {
             // alert("Reset Passowrd link sent to the email id");
             let response = JSON.stringify(res);
             console.log(response);
             const data = JSON.parse(response);
             if(data.ERROR){
              this.isInValidEmail = true;   
              this.emailErrorMessage = data.ERROR;
                this.spinnerService.hide();
             
             }
             else{
              this.isInValidEmail = false;
                this.spinnerService.hide();             
              this.snackBar.open ("Reset Passowrd link has been sent to the email id", "", {
                  duration: 5000,
                   horizontalPosition: this.horizontalPosition,
                   verticalPosition: this.verticalPosition
          });
        }
       
      },
      error => {
            this.isInValidEmail = true;   
            this.emailErrorMessage = "Invalid email";
            this.spinnerService.hide();
            this.loading = false;
          });
  }
  
}
