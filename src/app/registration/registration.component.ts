import {AntibotComponent} from '../general/antibot/antibot.component';
import {AUTHORITIES, SERVER_URL, DOMAIN, SafeHtmlPipe} from '../service/auth.constant';
import {UserService} from '../service/user.service';

import {Component, OnInit, Inject, ViewChild, Pipe, PipeTransform, NgModule} from '@angular/core';
import {
  ReactiveFormsModule,
  FormsModule,
  FormGroup,
  FormControl, 
  Validators,
  FormBuilder
} from '@angular/forms';

import {BrowserModule, DomSanitizer} from "@angular/platform-browser";
import {platformBrowserDynamic} from "@angular/platform-browser-dynamic";
import {PasswordValidator} from '../validators/password.validator';
import {ParentErrorStateMatcher} from '../validators/password.validator';
import {HttpClient} from '@angular/common/http';
import {Router, NavigationStart, ActivatedRoute, Params} from '@angular/router';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatRadioChange, MatInput, MatSnackBar} from '@angular/material';
import {MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition} from '@angular/material/snack-bar';
import {
  AuthService,
  FacebookLoginProvider,
  GoogleLoginProvider,
  LinkedinLoginProvider
} from 'angular5-social-auth';
import {Ng4LoadingSpinnerService} from 'ng4-loading-spinner';

export interface DialogData {
  userType: string;
  availableTypes: string[];
  lastLogin: string;
  username: string;
}

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})

@NgModule({
    imports: [
      SafeHtmlPipe
  ]
})
export class RegistrationComponent implements OnInit {
  [x: string]: any;
  @ViewChild(AntibotComponent) private antiBot: AntibotComponent;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  model: any = {};
  userDetailsForm: FormGroup;
  matching_passwords_group: FormGroup;
  parentErrorStateMatcher = new ParentErrorStateMatcher();
  redirectUrl: string;
  showSchoolnameField = false;
  userRoles = [];
  selectedUserType: string;
  error: any = {};
  userTypeerrorMessage = false;
  errorMessage = false;
  message: string;
  isPassword: boolean;
  isInValidEmail: boolean;
  passworErrorMessage: string;
  isEmail: string;
  emailErrorMessage: string;
  confPassErrorMsg: string;
  confPass='';
  isConfirmPassword: boolean;
  selectedUserOption: string;
  userNameForConfirmation: string;
   showConfirmation = false;
   confirmationMessage: any = {};
  user_validation_messages = {
    'email': [
      {type: 'required', message: 'Email is required'},
      {type: 'pattern', message: 'Enter a valid email'},
      {type: 'duplicateValue', message: 'Email ID already registered'}
    ],
    'password': [
      {type: 'required', message: 'Password is required'},
      {type: 'minlength', message: 'Password must be at least 8 characters long'}
    ],
    'confirm_password': [
      {type: 'required', message: 'Confirm password is required'},
      {type: 'areEqual', message: 'Password mismatch'}
    ],
    'userType': [
      {type: 'required', message: 'Please select one usertype'}
    ],
    'terms': [
      {type: 'pattern', message: 'You must accept terms and conditions'}
    ]
  }

  constructor(private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private router: Router,
    private http: HttpClient,
    public dialog: MatDialog,
    private socialAuthService: AuthService,
    public snackBar: MatSnackBar,
    private spinnerService: Ng4LoadingSpinnerService) {
    this.redirectUrl = this.activatedRoute.snapshot.queryParams['redirectTo'];
  }

