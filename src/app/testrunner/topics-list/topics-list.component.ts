import { Component, OnInit, ViewChild, NgModule } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { DataService } from '../../service/data-api.service' ;
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { SafeHtmlPipe } from '../../service/auth.constant';


@Component({
  selector: 'app-topics-list',
  templateUrl: './topics-list.component.html',
  styleUrls: ['./topics-list.component.css']
})
@NgModule({
    imports: [
      SafeHtmlPipe
  ]
})
export class TopicsListComponent implements OnInit {

    averageScores = null;
    topicList = null;
    subjectId = null;
  
    displayedColumns = [] ;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    
    constructor(private router: Router,
      private activatedRoute: ActivatedRoute,
        private dataService: DataService) {
    }

    getTopicResult(topicId) {
      this.router.navigate(['topic/' + topicId]);
    }

    ngOnInit() {
    this.displayedColumns = ['topicName', 'studentAverageScores', 'regionAverageScores', 'result'];
    this.activatedRoute.params.subscribe((params: Params) => {
          this.subjectId = params['subjectid'];
          this.getTopics();
      });
    
  }

  getTopics() {
       this.dataService.getTopics(this.subjectId).subscribe(
                data => {
                     this.topicList = data;
                     this.averageScores = new MatTableDataSource(this.topicList.averageScores);
                     this.averageScores.paginator = this.paginator;
                },
                error => {
                  alert('Request Failed :' + error);
                });
   }
  
  testrunner(){
    this.router.navigate(['testrunner/' + this.subjectId + '/MOCK']);
  }

}
