 
import * as $ from 'jquery';
import "angular2-navigate-with-data";
import { AvatarModule } from 'ngx-avatar';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { DataTableModule } from 'angular5-data-table';
import { UICarouselModule } from 'ui-carousel';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatCheckboxModule, MatSnackBarModule, MatRadioModule, ShowOnDirtyErrorStateMatcher } from '@angular/material';
import { MatExpansionModule } from '@angular/material/expansion';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatListModule } from '@angular/material/list'
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';

import { UserService } from './service/user.service';
import { DataService } from './service/data-api.service';
import { S3Service } from './service/s3.service';
import { ExamFilterService } from './parent-tutor/filters/exam-filter/exam-filter.service';

import { AppComponent, DialogUpdateConsent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './general/about/about.component';
import { Configuration } from './app.constants';
import { TimerComponent } from './timer/timer.component';
import { RegistrationComponent, DialogRegisterBasicInfoComponent } from './registration/registration.component';
import { TopicsListComponent } from './testrunner/topics-list/topics-list.component';
import { TopicComponent } from './testrunner/topic/topic.component';
import { ContentFeederListComponent } from './content-feeder/content-feeder-list/content-feeder-list.component';
import { ContentFeederMainComponent } from './content-feeder/content-feeder-main/content-feeder-main.component';
import { ContentFeederQuestionComponent } from './content-feeder/content-feeder-question/content-feeder-question.component';
import { ContentFeederSubquestionComponent } from './content-feeder/content-feeder-subquestion/content-feeder-subquestion.component';
import { LoginComponent } from './login/login.component';
import { RoutingComponent } from './content-feeder/routing/routing.component';
import { SafeHtmlPipe, GOOGLE_CLIENT_ID, FACEBOOK_CLIENT_ID_ARTOFEXAM, FACEBOOK_CLIENT_ID_EXCELPLUS } from './service/auth.constant';
import { TestRunnerComponent, DialogConfirmTestSubmission, DialogReportProblem } from './testrunner/test-runner/test-runner.component';
import { ExamSummaryComponent } from './testrunner/exam-summary/exam-summary.component';
import { ExamMasterSummaryComponent, DialogExamNameComponent } from './exam-master/exam-master-summary/exam-master-summary.component';
import { ExamMasterComponent } from './exam-master/exam-master/exam-master.component';
import { AntibotComponent } from './general/antibot/antibot.component';
import { CommonIssuesComponent } from './general/common-issues/common-issues.component';
import { ContactComponent } from './general/contact/contact.component';
import { FaqComponent } from './general/faq/faq.component';
import { LandingsComponent } from './landings/landings.component';
import { PagerService } from './service';
import { HttpUrlEncodingCodec } from '@angular/common/http';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTabsModule } from '@angular/material/tabs';
import { PaymentComponent } from './payment/payment.component';
import { MatMenuModule } from '@angular/material/menu';
import { TermsNConditionsComponent } from './general/terms-n-conditions/terms-n-conditions.component';
import { PrivacyPolicyComponent } from './general/privacy-policy/privacy-policy.component';
import { InformationComponent } from './general/information/information.component';
import { ExamExamFilterComponent } from './parent-tutor/filters/exam-filter/exam-filter.component';
import { StudentFilterComponent, DialogStudentSearch, DialogGroupSearch } from './parent-tutor/filters/student-filter/student-filter.component';
import { StudentFilterService } from './parent-tutor/filters/student-filter/student-filter.service';
import { NewFooterComponent } from './new-footer/new-footer.component';
import { NavHeaderComponent } from './nav-header/nav-header.component';
import { DashboardComponent } from './home/dashboard/dashboard.component';
import { MockListComponent } from './home/mock-list/mock-list.component';
import { TestingAreaComponent } from './home/testing-area/testing-area.component';
import { StudentMyActivityComponent } from './home/student-my-activity/student-my-activity.component';
import { StudActivityComponent } from './home/stud-activity/stud-activity.component';
import "angular2-navigate-with-data";
import { IndividualDashboardComponent } from './individual/individual-dashboard/individual-dashboard.component';
import { IndividualActivityComponent } from './individual/individual-activity/individual-activity.component';
import { AddStudentComponent, DialogUploadResult } from './parent-tutor/add-student/add-student.component';
import { EditStudentComponent } from './parent-tutor/edit-student/edit-student.component';
import { ReviewExamComponent, DialogReviewProblem } from './testrunner/review-exam/review-exam.component';
import { StudDashboardComponent } from './home/stud-dashboard/stud-dashboard.component';
import { MyStudComponent } from './home/my-stud/my-stud.component';
import { TutorHelpComponent } from './help-page/tutor-help/tutor-help.component';
import { ParentHelpComponent } from './help-page/parent-help/parent-help.component';
import { StudentHelpComponent } from './help-page/student-help/student-help.component';
import { BreadcrumLinkComponent } from './home/breadcrum-link/breadcrum-link.component';
import { AdminDashboardComponent } from './home/admin-dashboard/admin-dashboard.component';
import { ForgotPasswordComponent } from './reset-password/forgot-password/forgot-password.component';
import { NewPasswordComponent } from './reset-password/new-password/new-password.component';
import {
    SocialLoginModule,
    AuthServiceConfig,
    GoogleLoginProvider,
    FacebookLoginProvider,
    LinkedinLoginProvider

} from "angular5-social-auth";
import { SubscriptionComponent } from './home/dashboard/subscription/subscription.component';
import { SubscriptionDetailsComponent } from './home/dashboard/subscription-details/subscription-details.component';
import { ParentMyAccountComponent } from './home/dashboard/parent-my-account/parent-my-account.component';
import { ParentPrivacyComponent, DialogAlertUser } from './home/dashboard/parent-privacy/parent-privacy.component';
import { ParentEditComponent } from './home/dashboard/parent-edit/parent-edit.component';
import { PerformanceComponent, DialogPerformanceGraphComponent } from './performance/performance.component';
import { LoggerComponent } from './logger/logger.component';
import { MyGroupComponent, DialogCreateGroup, DialogEditGroup, DialogAddStudent, DialogDeleteGroup, DialogRemoveStudent } from './home/my-group/my-group.component';
import { GroupMocklistAssignComponent, DialogConfirmGroupMockListAction } from './parent-tutor/mocklist/group-mocklist-assign/group-mocklist-assign.component';
import { InstituteComponent } from './institute/institute.component';
import { InstituteLandingComponent } from './landings/institute-landing/institute-landing.component';
import { DialogConfirmMockListAction, MocklistAssignComponent } from './parent-tutor/mocklist/mocklist-assign/mocklist-assign.component';
import { ContentFeederDashboardComponent } from './content-feeder/content-feeder-dashboard/content-feeder-dashboard.component';
import { IndividualMyProfileComponent } from './individual/individual-my-profile/individual-my-profile.component';
import { AddAssistantComponent } from './parent-tutor/add-assistant/add-assistant.component';
import { DialogConfirmPaidMockListAction } from './home/mock-list/mock-list.component'
import { UiSwitchModule } from 'ngx-toggle-switch';
import { SearchAssistantComponent } from './parent-tutor/search-assistant/search-assistant.component';
import { FreeStyleDetailsComponent } from './home/free-style/free-style-details/free-style-details.component';
import { FreeStyleExamComponent } from './home/free-style/free-style-exam/free-style-exam.component';
import { WriteUpStudentComponent } from './home/write-up/write-up-student/write-up-student.component';
import { WriteUpExamListComponent } from './home/write-up/write-up-exam-list/write-up-exam-list.component';
import { WriteUpExamAddComponent } from './home/write-up/write-up-exam-add/write-up-exam-add.component';
import { WriteUpEvaluateListComponent, DialogUploadReviewComponent } from './home/write-up/write-up-evaluate-list/write-up-evaluate-list.component';
import { NgcCookieConsentModule, NgcCookieConsentConfig } from 'ngx-cookieconsent';
import { CookiePolicyComponent } from './general/cookie-policy/cookie-policy.component';
 
