import {SERVER_URL} from '../../service/auth.constant';
import {UserService} from '../../service/user.service';
import {Component, OnInit, Inject, Input, ViewChild} from '@angular/core';
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
import { HttpErrorResponse } from '@angular/common/http';
import {HttpClient} from '@angular/common/http';
import {Router, NavigationStart, ActivatedRoute} from '@angular/router';
import {MatRadioChange, MatInput, MatDialogRef, MatDialog, MAT_DIALOG_DATA, MatTableDataSource} from '@angular/material';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import * as regionList from 'assets/regionList.json';
import * as schoolList from 'assets/schoolList.json';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';

@Component({
  selector: 'app-add-student',
  templateUrl: './add-student.component.html',
  styleUrls: ['./add-student.component.css']
})
export class AddStudentComponent implements OnInit {

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  
  [x: string]: any;
   
  model: any = {};
  

  studentDetailsForm: FormGroup;

  matching_passwords_group: FormGroup;

  tutor = false;
  parentErrorStateMatcher = new ParentErrorStateMatcher();

  redirectUrl: string;

  showSchoolnameField = false;

  morethanoneStudent=false;
  error: any = {};

  studentTypeerrorMessage = false;

  errorMessage = false;

  message: string;

  emailerrorMessage = false;

  emailmessage: string;

  regions = (regionList);

  schools = (schoolList);

  genders = ["Male", "Female"];
  
