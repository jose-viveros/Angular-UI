import { AUTHORITIES, DOMAIN, EXAM_FILTERS } from '../../../service/auth.constant';
import { UserService } from '../../../service/user.service';
import { ExamFilterService } from './exam-filter.service';
import { HttpUrlEncodingCodec } from '@angular/common/http';
import { Component, OnInit, Input } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-exam-filter',
  templateUrl: './exam-filter.component.html',
  styleUrls: ['./exam-filter.component.css', '../../../styles/home.component.css', '../../../styles/dashboard.css', '../../../styles/parent.css', '../../../styles/registration.css']
})
export class ExamExamFilterComponent implements OnInit {

  
  model: any = {};
  redirectUrl: string;
  disableTopic = true;
  panelOpenState = true;
  isNotFreeStyle = true;
  tutor = false;
  
  @Input() showAssignedComponent = true;
  @Input() showStatusComponent = true;

  status = [];
  difficulties = [];
  hideWriteUpStatusDropDown = false;

  constructor(private router: Router,
    private userService: UserService,
    public snackBar: MatSnackBar,
    private enc: HttpUrlEncodingCodec,
    private filterService: ExamFilterService,
    private activatedRoute: ActivatedRoute) {
    this.redirectUrl = this.activatedRoute.snapshot.queryParams['redirectTo'];
  }

  ngOnInit() {
    if(location.pathname === "/excelplus/mocklist") {
        this.hideWriteUpStatusDropDown = true;
    }
    this.init();
    this.getUserRole();
    this.fetchSubjects();
    this.fetchCourses();
    this.status = ['Pending', 'InProgress', 'Complete'];
    this.difficulties = [{value:0,name:'Simple'},{value:1,name: 'Moderate'},{value:2,name: 'Hard'}];
    this.fetchFreeStyleTopics();
  }

  init() {
    this.model.writeUpStatus = "ALL";
    this.model.testTypeDesc = 'All';
    this.model.testType = "ALL";
    this.model.seldomain = this.userService.getAttribute(DOMAIN);
    this.model.testType = null;
    this.model.examName = null;
    this.model.selpublisher = null;
    this.model.selsubject = null;
    this.model.selcourse = null;
    this.model.seltopic = null;
    this.model.difficultyLevel = null;
    this.model.showAssigned = null;
    this.model.selstatus = null;

    EXAM_FILTERS.examType = "ALL";
    EXAM_FILTERS.examName = null;
    EXAM_FILTERS.publisher = null;
    EXAM_FILTERS.subject = null;
    EXAM_FILTERS.course = null;
    EXAM_FILTERS.topic = null;
    EXAM_FILTERS.status = null;
    EXAM_FILTERS.difficultyLevel = null;
    EXAM_FILTERS.showAssignedOnly = null;

    this.filterService.setFilters.subscribe(req => {
        if(req.examType === 'WRITEUP') {
            this.showBy('WRITEUP', 'Write-up');
            this.model.writeUpStatus = req.status;
            this.model.selfreestyle = req.topic;
            EXAM_FILTERS.status = req.status;
            EXAM_FILTERS.examType = req.examType;
            EXAM_FILTERS.topic = this.model.selfreestyle;
        }
    });
  }
   getUserRole() {
    const roles = JSON.parse(this.userService.getAttribute('AUTHORITIES'));
    console.log(roles[0].authority);
    if (roles && roles[0] && roles[0].authority) {
      const roll = roles[0].authority;
      if (roll === 'ROLE_TUTOR') {
        this.tutor = true;
      }else if(roll === 'ROLE_STUDENT') {
        this.userService.executeGetRequest('getuser').subscribe(
          data => {
            if(data.parentUser === 'TUTOR'){
              this.tutor = true;
            }
          })
      }
     }
  }
  fetchFreeStyleTopics() {
    this.userService.executeGetRequest("freestyletopics/" + this.model.seldomain).subscribe (
        res => {
          this.model.freestyletopics = res;
        }
      );
  }


  fetchSubjects() {
    this.userService.executeGetRequest("subject/" + this.model.seldomain).subscribe(
      res => {
        this.model.subject = res;
      }
    );
  }
  fetchCourses() {
    console.log("Current Domain", this.model.seldomain)
    this.userService.executeGetRequest("exams/" + this.model.seldomain).subscribe(
      resp => {
        this.model.course = resp
        this.model.selcourse = this.model.course[0].id
        this.model.courseName = this.model.course[0].name
        console.log("course", this.model.courseName)
        EXAM_FILTERS.course =  this.model.selcourse
      }
    )
  }

  subjectChangeEvent(e) {
    let target = e.source.selected._element.nativeElement;
    this.model.subjectText = target.innerText.trim();
    this.model.topicText = null;
    this.getTopics();
  }

