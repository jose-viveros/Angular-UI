import {StudActivityComponent} from '../../../home/stud-activity/stud-activity.component';
import {AUTHORITIES, DOMAIN, EXAM_FILTERS, STUDENT_NAMES, STUDENT_IDS, GROUP_IDS, GROUP_NAMES} from '../../../service/auth.constant';
import {UserService} from '../../../service/user.service';
import {StudentFilterService} from './student-filter.service';
import {HttpUrlEncodingCodec} from '@angular/common/http';
import {Component, OnInit, Inject, ViewChild, Host, Input, AfterViewInit, Directive, ElementRef} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {MatSnackBar, MatDialog, PageEvent, MatSort, Sort, MatDialogRef, MAT_DIALOG_DATA, MatPaginator, MatTableDataSource, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition} from '@angular/material';
import {Router, ActivatedRoute} from "@angular/router";
import {SelectionModel} from '@angular/cdk/collections';
import { Observable} from "rxjs/Observable";
import { fromMatSort, sortRows } from '../../../home/table-utils';
import { fromMatPaginator, paginateRows } from '../../../home/table-utils';
import { map } from "rxjs/operators";
import { of } from "rxjs/observable/of";
export interface DialogStudentSearchData {
  id: string;
  name: string;
  select: boolean;
}

export interface DialogGroupSearchData {
  id: string;
  groupName: string;
  select: boolean;
}

@Component({
  selector: 'app-student-filter',
  templateUrl: './student-filter.component.html',
  styleUrls: ['./student-filter.component.css']
})
export class StudentFilterComponent implements OnInit {

  model: any = {};
  redirectUrl: string;
  disableTopic = true;
  panelOpenState = true;
  grpdialogSelectedAll = false;
  stddialogSelectedAll = false;
  qStudentIds = [];
  qStudentNames = [];

  qGroupIds = [];
  qGroupNames = [];

  selectedGroup = false;
  selectedStudent = false;
  selectedStudents: any = {};
  selectedGroups: any = {};
  userType: string;
  tutor = false;

  noStudent = false;
  noGroup = false;


  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  @Input() showChangeButton = true;

  constructor(private router: Router,
    private userService: UserService,
    public snackBar: MatSnackBar,
    private enc: HttpUrlEncodingCodec,
    private filterService: StudentFilterService,
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
  ) {
    // alert(activity)
    this.redirectUrl = this.activatedRoute.snapshot.queryParams['redirectTo'];
  }

  ngOnInit() {

    this.checkIfGroupsExist();
    this.checkIfStudentsAdded();
    this.init();
  }

  init() {

    this.selectedStudents = [];
    this.selectedGroups = [];
     setTimeout(() => {
    this.getUserDetails()},1000);
  }

  getUserDetails() {
    this.userService.executeGetRequest('getuser').subscribe(
      data => {
        this.userType = data.userType;
        if (this.userType === 'TUTOR') {
          this.tutor = true;
          this.getGroupsFromSession();
        }
        else {
          this.tutor = false;
          this.getStudentsFromSession();
        }

      }
    );
  }

  getStudentsFromSession() {

    const stdId = this.userService.getAttribute(STUDENT_IDS);
    const stdName = this.userService.getAttribute(STUDENT_NAMES);

    if (stdId != null && stdName != null) {
      this.selectedStudent = true;
      this.qStudentIds = stdId.split(",");
      this.qStudentNames = stdName.split(",");
      this.model.selectedStudents = [];
      this.qStudentNames.forEach(row => {
        if (row !== "All Students") {
          this.model.selectedStudents.push({"name": row});
        }
        else {
          this.model.selectedStudents.push({"name": "All Students"});
        }

      });

      const selId = [];
      this.qStudentIds.forEach(row => {
        selId.push({"id": row});
      });

      this.selectedStudents = {"selected": selId};

      this.filterService.filter(this.qStudentIds);
    }
    else {
      if (this.userType === 'TUTOR') {

        if (!this.noGroup) {
          this.selectedStudent = false;
          this.selectAllGroups();
        }
        else {
          this.selectedGroup = false;
        }

      }
      else {

        if (!this.noStudent) {
          this.selectedStudent = true;
          this.isMoreThanOne();
        }
        else {
          this.selectedStudent = false;
        }
      }
    }

  }

