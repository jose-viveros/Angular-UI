import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from '../../environments/environment';
export const TOKEN_AUTH_USERNAME = 'testjwtclientid';
export const TOKEN_AUTH_PASSWORD = 'XY7kmzoNzl100';
export const TOKEN_NAME = 'X-AUTH-TOKEN';
export const SERVER_URL = (location.hostname === "localhost") ? "http://localhost:8080/api/" : location.origin + "/api/";
export const AUTHORITIES = 'AUTHORITIES';
export const DOMAIN = 'DOMAIN';
export const CURRENCY = 'CURRENCY';
export const GOOGLE_CLIENT_ID = "1093733407357-32l9k1qd0n83dgrrmpt75jld77i5j2ru.apps.googleusercontent.com";
//export const FACEBOOK_CLIENT_ID = "130471324524562";
export const FACEBOOK_CLIENT_ID_ARTOFEXAM = "339577033371653";
export const FACEBOOK_CLIENT_ID_EXCELPLUS = "835775903451014";
export const STUDENT_IDS = "STUDENT_IDS";
export const STUDENT_NAMES = "STUDENT_NAMES";
export const GROUP_IDS = "GROUP_IDS";
export const GROUP_NAMES = "GROUP_NAMES";
export const TIMEZONE = "TIMEZONE";
export const EXAM_FILTERS = {
  examType: null,
  examName: null,
  course: null, // This actually a exam e.g IBPS Clerk 2009. Grammer 2019 etc 
  publisher: null,
  subject: null,
  topic: null,
  status: null,
  difficultyLevel: null,
  showAssignedOnly: null
};

@Pipe({ name: 'safeHtml' })
export class SafeHtmlPipe implements PipeTransform {
  constructor(private sanitized: DomSanitizer) { }
  transform(value) {
    return this.sanitized.bypassSecurityTrustHtml(value);
  }
}