export function getAuthServiceConfigs() {

    let FACEBOOK_ID = FACEBOOK_CLIENT_ID_EXCELPLUS;
    if(window.location.host.endsWith("excel11plus.com")) {
        FACEBOOK_ID = FACEBOOK_CLIENT_ID_EXCELPLUS;
    } else {
        FACEBOOK_ID = FACEBOOK_CLIENT_ID_ARTOFEXAM;
    }

  const config = new AuthServiceConfig(
      [ 
        {
          id: GoogleLoginProvider.PROVIDER_ID,
          provider: new GoogleLoginProvider(GOOGLE_CLIENT_ID)
        },
        {
          id: FacebookLoginProvider.PROVIDER_ID,
          provider: new FacebookLoginProvider(FACEBOOK_ID)
        }
      ]);
  return config;
}

const cookieConfig:NgcCookieConsentConfig = {
  cookie: {
    domain: 'www.excel11plus.com'
  },
  position: 'bottom',
  theme: 'classic',
  palette: {
    popup: {
      background: '#000'
    },
    button: {
      background: '#f1d600'
    }
  },
  type: 'info',
  content:{
    message: 'This website uses cookies to ensure you get the best experience on our website.',
    dismiss: "Got it!",
    deny: "Refuse cookies",
    link: "Learn more",
    href: "https://cookiesandyou.com",
    policy: "Cookie Policy"
    

  }
};




