import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ISubscription } from 'rxjs/Subscription';
import { DataService } from '../service/data-api.service' ;

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css']
})
export class TimerComponent implements OnInit, OnDestroy {

  constructor(private dataService: DataService) { }

   ticks = 0;
   minutesDisplay: number ;
   hoursDisplay: number ;
   secondsDisplay: number;

   maxMinutesDisplay: number ;
   maxHoursDisplay: number ;
   maxSecondsDisplay: number;


   sub: ISubscription;
   @Input() startsWithInSecs = 0;
   @Input() maxExamDuration = 0;

    ngOnInit() {
      //this.sub = new Subscription();
      this.maxExamDuration = this.maxExamDuration * 60; //in secs
      this.maxSecondsDisplay = this.getSeconds(this.maxExamDuration);
      this.maxMinutesDisplay = this.getMinutes(this.maxExamDuration);
      this.maxHoursDisplay = this.getHours(this.maxExamDuration);
      this.startTimer();
    }

    ngOnDestroy() {
      //this.sub.unsubscribe();
    }

       public startTimer() {
        //let cnt = this.startsWithInSecs;
        let cnt = this.maxExamDuration - this.startsWithInSecs;
        this.updateDataServiceWithCurrentTime(cnt);
        const timer = Observable.timer(0, 1000);
        this.sub = timer.subscribe(
            t => {
                this.ticks = t;
                cnt = cnt - 1;
                this.updateDataServiceWithCurrentTime(cnt);
            }
        );
        return this.sub;
    }

    updateDataServiceWithCurrentTime(cnt) {
        this.secondsDisplay = this.getSeconds(cnt);
        this.minutesDisplay = this.getMinutes(cnt);
        this.hoursDisplay = this.getHours(cnt);
        this.dataService.setTime(this.hoursDisplay, this.minutesDisplay, this.secondsDisplay);
        this.dataService.setTimerSub(this.sub);
    }

    public stopTimer() {
        if(this.sub) {
            this.sub.unsubscribe();
        }
    }

    private getSeconds(ticks: number) {
        return this.pad(ticks % 60);
    }

    private getMinutes(ticks: number) {
         return this.pad((Math.floor(ticks / 60)) % 60);
    }

    private getHours(ticks: number) {
        return this.pad(Math.floor((ticks / 60) / 60));
    }

    private pad(digit: any) {
        return digit <= 9 ? '0' + digit : digit;
    }
}
