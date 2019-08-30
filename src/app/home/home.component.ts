import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { UserService } from '../service/user.service';

@Component({
   selector: 'app-home',
   templateUrl: './home.component.html',
   styleUrls: ['../styles/home.component.css', '../styles/dashboard.css', '../styles/parent.css', '../styles/registration.css']
})
export class HomeComponent implements OnInit {
   title = 'Excelplus';
   isLoggedIn$: Observable<boolean>;
   temp: boolean;
   menus: any = {};
   submenus: any = {};
   events: string[] = [];
   opened: boolean;
   collapsed = true;
   selectedOption: string;
   isParent: boolean;
   availableMenus: any;
   isDefaultSelected: boolean;
   user: string;
   currentPath: string;
   isAdmin: boolean;
   roles: any;

   constructor(private router: Router, private userService: UserService) { }

   ngOnInit() {
      this.verifyRefresh();
   }
   verifyRefresh() {
      this.isLoggedIn$.subscribe((isLogged) => {
         if (!isLogged) {
            this.roles = JSON.parse(this.userService.getAttribute('AUTHORITIES'));
          //  alert("role:"+this.roles[0].authority);
            if (this.roles && this.roles[0] && this.roles[0].authority) {
               const roll = this.roles[0].authority;
               if (roll === 'ROLE_ADMIN') {
                  this.user = 'ADMIN';
                  this.router.navigateByUrl('admin-dashboard');
               } else if (roll === 'ROLE_PARENT' ) {
                  this.user = 'PARENT';
                  this.router.navigateByUrl('parent-dashboard');
               } else if (roll === 'ROLE_TUTOR') {
                  this.user = 'TUTOR';
                  this.router.navigateByUrl('parent-dashboard');
               } else if (roll === 'ROLE_CF') {
                  this.user = 'CF';
                  this.router.navigateByUrl('content-feeder-dashboard');
               } else if (roll === 'ROLE_INDIVIDUAL') {
                  this.user = 'INDIVIDUAL';
                  this.router.navigateByUrl('individual-dashboard');
               } else{
                  this.user = 'STUDENT';
                  this.router.navigateByUrl('student-dashboard');
               } 
            }
         };
      });
   }

   /* getMenusForUser() {
       this.userService.executeGetRequest("menus").subscribe(
          res => {
             console.log(res);
             this.menus = res;
             const options = [];
             for (let i = 0; i < this.menus.length; i++) {
                options.push(this.menus[i].menuName)
             }
             this.availableMenus = options.sort();
             this.roles = JSON.parse(this.userService.getAttribute('AUTHORITIES'));
             console.log(this.roles[0].authority);
             if (this.roles && this.roles[0] && this.roles[0].authority) {
                const roll = this.roles[0].authority;
                if (roll === 'ROLE_ADMIN') {
                   this.user = 'ADMIN';
                   this.isDefaultSelected = false;
                } else if (roll === 'ROLE_PARENT') {
                   this.user = 'PARENT';
                   this.optionSelected(this.availableMenus[0]);
                   this.isDefaultSelected = true;
                } else {
                   this.user = 'STUDENT';
                   this.optionSelected(this.availableMenus[0]);
                   this.isDefaultSelected = true;
                }
             }
          }
       );
    }
 
    optionSelected(option: string) {
       this.selectedOption = option;
       this.currentPath = this.user + ' > ' + option;
       this.isDefaultSelected = false;
       if (this.roles && this.roles[0] && this.roles[0].authority) {
          const roll = this.roles[0].authority;
          if (option === 'Dashboard') {
             switch (roll) {
                case 'ROLE_ADMIN': this.selectedOption = 'adminDashboard';
                   break;
                case 'ROLE_PARENT': this.selectedOption = 'Dashboard';
                   break;
                case 'ROLE_STUDENT': this.selectedOption = 'studentDashboard';
                   break;
             }
          } else if (option === 'Exam Master') {
             this.router.navigateByUrl('exam-master-summary/null');
          } else if (option === 'Content Feeder') {
             this.router.navigateByUrl('/content-feeder');
          }
       }
    }
 */
   selectedMenu() {
      this.selectedOption = 'My Activity';
   }
}
