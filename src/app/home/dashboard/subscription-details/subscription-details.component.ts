import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { DataService } from '../../../service/data-api.service';
import { UserService } from '../../../service/user.service';

import { Exam } from '../subscription/subscription.component';
import { Router } from '@angular/router';
import { OrderDetails } from '../../../payment/payment.component';
@Component({
  selector: 'app-subscription-details',
  templateUrl: './subscription-details.component.html',
  styleUrls: ['./subscription-details.component.css']
})
export class SubscriptionDetailsComponent implements OnInit {
  displayedColumns: string[] = ['title', 'expiryDuration', 'expiryDate', 'noOfMockTests', 'noOfTopicTests', 'price', 'action'];
  @Input() exam: Exam;
  @Output() isPayment = new EventEmitter<boolean>();
  @Output() paymentData = new EventEmitter<boolean>();

  currency: string;
  model: any;

  orderDetails: OrderDetails;

  constructor(public dataService: DataService,
    public router: Router,
    private userService: UserService
  ) {
    this.currency = userService.getCurreny();
    this.orderDetails =   new OrderDetails();

  }

  ngOnInit() {
  }


  checkout(subscriptionId) {
    this.orderDetails.subscriptionId = subscriptionId
    this.userService.executePostRequest("/start-order", this.orderDetails).subscribe(
      resp => {
        this.model = resp
        console.log("start order response" , this.model)
        const url = "payment/" + subscriptionId + "/" + this.model.orderId;
        this.router.navigate([url]);
      }

    )

  }

}
