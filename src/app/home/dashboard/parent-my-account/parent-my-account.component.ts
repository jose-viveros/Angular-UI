import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../service/user.service';

import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { MatSnackBar, MatDialog, MatDialogRef, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material';
import { Router, NavigationExtras } from '@angular/router';
import { DataService } from '../../../service/data-api.service';
@Component({
  selector: 'app-parent-my-account',
  templateUrl: './parent-my-account.component.html',
  styleUrls: ['./parent-my-account.component.css',  '../../../styles/home.component.css', '../../../styles/dashboard.css', '../../../styles/parent.css']
})
export class ParentMyAccountComponent implements OnInit {
  userID = null;
  selectedOption: string;
  activeStudentCount = 0;
  archiveStudentCount = 0;
  inactiveStudentsinlastSevenDays = 0;
  numberofQuestionsAnswered = 0;
  carelessQuestions = 0;
  overtimeCorrectQuestions = 0;
  overtimeInCorrectQuestions = 0;
  unAttemptedQuestions = 0;
  currentOption: string;
  inactiveStudentIds = [];

  constructor(private fb: FormBuilder,
    private router: Router,
    public snackBar: MatSnackBar,
    private userService: UserService,
    private dataService: DataService,
    public dialog: MatDialog) { }

  ngOnInit() {
    this.getstatus();
  }

   //Status tab
  //---------------------------------------------------------------------------------------------
  getstatus() {
    this.userService.executeGetRequest('parentdashboard').subscribe(
      res => {
        this.activeStudentCount = res.activeStudentCount;
        this.archiveStudentCount = res.archiveStudentCount;
        this.inactiveStudentsinlastSevenDays = res.inactiveStudentsinlastSevenDays;
        this.numberofQuestionsAnswered = res.numberofQuestionsAnswered;
        this.inactiveStudentIds = res.inactiveStudentIds;
        this.carelessQuestions = res.carelessQuestions;
        this.overtimeCorrectQuestions = res.overtimeCorrectQuestions;
        this.overtimeInCorrectQuestions = res.overtimeInCorrectQuestions;
        this.unAttemptedQuestions = res.unAttemptedQuestions;
      })
    }
   showInactiveStudentActivity() {
      if(this.inactiveStudentsinlastSevenDays>0){
      const navigationInactiveStudent: NavigationExtras = {
         queryParams: {
            inactiveStudentIds: this.inactiveStudentIds

         }
      }
      this.router.navigate(['my-student'], navigationInactiveStudent);
   }
   }
   showPerformance() {
      const navigationStudentPerformance: NavigationExtras = {
         queryParams: {
            performancePage: true

         }
      }
      this.router.navigate(['student-activity'], navigationStudentPerformance);
   }
}
