import { Component } from '@angular/core';
 
@Component({
  selector: 'app-antibot',
  templateUrl: './antibot.component.html',
  styleUrls: ['./antibot.component.css']
})
export class AntibotComponent {
 
  code1: number;
  code2: number;
  error: string;
  answer: number;
  operators = [42,43,45];
  operator: string;
 
  constructor() { 
    this.operator = String.fromCharCode(this.operators[Math.floor(Math.random() * this.operators.length)]);
    this.code1 = this.getRandomInt(5,9);
    this.code2 = this.getRandomInt(1,5);
    
  }
 
  checkAnswer() {
    this.error = null;
    
    let ans;
    if(this.operator==='+'){
      ans = (this.code1 + this.code2);
      
    }else if(this.operator==='-'){
      ans = (this.code1 - this.code2);
     
    }else if(this.operator==='*'){
      ans = (this.code1 * this.code2);
     
    }
    
    if(ans == this.answer) {
      this.answer = null;
      return true;
    } else {
      this.error = "Wrong Captcha!";
    }   
  }
  closeError(){
    this.error = null;
  }
  reloadCaptcha(){
   // let operatorVal=this.operators[Math.floor(Math.random() * this.operators.length)];
    this.answer=null;
    this.operator = String.fromCharCode(this.operators[Math.floor(Math.random() * this.operators.length)]);
    this.code1 = this.getRandomInt(5,9);
    this.code2 = this.getRandomInt(1,5);
  }
  getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
 
}