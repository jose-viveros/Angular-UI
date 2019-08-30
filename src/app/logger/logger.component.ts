import { Component, OnInit } from '@angular/core';
import { SERVER_URL } from '../service/auth.constant';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
    selector: 'app-logger',
    templateUrl: './logger.component.html',
    styleUrls: ['./logger.component.css']
})
export class LoggerComponent implements OnInit {

    noOfRows = 100;
    logs: any = {};

    constructor(private http: HttpClient,
        private activatedRoute: ActivatedRoute) { }

    ngOnInit() {
        this.activatedRoute.params.subscribe((params: Params) => {
            this.noOfRows = params['noOfRows'];
            this.http.get(SERVER_URL + "logger/" + this.noOfRows).subscribe(
                data => {
                    this.logs = data;
                    this.logs = this.logs.logs;
                    const hiddenElement = document.createElement('a');
                    hiddenElement.href = 'data:attachment/txt,' + encodeURI(this.logs);
                    hiddenElement.target = '_blank';
                    hiddenElement.download = 'logger.txt';
                    document.body.appendChild(hiddenElement);
                    hiddenElement.click();                    
                }
            );
        });
    }

}
