import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-routing',
  templateUrl: './routing.component.html',
  styleUrls: ['./routing.component.css']
})
export class RoutingComponent implements OnInit {

  
  domain = null;
  subject = null;
  topic = null;
  grpquestionid = null;
  redirectUrl = null;
  
  constructor(private router: Router,
              private activatedRoute: ActivatedRoute) {
     
    this.redirectUrl = this.activatedRoute.snapshot.queryParams['redirectTo'];
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
        this.domain = params.domain;
        this.subject = params.subject;
        this.topic = params.topic;
        this.grpquestionid = params.grpQuestionId;

        const navigationEdit: NavigationExtras = {
            queryParams: {
                domain: this.domain,
                subject: this.subject,
                topic: this.topic,
                questionId: "null",
                grpQuestionId: this.grpquestionid
            }
        }
        this.router.navigate(['content-feeder-subquestion'], navigationEdit);
    });
  }

}