  isMoreThanOne() {
    this.userService.executeGetRequest("students").subscribe(
        res => {
            let stdData=[];
            if(res.length == 1) {
                for (let i = 0; i < res.length; i++) {
                    if (res[i].archived === 'Active') {
                        this.qStudentIds = [];
                        this.qStudentNames = [];
                        
                        this.qStudentIds.push(res[i].id);
                        this.qStudentNames.push(res[i].name);

                        this.userService.setAttribute(STUDENT_IDS, this.qStudentIds);
                        this.userService.setAttribute(STUDENT_NAMES, this.qStudentNames);

                        this.getStudentsFromSession();
                    }
                }
                return false;
            } else {
                this.selectAllStudents();
            }
        });
    }


  getGroupsFromSession() {

    const grpId = this.userService.getAttribute(GROUP_IDS);
    const grpName = this.userService.getAttribute(GROUP_NAMES);

    if (grpId != null && grpName != null) {
      this.selectedGroup = true;
      //when group is selected, remove all students
      this.selectedStudent = false;
      this.qStudentIds = [];
      this.qStudentNames = [];
      this.model.selectedStudents = [];
      //to be used in the popup again.
      this.selectedStudents = [];
      this.userService.removeAttribute(STUDENT_IDS);
      this.userService.removeAttribute(STUDENT_NAMES);
      this.filterService.filter(this.qStudentIds);
      this.qGroupIds = grpId.split(",");
      this.qGroupNames = grpName.split(",");
      this.model.selectedGroups = [];
      this.qGroupNames.forEach(row => {
        if (row !== "All Groups") {
          this.model.selectedGroups.push({"groupName": row});
        }
        else {
          this.model.selectedGroups.push({"groupName": "All Groups"});
        }
      });

      const selId = [];
      this.qGroupIds.forEach(row => {
        selId.push({"id": row});
      });

      this.selectedGroups = {"selected": selId};

      this.filterService.filter(this.qGroupIds);
    }
    else {
      this.selectedGroup = false;
      this.getStudentsFromSession();
    }

  }

  checkIfStudentsAdded() {
    this.userService.executeGetRequest("students").subscribe(
      res => {

        if (res.length === 0) {
         this.noStudent = true;
        }
        else {
          this.noStudent =false;
        }
      })
  }

  checkIfGroupsExist() {
    this.userService.executeGetRequest("getgroups").subscribe(
      res => {

        if (res.length === 0) {
          this.noGroup = true;

        }
        else {
          this.noGroup = false;
        }

      })

  }

  selectAllStudents() {

    this.selectedStudent = true;
    this.qStudentIds = [];
    this.qStudentNames = [];
    this.qStudentIds.push("-1");
    this.qStudentNames.push("All Students");
    this.model.selectedStudents = [];
    this.model.selectedStudents.push({"name": "All Students"});

    const selId = [];
    selId.push({"id": -1});
    this.selectedStudents = {"selected": selId};
    this.userService.setAttribute(STUDENT_IDS, this.qStudentIds);
    this.userService.setAttribute(STUDENT_NAMES, this.qStudentNames);
    this.filterService.filter(this.qStudentIds);

  }
  selectAllGroups() {

    this.selectedGroup = true;
    this.qGroupIds = [];
    this.qGroupNames = [];
    this.qGroupIds.push("-1");
    this.qGroupNames.push("All Groups");
    this.model.selectedGroups = [];
    this.model.selectedGroups.push({"groupName": "All Groups"});

    const selId = [];
    selId.push({"id": -1});
    this.selectedGroups = {"selected": selId};
    this.userService.setAttribute(GROUP_IDS, this.qGroupIds);
    this.userService.setAttribute(GROUP_NAMES, this.qGroupNames);
    this.filterService.filter(this.qGroupIds);

  }

