import { Injectable, Output, EventEmitter } from '@angular/core';
import { JwtHelper } from 'angular2-jwt';

import { TOKEN_NAME, SERVER_URL, DOMAIN, CURRENCY, TIMEZONE, AUTHORITIES } from './auth.constant';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs/Rx';
import 'rxjs/Rx';

@Injectable()
export class UserService {
    jwtHelper: JwtHelper = new JwtHelper();
    accessToken: string;
    isAdmin: boolean;
    currentState: string;

	private bShowTestRunnerMenu = new BehaviorSubject<boolean>(false);
  
    private loggedIn = new BehaviorSubject<boolean>(false);

    constructor(private router: Router,
        private http: HttpClient) {
    }
    
    get isLoggedIn() {
        return this.loggedIn.asObservable();
    }

    get getIsLoggedIn() {
        return this.loggedIn.getValue();
    }

    setLoggedIn(isLoggedIn) {
        this.loggedIn.next(isLoggedIn);
    }

    login(accessToken: string) {
        const decodedToken = this.jwtHelper.decodeToken(accessToken);

        this.accessToken = accessToken;

        this.setAttribute(TOKEN_NAME, accessToken);
        this.setAttribute(CURRENCY, "GBP");
    }

    setAttribute(key, value) {
        sessionStorage.setItem(key, value);
    }

    getAttribute(key) {
        return sessionStorage.getItem(key);
    }

    removeAttribute(key) {
        sessionStorage.removeItem(key);
    }

    logout() {
        this.setLoggedIn(false);
        if (!location.pathname.startsWith("/excelplus/testrunner")) {
            this.clearSessionOnLogout();
        } else {
            this.routeToLogin();
        }
        /*
        this.setLoggedIn(false);
            this.accessToken = null;
            this.isAdmin = false;
            sessionStorage.clear();
            this.routeToLogin();
            */
    }

    clearSessionOnLogout() {
        this.accessToken = null;
        this.isAdmin = false;
        sessionStorage.clear();
    }

    getToken() {
        this.accessToken = sessionStorage.getItem(TOKEN_NAME);
        return this.accessToken;
    }

    isAdminUser(): boolean {
        return this.isAdmin;
    }

    isUser(): boolean {
        return this.accessToken && !this.isAdmin;
    }

    errorHandler(err) {
        console.log(err);
        this.routeToLogin();
    }

    routeToLogin() {
        const url = "login";
        this.router.navigate([url]);
    }

    executeGetRequest(url): Observable<any> {
        let headers = this.getHeaders();
        return this.http.get(SERVER_URL + url, { headers })
            .map((res: Response) => res)
            .catch((err: any) => Observable.throw(this.errorHandler(err)));
    }

    executePostRequest(url, body) {
        let headers = this.getHeaders();
        return this.http.post(SERVER_URL + url, body, { headers })
            .map((res: Response) => res)
            .catch((err: any) => Observable.throw(this.errorHandler(err)));
    }

    executeDeleteRequest(url): Observable<any> {
        let headers = this.getHeaders();
        return this.http.delete(SERVER_URL + url, { headers })
            .map((res: Response) => res)
            .catch((err: any) => Observable.throw(this.errorHandler(err)));
    }

    getHeaders() {
        let headers = new HttpHeaders();
        headers = headers.append(TOKEN_NAME, this.getToken());
        headers = headers.append(TIMEZONE, this.getTimeZone());
        return headers;
    }

    getTimeZone() {
        return "GMT+" + (new Date()).getTimezoneOffset() / 60 * (-1);
    }

    getCurreny() {
        return this.getAttribute(CURRENCY)
    }
    getDomain() {
        return this.getAttribute(DOMAIN)
    }
    setCurrentstate(state) {
        this.currentState = state;
    }

    getCurrentstate() {
        return this.currentState;
    }

    isSubDomain() {
        const host = window.location.host;
        if (host.split(".").length >= 3 && !host.toLocaleLowerCase().startsWith('www')) {
            return true;
        } else {
            return false;
        }
    }

    verifyLength(s) {
        if ((s / (1024 * 1024)) > 1) {
            return false;
        } else {
            return true;
        }
    }

    isRoleParent() {
        return this.checkRole("ROLE_PARENT");
    }

    isRoleAdmin() {
        return this.checkRole("ROLE_ADMIN");
    }

    isRoleTutor() {
        return this.checkRole("ROLE_TUTOR");
    }

    isRoleCF() {
        return this.checkRole("ROLE_CF");
    }

    isRoleIndividual() {
        return this.checkRole("ROLE_INDIVIDUAL");
    }

    isRoleStudent() {
        return this.checkRole("ROLE_STUDENT");
    }

    isRoleTeacher() {
        return this.checkRole("ROLE_TEACHER");
    }

    isRoleChild() {
        return this.checkRole("ROLE_CHILD");
    }

    isRoleExternal() {
        return this.checkRole("ROLE_EXTERNAL");
    }

    isRoleSchoolAdmin() {
        return this.checkRole("ROLE_SCHOOL_ADMIN");
    }

    isRoleTutorAdmin() {
        return this.checkRole("ROLE_TUTOR_ADMIN");
    }
    
    checkRole(role) {
        const roles = JSON.parse(this.getAttribute('AUTHORITIES'));
        if (roles && roles[0] && roles[0].authority) {
            const roll = roles[0].authority;
            if (roll === role) {
                return true;
            } else {
                return false;
            } 
        } else {
            return false;
        }
    }
    
    setShowTestRunnerMenu(show) {
        this.bShowTestRunnerMenu.next(show);
    }

    showTestRunnerMenu() {
        return this.bShowTestRunnerMenu.getValue();
    }

    getShowTestRunnerMenu() {
        return this.bShowTestRunnerMenu.asObservable();        
    }
}
