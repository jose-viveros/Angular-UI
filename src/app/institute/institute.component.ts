import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../service/user.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, MatSnackBar } from '@angular/material';
import { HttpHeaders, HttpParams, HttpClient } from '@angular/common/http';
import { SERVER_URL, TOKEN_NAME } from '../service/auth.constant';

@Component({
    selector: 'app-institute',
    templateUrl: './institute.component.html',
    styleUrls: ['./institute.component.css']
})
export class InstituteComponent implements OnInit {

    instituteDetailsForm: FormGroup;

    institute_validation_messages = {
        'instituteName': [
            {type: 'required', message: 'Institute name is required'},
            {type: 'pattern', message: 'Enter a valid Institute name'}
        ],
        'instituteURL': [
            {type: 'required', message: 'Institute Domain name is required'}
        ]/*,
        'communicationEmailFrom': [
            {type: 'required', message: 'Communication Email from is required'},
            {type: 'pattern', message: 'Enter a valid email'},
        ]*/,
        'directorName': [
            {type: 'pattern', message: 'Enter a valid Director name'}
        ]
    };

    isInValidEmail = false;

    isEmail = null;

    emailErrorMessage = null;

    hostURL = "";

    error: any = {};

    model: any = {};

    horizontalPosition: MatSnackBarHorizontalPosition = 'center';
    
    verticalPosition: MatSnackBarVerticalPosition = 'top';

    instituteLogoFile: File = null;

    directorPhotoFile: File = null;

    sizeErrorDirector = false;

    sizeErrorLogo = false;

    instituteAlreadyRegistered = false;

    instituteId = null;

    protocol = null;

    constructor(private fb: FormBuilder,
        private activatedRoute: ActivatedRoute,
        private userService: UserService,
        private router: Router,
        private http: HttpClient,
        public snackBar: MatSnackBar,
        private spinnerService: Ng4LoadingSpinnerService) { 
            if(window.location.host.startsWith("localhost")) {
                this.hostURL = "localhost:4200";  
            } else {
                this.hostURL = window.location.host.substr(4);
            }
        }

    ngOnInit() {
        this.protocol = window.location.protocol;
        this.instituteForm();
        this.checkURL();
    }

    checkURL() {
        const host = window.location.host;
        /*if(host.toLocaleLowerCase() !== "www.excel11plus.com" && host.toLocaleLowerCase() !== "www.artofexam.com" && host.toLocaleLowerCase() !== "localhost:4200") {
            this.instituteAlreadyRegistered = true;
            this.getExistingValues(host);
        }*/
        this.getExistingValues(host);
    }

    getExistingValues(host) {
        const body = {"url": host.toLocaleLowerCase()};
        this.instituteId = null;
        this.userService.executePostRequest("getinstitute", body).subscribe((data) => {
            this.model = data;
            if(this.model) {
                this.instituteAlreadyRegistered = true;
                this.instituteId = this.model.id;
                this.instituteDetailsForm.value.instituteName = this.model.name;
                this.instituteDetailsForm.value.instituteDescription = this.model.description;
                this.instituteDetailsForm.value.instituteURL = "https://"+ this.model.url;
                //this.instituteDetailsForm.value.communicationEmailFrom = this.model.email;
                this.instituteDetailsForm.value.directorName = this.model.directorName;
                this.instituteDetailsForm.value.message = this.model.message;
                this.instituteDetailsForm.value.quotes = this.model.quotes;
            } else {
                this.instituteAlreadyRegistered = false;
            }
        });
    }

    instituteForm() {
        this.instituteDetailsForm = this.fb.group({
            instituteName: new FormControl('',Validators.compose([Validators.required])),
            instituteDescription: new FormControl(''),
            instituteURL: new FormControl('',Validators.compose([Validators.required])),
            //communicationEmailFrom: new FormControl('',Validators.compose([Validators.required])),
            instituteLogoImage: new FormControl(''),
            instituteLogoURL: new FormControl(''),
            directorName: new FormControl(''),
            directorImage: new FormControl(''),
            directorImageURL: new FormControl(''),
            message: new FormControl(''),
            quotes: new FormControl('')
        })
    }

