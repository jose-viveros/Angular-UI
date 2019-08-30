import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../../service/user.service';
import { SERVER_URL } from '../../service/auth.constant';


@Component({
  selector: 'app-institute-landing',
  templateUrl: './institute-landing.component.html',
  styleUrls: ['./institute-landing.component.css']
})
export class InstituteLandingComponent implements OnInit {

  
  menus: any = {};
  model: any = {};

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private userService: UserService,
              private iconRegistry: MatIconRegistry,
              private sanitizer: DomSanitizer,
              private http: HttpClient) {
    
  }
  
  ngOnInit() {
    this.getExistingValues();
  }
  
  getExistingValues() {
        const body = {"url": window.location.host.toLocaleLowerCase()};
        /*this.userService.executePostRequest("getinstitute", body).subscribe((data) => {
            this.model = data;
        });*/
        this.http.post(SERVER_URL + "getinstitute", body).subscribe(
            data => {
                this.model = data;        
        });
    }
}
