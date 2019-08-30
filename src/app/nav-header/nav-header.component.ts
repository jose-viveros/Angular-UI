import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { UserService } from '../service/user.service';
import { HttpClient } from '@angular/common/http';
import { SERVER_URL } from '../service/auth.constant';
import * as $ from 'jquery';

@Component({
  selector: 'app-nav-header',
  templateUrl: './nav-header.component.html',
  styleUrls: ['./nav-header.component.css']
})
export class NavHeaderComponent implements OnInit, OnChanges {

  @Input() login;
  loginTxt = this.login;

  @Output() hideMenus = new EventEmitter<boolean>();
  @Output() currentPath = new EventEmitter<boolean>();

  options: any;
  userId: number;
  userName: string;
  userType: string;
  constructor(private router: Router, private userService: UserService, private http: HttpClient) { }
  overrideLogo = false;
  logo = null;
  model: any = {};
  option = 'MyAccount';
  menus = [];
  userAvtar: string;
    isSubDomain = true;

  ngOnInit() {
    this.isSubDomain = this.userService.isSubDomain();

    this.checkLogo();
    this.loginTxt = this.login;
    $(document).ready(function () {
      $(document).on("click", "#mob-menu", function () {
         $('.inner-menu').slideToggle(800);
      });
      // filters
      $('.filter-opener h4, h4.tab-opner').click(function () {
         $('.filter-content, .new-filter').slideToggle(800);
      });
      //
      $('.ans_ ul li lable, .Select_All input').click(function () {
         $(this).toggleClass('active');
      });
      //
      $('.Select_All input').click(function () {
         $(this).parent('.Select_All').toggleClass('active');
      });
   });
  }

  ngOnChanges() {
    this.loginTxt = this.login;
    if (this.loginTxt === 'Logout') {
      this.getUserDetails();
      this.setUserType();
    }
  }

