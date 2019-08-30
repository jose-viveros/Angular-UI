import { Component, OnInit, NgModule } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { DataService } from '../../service/data-api.service' ;
import { UserService } from '../../service/user.service';
import { MatTableDataSource } from '@angular/material';
import { SafeHtmlPipe } from '../../service/auth.constant';


@Component({
  selector: 'app-exam-summary',
  templateUrl: './exam-summary.component.html',
  styleUrls: ['./exam-summary.component.css']
})
@NgModule({
    imports: [
      SafeHtmlPipe
  ]
})
export class ExamSummaryComponent implements OnInit {

    dataSource1 = null;
    displayedColumns = [] ; 
    questionColumns = [] ;
    result = {};
    summaryData = null;
    subjectId = null; 
    token: any = {};
  
    constructor(private router: Router,
      private activatedRoute: ActivatedRoute, private userService: UserService,
        private dataService: DataService) {
    }

    ngOnInit() {

      this.activatedRoute.params.subscribe((params: Params) => {
        this.subjectId = params['subjectid'];
        this.token = this.userService.getToken();
      });
      this.displayedColumns = ['subjectName', 'examName', 'maxMarks', 'marksObtained', 'totalQuestions', 'correctQuestionCount', 'completedIn', 'updatedDate', 'testId'];
      this.getExamSummary();
    }

    
    getExamSummary() {
      this.dataService.getExamSummary(this.subjectId).subscribe(
        data => {
          this.result = data;
          const jsonResponse = JSON.stringify(this.result);
          this.summaryData = JSON.parse(jsonResponse);
          this.dataSource1 = new MatTableDataSource(this.summaryData);
        },
        error => {
          alert('Request Failed :' + error);
        });
    }
  
    getRegionalRanking(){
      const url = "regional-ranking/" + this.summaryData[0].examMasterId ;
      this.router.navigate([url]);
    }
  
    checkAnswers(testId) {
      this.router.navigate(['check-answer/' + testId ]);
    }

}
