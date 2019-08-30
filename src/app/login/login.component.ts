import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from '../service/data-api.service' ;
import { AUTHORITIES, SERVER_URL, DOMAIN } from '../service/auth.constant';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import {FormControl, Validators} from '@angular/forms';
import { UserService } from '../service/user.service';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatRadioChange, MatInput } from '@angular/material';
import {
    AuthService,
    FacebookLoginProvider,
    GoogleLoginProvider,
    LinkedinLoginProvider
} from 'angular5-social-auth';
import { DialogRegisterBasicInfoComponent } from '../registration/registration.component';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

   model: any = {};
   loading = false;
   returnUrl: string;
   hide = true;
   error: any = {};
   redirectUrl: string;
   username: string
   password: string
   isAuth: boolean;
   userRoles = [];

   constructor(private router: Router,
      private activatedRoute: ActivatedRoute,
      private userService: UserService,
      private iconRegistry: MatIconRegistry,
      private sanitizer: DomSanitizer,
      private http: HttpClient,
      public dialog: MatDialog,
      private socialAuthService: AuthService) {
      this.redirectUrl = this.activatedRoute.snapshot.queryParams['redirectTo'];
      this.error = "";
      iconRegistry.addSvgIcon(
         'ep-eye',
         sanitizer.bypassSecurityTrustResourceUrl('assets/ep-eye.svg'));
      iconRegistry.addSvgIcon(
         'ep-user',
         sanitizer.bypassSecurityTrustResourceUrl('assets/ep-user.svg'));
   }

   ngOnInit() {
   }

   login(form) {
        this.error = "";
        this.isAuth = false;
        this.username = form.value.username;
        this.password = form.value.password;
        const body = { username: this.username, password: this.password };
        this.http.post(SERVER_URL + "auth", body).subscribe
            (data => {
                this.model = data;
                this.error = "Login Successfull!!!!";
                this.processSuccessLogin();
            },
            error => {
                this.error = "Invalid Credentials!!";
                this.loading = false;
                this.isAuth = true;
            }
        );
    }  

    currentPath() {
      const roles = JSON.parse(this.userService.getAttribute('AUTHORITIES'));
      console.log(roles[0].authority);
      if (roles && roles[0] && roles[0].authority) {
         const roll = roles[0].authority;
         if (roll === 'ROLE_ADMIN') {
            const user = 'ADMIN';
           this.redirectUrl = "/admin-dashboard";
         } else if (roll === 'ROLE_PARENT') {
            const user = 'PARENT';
            this.redirectUrl = "/parent-dashboard";
         } else if (roll === 'ROLE_TUTOR') {
            const user = 'TUTOR';
            this.redirectUrl = "/parent-dashboard";
         } else if (roll === 'ROLE_CF') {
            const user = 'CF';
            this.redirectUrl = "/content-feeder-dashboard";
         } else if (roll === 'ROLE_INDIVIDUAL') {
            const user = 'INDIVIDUAL';
            this.redirectUrl = "/individual-dashboard";
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

    public socialSignIn(socialPlatform: string) {
        this.isAuth = false;
        let socialPlatformProvider;
        if (socialPlatform === "google") {
            socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
        } else if (socialPlatform === "facebook") {
            socialPlatformProvider = FacebookLoginProvider.PROVIDER_ID;
        }

        this.socialAuthService.signIn(socialPlatformProvider).then(
            (userData) => {
                console.log(socialPlatform+" sign in data : " , userData);
                this.processUser(userData, socialPlatform);
            });
    }

    processUser(userData, socialPlatform) {
        //const profile = userData.getBasicProfile();

        let token = userData.idToken;
        if(socialPlatform === 'facebook') {
            token = userData.token;
        }

        const bd = {
            username: userData.email,
            socialId: userData.id,
            token: token,
            platform: socialPlatform,
            region: window.location.origin
        };
        this.socialAuth(bd);
    }

    socialAuth(bd) {
        this.http.post(SERVER_URL + "socialauth", bd).subscribe
            (data => {
                this.model = data;
                this.processSuccessLogin();
            },
            error => {
                this.loading = false;
                this.isAuth = true;
                this.registerSocialUser(bd);
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

    registerSocialUser(bd) {
        this.model.social = bd;
        
        this.http.post(SERVER_URL + "socialregister", bd).subscribe
            (data => {
                this.model.ERROR = data;
                if(this.model.ERROR.USER_ALREADY_SOCIAL_SIGNIN) {
                    this.error = "You are already registered from other social platform";
                } else {
                    // getting user types
                    this.http.get(SERVER_URL + "roles").subscribe(
                        roles => {
                            const userTypes = (JSON.stringify(roles));
                            this.userRoles = JSON.parse(userTypes);
                            this.openDialog();
                        }
                    );
                }
            },
            error => {
                
            }
        );
    }

    openDialog(): void {
        const dialogRef = this.dialog.open(DialogRegisterBasicInfoComponent, {
        width: '25%',
            data: {userType: null, availableTypes: this.userRoles, lastLogin: null}
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            if(result.userType) {
                this.completeSocialRegistration(result);
            }
        });
    }

    completeSocialRegistration (result) {
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
                this.socialAuth(bd);
            },
            error => {
            }
        );
    }          
}
