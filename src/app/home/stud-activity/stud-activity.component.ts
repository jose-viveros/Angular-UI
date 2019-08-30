import { SelectionModel } from '@angular/cdk/collections';
import { DataService } from '../../service/data-api.service';
import { UserService } from '../../service/user.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { MatPaginator, MatTableDataSource, MatSort, Sort, PageEvent, MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material';
import { ExamFilterService } from '../../parent-tutor/filters/exam-filter/exam-filter.service';
import { StudentFilterService } from '../../parent-tutor/filters/student-filter/student-filter.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { GROUP_IDS } from '../../service/auth.constant';
import { Observable} from "rxjs/Observable";
import { fromMatSort, sortRows } from '../table-utils';
import { fromMatPaginator, paginateRows } from '../table-utils';
import { map } from "rxjs/operators";
import { of } from "rxjs/observable/of";

@Component({
  selector: 'app-stud-activity',
  templateUrl: './stud-activity.component.html',
  styleUrls: ['./stud-activity.component.css', '../../styles/home.component.css', '../../styles/dashboard.css', '../../styles/parent.css', '../../styles/registration.css']
})
export class StudActivityComponent implements OnInit {
  [x: string]: any;
  page = 1;

  dificulties = ['Easy', 'Medium', 'Hard'];
  data: any;
  model: any = {};
  displayedColumns: string[] = ['examType', 'testName', 'student', 'assignedDate', 'finishedDate', 'score', 'rank', 'action', 'select'];
  dataSource = null;
  selection = new SelectionModel(true, []);
  @ViewChild(MatSort) sort: MatSort;
  tableData: ExamData[];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  noOfRows = 0;
  selectedRecordsCount = 0;
  studentRecords = [];
  studentIds = [];
  students = [];
  qtestNames = [];
  qStudentIds = [];
  qGroupIds = [];
  inactiveStudentIds = [];
  qStudentNames = [];
  allStudents = false;
  status: string = null;

  noRecord = false;
  noRecordMessage: string;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  displayedRows$: Observable<ExamData[]>;
  totalRows$: Observable<number>;