  openDialog(val) {

    if (val === 'student') {
      if (this.noStudent) {
        this.snackBar.open("No Student Record Available, Please add students", "", {
          duration: 3000,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition
        });
      }
      else {
        this.openStudentDialog();
      }
    }
    else {
      if (this.noGroup) {
        this.snackBar.open("No Group Record Available, Please create groups", "", {
          duration: 3000,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition
        });
      }
      else {
        this.openGroupDialog();
      }
    }
  }

  openStudentDialog(): void {
    const dialogRef = this.dialog.open(DialogStudentSearch, {
      disableClose: false,
      width: '60%', height: '70%',
      data: {selectedStudents:this.selectedStudents,isTutor:this.tutor}
    });

    dialogRef.afterClosed().subscribe(res => {

      if (res) {
        if (res.isAllSelected) {
          this.selectAllStudents();
          this.selectedStudent = true;
        } else {
          this.qStudentIds = [];
          this.qStudentNames = [];

          //Populate arrays to update the session and parent component
          if (res.data.selected && res.data.selected.length > 0) {
            this.selectedStudent = true;
            res.data.selected.forEach(row => {
              this.qStudentIds.push(row.id);
              this.qStudentNames.push(row.name);
            });

            this.model.selectedStudents = res.data.selected;
            //to be used in the popup again.
            this.selectedStudents = res.data;


            this.userService.setAttribute(STUDENT_IDS, this.qStudentIds);
            this.userService.setAttribute(STUDENT_NAMES, this.qStudentNames);
            this.filterService.filter(this.qStudentIds);
          } else {
            this.selectedStudent = false;
            this.qStudentIds = [];
            this.qStudentNames = [];
            this.model.selectedStudents = [];
            //to be used in the popup again.
            this.selectedStudents = [];
            this.userService.removeAttribute(STUDENT_IDS);
            this.userService.removeAttribute(STUDENT_NAMES);
            this.filterService.filter(this.qStudentIds);
          }
        }
      }

    });
  }

  openGroupDialog(): void {
    const dialogRef = this.dialog.open(DialogGroupSearch, {
      disableClose: false,
      width: '60%', height: '70%',
      data: this.selectedGroups
    });

    dialogRef.afterClosed().subscribe(res => {
      // alert(res);
      if (res) {
        if (res.isAllSelected) {
          this.selectedGroup = true;
          this.grpdialogSelectedAll = true;
          this.selectAllGroups();
          //when group is selected, remove all students
          this.selectedStudent = false;
          this.qStudentIds = [];
          this.qStudentNames = [];
          this.model.selectedStudents = [];
          //to be used in the popup again.
          this.selectedStudents = [];
          this.userService.removeAttribute(STUDENT_IDS);
          this.userService.removeAttribute(STUDENT_NAMES);
          this.filterService.filter(this.qStudentIds);
        } else {
          this.qGroupIds = [];
          this.qGroupNames = [];

          //Populate arrays to update the session and parent component
          if (res.data.selected && res.data.selected.length > 0) {
            this.selectedGroup = true;
            //when group is selected, remove all students
            this.selectedStudent = false;
            this.qStudentIds = [];
            this.qStudentNames = [];
            this.model.selectedStudents = [];
            //to be used in the popup again.
            this.selectedStudents = [];
            this.userService.removeAttribute(STUDENT_IDS);
            this.userService.removeAttribute(STUDENT_NAMES);
            this.filterService.filter(this.qStudentIds);

            res.data.selected.forEach(row => {
              this.qGroupIds.push(row.id);
              this.qGroupNames.push(row.groupName);
            });
            this.model.selectedGroups = res.data.selected;
            //to be used in the popup again.
            this.selectedGroups = res.data;

            this.userService.setAttribute(GROUP_IDS, this.qGroupIds);
            this.userService.setAttribute(GROUP_NAMES, this.qGroupNames);
            this.filterService.filter(this.qGroupIds);
          } else {
            this.selectedGroup = false;
            this.qGroupIds = [];
            this.qGroupNames = [];
            this.model.selectedGroups = [];
            //to be used in the popup again.
            this.selectedGroups = [];
            this.userService.removeAttribute(GROUP_IDS);
            this.userService.removeAttribute(GROUP_NAMES);
          }
        }
      }

    });
  }

