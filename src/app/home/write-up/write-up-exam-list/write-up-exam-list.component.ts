import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSnackBar, Sort, PageEvent, MatSort } from '@angular/material';
import { NavigationExtras, Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../../service/user.service';
import { DOMAIN } from '../../../service/auth.constant';
import { fromMatSort, fromMatPaginator, sortRows, paginateRows } from '../../table-utils';
import { Observable } from 'rxjs';
import { of } from "rxjs/observable/of";
import { map } from "rxjs/operators";

@Component({
  selector: 'app-write-up-exam-list',
  templateUrl: './write-up-exam-list.component.html',
  styleUrls: ['./write-up-exam-list.component.css','../../../styles/home.component.css', '../../../styles/dashboard.css', '../../../styles/parent.css', '../../../styles/registration.css']
})
export class WriteUpExamListComponent implements OnInit {

    displayedColumns: string[] = ['topicName', 'marks', 'topic'];
    @ViewChild(MatSort) sort: MatSort;
    dataSource = null;

    model: any = {};

    noOfRows = 0;
    @ViewChild(MatPaginator) paginator: MatPaginator;

     displayedRows$: Observable<writeupExamList[]>;
     totalRows$: Observable<number>;
    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        public snackBar: MatSnackBar,
        private userService: UserService ) { }

    ngOnInit() {
        this.model.seldomain = this.userService.getAttribute(DOMAIN);
        this.fetchFreeStyleTopics();
        this.model.selfreestyle = -1;
        this.getExistingExams();
    }

    fetchFreeStyleTopics() {
        this.userService.executeGetRequest("freestyletopics/" + this.model.seldomain).subscribe (
            res => {
                this.model.freestyletopics = res;
            }
        );
    }

    getExistingExams() {
        this.userService.executeGetRequest("writeupExamList/" + this.model.seldomain + "/" + this.model.selfreestyle).subscribe
            (data => {
                this.noOfRows = data.length;
                this.dataSource = new MatTableDataSource(data);
                this.dataSource.paginator = this.paginator;
                this.assignTableData(data);
            });
    }

    addExam() {
        const assistant: NavigationExtras = {
            queryParams: {
            }
        }
        this.router.navigate(['writeupexamadd'], assistant);
    }

    search() {
        this.getExistingExams();
    }
  
    assignTableData(data){
    const tab_data: writeupExamList[] = data;
    const sortEvents$: Observable<Sort> = fromMatSort(this.sort);
    const pageEvents$: Observable<PageEvent> = fromMatPaginator(this.paginator);
    const rows$ = of(tab_data);
    this.totalRows$ = rows$.pipe(map(rows => rows.length));
    this.displayedRows$ = rows$.pipe(sortRows(sortEvents$), paginateRows(pageEvents$));
  }
}

export  interface writeupExamList {
  topicName: string;
  marks: number;
  topic: string;
}