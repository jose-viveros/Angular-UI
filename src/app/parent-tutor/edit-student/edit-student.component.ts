import {SERVER_URL} from '../../service/auth.constant';
import {UserService} from '../../service/user.service';
import {Component, OnInit} from '@angular/core';
import {
  ReactiveFormsModule,
  FormsModule,
  FormGroup,
  FormControl,
  Validators,
  FormBuilder
} from '@angular/forms';

import {BrowserModule} from "@angular/platform-browser";
import {platformBrowserDynamic} from "@angular/platform-browser-dynamic";
import {PasswordValidator} from '../../validators/password.validator';
import {ParentErrorStateMatcher} from '../../validators/password.validator';
import {HttpClient} from '@angular/common/http';
import {Router, NavigationStart, ActivatedRoute} from '@angular/router';
import {MatRadioChange, MatInput} from '@angular/material';
import {MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition} from '@angular/material/snack-bar';
import * as regionList from 'assets/regionList.json';
import * as schoolList from 'assets/schoolList.json';
import {Ng4LoadingSpinnerService} from 'ng4-loading-spinner';
@Component({
  selector: 'app-edit-student',
  templateUrl: './edit-student.component.html',
  styleUrls: ['./edit-student.component.css']
})
export class EditStudentComponent implements OnInit {

  [x: string]: any;

  model: any = {};
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  formloading = false;
  studentEditForm: FormGroup;

  matching_passwords_group: FormGroup;

  studentId: number;
  parentErrorStateMatcher = new ParentErrorStateMatcher();

  redirectUrl: string;

  showSchoolnameField = false;

  studentdata: any = {};

  error: any = {};

  studentTypeerrorMessage = false;

  errorMessage = false;

  message: string;

  regions = (regionList);

  schools = (schoolList);
  tutor = false;

  genders = ["Male", "Female"];

  student_validation_messages = {

    'firstName': [
      {type: 'required', message: 'First name is required'},
      {type: 'pattern', message: 'Enter a valid first name'},
      {type: 'maxlength', message: 'First name must be less than 20 characters long'}

    ],
    'lastName': [
      {type: 'required', message: 'last name is required'},
      {type: 'pattern', message: 'Enter a valid last name'},
      {type: 'maxlength', message: 'Last name must be less than 20 characters long'}

    ],
    'username': [
      {type: 'required', message: 'User name is required'},
      {type: 'minlength', message: 'User name must be at least 3 characters long'},
      {type: 'maxlength', message: 'User name must be less than 16 characters long'}

    ],
    'region': [
      {type: 'required', message: 'Please select student region'},
    ],
    'email': [
      {type: 'pattern', message: 'Enter a valid email'}
    ],
    'gender': [
      {type: 'required', message: 'Please select student gender'},
    ],
    'password': [
       {type: 'minlength', message: 'Password must be at least 8 characters long'}
    ],
    'confirm_password': [
       {type: 'areEqual', message: 'Password mismatch'}
    ]


  }



  constructor(private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private router: Router,
    private http: HttpClient,
    public snackBar: MatSnackBar,
    private spinnerService: Ng4LoadingSpinnerService) {

    this.redirectUrl = this.activatedRoute.snapshot.queryParams['redirectTo'];
  }

  ngOnInit() {
    this.spinnerService.show();
    this.getUserDetails();
    this.activatedRoute.queryParams.subscribe(params => {

      //this.getStudent(params.studentId);
      this.userService.executeGetRequest('student/' + params.studentId).subscribe(
        res => {
          this.studentdata = res;
          setTimeout(() => {
            this.formloading = true
            this.studentform(this.studentdata);
            this.spinnerService.hide();
          }, 2000);

        });
    });
  }

  getUserDetails(){
    this.userService.executeGetRequest('getuser').subscribe(
     data => {
       this.userType = data.userType;
       if(this.userType==='TUTOR'){
         this.tutor = true;
       }
       
     }
   );
  }

  studentform(studentData) {

    this.studentId = studentData.id;
     // matching passwords validation
    this.matching_passwords_group = new FormGroup({
      password: new FormControl('', Validators.compose([Validators.minLength(8)])),
      confirm_password: new FormControl('')
    }, (formGroup: FormGroup) => {
      return PasswordValidator.areEqual(formGroup);
    });
    
    this.studentEditForm = this.fb.group({
      //id: new FormControl(studentData.id),
      firstName: new FormControl(studentData.firstName, Validators.compose([Validators.required,
      Validators.maxLength(20),Validators.pattern('^[a-zA-Z ]*$')])),
      lastName: new FormControl(studentData.lastName, Validators.compose([Validators.required,
      Validators.maxLength(20),Validators.pattern('^[a-zA-Z ]*$')])),
      username: new FormControl(studentData.username, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(16)])),
      standard: new FormControl(studentData.standard, Validators.required),
      region: new FormControl(studentData.region, Validators.required),
      school1: new FormControl(studentData.school1),
      school2: new FormControl(studentData.school2),
      email: new FormControl(studentData.parentEmail,Validators.compose([Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$')])),
      gender: new FormControl(studentData.gender, Validators.required),
      matching_passwords: this.matching_passwords_group

    })


  }

  onSubmitStudentDetails(value) {
    console.log(value);
    this.spinnerService.show();
    const body = {
      id: this.studentdata.id,
      firstName: value.firstName,
      lastName: value.lastName,
      username: value.username,
      standard: value.standard,
      school1: value.school1,
      school2: value.school2,
      gender: value.gender,
      parentEmail: value.email,
       password: value.matching_passwords.password,
      area: value.region
      
    };


    this.userService.executePostRequest('editstudent', body).subscribe
      (data => {
        console.log(JSON.stringify(data));
        this.error = data;
        if (this.error.ERROR) {

          setTimeout(() => {
            this.spinnerService.hide();
            this.errorMessage = true;
            this.message = "username already exists";
            this.snackBar.open(this.message, "", {
              duration: 5000,
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,

            });
          }, 2000)



          //alert(this.message);
        }
        else {
          setTimeout(() => {
            this.spinnerService.hide();
            this.errorMessage = false;
            this.message = "Student data updated Successfully";
            this.snackBar.open(this.message, "", {
              duration: 3000,
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,

            });
            //alert("Student data updated Successfully");
            this.studentEditForm.reset();

            this.redirectUrl = "my-student";
            this.router.navigate([this.redirectUrl]);
          }, 2000)
        }
      },
      error => {
        this.spinnerService.hide();
        this.message = "Something went wrong, please try again!!!";
        this.snackBar.open(this.message, "", {
          duration: 3000,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,

        });
        this.loading = false;
      }

      );



  }
  navigateTo(url) {
    this.router.navigate([url]);
  }
}
