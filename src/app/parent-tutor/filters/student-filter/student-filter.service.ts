import { EXAM_FILTERS } from '../../../service/auth.constant';
import { UserService } from '../../../service/user.service';
import { Injectable, Output, EventEmitter, Component, Inject } from '@angular/core'
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource, MatPaginator } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';

@Injectable()
export class StudentFilterService {

  model: any = {};
    
  @Output() getFilters: EventEmitter<any> = new EventEmitter();

  filter(req) {
    this.getFilters.emit(req);
  }  
}