import { ExamFilterService } from '../../parent-tutor/filters/exam-filter/exam-filter.service';
import { DataService } from '../../service/data-api.service';
import { UserService } from '../../service/user.service';
import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';


@Component({
  selector: 'app-individual-activity',
  templateUrl: './individual-activity.component.html',
  styleUrls: ['./individual-activity.component.css']
})
export class IndividualActivityComponent implements OnInit {

  [x: string]: any;
  page: number = 1;

  //status and exam type selected from dashboard submenu
  status: string = null;
  examType: string = null;

  dificulties = ['Easy', 'Medium', 'Hard'];

  redirectUrl: string;
  model: any = {};
  displayedColumns: string[] = ['testName', 'questions', 'marks', 'duration','finishedDate', 'avgScore','score','rank','status', 'action'];
  dataSource = null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  noOfRows = 0;
  selectedRecordsCount = 0;
   selection = new SelectionModel(true, []);
  
  @Input() showAssignedComponent: boolean = false;
  
  constructor(private dataService: DataService,
    private userService: UserService,
    private filterService: ExamFilterService,
    private router: Router,
    private spinnerService: Ng4LoadingSpinnerService,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
     this.showAssignedComponent= false;
    
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
   this.spinnerService.show();
   
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


  
  getAllTestsForUser(){
     this.noOfRows = 0;

    this.userService.executeGetRequest('userExams').subscribe(
      res => {
        this.spinnerService.hide();
        if (res != null) {
          this.noOfRows = res.length;
        }

        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.selection = new SelectionModel(true, []);
      });

  }
  
  
  getResult(status) {
    this.noOfRows = 0
    this.userService.executeGetRequest('userExamsbystatus/' + status).subscribe(
      res => {
        if (res != null) {
          this.noOfRows = this.noOfRows + res.length;
        }
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.spinnerService.hide();
      }
    );
  }

  getResultbyexamtypeandstatus(examtype, status) {
    this.noOfRows = 0;
    this.userService.executeGetRequest('userExamsbyExamTypeandStatus/' + examtype + '/' + status).subscribe(
      res => {
        if (res != null) {
          this.noOfRows = this.noOfRows + res.length;
        }
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.spinnerService.hide();
      }
    );
  }

  
  getAction(element){
    
      if(element.action === 'Start'){
       //this.redirectUrl = 'testrunner/'+element.assignedId+'/START';  //assignedId--> ep_user_exams_id
       //this.router.navigate([this.redirectUrl]);

       const navigationTest: NavigationExtras = {
          queryParams: {
            id: element.assignedId,
            type: "START",
            examName: element.testName
          }
        }
        this.router.navigate(['testrunner'], navigationTest);



      }
      else if(element.action === 'Review'){
        this.redirectUrl = 'check-answer/'+element.testId;  
       this.router.navigate([this.redirectUrl]);
      }
      else if(element.action === 'Resume'){
        //this.redirectUrl = 'testrunner/'+element.testId+'/RESUME';  //testId--> ep_test_id
        //this.router.navigate([this.redirectUrl]);

        const navigationTest: NavigationExtras = {
          queryParams: {
            id: element.testId,
            type: "RESUME",
            examName: element.testName
          }
        }
        this.router.navigate(['testrunner'], navigationTest);
    }
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
        this.dataSource.paginator = this.paginator;
        this.spinnerService.hide();
      }
    );
  }
  selectionChange(e){
   if(e.checked) {
       this.qtestNames.push(e.name);    
    } else {
       
      if(this.selectedRecordsCount===1){
        this.selectedRecordsCount=0;
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
    if (this.isAllSelected()) {
      this.selection.clear();
      this.selectedRecordsCount = 0;
     
    } else {
      this.dataSource.data.forEach(row => this.selection.select(row));
             
    }

  }
}