@NgModule({
  declarations: [
    
    AppComponent,
    SafeHtmlPipe,
    LoginComponent,
    ContentFeederMainComponent,
    ContentFeederListComponent,
    ContentFeederQuestionComponent,
    ContentFeederSubquestionComponent,
    HomeComponent,
    AboutComponent,
    ContactComponent,
    TimerComponent,
    RegistrationComponent,
    TopicsListComponent,
    TopicComponent,
    RoutingComponent,
    TestRunnerComponent,
    ExamSummaryComponent,
    ExamMasterComponent,
    ExamMasterSummaryComponent,
    LandingsComponent,
    PaymentComponent,
    DialogExamNameComponent,
    DialogPerformanceGraphComponent,
    DialogConfirmMockListAction,
    DialogConfirmPaidMockListAction,
    DialogConfirmTestSubmission,
    TermsNConditionsComponent,
    PrivacyPolicyComponent,
    InformationComponent,
    ExamExamFilterComponent,
    CommonIssuesComponent,
    FaqComponent,
    StudentFilterComponent,
    NewFooterComponent,
    NavHeaderComponent,
    DialogStudentSearch,
    StudentMyActivityComponent,
    TestingAreaComponent,
    StudActivityComponent,
    MockListComponent,
    DashboardComponent,
    MocklistAssignComponent,
    PaymentComponent,
    StudentFilterComponent,
    DialogStudentSearch,
    DialogGroupSearch,
    AddStudentComponent,
    EditStudentComponent,
    ReviewExamComponent,
    IndividualDashboardComponent,
    IndividualActivityComponent,
    StudDashboardComponent,
    MyStudComponent,
    TutorHelpComponent,
    ParentHelpComponent,
    StudentHelpComponent,
    BreadcrumLinkComponent,
    AdminDashboardComponent,
    AntibotComponent,
    ForgotPasswordComponent,
    NewPasswordComponent,
    DialogAlertUser,
    DialogUpdateConsent,
    DialogUploadResult,
    DialogRegisterBasicInfoComponent,
  SubscriptionComponent,
  SubscriptionDetailsComponent,
  PerformanceComponent,
  ParentMyAccountComponent,
  ParentPrivacyComponent,
  ParentEditComponent,
  LoggerComponent,
  MyGroupComponent,
  DialogCreateGroup,
  DialogEditGroup,
  DialogAddStudent,
  DialogRemoveStudent,
  DialogDeleteGroup,
  InstituteComponent,
  DialogConfirmGroupMockListAction,
  GroupMocklistAssignComponent,
  InstituteLandingComponent,
  MocklistAssignComponent,
  ContentFeederDashboardComponent,
  IndividualMyProfileComponent,
  AddAssistantComponent,
  DialogReportProblem,
  DialogReviewProblem,
  SearchAssistantComponent,
  FreeStyleDetailsComponent,
  FreeStyleExamComponent,
  WriteUpStudentComponent,
  WriteUpExamListComponent,
  WriteUpExamAddComponent,
  WriteUpEvaluateListComponent,
  DialogUploadReviewComponent,
  CookiePolicyComponent
  ],
  imports: [
    NgcCookieConsentModule.forRoot(cookieConfig),
    AvatarModule,
    BrowserModule,
    DataTableModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    HttpModule,
    MatSnackBarModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatTooltipModule,
    MatButtonModule, 
    MatCheckboxModule, 
    MatExpansionModule, 
    MatCardModule, 
    MatFormFieldModule, 
    MatListModule,
    MatGridListModule, 
    MatInputModule, 
    MatIconModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatDialogModule,     
    UICarouselModule,
    MatRadioModule,
	  NgxPaginationModule,
    MatTableModule,
    MatPaginatorModule,
    MatSlideToggleModule,
    MatTabsModule,
    MatSortModule,
    MatSidenavModule,
    MatMenuModule,
    MatButtonToggleModule,
    SocialLoginModule,
    UiSwitchModule,
    Ng4LoadingSpinnerModule.forRoot()
    //UiSwitchModule
  ],
  providers: [SubscriptionComponent, UserService, DataService, S3Service, Configuration, PagerService, HttpUrlEncodingCodec, ExamFilterService, StudentFilterService, {
      provide: AuthServiceConfig,
      useFactory: getAuthServiceConfigs
    }],
  
  bootstrap: [AppComponent],
  
  entryComponents: [DialogPerformanceGraphComponent, DialogExamNameComponent, DialogStudentSearch, 
  		MocklistAssignComponent,GroupMocklistAssignComponent, DialogConfirmMockListAction, 
  		DialogConfirmGroupMockListAction,DialogConfirmTestSubmission, DialogAlertUser, DialogUploadReviewComponent,
  		DialogRegisterBasicInfoComponent,DialogUploadResult,DialogCreateGroup,DialogReportProblem,DialogReviewProblem,
  		DialogEditGroup,DialogAddStudent,DialogDeleteGroup,DialogRemoveStudent,DialogGroupSearch,
      SubscriptionComponent, DialogConfirmPaidMockListAction,DialogUpdateConsent]
})
export class AppModule { }