  constructor(private userService: UserService,
    private filterService: ExamFilterService,
    private studentFilterService: StudentFilterService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public snackBar: MatSnackBar,
    private spinnerService: Ng4LoadingSpinnerService) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      console.log("param====>", params);
      this.status = params.status;
      this.examType = params.examType;
    });
    this.studentFilterService.getFilters.subscribe(req => {
      const groupIds = this.userService.getAttribute(GROUP_IDS);
      if (groupIds !== null) {
        this.setGroups(req);
      }
      else {
        this.setStudents(req);
      }
    });
    this.filterService.getFilters.subscribe(req => {
      this.search(req);
    });
  }

  setStudents(students) {
    this.spinnerService.show();
    this.qStudentIds = students;
    if (this.qStudentIds.length === 0) {
      this.noRecord = true;
      this.noRecordMessage = "No Activity Record Available";
      this.spinnerService.hide();
    }else if(this.status==='COMPLETE'){
        this.getResult(this.status)
        this.status=null;
    } else if (this.qStudentIds.length === 1 && this.qStudentIds[0] === "-1") {
        this.getTestsForAllStudents();
    } else {
          for (let i = 0; i < this.qStudentIds.length; i++) {
        this.getTestsForStudent(this.qStudentIds[i]);
        if (i === (this.qStudentIds.length - 1)) {
          this.spinnerService.hide();
        }
      }

    }
  }

  setGroups(groups) {
    this.spinnerService.show();
    this.qGroupIds = groups;
    if (this.qGroupIds.length === 0) {
      this.noRecord = true;
      this.noRecordMessage = "No Activity Record Available";
      this.spinnerService.hide();
    } else if (this.qGroupIds.length === 1 && this.qGroupIds[0] === "-1") {
      this.getTestsForAllGroups();
    } else {
      for (let i = 0; i < this.qGroupIds.length; i++) {
        this.getTestsForGroup(this.qGroupIds[i]);
        if (i === (this.qGroupIds.length - 1)) {
          this.spinnerService.hide();
        }
      }
    }
  }

  getAllStudents(){
    this.qStudentIds=[];
    this.studentIds=[];
      this.userService.executeGetRequest('studentDetails').subscribe(
        res => {

          this.noRecord = false;
          this.noRecordMessage = "";
          for (let i = 0; i < res.length; i++) {
            this.studentIds.push(res[i].id);
            this.qStudentIds.push(res[i].id);
          }
          return this.qStudentIds;
        });

  }

  getTestsForAllStudents() {
    // this.spinnerService.show();
    this.studentIds = [];
    this.qStudentIds = [];
    this.noOfRows = 0;
    this.userService.executeGetRequest('studentDetails').subscribe(
      res => {
        this.noRecord = false;
        this.noRecordMessage = "";
        for (let i = 0; i < res.length; i++) {
          this.getTestsForStudent(res[i].id);
          this.studentIds.push(res[i].id);
          this.qStudentIds.push(res[i].id);
        }
      });

  }

  getTestsForAllGroups() {
    this.studentIds = [];
    this.qStudentIds = [];
    this.studentRecords = [];
    this.noOfRows = 0;
    this.userService.executeGetRequest('getgroups').subscribe(
      res => {
        for (let i = 0; i < res.length; i++) {
          const students = res[i].students;
          students.forEach(student => {
            this.studentIds.push(student.id);
            this.qStudentIds.push(student.id);
            this.getTestsForStudent(student.id);
          })
        }

      }
    )
  }
  getTestsForGroup(groupId) {
    this.studentIds = [];
    this.qStudentIds = [];
    this.studentRecords = [];
    this.noOfRows = 0;

    this.userService.executeGetRequest('getgroupbyid/' + groupId).subscribe(
      res => {
        const students = res.students;
        students.forEach(student => {
          this.studentIds.push(student.id);
          this.qStudentIds.push(student.id);
          this.getTestsForStudent(student.id);
        })
      })
  }
  getTestsForStudent(id) {
    this.spinnerService.show();
    //alert(id);
    this.studentRecords = [];
    this.noOfRows = 0;
    this.userService.executeGetRequest('studentExams/' + id).subscribe(
      res => {

        if (res != null) {
          this.noOfRows = this.noOfRows + res.length;
        }
        else {
          this.noRecord = true;
          this.noRecordMessage = "No Activity Record Available";
        }
        for (let i = 0; i < res.length; i++) {
          this.studentRecords.push((res[i]));
        }
        setTimeout(() => {

          if (this.studentRecords.length === 0) {
            this.noRecord = true;
            this.noRecordMessage = "No Activity Record Available";
          } else {
            this.noRecord = false;
            this.noRecordMessage = "";
            this.data = Object.assign(this.studentRecords);
            this.dataSource = new MatTableDataSource(this.studentRecords);
            this.dataSource.paginator = this.paginator;
            this.assignTableData(this.studentRecords);
          }
          this.spinnerService.hide();
        }, 3000)
      }
    );

  }

  getResult(status) {
    this.spinnerService.show();
    this.noOfRows = 0;
    this.studentRecords = [];
    for (let i = 0; i < this.qStudentIds.length; i++) {
      this.userService.executeGetRequest('studentExamsbystatus/' + status + '/' + this.qStudentIds[i]).subscribe(
        res => {
          if (res != null) {
            for (let j = 0; j < res.length; j++) {
              this.studentRecords.push(res[j]);
            }
          }
          //console.log(JSON.stringify(this.studentRecords));
          setTimeout(() => {
            if (this.studentRecords.length === 0) {
              this.noRecord = true;
              this.noRecordMessage = "No Record Available";
            } else {
              this.noRecord = false;
              this.noRecordMessage = "";
              this.noOfRows = this.studentRecords.length;
              this.dataSource = new MatTableDataSource(this.studentRecords);
              this.dataSource.paginator = this.paginator;
              this.assignTableData(this.studentRecords);
            }
            this.spinnerService.hide();
          }, 3000);
        }
      );
    }
  }

  unAssignSelected() {
    this.spinnerService.show();
    const selectedRecords = this.selection.selected;
    // let ds = this.dataSource.data;
    selectedRecords.forEach(item => {
      this.userService.executeDeleteRequest('unassignUserExam/' + parseInt(item.assignedId, 10)).subscribe(
        () => {
          this.selection.clear();
          const index = this.data.findIndex(d => d === item);
          this.dataSource.data.splice(index, 1);
          this.dataSource = new MatTableDataSource(this.dataSource.data);
          this.assignTableData(this.dataSource.data);
          this.spinnerService.hide();
          this.snackBar.open("Test unassigned", "", {
            duration: 3000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition
          });
        });
    });
    this.noOfRows = this.noOfRows - selectedRecords.length;
    this.selectedRecordsCount = 0;
    this.selection = new SelectionModel(true, []);
  }

  search(filters) {
    this.spinnerService.show();
    this.dataSource = null;
    this.noOfRows = 0;
    this.studentRecords = [];
    for (let i = 0; i < this.qStudentIds.length; i++) {
      this.userService.executePostRequest("examfilterlistforstudent/" + this.qStudentIds[i], filters).subscribe(
        res => {
          if (res != null) {
            this.noOfRows = this.noOfRows + res.length;
          }
          for (let j = 0; j < res.length; j++) {
            this.studentRecords.push((res[j]));
          }
          setTimeout(() => {
            this.dataSource = new MatTableDataSource(this.studentRecords);
            this.dataSource.paginator = this.paginator;
            this.selection = new SelectionModel(true, []);
            this.assignTableData(this.studentRecords);
            this.spinnerService.hide();
          }, 3000);
        }
      );
    }
  }

  getAction(element) {
    //alert(JSON.stringify(element));
    if (element.testId === undefined) {
      alert(element.testName + " is not attempted by " + element.student);
      this.router.navigate(['stud-activity']);
    }
    else {
      this.redirectUrl = 'check-answer/' + element.testId;
      this.router.navigate([this.redirectUrl]);
    }
  }

  selectionChange(e) {
    if (e.checked) {
      this.qtestNames.push(e.name);
    } else {

      if (this.selectedRecordsCount === 1) {
        this.selectedRecordsCount = 0;
      }
    }
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    this.selectedRecordsCount = numSelected;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.selectedRecordsCount = 0;
    if (this.isAllSelected() || this.selection.hasValue()) {
      this.selection.clear();
      this.selectedRecordsCount = 0;
      this.assignbtn = false;
    } else {
      this.dataSource.data.forEach(row => {
        if (!row.finishedDate) {
          this.selection.select(row)
        }
      }
      );
      this.assignbtn = true;
    }
  }

  assignTableData(data){
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
