import { SERVER_URL } from '../../service/auth.constant';
import { AntibotComponent } from '../antibot/antibot.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ReactiveFormsModule,
         FormsModule,
         FormGroup,
         FormControl,
         Validators,
         FormBuilder} from '@angular/forms';
import { BrowserModule } from "@angular/platform-browser";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material';
import { Router, NavigationStart, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  [x: string]: any;

   @ViewChild(AntibotComponent) private antiBot: AntibotComponent;
  redirectUrl: string;
  
  contactDetailsForm: FormGroup;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  
   error: any = {};
  
   errorMessages: Object;
   successMessages: string;
  
  constructor(private fb: FormBuilder,
             private activatedRoute: ActivatedRoute,
             private router: Router,
             private http: HttpClient,
             public snackBar: MatSnackBar,
             private spinnerService: Ng4LoadingSpinnerService) { 
  
   this.redirectUrl = this.activatedRoute.snapshot.queryParams['redirectTo'];
  }
 
  contact_validation_messages = {
    
    'name': [
      { type: 'required', message: 'First name is required' },
       { type: 'pattern', message: 'Enter a valid name' }
    ],  
    'email': [
      { type: 'required', message: 'Email is required' },
      { type: 'pattern', message: 'Enter a valid email' }
    ],
    'contactno': [
      { type: 'required', message: 'Contact no. is required' },
      { type: 'pattern', message: 'Enter a valid contact no. eg.+11234567890, +1-1234567890' }
    ],
    'subject': [
      { type: 'required', message: 'Subject is required' }
    ],
    'message': [
      { type: 'required', message: 'Message is required' }
    ] 
    
  }

  ngOnInit() {
     this.contactform();
        
  }
  
  
  contactform() {
    
    this.contactDetailsForm = this.fb.group({
      name: new FormControl('', Validators.compose([ Validators.required,
      Validators.pattern('^[a-zA-Z ]*$')])),
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$')
      ])),
      contactno : new FormControl('',Validators.compose([Validators.required,Validators.pattern('^\\+(?:[0-9]-?){6,14}[0-9]$')])),
      subject : new FormControl('',Validators.compose([ Validators.required])),
      message : new FormControl('',Validators.compose([ Validators.required])),
      
    
    })
  }
  
  onSubmitContactDetails(value){
    this.spinnerService.show();
   
    
     const body  = {name:value.name,
                    email:value.email, 
                    phoneNumber:value.contactno,
                    subject:value.subject, 
                    message:value.message};
    if(this.antiBot.checkAnswer()){
        this.http.post(SERVER_URL + "contactus", body).subscribe
           ( data => {
            
             // alert(JSON.stringify(data));
       
              this.error = data;
              if(this.error.ERROR){
                this.successMessages = '';
                this.errorMessages = this.error.ERROR[0].defaultMessage;
                 this.spinnerService.hide();
                this.snackBar.open (JSON.stringify(this.error.ERROR[0].defaultMessage), "", {
                  duration: 5000,
                   horizontalPosition: this.horizontalPosition,
                   verticalPosition: this.verticalPosition,
                  
                });
                 //alert(JSON.stringify(this.error.ERROR[0].defaultMessage));
              }
              else{
                this.spinnerService.hide();
                this.errorMessages = null;
                this.snackBar.open ("Thank you for contacting us, soon our team will revert back.", "", {
                   duration: 5000,
                   horizontalPosition: this.horizontalPosition,
                   verticalPosition: this.verticalPosition
                });
                
            
               // alert("Thank you for contacting us, soon our team will contact you.");
                this.contactDetailsForm.reset();
               
                this.redirectUrl = "login";
                this.router.navigate([this.redirectUrl]);
                
              }
          }, 
          error => {
            this.spinnerService.hide();
            this.loading = false;
            throw new Error(error);
          }
          );
    }
    else{
      this.loading = false;
    }
      
      
  }
  navigateTo(url) {
    this.router.navigate([url]);
  }
  
  
}
