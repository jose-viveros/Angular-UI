import { Component, OnInit } from '@angular/core';
import { UserService } from '../../service/user.service';
import { ParentErrorStateMatcher, PasswordValidator } from '../../validators/password.validator';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { MatSnackBar, MatDialog, MatDialogRef, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { DataService } from '../../service/data-api.service';
import value from '*.json';

@Component({
   selector: 'app-dashboard',
   templateUrl: './dashboard.component.html',
   styleUrls: ['./dashboard.component.css', '../../styles/home.component.css', '../../styles/dashboard.css', '../../styles/parent.css', '../../styles/registration.css']
})
export class DashboardComponent implements OnInit {

  isPayment: boolean;
  paymentData: any;
  userRole:string;
   selectedOption: string;
   
  constructor(private fb: FormBuilder,
    private router: Router,
    public snackBar: MatSnackBar,
    private userService: UserService,
    private dataService: DataService,
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute) {
    }
  
    ngOnInit() {
      this.getRole();
      this.activatedRoute.queryParams.subscribe(params => {
           this.selectedOption = params.option;
          
      })
     if(!this.selectedOption){
        this.dataService.currentDashboardSubMenu.subscribe(dashboardSubMenu => this.selectedOption = dashboardSubMenu)
     }
  }

    getRole(){
      const roles = JSON.parse(this.userService.getAttribute('AUTHORITIES'));
      if (roles && roles[0] && roles[0].authority) {
        this.userRole = roles[0].authority;
      }
    }
    paymentPage(value){
      this.isPayment=value;

    }

    paymentData1(value){
       this.paymentData=value
       console.log(this.paymentData)

    }

  optionSelected(option) {
    this.selectedOption = option;
  }

 navigateTo(url) {
    this.router.navigate([url]);
  }
  
  

}

