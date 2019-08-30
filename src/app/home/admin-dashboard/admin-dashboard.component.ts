import { UserService } from '../../service/user.service';
import { Component, OnInit } from '@angular/core';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';


@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {

  template: string =`<img src="http://pa1.narvii.com/5722/2c617cd9674417d272084884b61e4bb7dd5f0b15_hq.gif" />`
  ContentFeederName: string;
  Total_QuestionsFed = 0;
  response =[];
  constructor(private userService:UserService,
              private spinnerService: Ng4LoadingSpinnerService) { }

  ngOnInit() {
    this.spinnerService.show();
    this.getAdminDashboradData();
  }
  
   getAdminDashboradData(){
       
       this.userService.executeGetRequest('adminDashboard').subscribe(
      res => {
        
        this.response=(res);
        this.spinnerService.hide();
      
      });
   }
}
