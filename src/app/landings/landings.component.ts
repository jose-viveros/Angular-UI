import { SERVER_URL } from '../service/auth.constant';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { UserService } from '../service/user.service';
import { HttpClient } from '@angular/common/http';
import {NgcCookieConsentModule, NgcCookieConsentService, NgcInitializeEvent, NgcStatusChangeEvent, NgcNoCookieLawEvent} from 'ngx-cookieconsent';

@Component({
  selector: 'app-landings',
  templateUrl: './landings.component.html',
  styleUrls: ['./landings.component.css']
})
 
export class LandingsComponent implements OnInit,OnDestroy {
  
  menus: any = {};
  model: any = {};
  homePageData: any={};
  popupOpenSubscription: any={};
  popupCloseSubscription: any={};
  initializeSubscription: any={};
  statusChangeSubscription: any={};
  revokeChoiceSubscription: any={};
  noCookieLawSubscription: any={};
  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private userService: UserService,
              private iconRegistry: MatIconRegistry,
              private sanitizer: DomSanitizer,
              private http: HttpClient,
              private ccService: NgcCookieConsentService) {
    
  }
  
  ngOnInit() {
    window.scroll(0, 0);
    this.getDomain();
    // subscribe to cookieconsent observables to react to main events
    this.popupOpenSubscription = this.ccService.popupOpen$.subscribe(
      () => {
        // you can use this.ccService.getConfig() to do stuff...
      });

    this.popupCloseSubscription = this.ccService.popupClose$.subscribe(
      () => {
        // you can use this.ccService.getConfig() to do stuff...
      });

    this.initializeSubscription = this.ccService.initialize$.subscribe(
      (event: NgcInitializeEvent) => {
        // you can use this.ccService.getConfig() to do stuff...
      });

    this.statusChangeSubscription = this.ccService.statusChange$.subscribe(
      (event: NgcStatusChangeEvent) => {
        // you can use this.ccService.getConfig() to do stuff...
      });

    this.revokeChoiceSubscription = this.ccService.revokeChoice$.subscribe(
      () => {
        // you can use this.ccService.getConfig() to do stuff...
      });

      this.noCookieLawSubscription = this.ccService.noCookieLaw$.subscribe(
      (event: NgcNoCookieLawEvent) => {
        // you can use this.ccService.getConfig() to do stuff...
      });
    document.getElementById('cookieconsent:link').addEventListener('click', (e) => this.router.navigate(['/cookiePolicy']));
  }
  
  ngOnDestroy() {
    // unsubscribe to cookieconsent observables to prevent memory leaks
    this.popupOpenSubscription.unsubscribe();
    this.popupCloseSubscription.unsubscribe();
    this.initializeSubscription.unsubscribe();
    this.statusChangeSubscription.unsubscribe();
    this.revokeChoiceSubscription.unsubscribe();
    this.noCookieLawSubscription.unsubscribe();
  }
  getMenusForUser() {
    this.userService.executeGetRequest("menus").subscribe (
        res => {
          this.menus = res;
        }
    );
  }

  getDomain(){
          
    this.http.get(SERVER_URL + "domains/getTermPrivacy").subscribe(
      res=> {
        const data = (JSON.stringify(res));
        const content = JSON.parse(data);
        this.homePageData =  content.homePage;        
      });
  }
  parentHelp() {
    this.router.navigateByUrl('/parent-help');     
  }

  tutorHelp() {
    this.router.navigateByUrl('/tutor-help');     
  }

  studentHelp() {
    this.router.navigateByUrl('/student-help');    
  }
  
}
