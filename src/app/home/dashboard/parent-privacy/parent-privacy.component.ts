import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router} from '@angular/router';
import { MatSnackBar, MatDialog, MatDialogRef, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material';
import { UserService } from '../../../service/user.service';
import { DataService } from '../../../service/data-api.service';

@Component({
  selector: 'app-parent-privacy',
  templateUrl: './parent-privacy.component.html',
  styleUrls: ['./parent-privacy.component.css', '../../../styles/home.component.css', '../../../styles/dashboard.css', '../../../styles/parent.css']
})
export class ParentPrivacyComponent implements OnInit {

  changeNotification = false;
  changeresultNotifications = false;
  userID = null;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  constructor(private fb: FormBuilder,
    private router: Router,
    public snackBar: MatSnackBar,
    private userService: UserService,
    private dataService: DataService,
    public dialog: MatDialog) { }

  ngOnInit() {
  this.getUser();
    //  this.editform();
  }
  getUser() {
    this.userService.executeGetRequest('getuser').subscribe(
      data => {
        this.userID = data.id;
        if (data.notifications === true) {
          this.changeNotification = true;
        }
        if (data.resultNotifications === true) {
          this.changeresultNotifications = true;
        }
        
      })
  }

   //Privacy Tab
   //------------------------------------------------------------------------
   updateConsent() {
    //alert(this.userID);
    const body = {
       id: this.userID,
       notifications: this.changeNotification,
       resultNotifications: this.changeresultNotifications
    };
    this.userService.executePostRequest('updatePrivacy', body).subscribe(
       res => {
          // alert(JSON.stringify(res.message));
          this.snackBar.open(res.message, "", { duration: 3000 });
       });

 
 }
  
navigateTo(url) {
    this.router.navigate([url]);
  }
 //------------------------------------------
 //Delete Personal Data
 openDialog() {
    const dialogRef = this.dialog.open(DialogAlertUser);

    dialogRef.afterClosed().subscribe(req => {
       if (req) {
          this.deletePersonalData();
       }
    });
 }

 deletePersonalData() {
    
    this.userService.executeDeleteRequest("deleteuserrecord/" + this.userID).subscribe(
     
       res => {
          if(res.ERROR){
             this.snackBar.open("Error:" + res.ERROR, "", {
                duration: 5000,
                 horizontalPosition: this.horizontalPosition,
                 verticalPosition: this.verticalPosition
              });
          }
          else{
          this.snackBar.open("Removed All Records", "", {
                duration: 5000,
                 horizontalPosition: this.horizontalPosition,
                 verticalPosition: this.verticalPosition
              });
          //this.navigateTo('www.excel11plus.com');
            window.location.href = window.location.origin;
         }

       })

 }

 downloadContent() {
    this.userService.executeGetRequest("getpersonaldata").subscribe(
       res => {
          const hiddenElement = document.createElement('a');
          hiddenElement.href = 'data:attachment/html,' + encodeURI(res.DATA);
          hiddenElement.target = '_blank';
          hiddenElement.download = 'PersonalData.html';
          document.body.appendChild(hiddenElement);
          hiddenElement.click();
       });
 }
}

@Component({
 selector: 'dialog-alert-user',
 templateUrl: 'dialog-alert-user.html',
})
export class DialogAlertUser {

 constructor(
    public dialogRef: MatDialogRef<DialogAlertUser>) { }
}


