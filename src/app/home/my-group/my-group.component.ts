import { StudentFilterService } from '../../parent-tutor/filters/student-filter/student-filter.service';
import { STUDENT_IDS, STUDENT_NAMES, GROUP_IDS, GROUP_NAMES } from '../../service/auth.constant';
import { DataService } from '../../service/data-api.service';
import { UserService } from '../../service/user.service';
import { MyStudComponent } from '../my-stud/my-stud.component';
import { SelectionModel } from '@angular/cdk/collections';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, forwardRef, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { MatSnackBar, MatTableDataSource, MatPaginator, MatSort, PageEvent, Sort} from '@angular/material';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { StudentFilterComponent } from '../../parent-tutor/filters/student-filter/student-filter.component';
import { Observable} from "rxjs/Observable";
import { of } from "rxjs/observable/of";
import { map } from "rxjs/operators";
import { fromMatSort, sortRows } from '../table-utils';
import { fromMatPaginator, paginateRows } from '../table-utils';
@Component({

  selector: 'app-my-group',
  templateUrl: './my-group.component.html',
  styleUrls: ['./my-group.component.css', '../../styles/home.component.css', '../../styles/dashboard.css', '../../styles/parent.css', '../../styles/registration.css']
})
export class MyGroupComponent {

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  groupData: any;
  requestPath: string;
  displayedGroupColumns: string[] = ['groupName', 'actions', 'noOfStudents', 'select'];
  groupdataSource = null;
  groupselection = new SelectionModel(true, []);
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(forwardRef(() => MyStudComponent)) myStudent: MyStudComponent;
  noOfGroups = 0;
  selectedGroupsCount = 0;
  model: any = {};
  groupName: string;
  groupRecords = [];
  groupIds = [];
  groupNames = [];
  groupSearchNames = [];
  qGroupIds = [];
  qGroupNames = [];
  errormsg: string;
  showSelected = false;
  noRecord = false;
  noRecordMessage= '';

  selectedStudents: any = {};
  userType: string;
  tutor = false;
  showByStudents = false;
  showByGroups = true;
  qStudentIds = [];
  qStudentNames = [];

  displayedRows$: Observable<GroupData[]>;
  totalRows$: Observable<number>;

  constructor(private fb: FormBuilder,
    private dataService: DataService,
    private userService: UserService,
    private filterService: StudentFilterService,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    public snackBar: MatSnackBar,
    private spinnerService: Ng4LoadingSpinnerService, public dialog: MatDialog,
  ) {
    this.model.selgroup = 'All Groups';
    this.getGroups();
    this.getGroupNames();
    this.getGroupsFromSession();
  }
  init() {
    this.model.showSelected = null;
    this.model.showAssigned = null;
  }

