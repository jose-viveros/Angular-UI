import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import { AboutComponent } from './general/about/about.component';
import { HomeComponent } from './home/home.component';
import { RegistrationComponent } from './registration/registration.component';
import { TopicComponent } from './testrunner/topic/topic.component';
import { TopicsListComponent } from './testrunner/topics-list/topics-list.component';

import { ContentFeederListComponent } from "./content-feeder/content-feeder-list/content-feeder-list.component";
import { ContentFeederMainComponent } from "./content-feeder/content-feeder-main/content-feeder-main.component";
import { ContentFeederQuestionComponent } from "./content-feeder/content-feeder-question/content-feeder-question.component";
import { ContentFeederSubquestionComponent } from './content-feeder/content-feeder-subquestion/content-feeder-subquestion.component';
import { RoutingComponent } from './content-feeder/routing/routing.component';
import { ExamMasterSummaryComponent } from './exam-master/exam-master-summary/exam-master-summary.component';
import { ExamMasterComponent } from './exam-master/exam-master/exam-master.component';
import { CommonIssuesComponent } from './general/common-issues/common-issues.component';
import { ContactComponent } from './general/contact/contact.component';
import { FaqComponent } from './general/faq/faq.component';
import { ExamSummaryComponent } from './testrunner/exam-summary/exam-summary.component';
import { LandingsComponent } from './landings/landings.component';
import { LoginComponent } from './login/login.component';
import { PaymentComponent } from './payment/payment.component' ;
import { TestRunnerComponent } from './testrunner/test-runner/test-runner.component' ;
import { TermsNConditionsComponent } from './general/terms-n-conditions/terms-n-conditions.component' ;
import { PrivacyPolicyComponent } from './general/privacy-policy/privacy-policy.component';
import { InformationComponent } from './general/information/information.component';
import { IndividualActivityComponent } from './individual/individual-activity/individual-activity.component';
import { IndividualDashboardComponent } from './individual/individual-dashboard/individual-dashboard.component';
import { AddStudentComponent } from './parent-tutor/add-student/add-student.component'
import { EditStudentComponent } from './parent-tutor/edit-student/edit-student.component';
import { ReviewExamComponent } from './testrunner/review-exam/review-exam.component';
import { TutorHelpComponent } from './help-page/tutor-help/tutor-help.component';
import { ParentHelpComponent } from './help-page/parent-help/parent-help.component';
import { StudentHelpComponent } from './help-page/student-help/student-help.component';
import { AdminDashboardComponent } from './home/admin-dashboard/admin-dashboard.component';
import { ForgotPasswordComponent } from './reset-password/forgot-password/forgot-password.component';
import { NewPasswordComponent } from './reset-password/new-password/new-password.component';
import { DashboardComponent } from './home/dashboard/dashboard.component';
import { MyStudComponent } from './home/my-stud/my-stud.component';
import { MockListComponent } from './home/mock-list/mock-list.component';
import { StudActivityComponent } from './home/stud-activity/stud-activity.component';
import { StudDashboardComponent } from './home/stud-dashboard/stud-dashboard.component';
import { StudentMyActivityComponent } from './home/student-my-activity/student-my-activity.component';
import { PerformanceComponent } from './performance/performance.component';
import { TestingAreaComponent } from './home/testing-area/testing-area.component';
import { LoggerComponent } from './logger/logger.component';
import { InstituteComponent } from './institute/institute.component';
import { InstituteLandingComponent } from './landings/institute-landing/institute-landing.component';
import { ContentFeederDashboardComponent } from './content-feeder/content-feeder-dashboard/content-feeder-dashboard.component';
import { CookiePolicyComponent } from './general/cookie-policy/cookie-policy.component';
import { IndividualMyProfileComponent } from './individual/individual-my-profile/individual-my-profile.component';
import { AddAssistantComponent } from './parent-tutor/add-assistant/add-assistant.component';
import { SearchAssistantComponent } from './parent-tutor/search-assistant/search-assistant.component';
import { FreeStyleDetailsComponent } from './home/free-style/free-style-details/free-style-details.component';
import { FreeStyleExamComponent } from './home/free-style/free-style-exam/free-style-exam.component';
import { WriteUpStudentComponent } from './home/write-up/write-up-student/write-up-student.component';
import { WriteUpExamListComponent } from './home/write-up/write-up-exam-list/write-up-exam-list.component';
import { WriteUpExamAddComponent } from './home/write-up/write-up-exam-add/write-up-exam-add.component';
import { WriteUpEvaluateListComponent } from './home/write-up/write-up-evaluate-list/write-up-evaluate-list.component';

