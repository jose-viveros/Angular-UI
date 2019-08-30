import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import {TOKEN_NAME, SERVER_URL} from './auth.constant';
import { UserService } from './user.service';
import { MatSnackBar } from '@angular/material';

@Injectable()
export class S3Service {

    model: any = {};

    constructor(
        private http: HttpClient,
        private userService: UserService,
        public snackBar: MatSnackBar
    ) { }

    sendFile(file, editor, type) {
        if(file.size / (1024 * 1024) > 1 ) {
            this.snackBar.open ("File size is greater than 1MB, please upload file with size less than 1MB!!", "", {
              duration: 5000
            });
        } else {
            let headers = new HttpHeaders();
            headers.set('Content-Type', null);
            headers.set('Accept', "multipart/form-data");
            headers = headers.append(TOKEN_NAME, this.userService.getToken());

            const formData = new FormData();
            formData.append('file', file, file.name);
            formData.append('type', type);

            this.http.post(SERVER_URL + "uploadToS3", formData, { headers }).subscribe((data) => {
                this.model.s3 = data;
                const s3URL = this.model.s3.s3URL;
                editor.summernote('editor.insertImage', s3URL);
            });
        }
    }
}
