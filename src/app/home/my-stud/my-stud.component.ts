import { Component, OnInit, ViewChild, Injectable } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { DataService } from '../../service/data-api.service';
import { UserService } from '../../service/user.service';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { MatPaginator, MatTableDataSource, MatSort, Sort, PageEvent} from '@angular/material';
import { AUTHORITIES, SERVER_URL, DOMAIN, STUDENT_NAMES, STUDENT_IDS, GROUP_IDS, GROUP_NAMES } from '../../service/auth.constant';
import { HttpClient } from '@angular/common/http';
import { StudentFilterService } from '../../parent-tutor/filters/student-filter/student-filter.service';
import { MyGroupComponent } from '../my-group/my-group.component';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { StudentFilterComponent } from '../../parent-tutor/filters/student-filter/student-filter.component';
import { NavHeaderComponent } from '../../nav-header/nav-header.component';
import { Observable} from "rxjs/Observable";
import { of } from "rxjs/observable/of";
import { map } from "rxjs/operators";
import { fromMatSort, sortRows } from '../table-utils';
import { fromMatPaginator, paginateRows } from '../table-utils';

@Component({
  providers: [MyGroupComponent,NavHeaderComponent],
  selector: 'app-my-stud',
  templateUrl: './my-stud.component.html',
  styleUrls: ['./my-stud.component.css', '../../styles/home.component.css', '../../styles/dashboard.css', '../../styles/parent.css', '../../styles/registration.css']
})

export class MyStudComponent implements OnInit {


