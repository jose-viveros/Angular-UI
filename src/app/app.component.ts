import {UserService} from './service/user.service';
import {TOKEN_NAME} from './service/auth.constant';
import {Component, ViewEncapsulation, OnChanges} from '@angular/core';
import {Router, NavigationExtras} from '@angular/router';
import {Observable} from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css', 'styles/dashboard.css', 'styles/parent.css', 'styles/registration.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnChanges {
  title = 'Excelplus';
  isLoggedIn$: Observable<boolean>;
  temp: boolean;
  menus: any = [];
  submenus: any = {};
  events: string[] = [];
  opened: boolean;
  collapsed = true;
  loginTxt = 'Login';
  isShowMenu: boolean;
  user: string;
  currentPath: string;
  isDefaultSelected: boolean;
  userId:number;
   userName:string;
   userType:string;
  pathSelected: string;
  testId: number;
  testRunnerMenuId = null;
  showTestRunnerMenu$: Observable<boolean>;
  currentActiveMenuId = null;

  constructor(private router: Router, private userService: UserService, public dialog: MatDialog,) {
    if (window.location.search.startsWith("?newpassword")) {
      this.router.navigateByUrl('newpassword?' + window.location.search.substring(13));
    } else if (window.location.search.startsWith("?confirm-registration")) { //22 
      this.router.navigateByUrl('registration?' + window.location.search.substring(22));
    } else if (window.location.search.startsWith("?logger")) {
      this.router.navigateByUrl('logger/' + window.location.search.substring(8));
    } else if (window.location.search.startsWith("?check-answer")) {
      const indexOftestIdString = window.location.search.lastIndexOf('testID=');
      this.testId = parseInt(window.location.search.substring(indexOftestIdString + 7));
      this.checkParentLoggedIn();
    } else {
      this.isLoggedIn$ = this.userService.isLoggedIn;
      this.verifyRefresh();
    }
    
    this.showTestRunnerMenu$ = this.userService.getShowTestRunnerMenu();

    this.showTestRunnerMenu$.subscribe((show) => {
        this.udateTestRunnerTab(show);
    });
  }

    udateTestRunnerTab(show) {
        const testRunner = document.getElementById("m" + this.testRunnerMenuId);
        if(testRunner) {
            testRunner.hidden = !show;
            testRunner.setAttribute("class", "ng-star-inserted active");
            const otherMenu = document.getElementById(this.currentActiveMenuId);
            otherMenu.setAttribute("class", "ng-star-inserted");
            
        }
    }
  
  checkParentLoggedIn() {
    this.isLoggedIn$ = this.userService.isLoggedIn;
    this.isLoggedIn$.subscribe((isLogged) => {
      
      if (!isLogged) {
        this.loginTxt = 'Login';
        this.router.navigate(['/']);
      } else {
        this.loginTxt = 'Logout';
        this.isShowMenu = true;
        this.getMenusForUser();
        this.router.navigateByUrl('check-answer/' + this.testId);
      }
    });
  }
  
  showHideMenu(menu) {
  	if(menu.menuUrl === "subject") {
  		this.testRunnerMenuId = menu.id;
  		return true;
  	} else {
  		return false;
  	}
  }
  
  verifyRefresh() {
    this.relogin();
    this.isLoggedIn$.subscribe((isLogged) => {
      if (!isLogged) {
        this.loginTxt = 'Login';
        if(this.userService.isSubDomain()) {
            this.router.navigate(['institute-landing']);
        } else {
            this.router.navigate(['/']);
        }
      } else {
        this.loginTxt = 'Logout';
        this.isShowMenu = true;
        this.getMenusForUser();
        
     }
    });
  }

  relogin() {
    const token = this.userService.getAttribute(TOKEN_NAME);
    if(token != null) {
        this.userService.setLoggedIn(true);
    }
  }


  hideMenu(value) {
    this.isShowMenu = value;
  }
  logout() {
    this.userService.logout();
  }

  selectedPath() {
    const roles = JSON.parse(this.userService.getAttribute('AUTHORITIES'));
    console.log(roles[0].authority);
    if (roles && roles[0] && roles[0].authority) {
      const roll = roles[0].authority;
      if (roll === 'ROLE_ADMIN') {
        this.user = 'ADMIN';
        this.isDefaultSelected = true;
      } else if (roll === 'ROLE_PARENT') {
        this.user = 'PARENT';
        this.isDefaultSelected = true;
      } else if (roll === 'ROLE_TUTOR') {
        this.user = 'TUTOR';
        this.isDefaultSelected = true;
      } else if (roll === 'ROLE_CF') {
        this.user = 'CF';
        this.isDefaultSelected = true;
     } else if (roll === 'ROLE_INDIVIDUAL') {
        this.user = 'INDIVIDUAL';
        this.isDefaultSelected = true;
     } else{
        this.user = 'STUDENT';
        this.isDefaultSelected = true;
     }   
         this.currentPath = this.user + ' > ' + 'Dashboard';
         
    }
  }

  navigateTo(id, url, menuType, name) {
      this.currentActiveMenuId = "m" + id;

    if (menuType === "MAIN") {
      this.getSubMenus(id);
    }
    this.isDefaultSelected = false;
    if(name !== 'Test Runner'){
    this.selectedPath();
    this.isDefaultSelected = false;
    this.currentPath = this.user + ' > ' + name;
    this.router.navigate([url]);
   }
  }

  getSubMenus(id) {
    this.userService.executeGetRequest("submenus/" + id).subscribe(
      res => {
        this.submenus = res;
        this.collapsed = (res.length === 0);
      }
    );
  }

  getMenusForUser() {
    this.userService.executeGetRequest("menus").subscribe(
      res => {       
        this.menus = res;
        this.loginTxt = 'Logout';
        this.selectedPath();
        this.getUserDetails();       
      }
    );
  }
  getUserDetails() {
    if(this.loginTxt==='Logout'){
    this.userService.executeGetRequest('getuser').subscribe(
      data => {
        let firstName = '';
        let lastName = '';
        if (data.displayName === null) {
          if (data.firstName != null) {
            firstName = data.firstName;
          }
          if (data.lastName != null) {
            lastName = data.lastName;
          }
        }
        else {
          firstName = data.displayName;
        }
        this.userName = firstName + " " + lastName;
        this.userId=data.id;
        this.userType = data.userType;
        if(data.notifications===null){
           if(this.user!=='STUDENT'){
            if(this.user!=='ADMIN'){ 
              if( this.user!=='CF'){
                this.openDialog();
              }
            }
          }
        }
      });
    }
  }
  openDialog() {
    const dialogRef = this.dialog.open(DialogUpdateConsent, {
      width: '450px',
      height: '350px'
    });

    dialogRef.afterClosed().subscribe(req => {
       if (req) {
        const navigationPrivacy: NavigationExtras = {
          queryParams: {
            option: 'Privacy'
          }
        }
        this.router.navigate(['parent-dashboard'], navigationPrivacy);
       }
    });
 }
  onActivate(event) {
    //  window.scroll(0, 0);
    //or document.body.scrollTop = 0;
    //or document.querySelector('body').scrollTo(0,0)
  }

  selectedPathFromHeader(value) {
    this.pathSelected = value;
    this.router.navigate(['/parent-dashboard']);
    // alert(value);
  }

  ngOnChanges() {
    //alert();
  }
}

@Component({
  selector: 'dialog-update-consent',
  templateUrl: 'dialog-update-consent.html',
 })
 export class DialogUpdateConsent {
 
  constructor(
     public dialogRef: MatDialogRef<DialogUpdateConsent>) { }
     onNoClick(): void {
      this.dialogRef.close();
    }
 }