const routes: Routes = [
  {
    path: 'content-feeder-list',
    component: ContentFeederListComponent
  },
  {
    path: 'content-feeder-question',
    component: ContentFeederQuestionComponent
  },
  {
    path: 'content-feeder-subquestion',
    component: ContentFeederSubquestionComponent
  },
  {
    path: 'routing',
    component: RoutingComponent
  },
  {
    path: 'content-feeder',
    component: ContentFeederMainComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'registration', component: RegistrationComponent},
  { path: 'subject', component: TestingAreaComponent},
  { path: 'exam-summary/:subjectid', component: ExamSummaryComponent},
  { path: 'exam-master-summary/:domain', component: ExamMasterSummaryComponent},
  { path: 'exam-master/:exammaster/:examType/:subjectid/:subjecttext/:topicid/:topictext/:domain', component: ExamMasterComponent},
  { path: 'topics-list/:subjectid', component: TopicsListComponent},
  { path: 'topic/:topicid', component: TopicComponent},
  { path: 'check-answer/:testid', component: ReviewExamComponent},
  { path: 'testrunner', component: TestRunnerComponent},
  { path: '', component: LandingsComponent},
  { path: 'payment/:subscriptionId/:orderId', component: PaymentComponent},
  { path: 'terms-n-conditions', component: TermsNConditionsComponent},
  { path: 'privacy-policy', component: PrivacyPolicyComponent},
  { path: 'information', component: InformationComponent},
  { path: 'mocklist', component: MockListComponent},
  { path: 'faq', component: FaqComponent}, 
  { path: 'common-issues', component: CommonIssuesComponent}, 
  { path: 'my-activity', component: StudentMyActivityComponent},
  { path:'student-activity', component: StudActivityComponent},
  
  { path: 'student-dashboard', component:StudDashboardComponent},
  { path: 'my-student', component:MyStudComponent},
  { path: 'add-student', component:AddStudentComponent},
  { path: 'edit-student', component:EditStudentComponent},
  { path: 'parent-dashboard', component:DashboardComponent},
  { path: 'individual-activity', component:IndividualActivityComponent},
  { path: 'individual-dashboard', component:IndividualDashboardComponent},  
  { path: 'tutor-help', component:TutorHelpComponent},  
  { path: 'parent-help', component:ParentHelpComponent},  
  { path: 'student-help', component:StudentHelpComponent},
  { path: 'forgot-password', component:ForgotPasswordComponent},
  { path: 'newpassword', component:NewPasswordComponent},
  { path: 'performance', component:PerformanceComponent},
  { path: 'logger/:noOfRows', component:LoggerComponent},
  { path: 'admin-dashboard', component:AdminDashboardComponent},
  { path: 'institute', component:InstituteComponent},
  { path: 'institute-landing', component:InstituteLandingComponent},
  { path: 'content-feeder-dashboard', component:ContentFeederDashboardComponent},
  { path: 'individual-my-profile', component:IndividualMyProfileComponent},
  { path: 'teachers', component: SearchAssistantComponent},
  { path: 'tutors', component: SearchAssistantComponent},
  { path: 'addassistant', component: AddAssistantComponent},
  { path: 'freestyle', component: WriteUpStudentComponent},
  { path: 'writeupexam', component: WriteUpExamListComponent},
  { path: 'writeupexamadd', component: WriteUpExamAddComponent},
  { path: 'evaluator_free_style', component: WriteUpEvaluateListComponent},
  { path: 'cookiePolicy', component: CookiePolicyComponent},
  {
    path: '**',
    redirectTo: '/'
  } 
];


@NgModule({
  imports: [
    RouterModule.forRoot(
      routes,
      {
        enableTracing: true,
      }
    )
  ],
  exports: [
    RouterModule
  ],
  providers: [
  ]
})
export class AppRoutingModule { }