  [x: string]: any;
  page = 1;
  data: any;
  model: any = {};
  displayedColumns: string[] = ['name', 'userName', 'groupName', 'actions', 'createdDate', 'graphIcon', 'select'];
  dataSource = null;
  selection = new SelectionModel(true, []);
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MyGroupComponent) myGroup: MyGroupComponent;
  @ViewChild(StudentFilterComponent) studentFilter: StudentFilterComponent;
  noOfRows = 0;
  selectedRecordsCount = 0;

  studentRecords = [];
  studentIds = [];
  qStudentIds = [];
  qStudentNames = [];
  inactiveStudentIds = [];

  userType: string;
  tutor = false;
  showByStudents = true;
  showByGroups = false;

  noRecord = false;
  noRecordMessage: string;
  //--------------------------

  groupData: any;

  displayedGroupColumns: string[] = ['archived', 'groupName', 'actions', 'noOfStudents', 'select'];
  groupdataSource = null;
  groupselection = new SelectionModel(true, []);
  noOfGroups = 0;
  selectedGroupsCount = 0;
  isGroupSelected = false;
  showSelected = false;
  showArchived = false;
  groupRecords = [];
  groupIds = [];
  groupNames = [];
  qGroupIds = [];
  qGroupNames = [];


  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  displayedRows$: Observable<StudData[]>;
  totalRows$: Observable<number>;

  constructor(private fb: FormBuilder,
    private dataService: DataService,
    private userService: UserService,
    private filterService: StudentFilterService,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    public snackBar: MatSnackBar,
    private spinnerService: Ng4LoadingSpinnerService,
    private myGroupComponent: MyGroupComponent,
    private activatedRoute: ActivatedRoute,
    private nav:NavHeaderComponent) { }

  ngOnInit() {
    this.spinnerService.show();
    this.getUserDetails();
    this.activatedRoute.queryParams.subscribe(params => {

      this.inactiveStudentIds = params.inactiveStudentIds;

      if (this.inactiveStudentIds && this.inactiveStudentIds.length > 0) {
        this.userService.removeAttribute(GROUP_IDS);
        this.qStudentIds = this.inactiveStudentIds;
        this.userService.setAttribute(STUDENT_IDS, this.qStudentIds);
        this.filterService.filter(this.qStudentIds);
        this.getInactiveStudents();
      } else {
        this.getStudentsFromSession();
        this.getStudents();
      }
    });


    this.filterService.getFilters.subscribe(req => {
      this.studentIds = req;
    });
  }

  getUserDetails() {
    this.userService.executeGetRequest('getuser').subscribe(
      data => {
        this.userType = data.userType;
        if (this.userType === 'TUTOR') {
          this.tutor = true;
        }

      }
    );
  }

  getInactiveStudents() {
    this.noOfRows = 0;
    const studData = [];
    this.qStudentNames = [];
    for (let i = 0; i < this.inactiveStudentIds.length; i++) {
      this.userService.executeGetRequest('student/' + this.inactiveStudentIds[i]).subscribe(
        res => {

          studData.push(res);
          this.qStudentNames.push(res.name);
          this.noOfRows = this.noOfRows + 1;

        });
    }

    setTimeout(() => {

      this.userService.setAttribute(STUDENT_NAMES, this.qStudentNames);
      this.data = Object.assign(studData);
      this.dataSource = new MatTableDataSource(studData);
      this.dataSource.paginator = this.paginator;
      this.assignTableData(studData);
      let selStudent = [];
      if (this.qStudentIds != null) {
        for (let i = 0; i < this.qStudentIds.length; i++) {
          for (let j = 0; j < this.dataSource.data.length; j++) {
            if (this.qStudentIds[i] === -1 || (this.qStudentIds[i] === this.dataSource.data[j].id)) {
              selStudent = selStudent.concat(this.dataSource.data.slice(j, j + 1));
            }
          }
        }
        this.selectedRecordsCount = selStudent.length;
      }
      this.selection = new SelectionModel(true, selStudent);

      this.spinnerService.hide();
    }, 5000);



  }

  getStudentsFromSession() {

    //get selected groups if any else get students
    const grpId = this.userService.getAttribute(GROUP_IDS);
    const grpName = this.userService.getAttribute(GROUP_NAMES);

    if (grpId != null && grpName != null) {

      this.qGroupIds = grpId.split(",").map(function (item) {
        return parseInt(item, 10);
      });
      this.qGroupNames = grpName.split(",");
    } else {
      const stdId = this.userService.getAttribute(STUDENT_IDS);
      const stdName = this.userService.getAttribute(STUDENT_NAMES);
      if (stdId != null && stdName != null) {
        this.qStudentIds = stdId.split(",").map(function (item) {
          return parseInt(item, 10);
        });
        this.qStudentNames = stdName.split(",");
      }
    }
  }

  init() {
    this.model.showSelected = null;
    this.model.showAssigned = null;
  }
  showSelectedOnly() {
    if (!this.showSelected) {
      this.paginator.pageIndex = 0;
      this.paginator.length = 0;
      this.noOfRows = this.selection.selected.length;
      this.dataSource = new MatTableDataSource(this.selection.selected);
      this.dataSource.paginator = this.paginator;
      this.assignTableData(this.selection.selected);
    } else {
      this.getStudents();
    }
  }
  includeArchived() {
    this.spinnerService.show();
    if (!this.showArchived) {
      this.paginator.pageIndex = 0;
      this.paginator.length = 0;
      this.noOfRows = 0;
      // this.selectedRecordsCount = 0;
      this.studentRecords = [];
      this.dataSource = [];
      this.selection.clear();
      this.userService.executeGetRequest('studentDetails').subscribe(
        res => {
          //this.selection.clear();

          if (res != null) {
            this.noOfRows = res.length;
          }
          setTimeout(() => {
            this.data = Object.assign(res);
            this.dataSource = new MatTableDataSource(res);
            this.assignTableData(res);
            this.dataSource.data.forEach(row => {
              this.qStudentIds.forEach(id => {
                if (row.id === id) {
                  this.selection.select(row);
                }
              })
            });
            this.dataSource.paginator = this.paginator;
            this.spinnerService.hide();
          }, 2000);
        })
    }
    else {
      this.getStudents();
    }
  }
  applyFilter(filterValue: string) {
    // this.dataSource.filter = filterValue;
    let filterData: any[] = [];
    this.data.forEach(elem => {
      if(elem.name.toLowerCase().includes(filterValue.toLowerCase()) || elem.username.toLowerCase().includes(filterValue.toLowerCase())){
        filterData.push(elem);
        this.noOfRows = filterData.length;
      }
    });
    this.assignTableData(filterData);
  }

  getStudents() {

    this.noOfRows = 0;
    this.userService.executeGetRequest('studentDetails').subscribe(
      res => {
        const studData = [];
        this.selection.clear();
        if (res.length === 0) {
          this.noRecord = true;
          this.noRecordMessage = "No Student data available";
        }
        else {
          this.noRecord = false;
          this.noRecordMessage = "";
          for (let i = 0; i < res.length; i++) {
            if (res[i].archived === 'Active') {
              studData.push(res[i]);
              this.noOfRows = this.noOfRows + 1;
            }
          }
        }
        this.data = Object.assign(studData);
        this.dataSource = new MatTableDataSource(studData);
        this.dataSource.paginator = this.paginator;
        this.assignTableData(studData);

        let selStudent = [];
        if (this.qStudentIds != null) {
          for (let i = 0; i < this.qStudentIds.length; i++) {
            for (let j = 0; j < this.dataSource.data.length; j++) {
              if (this.qStudentIds[i] === -1 || (this.qStudentIds[i] === this.dataSource.data[j].id)) {
                selStudent = selStudent.concat(this.dataSource.data.slice(j, j + 1));
              }
            }
          }
          this.selectedRecordsCount = selStudent.length;
        }
        this.selection = new SelectionModel(true, selStudent);
        this.spinnerService.hide();
      });
  }

  removeStudent(stud) {

    if (stud === 'All Students') {
      this.selectedStudent = false;
      let idx = 0;
      //remove students
      this.qStudentIds = [];
      this.qStudentNames = [];
      this.model.selectedStudents = [];
      //to be used in the popup again.
      this.selectedStudents = [];
      this.userService.removeAttribute(STUDENT_IDS);
      this.userService.removeAttribute(STUDENT_NAMES);
      this.filterService.filter(this.qStudentIds);
      this.selection.clear();
    }
    else {
      let idx = this.qStudentNames.indexOf(stud);
      this.qStudentNames.splice(idx, 1);
      this.qStudentIds.splice(idx, 1);
      // this.model.selectedStudents.splice(idx, 1);
      this.selectedStudent = true;
      if (idx === 0 && this.qStudentNames.length === 0) {
        this.selectedStudent = false;
        this.selectedRecordsCount = 0;
        this.qStudentIds = [];
        this.qStudentNames = [];
        // this.model.selectedStudents = [];
        //to be used in the popup again.
        this.selectedStudents = [];
        this.userService.removeAttribute(STUDENT_IDS);
        this.userService.removeAttribute(STUDENT_NAMES);
        this.filterService.filter(this.qStudentIds);
      }
      else {
        this.userService.setAttribute(STUDENT_IDS, this.qStudentIds);
        this.userService.setAttribute(STUDENT_NAMES, this.qStudentNames);
        this.filterService.filter(this.qStudentIds);

      }
      this.dataSource.data.forEach(row => {
        if (row.name === stud) {
          this.selection.deselect(row);
        }
      })
    }

  }

  removeGroup(group) {
    //  this.studentFilterComponent.removeGroup(group);

    if (group === 'All Groups') {
      this.isGroupSelected = false;
      this.qGroupIds = [];
      this.qGroupNames = [];
      this.model.selectedGroups = [];
      //to be used in the popup again.
      this.selectedGroups = [];
      this.userService.removeAttribute(GROUP_IDS);
      this.userService.removeAttribute(GROUP_NAMES);
    }
    else {

      this.isGroupSelected = true;
      let idx = this.qGroupNames.indexOf(group);
      this.qGroupNames.splice(idx, 1);
      this.qGroupIds.splice(idx, 1);
      //this.model.selectedGroups.splice(idx, 1);

      if (idx === 0 && this.qGroupNames.length === 0) {
        this.isGroupSelected = false;
        this.qGroupIds = [];
        this.qGroupNames = [];
        // this.model.selectedGroups = [];
        //to be used in the popup again.
        this.selectedGroups = [];
        this.userService.removeAttribute(GROUP_IDS);
        this.userService.removeAttribute(GROUP_NAMES);
      }
      else {

        this.userService.setAttribute(GROUP_IDS, this.qGroupIds);
        this.userService.setAttribute(GROUP_NAMES, this.qGroupNames);
        this.filterService.filter(this.qGroupIds);
      }
      this.myGroupComponent.groupdataSource.data.forEach(row => {
        if (row.groupName === group) {
          this.myGroupComponent.groupselection.deselect(row);
        }
      })
    }

  }


  getAction(id, examType, action) {
    if (action === 'Start') {
      this.redirectUrl = 'testrunner/' + id + '/' + examType;
      this.router.navigate([this.redirectUrl]);
    }
    else if (action === 'Review') {
      this.redirectUrl = 'check-answer/' + id;
      this.router.navigate([this.redirectUrl]);
    }
    else if (action === 'Resume') {
      this.redirectUrl = 'testrunner/' + id + '/' + examType;
      this.router.navigate([this.redirectUrl]);
    }
  }

  isAlreadySelected(id) {
    const idx = this.qStudentIds.indexOf(id);
    if (idx > -1) {
      return true;
    }
    return false;
  }

  studentSelectionChanged(e, id, name) {
    //check if any group is already selected
    const grpIds = this.userService.getAttribute(GROUP_IDS);
    if (grpIds !== null) {
      this.isGroupSelected = true;
      this.snackBar.open("There is already group selected, You need to remove or unselect the groups to select students", "", {
        duration: 5000,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition
      });

    }
    else {
      this.isGroupSelected = false;
      if (this.qStudentIds && this.qStudentIds.length === 1 && this.qStudentIds[0] === -1) {
        this.qStudentIds = [];
        this.qStudentNames = [];
        if (this.selection && this.selection.selected) {
          this.selection.selected.forEach(obj => {
            this.qStudentIds.push(obj.id);
            this.qStudentNames.push(obj.name);
          });
        }
      }
      if (e.checked) {
        this.qStudentIds.push(id);
        this.qStudentNames.push(name);
        this.userService.setAttribute(STUDENT_IDS, this.qStudentIds);
        this.userService.setAttribute(STUDENT_NAMES, this.qStudentNames);
        this.filterService.filter(this.qStudentIds);
      } else {
        let idx = this.qStudentNames.indexOf(id);
        this.qStudentIds.splice(idx, 1);
        idx = this.qStudentNames.indexOf(name);
        this.qStudentNames.splice(idx, 1);
        this.selectedStudent = true;
        if (idx === 0 && this.qStudentNames.length === 0) {
          this.selectedStudent = false;
          this.selectedRecordsCount = 0;
          this.qStudentIds = [];
          this.qStudentNames = [];
          this.selectedStudents = [];
          this.userService.removeAttribute(STUDENT_IDS);
          this.userService.removeAttribute(STUDENT_NAMES);
          this.filterService.filter(this.qStudentIds);
        }
        else {
          this.userService.setAttribute(STUDENT_IDS, this.qStudentIds);
          this.userService.setAttribute(STUDENT_NAMES, this.qStudentNames);
          this.filterService.filter(this.qStudentIds);

        }
      }
    }
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    //this.selectedRecordsCount = this.selection.selected.length;
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    this.selectedRecordsCount = numSelected;
    return numSelected === numRows;
  }

  isalreadychecked(row) {
    var idx = this.qStudentIds.indexOf(row.id);
    if (idx > -1) {
      return true;
    }
    return false;
  }
  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    console.log("is all selected--" + this.isAllSelected())
    this.selectedRecordsCount = 0;
    const grpIds = this.userService.getAttribute(GROUP_IDS);
    if (grpIds != null) {
      this.snackBar.open("There is already group selected, You need to remove or unselect the groups to select students", "", {
        duration: 5000,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition
      });
    } else if (this.isAllSelected()|| this.selection.hasValue()) {
      this.selection.clear();
      this.selectedRecordsCount = 0;
      this.qStudentIds = [];
      this.qStudentNames = [];
      this.userService.removeAttribute(STUDENT_IDS);
      this.userService.removeAttribute(STUDENT_NAMES);
      this.dataSource.data.forEach(row => {
        this.selection.deselect(row);

      });

    } else {
      this.selection.clear();
      this.qStudentIds = [];
      this.qStudentNames = [];
      this.dataSource.data.forEach(row => {

        if(row.archived==='Active'){
          if (!this.isalreadychecked(row)) {
          this.selection.select(row);
          this.qStudentIds.push(row.id);
          this.qStudentNames.push(row.name);
          }
        }
      });
    }

    if (this.qStudentIds && this.qStudentIds.length === 0) {
      this.userService.removeAttribute(STUDENT_IDS);
      this.userService.removeAttribute(STUDENT_NAMES);
    } else {
      this.userService.setAttribute(STUDENT_IDS, this.qStudentIds);
      this.userService.setAttribute(STUDENT_NAMES, this.qStudentNames);
    }

  }

  archive(value) {
    this.spinnerService.show();
    const selectedRecords = this.selection.selected;
    this.selection.clear();
    this.qstudentIds =[];
    this.qStudentNames =[];
    this.userService.removeAttribute(STUDENT_IDS);
    this.userService.removeAttribute(STUDENT_NAMES);
    // let ds = this.dataSource.data;
    selectedRecords.forEach(item => {
      this.userService.executeGetRequest('archiveStudents/' + item.id + '/' + value).subscribe(
        res => {
          if (res != null) {
             if (value) {
                item.archived = "Active";
              } else {
                item.archived = "InActive";
                item.groupName = "";
              }
              this.spinnerService.hide();
           }
        });
    });

  }
  unarchive(e,value){
    this.spinnerService.show();
    this.userService.executeGetRequest('archiveStudents/' + e.id + '/' + value).subscribe(
      res => {
        if (res != null) {
          e.archived = "Active";
          this.spinnerService.hide();
        }
     });
  }

  getTestsForStudent() {
    const selectedRecords = this.selection.selected;
    const navigationResult: NavigationExtras = {
      queryParams: {
        examType: 'ANY',
        status: 'COMPLETE'
      }
    }
    this.router.navigate(['student-activity'], navigationResult);
  }

  navigateTo(url) {
    this.router.navigate([url]);
  }

  addStudent(){
    if(!this.tutor && this.noOfRows === 2){
      this.snackBar.open ("You can add maximum 2 children as a parent", "", {
                   duration: 3000,
                   horizontalPosition: this.horizontalPosition,
                   verticalPosition: this.verticalPosition
                });
    }
    else{
       this.navigateTo('add-student')
    }
  }
  loginToStudent(element) {
    this.userService.setLoggedIn(false);
    this.http.get(SERVER_URL + "impersonate?username=" + element.username).subscribe
      (
        data => {
          this.model = data;
          this.userService.login(this.model.token);
          if (this.model.authorities) {
            this.userService.setAttribute(AUTHORITIES, JSON.stringify(this.model.authorities));
          }
          this.userService.setAttribute(DOMAIN, this.model.domain);
          this.userService.setLoggedIn(true);

          this.navigateTo('student-dashboard');
          console.log(data);
        },
        error => {

          this.snackBar.open("Error:" + error, "", {
            duration: 5000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition
          });
          console.log(error);
        }
      );
  }

  navigateToPerformance(element) {
    if (element.archived === "Active") {
      if (element.performance) {
        this.qStudentIds = [];
        this.qStudentNames = [];
        this.qStudentIds.push(element.id);
        this.qStudentNames.push(element.name);
        this.userService.setAttribute(STUDENT_IDS, this.qStudentIds);
        this.userService.setAttribute(STUDENT_NAMES, this.qStudentNames);
        this.router.navigate(['performance']);
      }
      else {
        this.snackBar.open("No test attempted by " + element.name, "", {
          duration: 3000,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition
        });
      }
    }
  }


  editStudent(element) {

    let editStudent: NavigationExtras = {
      queryParams: {

        studentId: element.id,

      }
    }
    this.router.navigate(['edit-student'], editStudent);

  }
  //----------------------------------------------------------------------------------------------------
  //group functions

  showBy(data) {
    if (data === 'students') {
      this.showByStudents = true;
      this.showByGroups = false;
    } else if (data === 'groups') {
      this.showByStudents = false;
      this.showByGroups = true;
    }
  }

  getGroups() {
    this.model.selgroup = 'AllGroups'
    this.noOfRows = 0;
    this.userService.executeGetRequest('getgroups').subscribe(
      res => {
        //alert(JSON.stringify(res));
        let grpData = [];
        this.selection.clear();
        if (res != null) {
          for (let i = 0; i < res.length; i++) {
            this.groupNames.push(res[i].groupName);
            if (res[i].archived === 'Active') {
              grpData.push(res[i]);
              this.noOfGroups = this.noOfGroups + 1;
            }
          }
        }
        this.groupData = Object.assign(grpData);
        this.groupdataSource = new MatTableDataSource(grpData);
        this.groupdataSource.paginator = this.paginator;

        let selGroup = [];

        if (this.qGroupIds != null) {
          for (let i = 0; i < this.qGroupIds.length; i++) {
            for (let j = 0; j < this.groupdataSource.data.length; j++) {
              if (this.qGroupIds[i] === -1 || (this.qGroupIds[i] === this.groupdataSource.data[j].id)) {
                selGroup = selGroup.concat(this.groupdataSource.data.slice(j, j + 1));
              }
            }
          }
          this.selectedGroupsCount = selGroup.length;
        }
        this.groupselection = new SelectionModel(true, selGroup);
        setTimeout(() => {
          this.spinnerService.hide();
        }, 2000);
      });
  }
  assignTableData(data){
    const tab_data: StudData[] = data;
    const sortEvents$: Observable<Sort> = fromMatSort(this.sort);
    const pageEvents$: Observable<PageEvent> = fromMatPaginator(this.paginator);
    const rows$ = of(tab_data);
    this.totalRows$ = rows$.pipe(map(rows => rows.length));
    this.displayedRows$ = rows$.pipe(sortRows(sortEvents$), paginateRows(pageEvents$));
  }
}

export  interface StudData{
  archived: string;
  createdDate: Date;
  firstName: string;
  gender: string;
  groupName: string;
  id: number;
  lastName: string;
  name: string;
  performance: boolean;
  region: string;
  school1: string;
  school2: string;
  select: string;
  standard: string;
  username: string;
}