  selectedFiles: FileList;
  currentFileUpload: File;
  uploadResult:any ={};
  uploadSuccess = false;
  downloadhtml:string;
  
  
  student_validation_messages = {

    'firstName': [
      {type: 'required', message: 'First name is required'},
      {type: 'pattern', message: 'Enter a valid first name'},
      {type: 'maxlength', message: 'First name must be less than 20 characters long'}

    ],
    'lastName': [
      {type: 'required', message: 'Last name is required'},
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
    'gender': [
      {type: 'required', message: 'Please select student gender'},
    ],
    'email': [
      {type: 'pattern', message: 'Enter a valid email'}
    ],
    'password': [
      {type: 'required', message: 'Password is required'},
      {type: 'minlength', message: 'Password must be at least 8 characters long'}
    ],
    'confirm_password': [
      {type: 'required', message: 'Confirm password is required'},
      {type: 'areEqual', message: 'Password mismatch'}
    ]

  }
  constructor(private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private router: Router,
    private http: HttpClient,
    public snackBar: MatSnackBar,
    private spinnerService: Ng4LoadingSpinnerService,
    public dialog: MatDialog
    ) {

    this.redirectUrl = this.activatedRoute.snapshot.queryParams['redirectTo'];
  }

  ngOnInit() {
    this.getUserDetails();
    this.studentform();
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

  studentform() {
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

    this.studentDetailsForm = this.fb.group({

      firstName: new FormControl('',Validators.compose([Validators.required,Validators.maxLength(20),Validators.pattern('^[a-zA-Z ]*$')])),
      lastName: new FormControl('',Validators.compose([Validators.required,Validators.maxLength(20),Validators.pattern('^[a-zA-Z ]*$')])),
      username: new FormControl('', Validators.compose([Validators.required,Validators.minLength(3),Validators.maxLength(16)])),
      standard: new FormControl(''),
      region: new FormControl('', Validators.required),
      email: new FormControl('', Validators.compose([Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$')])),
      school1: new FormControl(''),
      school2: new FormControl(''),
      gender: new FormControl('', Validators.required),
      matching_passwords: this.matching_passwords_group,
    })
  }

  onSubmitStudentDetails(value) {
   
this.errorMessage = false;
this.emailerrorMessage =false;
    
    
    this.spinnerService.show();
    const body = {
      firstName: value.firstName,
      lastName: value.lastName,
      username: value.username,
      standard: value.standard,
      school1: value.school1,
      school2: value.school2,
      gender: value.gender,
      parentEmail:value.email,
      password: value.matching_passwords.password,
      area: value.region
    };
   

    this.userService.executePostRequest("addstudent", body).subscribe
      (data => {
        
        this.error = data;
        if (this.error.ERROR) {
          
          if(this.error.ERROR.code==="max2"){
            this.spinnerService.hide();
            this.errorMessage = false;
            this.snackBar.open (this.error.ERROR.error_message, "", {
                   duration: 5000,
                   horizontalPosition: this.horizontalPosition,
                   verticalPosition: this.verticalPosition
                });
                
             this.studentDetailsForm.reset();

             this.navigateTo("/my-student");
          }
          else if(this.error.ERROR[0].codes[1]==='duplicateValue.username'){
          
           this.errorMessage = true;
           this.message = "User Name already exists";
           this.spinnerService.hide();
           }
         
        }
        else {
          this.spinnerService.hide();
          this.errorMessage = false;
          this.snackBar.open ("Student added Successfully", "", {
                   duration: 5000,
                   horizontalPosition: this.horizontalPosition,
                   verticalPosition: this.verticalPosition
                });
                
          this.studentDetailsForm.reset();

          this.navigateTo("/my-student");
         
        }
      },
      error => {
        this.spinnerService.hide();
        this.loading = false;
      }

      );
  }
  navigateTo(url) {
    this.router.navigate([url]);
  }
  
  downloadStudentRecordFormat(){
   const link = document.createElement('a');
   link.setAttribute('type', 'hidden');
   link.href = 'assets/Excelplus_student_record.xlsx';
   link.download = 'Excelplus_student_record.xlsx';
   document.body.appendChild(link);
   link.click();
   link.remove();
  }
  
  getFileDetails (event) {
    this.selectedFiles = event.target.files;
  }
  
  
  uploadFile() {
   this.spinnerService.show();
   this.currentFileUpload = this.selectedFiles.item(0);
   const formdata: FormData = new FormData();
    formdata.append('file', this.currentFileUpload);
    this.userService.executePostRequest('uploadStudentDataFile', formdata).subscribe(
      data => {
             
        this.uploadResult = data;
        if(data.length>0){
        if(data[0].ERROR){
          this.spinnerService.hide();
          this.snackBar.open (data[0].ERROR, "", {
                   duration: 3000,
                   horizontalPosition: this.horizontalPosition,
                   verticalPosition: this.verticalPosition
                });
        }
        else{
        this.spinnerService.hide();
        this.openDialog();
        }
      }else{
        this.spinnerService.hide();
        this.openDialog();
      }
      }
      
    );
  }

  
  openDialog() {
    
    const dialogRef = this.dialog.open(DialogUploadResult,{
      width: '700px',
      data:this.uploadResult});

    dialogRef.afterClosed().subscribe(req => {
      
      
    });
  }
  
  downloadUploadFileResult(){
    
     /*const hiddenElement = document.createElement('a');
        hiddenElement.href = 'data:attachment/html,' + encodeURI();
        hiddenElement.target = '_blank';
        hiddenElement.download = 'PersonalData.html';
        document.body.appendChild(hiddenElement);
        hiddenElement.click();
    */
    
  }
  
  
}
export interface uploadData {
  /* saved: string[];
  unsaved: string[];
  missingMandatoryFields: string[];
  fileName: string;
  uploadDate: string;*/
  
}

@Component({
  selector: 'dialog-upload-result',
  templateUrl: 'dialog-upload-result.html',
  styleUrls: ['./add-student.component.css']
})
export class DialogUploadResult {
 
  constructor(
    public dialogRef: MatDialogRef<DialogUploadResult>,
    @Inject(MAT_DIALOG_DATA) public data:any={}
    ) {
    
  }
  closeDailog(){
     this.dialogRef.close();
  }
   downloadPdf(data){
    
    const doc = new jsPDF();
   
    jsPDF.autoTableSetDefaults({
      columnStyles: {id: {fontStyle: 'bold'}},
      headStyles: {fillColor: 0},
    });

     let finalY =10;
     doc.setFontSize(18);
     doc.text("Upload Result", 75,10);           
     doc.setFontSize(12);
     doc.text("File Name : " + data[0].fileName, 14, 20);
     doc.setFontSize(12);
     doc.text("Date of Upload : " + data[0].uploadDate, 14, 28);
   
     doc.autoTable({startY:35,html: '#saved',useCss:true});
    
     
     doc.save("ExcelPlusSavedRecord.pdf");
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
