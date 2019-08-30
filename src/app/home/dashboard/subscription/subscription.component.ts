import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import * as $ from 'jquery';

import { UserService } from '../../../service/user.service';
import { Router, NavigationExtras, NavigationEnd } from '@angular/router';
import { OrderDetails } from '../../../payment/payment.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, PageEvent, MatSort, Sort, MatTableDataSource, MatPaginator } from '@angular/material';
import { Observable} from "rxjs/Observable";
import { of } from "rxjs/observable/of";
import { map } from "rxjs/operators";
import { fromMatSort, sortRows } from '../../table-utils';
import { fromMatPaginator, paginateRows } from '../../table-utils';

export class Exam {
  id: number;
  name: string;
  courseName: string
  date: string;
  examInfo: string;
  subscriptions: Subscription[];
}
export class Subscription {

  id: number;
  code: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  expiryDate: string;
  expirayDuration: number;
  noOfMockTests: number;
  noOfTopicTests: number;
  priceId: number;
  price: number;
  discount: number;
  showTicket: number = 0;
  exam: Exam;
}

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.css']
})

export class SubscriptionComponent implements OnInit {
  @Output() isPayment = new EventEmitter<boolean>();
  @Output() paymentData = new EventEmitter<boolean>();

  displayedColumns: string[] = ['exam.name', 'price', 'startDate', 'expiryDate', 'expiryDuration'];
  dataSource = null;
  purchaseHistoryDataSource = null;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;


  exams: Exam[];
  selectedExam: Exam;
  activeSubscriptions: Subscription[];
  purchasedSubscriptions: Subscription[];
  currency: string;
  orderDetails: OrderDetails;
  model: any;

  displayedRows$: Observable<HistoryData[]>;
  totalRows$: Observable<number>;

  constructor(private userService: UserService,
    private router: Router) {
    this.currency = userService.getCurreny();
    this.orderDetails = new OrderDetails();
  }

  ngOnInit() {
    window.scroll(0, 0);

    this.getExamsByRoles();
    this.getPurchasedSubscriptions()
    // this.getActiveSubscriptions();
    //  $(document).ready(function(){
    //   $(document).on("click",".show-pkg",function(){
    //     $(".pkgs-tab-main .by-box").removeClass("active");
    //     $(".all_pack").hide();
    //     $(this).parent().parent().addClass("active");
    //       var package_id = $(this).attr('id');
    //       $("#pack_"+package_id).parent('div').show();
    //     });
    //   });

    $(document).ready(function () {
      $(document).on("click", ".just_one_package", function () {
        $(".pkgs-tab-main .by-box").removeClass("active");
        $(".all_pack").hide();
        $(this).parent().addClass("active");
        var id = $(this).attr('id');
        $("#pack_" + id).parent('div').show();
      });
    });
  }

  onSelect(exam: Exam): void {
    this.selectedExam = exam;
  }

  // showTicket(id){
  //   console.log('=======>', id);
  //   this.showTicket = id;
  //   $(".pkgs-tab-main .by-box").removeClass("active");
  //   $(".all_pack").hide();
  //   $("#"+id).addClass("active");
  //   $("#pack_"+id).parent('div').show();
  // }

  getAllExams() {
    this.userService.executeGetRequest("exams").subscribe(
      res => {
        console.log('exam ====>', JSON.stringify(res));

        this.exams = res;
        this.dataSource = new MatTableDataSource(res);
      }
    );
  }

  getExamsByRoles() {
    this.userService.executeGetRequest("exams-by-roles/"+this.userService.getDomain()).subscribe(
      res => {
        console.log('exam ====>', JSON.stringify(res));

        this.exams = res;
        this.dataSource = new MatTableDataSource(res);
      }
    );
  }
  getActiveSubscriptions() {
    this.userService.executeGetRequest("active-subscriptions").subscribe(
      res => {
        this.activeSubscriptions = res;
        console.log("subscriptions loaded", this.activeSubscriptions)
      }
    );

  }

  getPurchasedSubscriptions() {
    this.userService.executeGetRequest("purchased-subscriptions").subscribe(
      res => {
        this.purchasedSubscriptions = res;
        console.log("purchased-subscriptions loaded", this.purchasedSubscriptions)
        this.purchaseHistoryDataSource =new MatTableDataSource(res);
        this.assignTableData(res);
      }
    );

  }


  public getActiveSubscriptionsByExam(examId): Observable<Subscription[]> {
    return this.userService.executeGetRequest("active-subscriptions/" + examId);
  }
  checkout(subscriptionId) {
    console.log(subscriptionId);
    this.orderDetails.subscriptionId = subscriptionId
    this.userService.executePostRequest("/start-order", this.orderDetails).subscribe(
      resp => {
        this.model = resp
        console.log("start order response", this.model)
        const url = "payment/" + subscriptionId + "/" + this.model.orderId;
        this.router.navigate([url]);
      }

    )

  }
  makePayment(value) {
    console.log(value);

    this.isPayment.emit(value);

  }

  assignTableData(data){
    const tab_data: HistoryData[] = data;
    const sortEvents$: Observable<Sort> = fromMatSort(this.sort);
    const pageEvents$: Observable<PageEvent> = fromMatPaginator(this.paginator);
    const rows$ = of(tab_data);
    this.totalRows$ = rows$.pipe(map(rows => rows.length));
    this.displayedRows$ = rows$.pipe(sortRows(sortEvents$), paginateRows(pageEvents$));
  }
}

export interface HistoryData{
  code: string;
  discount: number;
  exam: {
    courseName: string;
    examDate: Date;
    examInfo: string;
    id: number;
    name: string;
    subscriptions: string;
  };
  expiryDate: Date;
  expiryDuration: number;
  id: number;
  longDesctiption: string;
  noOfMockTests: number;
  noOfTopicTests: number;
  price: number;
  priceId: number;
  shortDescription: string;
  startDate: Date;
  title: string;
}