    onSubmitInstituteDetails(value) {

        if(this.sizeErrorDirector || this.sizeErrorLogo) {

        } else {        
            let headers = new HttpHeaders();
            headers.set('Content-Type', null);
            headers.set('Accept', "multipart/form-data");
            headers = headers.append(TOKEN_NAME, this.userService.getToken());

            const params = new HttpParams();

            const formData = new FormData();
            formData.append("name", value.instituteName);
            formData.append("description", value.instituteDescription);
            //formData.append("url", "www." + value.instituteURL + "." + this.hostURL);
            formData.append("url", value.instituteURL + "." + this.hostURL);
            //formData.append("email", value.communicationEmailFrom);
            formData.append("logoImageName", value.instituteLogoImage);
            formData.append("logoImageUrl", value.instituteLogoURL);
            formData.append("directorName", value.directorName);
            formData.append("directorImageName", value.directorImage);
            formData.append("directorImageUrl", value.directorImageURL);
            formData.append("message", value.message);
            formData.append("quotes", value.quotes);
            if(this.instituteId != null) {
                formData.append("id", this.instituteId);
            }
            if (this.instituteLogoFile) {
                formData.append('instituteLogo', this.instituteLogoFile, this.instituteLogoFile.name);
            } else {
                formData.append('instituteLogo', this.instituteLogoFile, "");
            }

            if(this.directorPhotoFile) {
                formData.append('directorPhoto', this.directorPhotoFile, this.directorPhotoFile.name);
            } else {
                formData.append('directorPhoto', this.directorPhotoFile, "");
            }
            
            this.http.post(SERVER_URL + "institute", formData,  {headers} ).subscribe((data) => {
                this.spinnerService.hide(); 
                    this.error = data;
                    if(this.error.ERROR) {
                        this.snackBar.open (this.error.ERROR, "", {
                            duration: 5000,
                            horizontalPosition: this.horizontalPosition,
                            verticalPosition: this.verticalPosition
                        });
                    } else {
                        this.snackBar.open ("Institute Created Successfully!!!", "", {
                            duration: 5000,
                            horizontalPosition: this.horizontalPosition,
                            verticalPosition: this.verticalPosition
                        });
                    }
            });
        }

        /*this.spinnerService.show();
        const body = {
            name: value.instituteName,
            description: value.instituteDescription,
            url: "www." + value.instituteURL + "." + this.hostURL,
            logoImageName: value.instituteLogoImage,
            logoImageUrl: value.instituteLogoURL,
            instituteSummaries: [{
                directorName: value.directorName,
                directorImageName: value.directorImage,
                directorImageUrl: value.directorImageURL,
                message: value.message,
                quotes: value.quotes
            }]            
        };

        this.userService.executePostRequest("institute", body).subscribe(
            data => {
                this.spinnerService.hide(); 
                this.error = data;
                if(this.error.ERROR) {
                    this.snackBar.open (this.error.ERROR, "", {
                        duration: 5000,
                        horizontalPosition: this.horizontalPosition,
                        verticalPosition: this.verticalPosition
                    });
                } else {
                    this.snackBar.open ("Institute Created Successfully!!!", "", {
                        duration: 5000,
                        horizontalPosition: this.horizontalPosition,
                        verticalPosition: this.verticalPosition
                    });
                }
            },
            error => {
                this.spinnerService.hide();
                this.snackBar.open ("Error Saving", "", {
                        duration: 5000,
                        horizontalPosition: this.horizontalPosition,
                        verticalPosition: this.verticalPosition
                });
            }
        );*/
    }


    handleInstituteLogoFileInput(files: FileList) {
        this.sizeErrorLogo = false;
        if(files && files.length > 0) {
            if(this.userService.verifyLength(files[0].size)) {
                this.instituteLogoFile = files[0];
            } else {
                this.sizeErrorLogo = true;
            }
        } else {
            this.sizeErrorLogo = false;
            this.instituteLogoFile = null;
        }
        
    }

    handleDirectorPhotoFileInput(files: FileList) {
        this.sizeErrorDirector = false;
        if(files && files.length > 0) {
            if(this.userService.verifyLength(files[0].size)) {
                this.directorPhotoFile = files[0];
            } else {
                this.sizeErrorDirector = true;
            }
        } else {
            this.sizeErrorDirector = false;
            this.directorPhotoFile = null;
        }
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
}