  showBy(data) {
    if (data === 'students') {
      this.showByStudents = true;
      this.showByGroups = false;
    } else if (data === 'groups') {
      this.showByStudents = false;
      this.showByGroups = true;
    }
  }
  getGroupNames() {
    this.userService.executeGetRequest('getgroups').subscribe(
      res => {

        for (let i = 0; i < res.length; i++) {
          this.groupSearchNames.push(res[i].groupName);
        }

      })
  }
  getGroups() {
    this.groupdataSource = [];
    this.userService.executeGetRequest('getuser').subscribe(
      data => {
        this.userType = data.userType;
        if (this.userType === 'TUTOR') {
          this.tutor = true;
        }
      }
    );
    this.noOfGroups = 0;

    this.userService.executeGetRequest('getgroups').subscribe(
      res => {
        this.groupNames = [];
        let grpData = [];
        this.groupselection.clear();
        if (res.length === 0) {
          this.noRecord = true;
          this.noRecordMessage = "No Group data available";
        }else {
          this.noRecord = false;
          this.noRecordMessage = "";
          for (let i = 0; i < res.length; i++) {
            this.groupNames.push(res[i].groupName);
            if (this.model.showArchived) {
              grpData.push(res[i]);
              this.noOfGroups = this.noOfGroups + 1;
            } else {
              if (res[i].archived === 'Active') {
                grpData.push(res[i]);
                this.noOfGroups = this.noOfGroups + 1;
              }
            }
          }
        }
        this.groupData = Object.assign(grpData);
        this.groupdataSource = new MatTableDataSource(grpData);
        this.groupdataSource.paginator = this.paginator;
        this.assignTableData(grpData);
        console.log('displayedRows$',this.displayedRows$);
        let selGroup = [];

        if (this.qGroupIds != null) {
          for (let i = 0; i < this.qGroupIds.length; i++) {
            for (let j = 0; j < this.groupdataSource.data.length; j++) {
              if (this.qGroupIds[i] == -1 || (this.qGroupIds[i] == this.groupdataSource.data[j].id)) {
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

  getGroupsFromSession() {
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

  groupSelectionChanged(e, id, name) {
    if (this.qGroupIds && this.qGroupIds.length == 1 && this.qGroupIds[0] == -1) {
      this.qGroupIds = [];
      this.qGroupNames = [];
      if (this.groupselection && this.groupselection.selected) {
        this.groupselection.selected.forEach(obj => {
          this.qGroupIds.push(obj.id);
          this.qGroupNames.push(obj.groupName);
        });
      }
    }
    if (e.checked) {
      this.qGroupIds.push(id);
      this.qGroupNames.push(name);
      this.qStudentIds = [];
      this.qStudentNames = [];
      this.userService.removeAttribute(STUDENT_IDS);
      this.userService.removeAttribute(STUDENT_NAMES);
      this.userService.setAttribute(GROUP_IDS, this.qGroupIds);
      this.userService.setAttribute(GROUP_NAMES, this.qGroupNames);
      this.filterService.filter(this.qGroupIds);
    } else {
      let idx = this.qGroupNames.indexOf(id);
      this.qGroupIds.splice(idx, 1);
      idx = this.qGroupNames.indexOf(name);
      this.qGroupNames.splice(idx, 1);
      if (idx === 0 && this.qGroupNames.length === 0) {
        this.qGroupIds = [];
        this.qGroupNames = [];
        this.selectedGroupsCount = 0;
        this.userService.removeAttribute(GROUP_IDS);
        this.userService.removeAttribute(GROUP_NAMES);
        this.filterService.filter(this.qGroupIds);
      }
      else {
        this.userService.setAttribute(GROUP_IDS, this.qGroupIds);
        this.userService.setAttribute(GROUP_NAMES, this.qGroupNames);
        this.filterService.filter(this.qGroupIds);
      }
    }
  }

 
  applyFilter(filterValue: string) {
    let filterData: any[] = [];
    this.groupData.forEach(elem => {
      if(elem.groupName.toLowerCase().includes(filterValue.toLowerCase())){
        filterData.push(elem);
        this.noOfGroups = filterData.length;
      }
    });
    this.assignTableData(filterData);
  }

  showSelectedOnly() {
    if (!this.showSelected) {
      this.paginator.pageIndex = 0;
      this.paginator.length = 0;
      this.noOfGroups = this.groupselection.selected.length;
      this.groupdataSource = new MatTableDataSource(this.groupselection.selected);
      this.groupdataSource.paginator = this.paginator;
      this.assignTableData(this.groupselection.selected);
    } else {
      this.getGroups();
    }
  }
  removeStudent(stud) {

    if (stud === 'All Students') {

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
      let idx = this.qStudentNames.indexOf(stud);
      this.qStudentNames.splice(idx, 1);
      this.qStudentIds.splice(idx, 1);
      this.model.selectedStudents.splice(idx, 1);

      if (idx === 0 && this.model.selectedStudents.length === 0) {

        this.qStudentIds = [];
        this.qStudentNames = [];
        this.model.selectedStudents = [];

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

    if (group === 'All Groups') {

      this.qGroupIds = [];
      this.qGroupNames = [];
      //this.model.selectedGroups = [];

      this.userService.removeAttribute(GROUP_IDS);
      this.userService.removeAttribute(GROUP_NAMES);
      this.groupselection.clear();
    }
    else {


      let idx = this.qGroupNames.indexOf(group);
      this.qGroupNames.splice(idx, 1);
      this.qGroupIds.splice(idx, 1);
      // this.model.selectedGroups.splice(idx, 1);

      if (idx === 0 && this.qGroupNames.length === 0) {

        this.qGroupIds = [];
        this.qGroupNames = [];
        // this.model.selectedGroups = [];

        this.userService.removeAttribute(GROUP_IDS);
        this.userService.removeAttribute(GROUP_NAMES);
        this.filterService.filter(this.qGroupIds);
      }
      else {

        this.userService.setAttribute(GROUP_IDS, this.qGroupIds);
        this.userService.setAttribute(GROUP_NAMES, this.qGroupNames);
        this.filterService.filter(this.qGroupIds);
      }
      //alert(this.groupdataSource.length);
      this.groupdataSource.data.forEach(row => {
        if (row.groupName === group) {
          this.groupselection.deselect(row);
        }
      })
    }

  }
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    //this.selectedGroupsCount = this.groupselection.selected.length;
    const numSelected = this.groupselection.selected.length;
    const numRows = this.groupdataSource.data.length;
    this.selectedGroupsCount = numSelected;
    return numSelected === numRows;
  }

  isalreadyselected(row) {
    var idx = this.qGroupIds.indexOf(row.id);
    if (idx > -1) {
      return true;
    }
    return false;
  }
  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.selectedGroupsCount = 0;
    if (this.qGroupIds && this.qGroupIds.length === 1 && this.qGroupIds[0] === -1) {
      this.qGroupIds = [];
      this.qGroupNames = [];
    }
    if (this.isAllSelected() || this.groupselection.hasValue()) {
      this.groupselection.clear();
      this.selectedGroupsCount = 0;
      this.groupdataSource.data.forEach(row => {
        this.groupselection.deselect(row);
        let idx = this.qGroupIds.indexOf(row.id);
        if (idx > -1) {
          this.qGroupIds.splice(idx, 1);
        }

        idx = this.qGroupNames.indexOf(row.groupName);
        if (idx > -1) {
          this.qGroupNames.splice(idx, 1);
        }
      });

    } else {
      this.qStudentIds = [];
      this.qStudentNames = [];
      this.userService.removeAttribute(STUDENT_IDS);
      this.userService.removeAttribute(STUDENT_NAMES);
      this.groupdataSource.data.forEach(row => {

        if (row.archived === 'Active') {

          if (!this.isalreadyselected(row)) {
            this.groupselection.select(row);
            this.qGroupIds.push(row.id);
            this.qGroupNames.push(row.groupName);
          }

        }
      });
    }

    if (this.qGroupIds && this.qGroupIds.length === 0) {
      this.userService.removeAttribute(GROUP_IDS);
      this.userService.removeAttribute(GROUP_NAMES);
    } else {
      this.userService.setAttribute(GROUP_IDS, this.qGroupIds);
      this.userService.setAttribute(GROUP_NAMES, this.qGroupNames);
    }

  }

  openCreateGroupDialog(): void {
    const dialogRef = this.dialog.open(DialogCreateGroup, {
      width: '700px',
      height: '250px',
      data: { groupName: this.groupName }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getGroups();
    });
  }

  openEditGroupDialog(e): void {
    const dialogRef = this.dialog.open(DialogEditGroup, {
      width: '700px',
      height: '300px',
      data: { id: e.id, oldGroupName: e.groupName, groupName: this.groupName }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getGroups();

    });
  }

  openDeleteGroupDialog(e) {
    const dialogRef = this.dialog.open(DialogDeleteGroup);

    dialogRef.afterClosed().subscribe(req => {
      if (req) {
        this.deleteGroup(e);
      }
    });
  }




  deleteGroup(e) {
    this.userService.executeGetRequest("deleteGroup/" + e.id).subscribe(
      res => {
        setTimeout(() => {

          if (res.ERROR) {
            this.snackBar.open(res.ERROR, "", {
              duration: 3000,
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition
            });
          }
          else {
            this.snackBar.open("Group Archived Successfully", "", {
              duration: 3000,
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition
            });
            this.getGroups();
          }
          this.spinnerService.hide();
        }, 2000);

      })


  }

  openAddStudentDialog(e): void {
    const dialogRef = this.dialog.open(DialogAddStudent, {
      disableClose: false,
      width: '60%', height: '70%',
      data: { groupName: e.groupName }
    });

    dialogRef.afterClosed().subscribe(res => {
      //  console.log(this.selectedStudents);
      if (res) {
        this.spinnerService.show();
        this.addStudents(e.id, res.data.selected);
        /*  res.data.selected.forEach(row => {
            this.addStudent(e.id,row.id);

          });*/
        //this.model.selectedStudents = res.data.selected;
        //to be used in the popup again.
        //this.selectedStudents = res.data;

      }

    });
  }

  openRemoveStudentDialog(e): void {
    const dialogRef = this.dialog.open(DialogRemoveStudent, {
      disableClose: false,
      width: '60%', height: '70%',
      data: { groupName: e.groupName }
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.spinnerService.show();
        this.removeStudents(e.id, res.data.selected);
      }
    });
  }

  addStudents(groupId, students) {
    let i = students.length;
    students.forEach(student => {
      this.userService.executeGetRequest("addStudentToGroup/" + groupId + "/" + student.id).subscribe(
        res => {
          setTimeout(() => {
            if (res.ERROR) {

              this.snackBar.open(res.ERROR, "", {
                duration: 3000,
                horizontalPosition: this.horizontalPosition,
                verticalPosition: this.verticalPosition
              });
            }
            else {
              i--;
              if (i === 0) {

                this.snackBar.open("Students Added Successfully", "", {
                  duration: 3000,
                  horizontalPosition: this.horizontalPosition,
                  verticalPosition: this.verticalPosition
                });
                this.getGroups();
              }
            }
            this.spinnerService.hide();
          }, 2000);

        })

    })

  }

  removeStudents(groupId, students) {
    let i = students.length;
    students.forEach(student => {
      this.userService.executeGetRequest("removeStudentFromGroup/" + groupId + "/" + student.id).subscribe(
        res => {
          setTimeout(() => {
            if (res.ERROR) {

              this.snackBar.open(res.ERROR, "", {
                duration: 3000,
                horizontalPosition: this.horizontalPosition,
                verticalPosition: this.verticalPosition
              });
            }
            else {
              i--;
              if (i === 0) {

                this.snackBar.open("Students Removed Successfully", "", {
                  duration: 3000,
                  horizontalPosition: this.horizontalPosition,
                  verticalPosition: this.verticalPosition
                });
                this.getGroups();
              }
            }
            this.spinnerService.hide();
          }, 2000);

        })

    })

  }
  unArchiveGroup(e) {
    this.spinnerService.show();
    this.userService.executeGetRequest("unarchiveGroup/" + e.id).subscribe(
      res => {
        setTimeout(() => {

          if (res.ERROR) {
            this.snackBar.open(res.ERROR, "", {
              duration: 3000,
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition
            });
          }
          else {
            this.snackBar.open("Group Unarchived Successfully", "", {
              duration: 3000,
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition
            });
            this.getGroups();
          }
          this.spinnerService.hide();
        }, 2000);
      }
    )
  }


  includeArchived() {

    this.spinnerService.show();
    if (!this.model.showArchived) {
      this.noOfGroups = 0;
      // this.selectedGroupsCount = this.qGroupIds.length;
      this.groupRecords = [];
      this.groupdataSource = [];
      this.groupselection.clear();
      this.userService.executeGetRequest('getgroups').subscribe(
        res => {

          if (res != null) {
            this.noOfGroups = res.length;
          }

          this.groupData = Object.assign(res);
          this.groupdataSource = new MatTableDataSource(res);
          this.assignTableData(res);
          this.groupdataSource.data.forEach(row => {
            this.qGroupIds.forEach(id => {
              if (row.id === id) {
                this.groupselection.select(row);
              }
            })
          });
          this.groupdataSource.paginator = this.paginator;
          this.spinnerService.hide();
        })
    }
    else {
      this.getGroups();
    }


  }

  navigateTo(url) {
    this.router.navigate([url]);
  }

  assignTableData(data){
    const tab_data: GroupData[] = data;
    const sortEvents$: Observable<Sort> = fromMatSort(this.sort);
    const pageEvents$: Observable<PageEvent> = fromMatPaginator(this.paginator);
    const rows$ = of(tab_data);
    this.totalRows$ = rows$.pipe(map(rows => rows.length));
    this.displayedRows$ = rows$.pipe(sortRows(sortEvents$), paginateRows(pageEvents$));
  }
}
export interface GroupData{
  archived: string;
  groupName: string;
  id: number;
  noOfStudents: number;
  students: any[];
}
//----------------------------------------------------------------------------------------------------------------------------------------------------------------
//create group
export interface dialogcreateData {
  id: number;
  oldGroupName: string;
  groupName: string;
}

@Component({
  selector: 'dialog-create-group',
  templateUrl: 'dialog-create-group.html',
  styleUrls: ['./my-group.component.css', '../../styles/home.component.css', '../../styles/dashboard.css', '../../styles/parent.css', '../../styles/registration.css']
})
export class DialogCreateGroup {
  errormsg: string;
  duplicateValue = false;
  groupNameForm: FormGroup;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  constructor(
    public dialogRef: MatDialogRef<DialogCreateGroup>,
    @Inject(MAT_DIALOG_DATA) public data: dialogcreateData,
    private userService: UserService,
    private fb: FormBuilder,
    public snackBar: MatSnackBar,
    private spinnerService: Ng4LoadingSpinnerService
  ) {
    this.groupForm();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  groupForm() {
    this.groupNameForm = this.fb.group({
      groupName: new FormControl('')
    })
  }
  onSubmitGroupDetails(value) {
    // alert("name:"+value)
    if (value) {

      const groupData = { groupName: value };
      this.userService.executePostRequest("createGroup", groupData).subscribe(
        res => {

          if (res.ERROR) {

            this.duplicateValue = true;
            this.errormsg = res.ERROR;
          }
          else {

            this.spinnerService.show();
            setTimeout(() => {

              this.snackBar.open("Group Created Successfully", "", {
                duration: 3000,
                horizontalPosition: this.horizontalPosition,
                verticalPosition: this.verticalPosition
              });

              this.spinnerService.hide();
              this.onNoClick();

            }, 2000);


          }

        })
    }
    else {
      this.duplicateValue = true;
      this.errormsg = "Group Name required to create a group";
    }
  }
}




//-------------------------------------------------------------------------------------------------------------------------------------------------------------------
//Edit Group
@Component({
  selector: 'dialog-edit-group',
  templateUrl: 'dialog-edit-group.html',
  styleUrls: ['./my-group.component.css', '../../styles/home.component.css', '../../styles/dashboard.css', '../../styles/parent.css', '../../styles/registration.css']
})
export class DialogEditGroup {
  oldGroupName: string;
  groupId: number;
  errormsg: string;
  duplicateValue = false;
  groupNameForm: FormGroup;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  constructor(
    public dialogRef: MatDialogRef<DialogEditGroup>,
    @Inject(MAT_DIALOG_DATA) public data: dialogcreateData,
    private userService: UserService,
    private fb: FormBuilder,
    public snackBar: MatSnackBar,
    private spinnerService: Ng4LoadingSpinnerService) {
    this.groupId = data.id;
    this.oldGroupName = data.oldGroupName;
    this.groupForm();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  groupForm() {
    this.groupNameForm = this.fb.group({
      groupName: new FormControl('')
    })
  }
  onSubmitGroupDetails(value) {
    // alert("name:"+value)
    if (value) {

      const groupData = { id: this.groupId, groupName: value };
      this.userService.executePostRequest("editGroup", groupData).subscribe(
        res => {

          if (res.ERROR) {

            this.duplicateValue = true;
            this.errormsg = res.ERROR;
          }
          else {

            this.spinnerService.show();
            setTimeout(() => {

              this.snackBar.open("Group Name Updated Successfully", "", {
                duration: 3000,
                horizontalPosition: this.horizontalPosition,
                verticalPosition: this.verticalPosition
              });

              this.spinnerService.hide();
              this.onNoClick();

            }, 2000);


          }

        })
    }
    else {
      this.duplicateValue = true;
      this.errormsg = "Group Name required to Update";
    }
  }

}

//---------------------------------------------------------------------------------------------------------------------------------------------------------------------
//Add Student
export interface StudentElement {
  id: string;
  name: string;
  standard: string;
  select: boolean;

}

@Component({
  selector: 'dialog-add-student',
  templateUrl: 'dialog-add-student.html',
  styleUrls: ['./my-group.component.css', '../../styles/home.component.css', '../../styles/dashboard.css', '../../styles/parent.css', '../../styles/registration.css']
})
export class DialogAddStudent {


  displayedColumns: string[] = ['select', 'name', 'groupName', 'standard'];
  dataSource = null;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  model: any = {};
  selection = new SelectionModel(true, []);
  filterName: string;
  filterStandard: string;

  displayedRows$: Observable<StudData[]>;
  totalRows$: Observable<number>;
  modelData: any;
  constructor(
    public dialogRef: MatDialogRef<DialogAddStudent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userService: UserService) {

    this.userService.executeGetRequest("students").subscribe(
      res => {
        let stdList = [];
        console.log(JSON.stringify(res));
        for (let i = 0; i < res.length; i++) {
          if (res[i].archived === 'Active') {
            stdList.push(res[i]);
          }
        }
        this.modelData =  stdList;
        this.dataSource = new MatTableDataSource(stdList);
        this.setSelection();
        this.dataSource.paginator = this.paginator;
        this.assignTableData(res);

        this.dataSource.filterPredicate =
          (data: StudentElement, filtersJson: string) => {
            const matchFilter = [];
            const filters = JSON.parse(filtersJson);

            filters.forEach(filter => {
              const val = data[filter.id] === null ? '' : data[filter.id];
              matchFilter.push(val.toLowerCase().includes(filter.value.toLowerCase()));
            });
            return matchFilter.every(Boolean);
          };

      }
    );


  }

  setSelection() {
    let selStudent = [];
    if (this.data && this.data.selected) {
      for (let i = 0; i < this.data.selected.length; i++) {
        for (let j = 0; j < this.dataSource.data.length; j++) {
          if (this.data.selected[i].id === -1 || (this.data.selected[i].id === this.dataSource.data[j].id)) {
            selStudent = selStudent.concat(this.dataSource.data.slice(j, j + 1))
          }
        }
      }
    }
    this.selection = new SelectionModel<StudentElement>(true, selStudent);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  /*  applyFilter(e) {
       this.dataSource.filter = e.trim().toLowerCase();
    }*/
  applyFilter(filterValue: string) {
    const tableFilters = [];
    this.filterName = filterValue;
    tableFilters.push({
      id: 'name',
      value: filterValue
    });
    if (this.filterStandard) {
      tableFilters.push({
        id: 'standard',
        value: this.filterStandard
      });
    }
    this.dataSource.filter = JSON.stringify(tableFilters);
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
    if(filterValue){
      this.filterConvert(filterValue, 'name');
    }else{
      this.assignTableData(this.modelData);
    }
  }

  filterConvert(key, spec){
    let data: any[] = [];
    this.modelData.forEach(elem => {
      if(spec === 'name'){
        if(this.filterStandard){
          if(elem.name.toLowerCase().indexOf(key.toLowerCase()) >= 0 &&
             elem.standard.toLowerCase().indexOf(this.filterStandard.toLowerCase()) >= 0){
            data.push(elem);
          }
        }else{
          if(elem.name.toLowerCase().indexOf(key.toLowerCase()) >= 0){
            data.push(elem);
          }
        }
      }else{
        if(this.filterName){
          if(elem.standard.toLowerCase().indexOf(key.toLowerCase()) >= 0 &&
          elem.name.toLowerCase().indexOf(this.filterName.toLowerCase()) >= 0){
            data.push(elem);
          }
        }else{
          if(elem.standard.toLowerCase().indexOf(key.toLowerCase()) >= 0){
            data.push(elem);
          }
        }
      }
    });
    this.assignTableData(data);
  }

  /*  applyStandardFilter(e) {
      this.dataSource.filter = e;
   }*/

  applyStandardFilter(filterValue: string) {
    const tableFilters = [];
    this.filterStandard = filterValue;
    tableFilters.push({
      id: 'standard',
      value: filterValue
    });
    if (this.filterName) {
      tableFilters.push({
        id: 'name',
        value: this.filterName
      });
    }

    this.dataSource.filter = JSON.stringify(tableFilters);
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
    if(filterValue){
      this.filterConvert(filterValue, 'standard');
    }else{
      this.assignTableData(this.modelData);
    }
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  getIsChecked(row) {
    let isSelected = false;
    if (this.data) {
      this.data.forEach(sel => {
        if (sel.id === row.id) {
          isSelected = true;
        }
      });
    }
    return isSelected;
  }

  masterToggle() {
    this.isAllSelected() || this.selection.hasValue() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => {
        if (row.groupName === '') {
          this.selection.select(row);
        }


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

export interface StudData{
  archived: string;
  groupName: string;
  id: number;
  name: string;
  standard: string;
}
//--------------------------------------------------------------------------------------------------------------------------
//remove students

@Component({
  selector: 'dialog-remove-student',
  templateUrl: 'dialog-remove-student.html',
  styleUrls: ['./my-group.component.css', '../../styles/home.component.css', '../../styles/dashboard.css', '../../styles/parent.css', '../../styles/registration.css']
})
export class DialogRemoveStudent {

  groupName: string;
  removeData: any;
  displayedColumns: string[] = ['select', 'name', 'groupName', 'standard'];
  dataSource = null;
  nameFilter: string;
  standardFilter: string;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  model: any = {};
  selection = new SelectionModel(true, []);
  displayedRows$: Observable<StudData[]>;
  totalRows$: Observable<number>;
  constructor(
    public dialogRef: MatDialogRef<DialogAddStudent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Inject(MAT_DIALOG_DATA) public groupData: dialogcreateData,
    private userService: UserService) {
    this.groupName = groupData.groupName;
    let existingStudents = [];
    this.userService.executeGetRequest("students").subscribe(
      res => {
        for (let i = 0; i < res.length; i++) {
          // alert(res[i].groupName);
          if (res[i].groupName === this.groupName) {
            existingStudents.push(res[i]);
          }
        }
        this.removeData = existingStudents;
        this.dataSource = new MatTableDataSource(existingStudents);
        this.setSelection();
        this.dataSource.paginator = this.paginator;
        this.assignTableData(existingStudents);
      }
    );

  }

  setSelection() {
    let selStudent = [];
    if (this.data && this.data.selected) {
      for (let i = 0; i < this.data.selected.length; i++) {
        for (let j = 0; j < this.dataSource.data.length; j++) {
          if (this.data.selected[i].id === -1 || (this.data.selected[i].id === this.dataSource.data[j].id)) {
            selStudent = selStudent.concat(this.dataSource.data.slice(j, j + 1))
          }
        }
      }
    }
    this.selection = new SelectionModel<StudentElement>(true, selStudent);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  applyFilter(e) {
    this.dataSource.filter = e.trim().toLowerCase();
    this.nameFilter = e;
    if(e){
      this.filterConvert(e, 'name');
    }else{
      this.assignTableData(this.removeData);
    }
  }

  applyStandardFilter(e) {
    this.dataSource.filter = e;
    this.standardFilter = e;
    if(e){
      this.filterConvert(e, 'standard');
    }else{
      this.assignTableData(this.removeData);
    }
  }

  filterConvert(key, spec){
    let data: any[] = [];
    this.removeData.forEach(elem => {
      if(spec === 'name'){
        if(this.standardFilter){
          if(elem.name.toLowerCase().indexOf(key.toLowerCase()) >= 0 &&
             elem.standard.toLowerCase().indexOf(this.standardFilter.toLowerCase()) >= 0){
            data.push(elem);
          }
        }else{
          if(elem.name.toLowerCase().indexOf(key.toLowerCase()) >= 0){
            data.push(elem);
          }
        }
      }else{
        if(this.nameFilter){
          if(elem.standard.toLowerCase().indexOf(key.toLowerCase()) >= 0 &&
          elem.name.toLowerCase().indexOf(this.nameFilter.toLowerCase()) >= 0){
            data.push(elem);
          }
        }else{
          if(elem.standard.toLowerCase().indexOf(key.toLowerCase()) >= 0){
            data.push(elem);
          }
        }
      }
    });
    this.assignTableData(data);
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  getIsChecked(row) {
    let isSelected = false;
    if (this.data) {
      this.data.forEach(sel => {
        if (sel.id === row.id) {
          isSelected = true;
        }
      });
    }
    return isSelected;
  }

  masterToggle() {
    this.isAllSelected() || this.selection.hasValue() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
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
@Component({
  selector: 'dialog-delete-group',
  templateUrl: 'dialog-delete-group.html',
  styleUrls: ['./my-group.component.css']
})
export class DialogDeleteGroup {

  constructor(
    public dialogRef: MatDialogRef<DialogDeleteGroup>) { }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
