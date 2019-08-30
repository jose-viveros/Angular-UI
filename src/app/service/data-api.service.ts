import 'rxjs/add/operator/map';

import { HttpClient, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Configuration } from '../app.constants';
import { UserService } from './user.service';
import { Subscription } from 'rxjs/Subscription';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class DataService {

  private dashboardSubMenuSource = new BehaviorSubject('MyAccount');
  currentDashboardSubMenu = this.dashboardSubMenuSource.asObservable();

  private individualdashboardSubMenuSource = new BehaviorSubject('Edit');
  currentIndividualDashboardSubMenu = this.individualdashboardSubMenuSource.asObservable();

  public actionUrl: string;
  // private username: string;
  // private password: string;
  user = null;
  question = null;
  chargeRequest = null;
  url = null;
  answersGiven = [];
  hours: number;
  minutes: number;
  seconds: number;
  timeDuration: number;
  sub: Subscription;
  constructor(private userService: UserService, private _configuration: Configuration) {
    this.actionUrl = _configuration.ServerWithApiUrl;
  }

  public getSubjects<T>(): Observable<T> {
    return this.userService.executeGetRequest('getsubjectaverage');
  }

  public getTopics<T>(subjectId): Observable<T> {
    return this.userService.executeGetRequest('gettopicaverage/' + subjectId);

  }

  public getTopicResultHistory<T>(topicId): Observable<T> {
    return this.userService.executeGetRequest('gettesthistory/' + topicId);

  }


  public getRegionalRanking<T>(examMasterId): Observable<T> {
    return this.userService.executeGetRequest('regionalranking/' + examMasterId);

  }

  public getExamSummary<T>(subjectId): Observable<T> {
    return this.userService.executeGetRequest('getexamlistforsubject/' + subjectId);

  }

  public getTestResult<T>(request): Observable<T> {
    //return this.userService.executePostRequest('verifyanswers', request);
    return this.userService.executePostRequest('reviewExams', request);

  }

  public testRunner<T>(request): Observable<T> {
    this.question = request;
    return this.userService.executePostRequest('testRunner', this.question);

  }

  public testTopicRunner<T>(url, request): Observable<T> {
    this.question = request;
    this.url = url;
    return this.userService.executePostRequest(this.url, this.question);

  }

  public nextQuestion<T>(request): Observable<T> {
    this.question = request;
    return this.userService.executePostRequest('testRunner', this.question);
  };

  public previousQuestion<T>(request): Observable<T> {
    this.question = request;
    return this.userService.executePostRequest('testRunner', this.question);
  };

  public saveAndSubmit<T>(request): Observable<T> {
    this.question = request;
    return this.userService.executePostRequest('testRunner', this.question);
  };

  public save<T>(request): Observable<T> {
    this.question = request;
    return this.userService.executePostRequest('testRunner', this.question);
  };

  public checkout<T>(request): Observable<T> {
    return this.userService.executePostRequest('checkout', request);
  };
  public charge<T>(request): Observable<T> {
    return this.userService.executePostRequest('charge', request);
  };

  public setTime(hours, minutes, seconds) {
    this.hours = hours;
    this.minutes = minutes;
    this.seconds = seconds;
    //this.timeDuration = Math.round(hours*60) + Math.round(minutes) + Math.round((seconds/60)) ;
    this.timeDuration = +(hours * 60) + +(minutes) + +((seconds / 60));
  };

  public setTimeInSeconds(seconds) {
    this.timeDuration = seconds;
  }

  public getTime(): number {
    return (this.timeDuration);
  };

  public setTimerSub(s) {
    this.sub = s;
  }

  get getSub() {
    return this.sub;
  }


  changeDashboardSubMenu(dashboardSubMenu: string) {
    this.dashboardSubMenuSource.next(dashboardSubMenu)
  }


}


@Injectable()
export class CustomInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!req.headers.has('Content-Type')) {
      req = req.clone({ headers: req.headers.set('Content-Type', 'application/json') });
    }
    req = req.clone({ headers: req.headers.set('Accept', 'application/json') });
    console.log(JSON.stringify(req.headers));
    return next.handle(req);
  }
}