import { UserService } from '../../service/user.service';
import { DataService } from '../../service/data-api.service';
import { StudentFilterService } from '../../parent-tutor//filters/student-filter/student-filter.service';
import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource, MatPaginator, MatSort, PageEvent, Sort } from '@angular/material';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { EXAM_FILTERS, GROUP_IDS, STUDENT_IDS } from '../../service/auth.constant';
import { ExamFilterService } from '../../parent-tutor/filters/exam-filter/exam-filter.service';
import { GroupMocklistAssignComponent } from '../../parent-tutor/mocklist/group-mocklist-assign/group-mocklist-assign.component';
import { MocklistAssignComponent } from '../../parent-tutor/mocklist/mocklist-assign/mocklist-assign.component';
import { SubscriptionComponent, Exam } from '../../home/dashboard/subscription/subscription.component';
import { of } from "rxjs/observable/of";
import { map } from "rxjs/operators";
import { fromMatSort, sortRows } from '../table-utils';
import { fromMatPaginator, paginateRows } from '../table-utils';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import {Observable} from "rxjs/Observable";

export interface ExamMasterElement {
   name: string;
   examType: string;
   publisher: string;
   totalQuestions: string;
   passingMarks: string;
   duration: string;
   id: string;
   paid: string
}

@Component({
   selector: 'app-mock-list',
   templateUrl: './mock-list.component.html',
   styleUrls: ['./mock-list.component.css', '../../styles/home.component.css', '../../styles/dashboard.css', '../../styles/parent.css', '../../styles/registration.css']
})
export class MockListComponent implements OnInit {
   model: any = {};
   displayedColumns: string[] = ['examType', 'name', 'totalQuestions', 'passingMarks', 'duration', 'paid', 'select'];
   dataSource = null;
   @ViewChild(MatSort) sort: MatSort;
   @ViewChild(MatPaginator) paginator: MatPaginator;
   noOfRows = 0;
   qStudentIds = [];
   initialSelection = [];
   allowMultiSelect = true;
   selection = new SelectionModel<ExamMasterElement>(this.allowMultiSelect, this.initialSelection);
   // selection = new SelectionModel(true, []);
   showSelected = false;
   selectedExamIds = [];
   selectedPaidExamIds = [];
   stdIds = [];
   grpIds = [];
   isActiveSubsctionAvailable = false;

   displayedRows$: Observable<MockExamTableData[]>;
   totalRows$: Observable<number>;

   constructor(private router: Router,
      private userService: UserService,
      public snackBar: MatSnackBar,
      private examFilterService: ExamFilterService,
      private studentFilterService: StudentFilterService,
      public dialog: MatDialog,
      private activatedRoute: ActivatedRoute,
      private subscriptionComponent: SubscriptionComponent,
      private spinnerService: Ng4LoadingSpinnerService) { }

   ngOnInit() {

      this.spinnerService.show();
      this.selection = new SelectionModel<ExamMasterElement>(this.allowMultiSelect, this.initialSelection);
      this.model.filters = EXAM_FILTERS;
       setTimeout(() => {
         this.getResult();
         
       },2000)
      
      this.examFilterService.getFilters.subscribe(req => {
         this.search(req);
         this.initActiveSubscriptionAvailable(this.model.filters.course)
      });

      this.studentFilterService.getFilters.subscribe(req => {
         this.setStudents(req);
      });

   }

   initActiveSubscriptionAvailable(courseID) {
      this.subscriptionComponent.getActiveSubscriptionsByExam(courseID).subscribe(
         rep => {
            this.isActiveSubsctionAvailable = rep.length > 0
         }
      );
   }

   getResult() {
      this.model.filters = EXAM_FILTERS;
      this.initActiveSubscriptionAvailable(this.model.filters.course)
      this.noOfRows = 0;
      this.paginator.pageIndex = 0;
      this.paginator.length = 0;
      this.selection = new SelectionModel<ExamMasterElement>(this.allowMultiSelect, this.initialSelection);
      this.userService.executePostRequest("mocklist", this.model.filters).subscribe(
         res => {
            this.spinnerService.hide();
            if (res != null) {
               this.noOfRows = res.length;
            }
            this.dataSource = new MatTableDataSource(res);
            this.dataSource.paginator = this.paginator;
            this.assignMockTableData(res);
         }
      );
   }

   search(filters) {
      this.model.filters = filters;
      this.getResult();
   }

   setStudents(students) {

      this.qStudentIds = students;
   }