  getUserDetails() {
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
        this.userId = data.id;
      });
  }

  setUserType() {
    const roles = JSON.parse(this.userService.getAttribute('AUTHORITIES'));

    if (roles && roles[0] && roles[0].authority) {
      const roll = roles[0].authority;
      if (roll === 'ROLE_ADMIN') {
        this.userType = 'ADMIN';
      } else if (roll === 'ROLE_PARENT') {
        this.userType = 'PARENT';
      } else if (roll === 'ROLE_TUTOR') {
        this.userType = 'TUTOR';
      } else if (roll === 'ROLE_CF') {
        this.userType = 'CF';
      } else if (roll === 'ROLE_INDIVIDUAL') {
        this.userType = 'INDIVIDUAL';
      } else{
        this.userType = 'STUDENT';
      }
    }
  }


  getMenusForUser() {
    console.log('=====>');
    this.menus = [];
    if (this.userType === 'PARENT' || this.userType === 'TUTOR') {
      this.menus.push('Status', 'Edit', 'Privacy', 'Subscriptions');
    } else if (this.userType === 'STUDENT') {
      this.menus.push('Status');
    } else if (this.userType === 'INDIVIDUAL') {
      this.menus.push('Edit', 'Privacy', 'Subscriptions');
    } else {
      this.menus.push('Dashboard')
    }

  }
  checkLogo() {
    const host = window.location.host;
    if (this.userService.isSubDomain()) {
      const body = { "url": host.toLocaleLowerCase() };
      this.http.post(SERVER_URL + "logo", body).subscribe
        (data => {
          this.overrideLogo = true;
          this.model = data;
          this.logo = this.model.logo;
        },
          () => {
            this.overrideLogo = false;
          }
        );
    }
  }

  loginClick() {
    if (this.loginTxt === 'Logout') {
      this.loginTxt = 'Login';
      this.userService.logout();
    }
    this.hideMenus.emit(false);
    this.router.navigate(['/login']);
    if(window.innerWidth < 575){
      $('.inner-menu').slideToggle(800);
    }
  }
  selectedOption(value) {
    this.userService.setCurrentstate(value);

    this.currentPath.emit(value);
    //  this.router.navigateByUrl('parent-dashboard');
  }

  registerClick() {
    // $('.inner-menu').slideToggle(800);
    this.loginTxt = 'Login';
    this.userService.logout();
    this.hideMenus.emit(false);
    this.router.navigate(['/registration']);
    if(window.innerWidth < 575){
      $('.inner-menu').slideToggle(800);
    }
  }

  homeClick() {
    this.hideMenus.emit(false);
    this.router.navigate(['/']);
  }

  excel11plusClick() {
    if (this.loginTxt !== 'Login') {
      if (this.userType === 'TUTOR' || this.userType === 'PARENT') {
        const navigationShop: NavigationExtras = {
          queryParams: {
            option: 'MyAccount'
          }
        }
        this.router.navigate(['parent-dashboard'], navigationShop);
      } else if (this.userType === 'INDIVIDUAL') {
        this.router.navigate(['individual-dashboard']);
      } else if (this.userType === 'STUDENT') {
        this.router.navigate(['student-dashboard']);
      }

    }

  }
  shopClick() {
    if (this.loginTxt !== 'Login') {
      if (this.userType === 'TUTOR' || this.userType === 'PARENT') {
        const navigationShop: NavigationExtras = {
          queryParams: {
            option: 'Subscriptions'
          }
        }
        this.router.navigate(['parent-dashboard'], navigationShop);
      } else if (this.userType === 'INDIVIDUAL') {
        const navigationShop: NavigationExtras = {
          queryParams: {
            option: 'Subscriptions'
          }
        }
        this.router.navigate(['individual-my-profile'], navigationShop);
      }
    }
  }
  menuChangeEvent(value) {
    if (this.userType === 'TUTOR' || this.userType === 'PARENT') {
      switch (value) {
        case "Status":
          const navigationStatus: NavigationExtras = {
            queryParams: {
              option: 'MyAccount'
            }
          }
          this.router.navigate(['parent-dashboard'], navigationStatus);
          break;

        case "Edit":
          const navigationEdit: NavigationExtras = {
            queryParams: {
              option: 'Edit'
            }
          }
          this.router.navigate(['parent-dashboard'], navigationEdit);
          break;
        case "Privacy":
          const navigationPrivacy: NavigationExtras = {
            queryParams: {
              option: 'Privacy'
            }
          }
          this.router.navigate(['parent-dashboard'], navigationPrivacy);
          break;
        case "Subscriptions":
          const navigationShop: NavigationExtras = {
            queryParams: {
              option: 'Subscriptions'
            }
          }
          this.router.navigate(['parent-dashboard'], navigationShop);
          break;

      }


    } else if (this.userType === 'STUDENT') {
      this.router.navigate(['student-dashboard']);
    } else if (this.userType === 'INDIVIDUAL') {
      switch (value) {
        case "Edit":
          const navigationEdit: NavigationExtras = {
            queryParams: {
              option: 'Edit'
            }
          }
          this.router.navigate(['individual-my-profile'], navigationEdit);
          break;
        case "Privacy":
          const navigationPrivacy: NavigationExtras = {
            queryParams: {
              option: 'Privacy'
            }
          }
          this.router.navigate(['individual-my-profile'], navigationPrivacy);
          break;
        case "Subscriptions":
          const navigationShop: NavigationExtras = {
            queryParams: {
              option: 'Subscriptions'
            }
          }
          this.router.navigate(['individual-my-profile'], navigationShop);
          break;

      }

    } else if (this.userType === 'ADMIN') {
      this.router.navigate(['admin-dashboard']);
    } else if (this.userType === 'CF') {
      this.router.navigate(['content-feeder-dashboard']);
    }
    if(window.innerWidth < 575){
      $('.inner-menu').slideToggle(800);
    }
  }
}

