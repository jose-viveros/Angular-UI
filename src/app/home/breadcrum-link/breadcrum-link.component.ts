import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-breadcrum-link',
  templateUrl: './breadcrum-link.component.html',
  styleUrls: ['./breadcrum-link.component.css']
})
export class BreadcrumLinkComponent implements OnInit {

  @Input() bredcrumbPath;  
  constructor() { }

  ngOnInit() {
  }
}
