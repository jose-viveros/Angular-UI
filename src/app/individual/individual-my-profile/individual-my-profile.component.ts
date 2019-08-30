import { Component, OnInit } from '@angular/core';
import { UserService } from '../../service/user.service';
import { ParentErrorStateMatcher, PasswordValidator } from '../../validators/password.validator';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { MatSnackBar, MatDialog, MatDialogRef, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { DataService } from '../../service/data-api.service';

@Component({
  selector: 'app-individual-my-profile',
  templateUrl: './individual-my-profile.component.html',
  styleUrls: ['./individual-my-profile.component.css', '../../styles/home.component.css', '../../styles/dashboard.css', '../../styles/parent.css', '../../styles/registration.css']
})
export class IndividualMyProfileComponent implements OnInit {

  isPayment: boolean;
  paymentData: any;

  selectedOption: string;

  constructor(private fb: FormBuilder,
    private router: Router,
    public snackBar: MatSnackBar,
    private userService: UserService,
    private dataService: DataService,
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.selectedOption = params.option;

    })
    if (!this.selectedOption) {
      this.dataService.currentIndividualDashboardSubMenu.subscribe(dashboardSubMenu => this.selectedOption = dashboardSubMenu)
    }
  }

  paymentPage(value) {
    this.isPayment = value;

  }

  paymentData1(value) {
    this.paymentData = value
    console.log(this.paymentData)

  }

  optionSelected(option) {
    this.selectedOption = option;
  }

  navigateTo(url) {
    this.router.navigate([url]);
  }
}