  onChangeUserType(event, name) {
    console.log(name.selectedIndex);
    this.userTypeerrorMessage = false;
    this.selectedUserOption = this.userRoles[name.selectedIndex];
    this.showSchoolnameField = (this.userRoles[name.selectedIndex] === 'TUTOR');
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

  passworChange(event) {
    const pass = event.target.value;
    if (pass === '') {
      this.passworErrorMessage = 'Password is required';
    } else {
      
      this.isPassword = (pass.length < 8);
      this.passworErrorMessage = (this.isPassword) ? 'Password must be at least 8 characters long' : '';
      if(this.confPass!==''){
         this.isConfirmPassword = (this.confPass !== this.userDetailsForm.value.matching_passwords.password);
         this.confPassErrorMsg = (this.isConfirmPassword) ? 'Password mismatch' : ''
      }
      
    }
  }

  confirmPassworChange(event) {
    const confPass = event.target.value;
    if (confPass === '') {
      this.isConfirmPassword = true;
      this.confPassErrorMsg = 'Confirm password is required';
    } else {
      this.confPass=confPass;
      this.isConfirmPassword = (confPass !== this.userDetailsForm.value.matching_passwords.password);
      this.confPassErrorMsg = (this.isConfirmPassword) ? 'Password mismatch' : ''
    }
  }

  ngOnInit() {
       this.userNameForConfirmation = null;
       this.showConfirmation = false; 
       this.confirmationMessage = null;
      this.activatedRoute.queryParams.subscribe((params: Params) => {
        this.userNameForConfirmation = params['username'];
        if(this.userNameForConfirmation == null || !this.userNameForConfirmation) {
            this.getuserRoles();
            this.userform();
        } else {
            this.http.get(SERVER_URL + "confirm-registration?token=" + params['token'] + "&username=" + this.userNameForConfirmation).subscribe(
                data => {
                    this.showConfirmation = true;
                    this.confirmationMessage = data;
                    this.confirmationMessage = this.confirmationMessage.response;
                    console.log("Confirmed!!" + this.confirmationMessage);
                }, error => {
                    console.log("Error!!" + error);
                } 
            );    
        }
      });
      
   }

   loginClick() {
       this.router.navigate(['/login']);
   }

  getuserRoles() {
    // getting user types
    this.http.get(SERVER_URL + "roles").subscribe(
      data => {
        const userTypes = (JSON.stringify(data));
        this.userRoles = JSON.parse(userTypes);
        this.spinnerService.hide();

      }
    );
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

      userType: new FormControl(''),

      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$')

      ])),

      matching_passwords: this.matching_passwords_group,

      terms: new FormControl(false, Validators.pattern('true'))

    })


  }
  onSubmitUserDetails(value) {
    this.spinnerService.show();

    this.selectedUserType = (JSON.parse(JSON.stringify(value.userType)));
    if (this.selectedUserType === '') {
      this.userTypeerrorMessage = true;
    } else {
      this.userTypeerrorMessage = false;
      const body = {
        userType: this.selectedUserOption,
        password: value.matching_passwords.password,
        email: value.email,
        region: window.location.origin
      };
      if (this.antiBot.checkAnswer()) {
        this.http.post(SERVER_URL + "registeruser", body).subscribe
          (data => {
            //console.log(JSON.stringify(data));
            this.error = data;
            if (this.error.ERROR) {
              this.successMessages = '';
              this.errorMessages = this.error.ERROR[0].defaultMessage;
              this.spinnerService.hide();
              this.isInValidEmail = true;
              this.emailErrorMessage = (this.error.ERROR[0].defaultMessage);

            }
            else {

              this.spinnerService.hide();
              this.errorMessage = false;
              this.snackBar.open("Registered Successfully, Verification mail has been sent to your email. \n Please click on the link to verify!", "", {
                duration: 5000,
                horizontalPosition: this.horizontalPosition,
                verticalPosition: this.verticalPosition,

              });
              
              this.userDetailsForm.reset();
              this.redirectUrl = "/login";
              this.router.navigate([this.redirectUrl]);
            }
          },
          error => {
            this.spinnerService.hide();
            this.snackBar.open("Something went Wrong, try again!!!", "", {
              duration: 5000,
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,

            });
            this.loading = false;
          }
          );
      }
      else {
        this.spinnerService.hide();
        this.snackBar.open("Wrong Captcha", "", {
          duration: 5000,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,

        });
        this.loading = false;
      }
    }
  }
  navigateTo(url) {
    this.router.navigate([url]);
  }

  public socialSignInRegister(socialPlatform: string) {
    let socialPlatformProvider;
    if (socialPlatform === "google") {
        socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
    } else if (socialPlatform === "facebook") {
        socialPlatformProvider = FacebookLoginProvider.PROVIDER_ID;
    }

    this.socialAuthService.signIn(socialPlatformProvider).then(
      (userData) => {
        console.log(socialPlatform + " sign in data : ", userData);
        this.processUser(userData, socialPlatform);
      });
  }

  processUser(userData, socialPlatform) {
      let token = userData.idToken;
        if(socialPlatform === 'facebook') {
            token = userData.token;
        }

    const bd = {
      username: userData.email,
      socialId: userData.id,
      token: token,
      userType: this.selectedUserOption,
      platform: socialPlatform,
      region: window.location.origin
    };

    this.model.social = bd;

    this.http.post(SERVER_URL + "socialregister", bd).subscribe
      (data => {
        this.processRegister(data);
      },
      error => {
        this.message = "Problem Registering Account, please try again!!";
        this.errorMessage = true;
      }
      );
  }

  processRegister(data) {
    this.error = data;
    if (data.ALREADY_REGISTERED) {
      this.openDialog(data.USER_TYPE, data.LAST_LOGIN);
    } else if (this.error.ERROR) {
      this.errorMessage = true;
      this.message = JSON.parse(JSON.stringify(this.error.ERROR[0].defaultMessage));
      // alert(this.message);
    }
    else {
      this.openDialog(null, null);
    }
  }

  openDialog(userType, lastLogin): void {
    const dialogRef = this.dialog.open(DialogRegisterBasicInfoComponent, {
      width: '25%',
      data: {userType: userType, availableTypes: this.userRoles, lastLogin: lastLogin}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result.userType) {
        this.completeSocialRegistration(result);
      }
    });
  }

  completeSocialRegistration(result) {
    //update userType
    const bd = {
      username: this.model.social.username,
      socialId: this.model.social.socialId,
      token: this.model.social.token,
      platform: this.model.social.platform,
      userType: result.userType
    };

    this.http.post(SERVER_URL + "updateUserType", bd).subscribe
      (data => {
        this.login(bd);
      },
      error => {
        this.message = "Problem Registering Account, please try again!!";
        this.errorMessage = true;
      }
      );
  }

  login(bd) {
    this.http.post(SERVER_URL + "socialauth", bd).subscribe
      (data => {
        this.model = data;
        this.errorMessage = false;
        alert("Registered Successfully!!");
        this.userDetailsForm.reset();
        this.processSuccessLogin();
      },
      error => {
        this.error = "Not a registered account, please register!!";
        this.loading = false;
        this.isAuth = true;
      }
      );
  }

  processSuccessLogin() {
    this.userService.login(this.model.token);
    if (this.model.authorities) {
      this.userService.setAttribute(AUTHORITIES, JSON.stringify(this.model.authorities));
    }
    this.userService.setAttribute(DOMAIN, this.model.domain);
    this.userService.setLoggedIn(true);
    this.setNextUrl();
    this.navigateAfterSuccess();
  }

  currentPath() {
    const roles = JSON.parse(this.userService.getAttribute('AUTHORITIES'));
    console.log(roles[0].authority);
    if (roles && roles[0] && roles[0].authority) {
      const roll = roles[0].authority;
      if (roll === 'ROLE_ADMIN') {
        const user = 'ADMIN';
      } else if (roll === 'ROLE_PARENT') {
        const user = 'PARENT';
        this.redirectUrl = "/parent-dashboard";
      } else {
        const user = 'STUDENT';
        this.redirectUrl = "/student-dashboard";
      }
    }
  }

  setNextUrl() {
    this.redirectUrl = "/subject";
    const roles = this.model.authorities;
    for (let i = 0; i < roles.length; i++) {
      if (roles[i].authority === "ROLE_CF") {
        this.redirectUrl = "/content-feeder";
      } else if (roles[i].authority === "ROLE_CF_ADMIN") {
        this.redirectUrl = "/content-feeder";
      }
    }
    this.currentPath();
  }

  navigateAfterSuccess() {
    if (this.redirectUrl) {
      this.router.navigate([this.redirectUrl]);
    } else {
      this.router.navigate(['/']);
    }
  }
}

@Component({
  selector: 'app-dialog-register-basic-info',
  templateUrl: 'dialog-register-basic-info.html',
})
export class DialogRegisterBasicInfoComponent {

  constructor(
    public dialogRef: MatDialogRef<DialogRegisterBasicInfoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}