   showSelectedOnly() {
      if (!this.showSelected) {
         this.paginator.pageIndex = 0;
         this.paginator.length = 0;
         this.noOfRows = this.selection.selected.length;
         this.dataSource = new MatTableDataSource(this.selection.selected);
         this.dataSource.paginator = this.paginator;
         this.assignMockTableData(this.selection.selected);
      } else {
         this.getResult();
      }
   }

   isAllSelected() {
      const numSelected = this.selection.selected.length;
      const numRows = this.dataSource.data.length;
      return numSelected === numRows;
   }

   masterToggle() {
      this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
   }

   assign() {
      this.getExamIds();
      const config = new MatSnackBarConfig();
      config.duration = 5000;
      config.panelClass = ['red-snackbar'];

      let grpIds = this.userService.getAttribute(GROUP_IDS);

      let stdIds = this.userService.getAttribute(STUDENT_IDS);


      if (this.selectedExamIds.length === 0 && stdIds == null && grpIds == null) {
         this.snackBar.open("Select Student and Exam to assign!!!", "", config);
      } else if (this.selectedExamIds.length === 0) {
         this.snackBar.open("Select Exams to assign!!!", "", config);
      } else if (stdIds == null && grpIds == null) {
         this.snackBar.open("Select Students to assign!!!", "", config);
      } else if (!this.isActiveSubsctionAvailable && this.selectedPaidExamIds.length > 0) {
         //If any paid exam is seleted and there is no active subscription
         this.openPaidExamDialog();
      } else {

         if (grpIds != null && grpIds.length > 0) {
            this.grpIds = grpIds.split(",");
            this.openGroupDialog();
         } else if (stdIds != null && stdIds.length > 0) {

            this.stdIds = stdIds.split(",");
            this.openDialog();
         }
      }
   }

   openGroupDialog(): void {
      const dialogRef = this.dialog.open(GroupMocklistAssignComponent, {
         width: '80%',
         data: { examIds: this.getExamIds(), groupIds: this.grpIds }
      });
      dialogRef.afterClosed().subscribe(result => {

      });
   }
   openDialog(): void {
      const dialogRef = this.dialog.open(MocklistAssignComponent, {
         width: '60%',
         data: { examIds: this.getExamIds(), studentIds: this.stdIds }
      });
      dialogRef.afterClosed().subscribe(result => {
      });
   }
   openPaidExamDialog(): void {
      const dialogRef = this.dialog.open(DialogConfirmPaidMockListAction, {
         width: '60%',
         data: { paidExamIds: this.selectedPaidExamIds, studentIds: this.stdIds }
      });
      dialogRef.afterClosed().subscribe(result => {
      });
   }

   getExamIds() {
      this.selectedExamIds = [];
      this.selectedPaidExamIds = [];
      this.selection.selected.forEach(row => {
         this.selectedExamIds.push(row.id);
         if (row.paid) {
            this.selectedPaidExamIds.push(row.id)
         }
      });
      return this.selectedExamIds;
   }
  assignMockTableData(data){
     const tab_data: MockExamTableData[] = data;
      const sortEvents$: Observable<Sort> = fromMatSort(this.sort);
      const pageEvents$: Observable<PageEvent> = fromMatPaginator(this.paginator);
      const rows$ = of(tab_data);
      this.totalRows$ = rows$.pipe(map(rows => rows.length));
      this.displayedRows$ = rows$.pipe(sortRows(sortEvents$), paginateRows(pageEvents$));
   }

}

@Component({
   selector: 'dialog-confirm-paid-mocklist-action',
   templateUrl: 'dialog-confirm-paid-mocklist-action.component.html',
})
export class DialogConfirmPaidMockListAction {

   constructor(
      public dialogRef: MatDialogRef<DialogConfirmPaidMockListAction>,
      @Inject(MAT_DIALOG_DATA) public paidExamIds: string[],
      private router: Router,
      private dataService: DataService) { }

   onNoClick(): void {
      this.dialogRef.close();
   }

   onBuyClick(): void {

      this.dataService.changeDashboardSubMenu('Subscriptions')
      this.router.navigate(["parent-dashboard"])
      this.dialogRef.close();
   }
}
export interface MockExamTableData{
  assignedId: number;
  dueDate: Date;
  duration: number;
  examId: number;
  examMasterId: number;
  examName: string;
  examType: string;
  expiredYN: boolean
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
  removeAssigned: boolean;
  status: boolean;
  studentId: number;
  studentIdToAssign: number;
  studentName: string;
  totalQuestions: number;
  totalStudentsInGroup: number;
}
