import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar, MatDialog, MatDialogRef, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material';
import { UserService } from '../../../service/user.service';
import { DataService } from '../../../service/data-api.service';
import { ParentErrorStateMatcher, PasswordValidator } from '../../../validators/password.validator';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-parent-edit',
  templateUrl: './parent-edit.component.html',
  styleUrls: ['./parent-edit.component.css', '../../../styles/home.component.css', '../../../styles/dashboard.css', '../../../styles/parent.css']
})
export class ParentEditComponent implements OnInit {

   horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  formloading = false;
   parentdata: any = {};
   userUpdateForm: FormGroup;
   matching_passwords_group: FormGroup;
   birthYears = [];
   birthDate: number;
   parentErrorStateMatcher = new ParentErrorStateMatcher();
   userType: string;
   error: any = {};
   errorMessage = false;
   genders = ["Male", "Female"];
   changeNotification = false;
   changeresultNotifications = false;
   isSocialUser = false;
   userID = null;
   user_validation_messages = {

      'firstName': [
         { type: 'required', message: 'First name is required' },
         { type: 'pattern', message: 'Enter a valid first name' },
         {type: 'maxlength', message: 'First name must be less than 20 characters long'}

      ],
      'lastName': [
         { type: 'required', message: 'Last name is required' },
         { type: 'pattern', message: 'Enter a valid last name' },
         {type: 'maxlength', message: 'Last name must be less than 20 characters long'}
      ],
      'displayName': [
         { type: 'required', message: 'Display name is required' },
         { type: 'pattern', message: 'Enter a valid name to display' },
         {type: 'maxlength', message: 'Display name must be less than 20 characters long'}

      ],
      'gender': [
         { type: 'required', message: 'Please select gender' },
      ],

      'password': [
         { type: 'minlength', message: 'Password must be at least 8 characters long' }
      ],
      'confirm_password': [
         { type: 'areEqual', message: 'Password mismatch' }
      ]


   }

  constructor(private fb: FormBuilder,
    private router: Router,
    public snackBar: MatSnackBar,
    private userService: UserService,
    private dataService: DataService,
    public dialog: MatDialog,
    private spinnerService:Ng4LoadingSpinnerService) { }

  ngOnInit() {
   this.spinnerService.show();
  this.getUser();
    //  this.editform();
  }
  getUser() {
    this.userService.executeGetRequest('getuser').subscribe(
      data => {
        // alert(data.resultNotifications)
        this.parentdata = data;
        this.userID = data.id;
        setTimeout(() => {
           this.formloading =true;
           this.editform();
           this.spinnerService.hide();
        },2000);
      })
  }
  
  //Edit Tab
   //----------------------------------------------------------------------
   editform() {

      this.userType = this.parentdata.userType;
      this.isSocialUser = this.parentdata.isSocialUser;

      const date = new Date();
      const year = date.getFullYear();

      for (let i = 0; i < 80; i++) {
         this.birthYears.push(year - i);
      }

      if (this.parentdata.birthDate !== null) {
         // this.parentdata.birthDate = ''
         const bd = new Date(this.parentdata.birthDate);
         this.birthDate = bd.getFullYear();
      }
      else {
         this.birthDate = null;
      }


      // matching passwords validation
      this.matching_passwords_group = new FormGroup({
         password: new FormControl('', Validators.compose([
            Validators.minLength(8)
         ])),
         confirm_password: new FormControl('')
      }, (formGroup: FormGroup) => {
         return PasswordValidator.areEqual(formGroup);
      });

      this.userUpdateForm = new FormGroup({
         userType: new FormControl(this.parentdata.userType),
         firstName: new FormControl(this.parentdata.firstName, Validators.compose([Validators.required,Validators.maxLength(20),
         Validators.pattern('^[a-zA-Z ]*$')])),
         lastName: new FormControl(this.parentdata.lastName, Validators.compose([Validators.required,Validators.maxLength(20),
         Validators.pattern('^[a-zA-Z ]*$')])),
         displayName: new FormControl(this.parentdata.displayName, Validators.compose([Validators.required,Validators.maxLength(20),
         Validators.pattern('^[a-zA-Z ]*$')])),
         birthYear: new FormControl(this.birthDate),

         address: new FormControl(this.parentdata.address),
         matching_passwords: this.matching_passwords_group,
         gender: new FormControl(this.parentdata.gender, Validators.required)

      })


   }

   onSubmitUserDetails(value) {
      this.spinnerService.show();
      let bd;
      if (value.birthYear == null) {
         bd = null;
      }
      else {
         bd = value.birthYear + "-01-01";
      }
      //console.log(value);

      const body = {
         id: this.parentdata.id,
         firstName: value.firstName,
         lastName: value.lastName,
         displayName: value.displayName,
         gender: value.gender,
         birthDate: bd,
         address: value.address,
         password: value.matching_passwords.password

      };


      this.userService.executePostRequest('edituser', body).subscribe
         (data => {
            console.log(JSON.stringify(data));
            this.error = data;
            if (this.error.ERROR) {
               this.snackBar.open(this.error.ERROR.message, "", {
                  duration: 3000,
                  horizontalPosition: this.horizontalPosition,
                  verticalPosition: this.verticalPosition,
        
                });
               this.spinnerService.hide();
            }
            else {
               this.errorMessage = false;
               this.snackBar.open("Data Updated successfully", "", {
                  duration: 3000,
                  horizontalPosition: this.horizontalPosition,
                  verticalPosition: this.verticalPosition,
        
                });
               this.userUpdateForm.reset();
               this.getUser();
               this.spinnerService.hide();
               // this.navigateTo('/home');

            }
         },
            error => {
               //this.loading = false;
            }

         );



   }

}
