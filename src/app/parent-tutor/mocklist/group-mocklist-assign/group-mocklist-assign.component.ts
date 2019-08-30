import { UserService } from '../../../service/user.service';
import { Component, OnInit, Inject, ViewChild, QueryList, ViewChildren } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource, MatPaginator, MatSnackBar } from '@angular/material';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

export interface ExamAssignData {
  examIds: string[];
  groupIds: string[];
}

export interface DialogData {
  examName: string;
  studentName: string;
  status: string;
  mockId: string;
  examMasterId: string;
  groupId: string;
}

@Component({
  selector: 'app-group-mocklist-assign',
  templateUrl: './group-mocklist-assign.component.html',
  styleUrls: ['./group-mocklist-assign.component.css']
})
export class GroupMocklistAssignComponent {

  displayedColumns: string[] = ['examName', 'groupName','totalStudentsInGroup','status'];
  dataSource = null;
  @ViewChild(MatPaginator) paginator : MatPaginator;
  model: any = {};
  
  constructor(
    public dialogRef: MatDialogRef<GroupMocklistAssignComponent>,
    private userService: UserService,
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
    private spinnerService: Ng4LoadingSpinnerService,
    @Inject(MAT_DIALOG_DATA) public data: ExamAssignData) {
   
    this.getData(data);
  }
  
  getData(data) {
    //alert(data.groupIds);
     this.model.groupIdToAssign = data.groupIds;
     this.model.idToAssign=data.examIds;
      this.userService.executePostRequest("getExamGroupAssignment", {"groupIdToAssign" : data.groupIds, "idToAssign" : data.examIds}).subscribe (
          res => {
            //alert(JSON.stringify(res));
            this.dataSource = new MatTableDataSource(res);
            this.dataSource.paginator = this.paginator;
          }
       );
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  
  applyFilter(e) {
    this.dataSource.filter = e.trim().toLowerCase();
  }
  
  action(){
    
    const dialogRef = this.dialog.open(DialogConfirmGroupMockListAction, {
      width: '45%',
      data:{"groupIdToAssign" : this.model.groupIdToAssign, "idToAssign" : this.model.idToAssign}
    });

    dialogRef.afterClosed().subscribe(req => {
      if(req) {
        this.spinnerService.show();
       this.onNoClick();
        let assignObj = {"groupIdToAssign" : this.model.groupIdToAssign, "idToAssign" : this.model.idToAssign};
        this.performAction(assignObj);
      }
    });
  }
  
  performAction(obj) {
    if(this.model.dueDate){
      obj.dueDate = this.model.dueDate;
    }
    
    this.userService.executePostRequest("assignMocklistToGroup", obj).subscribe (
        res => {
         // alert(res.length);
         if(res.length===0){
           this.snackBar.open ("No record Saved", "", {
                  duration: 3000
          });
           this.spinnerService.hide();
         }else{
          this.snackBar.open ("Record Saved successfully", "", {
                  duration: 3000
          });
           this.spinnerService.hide();
        }
      }
    );
    
  }
}



@Component({
  selector: 'dialog-confirm-group-mocklist-action',
  templateUrl: 'dialog-confirm-group-mocklist-action.component.html',
})
export class DialogConfirmGroupMockListAction {

  constructor(
    public dialogRef: MatDialogRef<DialogConfirmGroupMockListAction>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}