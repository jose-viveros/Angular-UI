import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SERVER_URL } from '../../service/auth.constant';

@Component({
  selector: 'app-terms-n-conditions',
  templateUrl: './terms-n-conditions.component.html',
  styleUrls: ['./terms-n-conditions.component.css']
})
export class TermsNConditionsComponent implements OnInit {

  termsnconditions: any={};
  domain:string;
  constructor(private router: Router,
             private http: HttpClient) { }

  ngOnInit() {
    this.getDomain();
  }

  getDomain(){
          
    this.http.get(SERVER_URL + "domains/getTermPrivacy").subscribe(
      res=> {
        const data = (JSON.stringify(res));
        const content = JSON.parse(data);
        this.termsnconditions =  content.temsNConditions;
        
        
      }
   );
  }
}
