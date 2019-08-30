import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../service/user.service';
import { MatTableDataSource, MatPaginator, MatSnackBar } from '@angular/material';
import { NavigationExtras, Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-search-assistant',
    templateUrl: './search-assistant.component.html',
    styleUrls: ['./search-assistant.component.css']
})
export class SearchAssistantComponent implements OnInit {

    displayedColumns: string[] = ['firstName', 'lastName', 'email', 'actions'];

    dataSource = null;

    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        public snackBar: MatSnackBar,
        private userService: UserService) { }

    ngOnInit() {
        this.getExistingAssistant();
    }

    getExistingAssistant() {
        this.userService.executeGetRequest("assistant").subscribe
            (data => {
                this.dataSource = new MatTableDataSource(data);
                this.dataSource.paginator = this.paginator;
            });
    }

    addAssistant() {
        const assistant: NavigationExtras = {
            queryParams: {
            }
        }
        this.router.navigate(['addassistant'], assistant);
    }
    
    changeAssistantState(e, ele) {
        this.userService.executeGetRequest("activateassistant/" + ele.id + "/" + e.checked).subscribe(
            res => {
                if (res && res.error) {
                    e.source.checked = false;
                    ele.active = false;
                    this.snackBar.open(res.error, "", {
                        duration: 5000
                    });
                } else {
                    if (e.checked) {
                        this.snackBar.open("User Activated Successfully!!!", "", {
                            duration: 2000
                        });
                    } else {
                        this.snackBar.open("User De-Activated Successfully!!!", "", {
                            duration: 2000
                        });
                    }
                }

            }, error => {
                alert(error.error.text);
            }
        );
    }
}
