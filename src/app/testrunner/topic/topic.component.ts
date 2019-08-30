import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Injectable } from '@angular/core';
import { DataService } from '../../service/data-api.service' ;
import { MatPaginator, MatTableDataSource } from '@angular/material';

// import {results} from './data-table-results-data';

@Component({
  selector: 'app-topic',
  templateUrl: './topic.component.html',
  styleUrls: ['./topic.component.css']
})
export class TopicComponent implements OnInit {
  
    question = null; 
    result = {};
    testRunnerResponse = {};
    url = null ; 
    draftTestId = null; 
    testHistory = null;
    topicId = null; 
    displayedColumns = [] ;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(private router: Router,
        private activatedRoute: ActivatedRoute,
        private dataService: DataService) {
  /*      
       this.question = {
         testType: 'TOPIC',
         subjectId: null,
         topicId: null,
         testId: null,
         questionId: null,
         difficultyLevel: 0,
         questionSequence: 0,
         navigateToQuestionSequence: null,
         questionDescription: null,
         answerOptions: null,
         answersGiven: null,
         action: "NEXT",
         dirtyObject: false,
         isGroupQuestion: false,
         errorDescription: null,
         examMasterId: null,
         isNonVerbal: null,
         figure: null,
         isMultiChoice: false,
         isCorrect: null,
         correctAnswerTest: null,
         completedIn: null
       } */
    }


    getResults(testId) {
      //alert('Double clicked: ' + rowEvent.row.item.testId);
      this.router.navigate(['check-answer/' + testId]);
    }


    ngOnInit() {
      this.displayedColumns = ['date', 'score', 'results'];
      this.activatedRoute.params.subscribe((params: Params) => {
        this.topicId = params['topicid'];
       // this.question.topicId = this.topicId ; 
        this.getTopicResultHistory();
      });
    }
  
  getTopicResultHistory() {
    this.dataService.getTopicResultHistory(this.topicId).subscribe(
      data => {
        this.result = data;
        const jsonResponse = JSON.stringify(this.result);
        const testHistory = JSON.parse(jsonResponse);
        this.testHistory = new MatTableDataSource(testHistory);
        this.testHistory.paginator = this.paginator;
      },
      error => {
        alert('Request Failed :' + error);
      });
  }
  
  testrunner() {
     /* this.checkPreviousTopicExam();
     if (this.draftTestId != null) {
       this.question.testId = this.draftTestId ;
     }*/
    this.router.navigate(['testrunner/' + this.topicId +'/TOPIC']);
  }
  
  /*checkPreviousTopicExam() {
    this.dataService.checkPreviousExam(this.topicId, 'TOPIC').subscribe(
      data => {
        const jsonResponse = JSON.stringify(data);
        const topicRequest = JSON.parse(jsonResponse);
        this.draftTestId = topicRequest.testId;
        alert('Draft Test Id : ' + this.draftTestId);
      },
      error => {
        alert('Request Failed :' + error);
      });
  }*/
  
}
