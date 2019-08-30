import { SERVER_URL } from '../../service/auth.constant';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.css']
})
export class PrivacyPolicyComponent implements OnInit {

  domain:string;
  privacyPolicy:any ={};
  constructor(private router: Router,
             private http: HttpClient) { }

  ngOnInit() {
    this.getDomain();
  }

  getDomain() {
    
    this.http.get(SERVER_URL + "domains/getTermPrivacy").subscribe(
      res=> {
         const data = (JSON.stringify(res)); 
       
        const content = JSON.parse(data);
        this.privacyPolicy =  content.privacyPolicy;
       
        
      }
   );
  }
}