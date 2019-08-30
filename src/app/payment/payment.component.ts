import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef, ChangeDetectorRef, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DataService } from '../service/data-api.service';
import { UserService } from '../service/user.service';
import { HttpClient } from '@angular/common/http';
import { AUTHORITIES, SERVER_URL } from '../service/auth.constant';
import { MatButtonModule, MatCheckboxModule, MatSnackBarModule, MatSnackBar, MatStep, ShowOnDirtyErrorStateMatcher } from '@angular/material';
import { MatExpansionModule } from '@angular/material/expansion';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from '../home/dashboard/subscription/subscription.component';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

export class PaymentRequest {

  paymentToken: string;
  amount: number;
  currency: string;

}

export class OrderDetails extends PaymentRequest {
  orderId: number;
  subscriptionId: string;
  transactionId: string;
  status: string;
  chargeId: string;
  failureCode: string
  failureMessage: string
  clientSecret: string
  paymentSource: string

}

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('cardInfo') cardInfo: ElementRef;

  @Input() paymentData;
  subscription: Subscription;
  card: any;
  cardHandler = this.onChange.bind(this);
  error: string;
  paymentRequest: PaymentRequest = {
    paymentToken: null,
    amount: 0,
    currency: null
  };

  orderDetails = new OrderDetails();

  model: any;

  constructor(private cd: ChangeDetectorRef,
    private dataService: DataService,
    private userService: UserService,
    public snackBar: MatSnackBar,
    private http: HttpClient,

    private router: Router,
    private activatedRoute: ActivatedRoute,
    private spinnerService: Ng4LoadingSpinnerService) {
    this.paymentRequest.currency = this.userService.getCurreny();
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.orderDetails.orderId = params["orderId"]
      this.getSubscription(params["subscriptionId"]);
    });

  }
  ngAfterViewInit() {
    this.card = elements.create('card');
    this.card.mount(this.cardInfo.nativeElement);

    this.card.addEventListener('change', this.cardHandler);
  }

  ngOnDestroy() {
    this.card.removeEventListener('change', this.cardHandler);
    this.card.destroy();
  }

  onChange({ error }) {
    if (error) {
      this.error = error.message;
    } else {
      this.error = null;
    }
    this.cd.detectChanges();
  }




  async onSubmit(form: NgForm) {
    await this.handlePayment()
    //Navigate to subscription page
    this.dataService.changeDashboardSubMenu('Subscriptions')
    this.router.navigate(["parent-dashboard"])
  }


  public getSubscription(id) {
    this.spinnerService.show();
    this.userService.executeGetRequest('subscription/' + id).subscribe(
      res => {
        this.subscription = res;
        this.spinnerService.hide();
        this.createPaymentIntenet()
      }
    );
  }


  createPaymentIntenet() {

    this.paymentRequest.amount = this.subscription.price
    this.paymentRequest.currency = this.userService.getCurreny();
    // make paymentIntent
    this.userService.executePostRequest("paymentIntent", this.paymentRequest).subscribe(
      res => {
        //retain orderId
        res.orderId = this.orderDetails.orderId;
        this.orderDetails = res;
        this.updateOrder();
        console.log("PaymentIntent created successful:", res);
        this.spinnerService.hide();
        //resolve(res)
      },
      error => {
        console.log("PaymentIntent request Failed:", error);
        alert('Payment PaymentIntent Failed :' + error);
        this.spinnerService.hide();
        //reject(error)
      });

  }


  async makePayment(token): Promise<any> {

    return new Promise((resolve, reject) => {
      // ...send the token to the your backend to process the charge
      this.paymentRequest.paymentToken = token.id;
      this.paymentRequest.amount = this.subscription.price
      this.paymentRequest.currency = this.userService.getCurreny();
      // make payment
      this.userService.executePostRequest("charge", this.paymentRequest).subscribe(
        res => {
          //retain orderId
          res.orderId = this.orderDetails.orderId;
          this.orderDetails = res;
          this.updateOrder();
          console.log("Payment successful:", res);
          alert("Payment successful, your transaction reference is " + this.orderDetails.transactionId);
          resolve(res)
        },
        error => {
          console.log("Payment request Failed:", error);
          alert('Payment Request Failed :' + error);
          reject(error)
        });

    });

  }

  async handlePayment() {
    const { paymentIntent, error } = await stripe.handleCardPayment(
      this.orderDetails.clientSecret, this.card, {
        source_data: {
        }
      }
    );
    if (error) {
      console.error("Transaction is not successful", error);
      this.orderDetails.status = error.code
      this.orderDetails.chargeId = error.payment_intent.id
      //this.orderDetails.paymentSource = error.source.id
      alert("Payment failed. " + error.message);
    } else {
      // The payment has succeeded. Display a success message.
      this.orderDetails.status = paymentIntent.status
      this.orderDetails.chargeId = paymentIntent.id
      this.orderDetails.paymentSource = paymentIntent.source
      console.log("Payment successful:", paymentIntent);
      alert("Payment successful. Your transaction reference is " + paymentIntent.id);
    }
    this.updateOrder()
  }
  public updateOrder() {
    this.orderDetails.amount = this.paymentRequest.amount
    this.orderDetails.currency = this.paymentRequest.currency
    this.orderDetails.paymentToken = this.paymentRequest.paymentToken
    this.orderDetails.subscriptionId = ""+this.subscription.id

    //update the order with payment information

    console.log("orderDetails", this.orderDetails)

    this.userService.executePostRequest("update-order", this.orderDetails).subscribe(
      resp => {
        this.model = resp
      }
    )

  }
}