  removeStudent(stud) {

    if (stud.name === 'All Students') {
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
    }
    else {
      let idx = this.qStudentNames.indexOf(stud.name);
      this.qStudentNames.splice(idx, 1);
      this.qStudentIds.splice(idx, 1);
      this.model.selectedStudents.splice(idx, 1);
      this.selectedStudent = true;
      if (idx === 0 && this.model.selectedStudents.length === 0) {
        this.selectedStudent = false;
        this.qStudentIds = [];
        this.qStudentNames = [];
        this.model.selectedStudents = [];
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
    }

  }

  removeGroup(group) {

    if (group.groupName === 'All Groups') {
      this.selectedGroup = false;
      this.qGroupIds = [];
      this.qGroupNames = [];
      this.model.selectedGroups = [];
      //to be used in the popup again.
      this.selectedGroups = [];
      this.userService.removeAttribute(GROUP_IDS);
      this.userService.removeAttribute(GROUP_NAMES);
    }
    else {

      this.selectedGroup = true;
      let idx = this.qGroupNames.indexOf(group.groupName);
      this.qGroupNames.splice(idx, 1);
      this.qGroupIds.splice(idx, 1);
      this.model.selectedGroups.splice(idx, 1);

      if (idx === 0 && this.model.selectedGroups.length === 0) {
        this.selectedGroup = false;
        this.qGroupIds = [];
        this.qGroupNames = [];
        this.model.selectedGroups = [];
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
    }
  }
}

export interface StudentElement {
  id: string;
  name: string;
  select: boolean;
}

@Component({
  selector: 'dialog-student-search',
  templateUrl: 'dialog-student-search.html',
})
export class DialogStudentSearch {


  displayedColumns: string[] = ['select', 'name', 'groupName'];
  dataSource = null;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  model: any = {};
  selection = new SelectionModel(true, []);

  isTutor=true;
  displayedRows$: Observable<StudentElement[]>;
  totalRows$: Observable<number>;
  StudData: any;
  constructor(
    public dialogRef: MatDialogRef<DialogStudentSearch>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userService: UserService) {
    this.isTutor = this.data.isTutor;
    this.userService.executeGetRequest("students").subscribe(
      res => {
        let stdData=[];
        for (let i = 0; i < res.length; i++) {
          if (res[i].archived === 'Active') {
            stdData.push(res[i]);
          }
        }
        this.StudData = stdData;
        this.dataSource = new MatTableDataSource(stdData);
        this.setSelection();
        this.dataSource.paginator = this.paginator;
        this.assignTableData(stdData);
      }
    );
  }

  setSelection() {
    let selStudent = [];
    if (this.data.selectedStudents && this.data.selectedStudents.selected) {
      for (let i = 0; i < this.data.selectedStudents.selected.length; i++) {
        for (let j = 0; j < this.dataSource.data.length; j++) {
          if (this.data.selectedStudents.selected[i].id == -1 || (this.data.selectedStudents.selected[i].id == this.dataSource.data[j].id)) {
            selStudent = selStudent.concat(this.dataSource.data.slice(j, j + 1))
          }
        }
      }
    }
    this.selection = new SelectionModel<DialogStudentSearchData>(true, selStudent);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  applyFilter(e) {
    this.dataSource.filter = e.trim().toLowerCase();
    const data:any[] = [];
    this.StudData.forEach(elem => {
      if(elem.groupName.toLowerCase() === e.trim().toLowerCase() || elem.name.toLowerCase() === e.trim().toLowerCase()){
        data.push(elem);
      }
    });
    this.assignTableData(data);

  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return (numSelected === numRows) && (numSelected > 1) ;
  }

  getIsChecked(row) {
    let isSelected = false;
    if (this.data) {
      this.data.forEach(sel => {
        if (sel.id == row.id) {
          isSelected = true;
        }
      });
    }
    return isSelected;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => {

        this.selection.select(row)
      });
  }
  assignTableData(data){
    const tab_data: StudentElement[] = data;
    const sortEvents$: Observable<Sort> = fromMatSort(this.sort);
    const pageEvents$: Observable<PageEvent> = fromMatPaginator(this.paginator);
    const rows$ = of(tab_data);
    this.totalRows$ = rows$.pipe(map(rows => rows.length));
    this.displayedRows$ = rows$.pipe(sortRows(sortEvents$), paginateRows(pageEvents$));
  }
}


export interface GroupElement {
  id: string;
  groupName: string;
  select: boolean;
}

@Component({
  selector: 'dialog-group-search',
  templateUrl: 'dialog-group-search.html',
})
export class DialogGroupSearch {


  displayedColumns: string[] = ['select', 'groupName', 'noOfStudents'];
  dataSource = null;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  model: any = {};
  selection = new SelectionModel(true, []);

  displayedRows$: Observable<GroupElement[]>;
  totalRows$: Observable<number>;
  GroupData: any;
  constructor(
    public dialogRef: MatDialogRef<DialogStudentSearch>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userService: UserService) {

    this.userService.executeGetRequest("getgroups").subscribe(
      res => {
        let groupData = [];

        for (let i = 0; i < res.length; i++) {
          if (res[i].archived === 'Active') {
            groupData.push(res[i]);
          }
        }
        this.GroupData = groupData;
        this.dataSource = new MatTableDataSource(groupData);
        this.setSelection();
        this.dataSource.paginator = this.paginator;
        this.assignTableData(groupData);
      }
    );
  }

  setSelection() {
    let selGroup = [];
    if (this.data && this.data.selected) {
      for (let i = 0; i < this.data.selected.length; i++) {
        for (let j = 0; j < this.dataSource.data.length; j++) {
          if (this.data.selected[i].id == -1 || (this.data.selected[i].id == this.dataSource.data[j].id)) {
            selGroup = selGroup.concat(this.dataSource.data.slice(j, j + 1))
          }
        }
      }
    }
    this.selection = new SelectionModel<DialogGroupSearchData>(true, selGroup);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  applyFilter(e) {
    this.dataSource.filter = e.trim().toLowerCase();
    const data:any[] = [];
    this.GroupData.forEach(elem => {
      if(elem.groupName.toLowerCase() === e.trim().toLowerCase() || elem.name.toLowerCase() === e.trim().toLowerCase()){
        data.push(elem);
      }
    });
    this.assignTableData(data);
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return (numSelected === numRows) && (numSelected > 1) ;
  }

  getIsChecked(row) {
    let isSelected = false;
    if (this.data) {
      this.data.forEach(sel => {
        if (sel.id == row.id) {
          isSelected = true;
        }
      });
    }
    return isSelected;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }
  assignTableData(data){
    const tab_data: GroupElement[] = data;
    const sortEvents$: Observable<Sort> = fromMatSort(this.sort);
    const pageEvents$: Observable<PageEvent> = fromMatPaginator(this.paginator);
    const rows$ = of(tab_data);
    this.totalRows$ = rows$.pipe(map(rows => rows.length));
    this.displayedRows$ = rows$.pipe(sortRows(sortEvents$), paginateRows(pageEvents$));
  }
}