  courseChangeEvent(e) {
    let target = e.source.selected._element.nativeElement;
    this.model.courseName = target.innerText.trim();
  }

  topicChangeEvent(e) {
    let target = e.source.selected._element.nativeElement;
    this.model.topicText = target.innerText.trim();
  }

  statusChangeEvent(e) {
    let target = e.source.selected._element.nativeElement;
    this.model.statusText = target.innerText.trim();
  }

  writeUpTypeChangeEvent(e) {
      let target = e.source.selected._element.nativeElement;
      this.model.writeUpTypeText = target.innerText.trim();
  }

  writeUpStatusChangeEvent(e) {
      let target = e.source.selected._element.nativeElement;
      this.model.writeUpStatusText = target.innerText.trim();
  }
  difficultyChangeEvent(e){
      let target = e.source.selected._element.nativeElement;
      this.model.difficultyText = target.innerText.trim();
  }

  getTopics() {
    this.model.seltopic = null;
    if ((this.model.testType == "TOPIC" || this.model.testType == null) && this.model.selsubject) {
      this.userService.executeGetRequest("topic/" + this.model.selsubject).subscribe(
        res => {
          this.model.topic = res;
          this.disableTopic = false;
        }
      );
    }
  }

  showBy(testType, testTypeDesc) {
    this.model.testTypeDesc = testTypeDesc;
    this.model.testType = testType;
    if(testType === "WRITEUP") {
        this.model.courseName = null;
        this.isNotFreeStyle = false;
        this.clearAndReload(false);
        this.model.testTypeDesc = testTypeDesc;
        this.model.testType = testType;
        EXAM_FILTERS.examType = testType;
        this.filterService.filter(EXAM_FILTERS);
    } else if (this.model.testType != "TOPIC") {
        this.model.writeUpTypeText = null;
        this.model.writeUpStatusText = null;
        this.model.courseName = this.model.course[0].name;
        EXAM_FILTERS.course = this.model.course[0].name;
        this.isNotFreeStyle = true;
        this.model.topic = null;
        this.disableTopic = true;
    } else {
        this.model.writeUpTypeText = null;
        this.model.writeUpStatusText = null;
        this.model.courseName = this.model.course[0].name
        EXAM_FILTERS.course = this.model.course[0].name;
        this.isNotFreeStyle = true;
        this.getTopics();
    }
  }

  getCss(testType) {
    if (testType == this.model.testType) {
      return "btn btn-primary btn-active";
    } else {
      return "btn btn-primary unselectedCss";
    }
  }

  search() {
    if(!this.isNotFreeStyle && this.model.selfreestyle == null) {
          this.snackBar.open("Please select Write-Up Type", "", {
                duration: 3000
            });
            return;
      }
    EXAM_FILTERS.examType = this.model.testType;
    EXAM_FILTERS.examName = this.model.examName;
    EXAM_FILTERS.publisher = this.model.selpublisher;
    EXAM_FILTERS.course = this.model.selcourse;
    EXAM_FILTERS.subject = this.model.selsubject;
    if(EXAM_FILTERS.examType === "WRITEUP") {
        EXAM_FILTERS.topic = this.model.selfreestyle;
        EXAM_FILTERS.status = this.model.writeUpStatus;
    } else {
        EXAM_FILTERS.topic = this.model.seltopic;
        EXAM_FILTERS.status = this.model.selstatus;
    }
    
    EXAM_FILTERS.difficultyLevel = this.model.difficultyLevel;
    EXAM_FILTERS.showAssignedOnly = this.model.showAssigned;

    this.filterService.filter(EXAM_FILTERS);
  }

  clear() {
    this.clearAndReload(true);
  }

  clearAndReload(reload) {
    EXAM_FILTERS.examType = "ALL";
    EXAM_FILTERS.examName = null;
    EXAM_FILTERS.publisher = null;
    EXAM_FILTERS.subject = null;
    EXAM_FILTERS.topic = null;
    EXAM_FILTERS.status = null;
    EXAM_FILTERS.difficultyLevel = null;
    EXAM_FILTERS.showAssignedOnly = null;
    this.model.selsubject = null;
    this.model.seltopic = null;
    this.model.selpublisher = null;
    this.model.selstatus = null;
    this.model.difficultyLevel = null;
    this.model.selfreestyle = "-1";
    this.model.testType = "ALL";
    this.model.examName = null;
    this.model.showAssigned = false;
    this.model.subjectText = null;
    this.model.topicText = null;
    this.model.statusText = null;
    this.model.difficultyText = null;
    this.model.testTypeDesc = 'All';
    this.model.testType = "ALL";
    this.model.writeUpStatus = "ALL";
    
    if(reload) {
        this.model.writeUpTypeText = null;
        this.model.writeUpStatusText = null;
        this.filterService.filter(EXAM_FILTERS);
    }
  }


}