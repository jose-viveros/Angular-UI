import { UserService } from '../../../service/user.service';
import { Component, OnInit, Inject, ViewChild, QueryList, ViewChildren } from '@angular/core';
import { MatDialog, MatDialogRef, MatSort, PageEvent, Sort, MAT_DIALOG_DATA, MatTableDataSource, MatPaginator, MatSnackBar } from '@angular/material';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { SelectionModel } from '@angular/cdk/collections';
import { Observable} from "rxjs/Observable";
import { fromMatSort, sortRows } from '../../../home/table-utils';
import { fromMatPaginator, paginateRows } from '../../../home/table-utils';
import { map } from "rxjs/operators";
import { of } from "rxjs/observable/of";

export interface ExamAssignData {
  examIds: string[];
  studentIds: string[];
}

export interface DialogData {
  examName: string;
  studentName: string;
  status: string;
  mockId: string;
  examMasterId: string;
  studentId: string;
}

@Component({
  selector: 'app-mocklist-assign',
  templateUrl: './mocklist-assign.component.html',
  styleUrls: ['./mocklist-assign.component.css']
})
export class MocklistAssignComponent {

  displayedColumns: string[] = ['select', 'examName', 'studentName', 'status'];
  dataSource = null;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  model: any = {};
  assignList: any = [];
  selection = new SelectionModel(true, []);
  displayedRows$: Observable<AssignData[]>;
  totalRows$: Observable<number>;
  MockData: any;
  constructor(
    public dialogRef: MatDialogRef<MocklistAssignComponent>,
    private userService: UserService,
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private spinnerServcie: Ng4LoadingSpinnerService) {

    this.getData(data);
  }

  getData(data) {
    this.userService.executePostRequest("getExamStudentAssignment", { "studentIdToAssign": data.studentIds, "idToAssign": data.examIds }).subscribe(
      res => {
        console.log('assign =====>', res);
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.assignTableData(res);
        this.MockData = res;

      }
    );
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
        if (sel.id == row.id) {
          isSelected = true;
        }
      });
    }
    return isSelected;
  }


  masterToggle() {

    if (this.isAllSelected() || this.selection.hasValue()) {
      this.selection.clear();
    } else {
      this.dataSource.data.forEach(element => {
        if (element.status === 'ASSIGN' || element.status === 'REASSIGN') {
          this.selection.select(element)
        }
      }
      );

    }
  }

  removeRow(element) {
    let idx = this.assignList.indexOf(element);
    this.assignList.splice(idx, 1);
    this.dataSource = new MatTableDataSource(this.assignList);
    this.dataSource.paginator = this.paginator;
    this.assignTableData(this.assignList);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  applyFilter(e) {
    this.dataSource.filter = e.trim().toLowerCase();
    console.log('dataSource====>', this.dataSource);
    const data:any[] = [];
    this.MockData.forEach(elem => {
      if(elem.examName.toLowerCase() === e.trim().toLowerCase() || elem.studentName.toLowerCase() === e.trim().toLowerCase()){
        data.push(elem);
      }
    });
    this.assignTableData(data);
  }

  action() {
    this.assignList = this.selection.selected;
    if (this.assignList.length === 0) {
      this.snackBar.open("Please select record", "", {
        duration: 3000
      });

    }
    else {
      const dialogRef = this.dialog.open(DialogConfirmMockListAction, {
        width: '25%'
      });

      dialogRef.afterClosed().subscribe(req => {
        if (req) {
          this.performAction();
        }
      });
    }
  }

  performAction() {
    this.onNoClick();
    this.spinnerServcie.show();
    const savedRecords = [];
    //  alert(this.model.dueDate);
    this.assignList.forEach(req => {
      if (this.model.dueDate) {
        req.dueDate = this.model.dueDate;
      }
      this.userService.executePostRequest("savemocklist", req).subscribe(
        res => {

          if (req.status === 'ASSIGN' || req.status === 'REASSIGN') {
            req.id = res.id;
            req.status = "NOTSTARTED";
            savedRecords.push(res);
          } else if (req.status === 'NOTSTARTED') {
            req.status = "ASSIGN";
          }

          setTimeout(() => {
            this.spinnerServcie.hide();
            if (savedRecords.length === 0) {
              this.snackBar.open("No record saved as tests already assigned", "", {
                duration: 3000
              });
            } else {
              this.snackBar.open("Test Assigned successfully", "", {
                duration: 3000
              });
            }
          }, 3000)
        }
      );
    })
  }
  assignTableData(data){
    const tab_data: AssignData[] = data;
    const sortEvents$: Observable<Sort> = fromMatSort(this.sort);
    const pageEvents$: Observable<PageEvent> = fromMatPaginator(this.paginator);
    const rows$ = of(tab_data);
    this.totalRows$ = rows$.pipe(map(rows => rows.length));
    this.displayedRows$ = rows$.pipe(sortRows(sortEvents$), paginateRows(pageEvents$));
  }
}

export interface AssignData{
  assignedId: number;
  dueDate: Date;
  duration: number;
  examId: number;
  examMasterId: number;
  examName: string;
  examType: string;
  expiredYN: boolean;
  groupId: number;
  groupIdToAssign: number;
  groupName: string;
  id: number;
  idToAssign: number;
  idToUnAssign: number;
  name: string;
  paid: boolean;
  passingMarks: number;
  publisher: string;
  removeAssigned: string;
  status: string;
  studentId: number;
  studentIdToAssign: number;
  studentName: string;
  totalQuestions: number;
  totalStudentsInGroup: number;
}



@Component({
  selector: 'dialog-confirm-mocklist-action',
  templateUrl: 'dialog-confirm-mocklist-action.component.html',
})
export class DialogConfirmMockListAction {

  constructor(
    public dialogRef: MatDialogRef<DialogConfirmMockListAction>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}

