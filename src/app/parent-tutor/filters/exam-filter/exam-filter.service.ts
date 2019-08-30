import { EXAM_FILTERS } from '../../../service/auth.constant';
import { Injectable, Output, EventEmitter } from '@angular/core'

@Injectable()
export class ExamFilterService {

  model: any = {};

  @Output() getFilters: EventEmitter<any> = new EventEmitter();
  @Output() setFilters: EventEmitter<any> = new EventEmitter();

  filter(req) {
    this.getFilters.emit(req);
  }

  setFilter(req) {
    this.setFilters.emit(req);
  }

}
