import { Component, OnInit, ViewChild } from '@angular/core';
import { ExamFilterService } from '../../parent-tutor/filters/exam-filter/exam-filter.service';
import { DataService } from '../../service/data-api.service';
import { UserService } from '../../service/user.service';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { Injectable, Pipe, PipeTransform } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { MatPaginator, MatTableDataSource, Sort, PageEvent, MatSort } from '@angular/material';
import { MatMenuModule } from '@angular/material/menu';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { Observable} from "rxjs/Observable";
import { of } from "rxjs/observable/of";
import { map } from "rxjs/operators";
import { fromMatSort, sortRows } from '../table-utils';
import { fromMatPaginator, paginateRows } from '../table-utils';

@Component({
   selector: 'app-student-my-activity',
   templateUrl: './student-my-activity.component.html',
   styleUrls: ['./student-my-activity.component.css', '../../styles/home.component.css', '../../styles/dashboard.css', '../../styles/parent.css', '../../styles/registration.css']
})
export class StudentMyActivityComponent implements OnInit {

   [x: string]: any;
  page: number = 1;
  loading:boolean;
  //status and exam type selected from dashboard submenu
  status: string = null;
  examType: string = null;

  dificulties = ['Easy', 'Medium', 'Hard'];

  redirectUrl: string;
  model: any = {};
  displayedColumns: string[] = ['testName', 'publisher', 'assignedDate', 'dueDate','finishedDate', 'score', 'action'];
  dataSource = null;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  noOfRows = 0;
  submenudata = null;
  displayedRows$: Observable<ExamData[]>;
  totalRows$: Observable<number>;
  constructor(
    private dataService: DataService,
    private userService: UserService,
    private filterService: ExamFilterService,
    private router: Router,
    private spinnerService: Ng4LoadingSpinnerService,
    private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.spinnerService.show();
    this.loading=true;
    this.activatedRoute.queryParams.subscribe(params => {
      this.status = params.status;
      this.examType = params.examType;
    });
    this.getTestsForUser();
    this.filterService.getFilters.subscribe(req => {
      this.search(req);
    });

  }
  getTestsForUser() {
    if(this.examType === "WRITEUP") {
        const res = {
            topic: -1,
            examType: 'WRITEUP',
            status: 'NOTSTARTED'
        };
        //this.filterService.setFilter(res);
        this.search(res);
    } else {
        if (this.status) {
        if (this.status === 'COMPLETE') {
            this.getResult(this.status);
        } else {
            this.getResultbyexamtypeandstatus(this.examType, this.status);
        }
        } else {
        this.getAllTestsForUser()
        }
    }

  }


  getAllTestsForUser() {

    this.loading = true;
    this.noOfRows = 0;
    this.userService.executeGetRequest('userExams').subscribe(
      res => {
        if (res != null) {
          this.noOfRows = res.length;
        }
        this.dataSource = new MatTableDataSource(res);
        // this.dataSource.paginator = this.paginator;
        this.spinnerService.hide();
        this.loading=false;
        this.assignTableData(res);
      }
    );
 }

  getResult(status) {
    this.spinnerService.show();
    this.loading=true;
    this.noOfRows = 0
    this.userService.executeGetRequest('userExamsbystatus/' + status).subscribe(
      res => {
        if (res != null) {
          this.noOfRows = this.noOfRows + res.length;
        }
        this.dataSource = new MatTableDataSource(res);
        // this.dataSource.paginator = this.paginator;
        this.spinnerService.hide();
        this.loading = false;
        this.assignTableData(res);
      }
    );
  }

  getResultbyexamtypeandstatus(examtype, status) {
    this.loading=true;
    this.noOfRows = 0;
    this.userService.executeGetRequest('userExamsbyExamTypeandStatus/' + examtype + '/' + status).subscribe(
      res => {
        if (res != null) {
          this.noOfRows = this.noOfRows + res.length;
        }
        this.dataSource = new MatTableDataSource(res);
        // this.dataSource.paginator = this.paginator;
        this.spinnerService.hide();
        this.loading=false;
        this.assignTableData(res);
      }
    );
  }

  search(filters) {
    this.spinnerService.show();
    this.noOfRows = 0;
    this.userService.executePostRequest("examfilterlist", filters).subscribe(
      res => {

        if (res != null) {
          this.noOfRows = res.length;
        }
        this.dataSource = new MatTableDataSource(res);
        // this.dataSource.paginator = this.paginator;
        this.spinnerService.hide();
        this.loading=false;
        this.assignTableData(res);
      }
    );
  }

    getAction(element) {
        if (element.IS_WRITEUP) {
            if (element.action === 'Start') {
                const navigationTest: NavigationExtras = {
                    queryParams: {
                        id: element.assignedId,
                        type: "START",
                        examName: element.testName
                    }
                }
                this.router.navigate(['freestyle'], navigationTest);
            } else if (element.action === 'Pending Review') {
                const navigationTest: NavigationExtras = {
                    queryParams: {
                        id: element.testId,
                        type: "PENDING",
                        examName: element.testName
                    }
                }
                this.router.navigate(['freestyle'], navigationTest);
            } else if (element.action === 'Review') {
                const navigationTest: NavigationExtras = {
                    queryParams: {
                        id: element.testId,
                        type: "COMPLETE",
                        examName: element.testName
                    }
                }
                this.router.navigate(['freestyle'], navigationTest);
            }
        } else {
            this.userService.setShowTestRunnerMenu(true);
            if (element.action === 'Start') {
                const navigationTest: NavigationExtras = {
                    queryParams: {
                        id: element.assignedId,
                        type: "START",
                        examName: element.testName,
                        subjectName:element.subjectName,
                        duration:element.duration,
                        marks:element.marks
                    }
                }
                this.router.navigate(['testrunner'], navigationTest);
            }
            else if (element.action === 'Review') {
                this.redirectUrl = 'check-answer/' + element.testId;
                this.router.navigate([this.redirectUrl]);
            }
            else if (element.action === 'Resume') {
                const navigationTest: NavigationExtras = {
                    queryParams: {
                        id: element.testId,
                        type: "RESUME",
                        examName: element.testName,
                        subjectName:element.subjectName,
                        duration:element.duration,
                        marks:element.marks
                    }
                }
                this.router.navigate(['testrunner'], navigationTest);
            }
        }
    }
  assignTableData(data){
    console.log(data);
    const tab_data: ExamData[] = data;
    const sortEvents$: Observable<Sort> = fromMatSort(this.sort);
    const pageEvents$: Observable<PageEvent> = fromMatPaginator(this.paginator);
    const rows$ = of(tab_data);
    this.totalRows$ = rows$.pipe(map(rows => rows.length));
    this.displayedRows$ = rows$.pipe(sortRows(sortEvents$), paginateRows(pageEvents$));
  }
}

export interface ExamData{
  action: string;
  assignedDate: Date;
  assignedId: number;
  avgScore: number;
  dueDate: Date;
  duration: number;
  examType: string;
  finishedDate: string;
  marks: number;
  overDue: boolean;
  publisher: string;
  questions: number;
  rank: string;
  score: string;
  status: string;
  student: string;
  testName: string;
}
