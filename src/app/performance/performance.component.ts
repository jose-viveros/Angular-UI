import { Component, OnInit, Inject } from '@angular/core';
import { Chart } from 'chart.js';
import { DOMAIN, AUTHORITIES } from '../service/auth.constant';
import { UserService } from '../service/user.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatSnackBar } from '@angular/material';
import { StudentFilterService } from '../parent-tutor/filters/student-filter/student-filter.service';
import { ActivatedRoute } from '@angular/router';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';

export interface DialogData {
  chartData: {};
  title: string;

  averageTime: string;

  targetTime: string;
}


@Component({
  selector: 'app-performance',
  templateUrl: './performance.component.html',
  styleUrls: ['./performance.component.css', '../styles/home.component.css', '../styles/dashboard.css', '../styles/parent.css', '../styles/registration.css']
})
export class PerformanceComponent implements OnInit {

    model: any = {};

    myChart = null;

    subjectDataURL = null;

    subjectAverageTime = "";

    subjectTargetTime = "";

    isStudent = false;

    selectedStudentId = null;

    studentName = null;

    reportRequest = {
        "userId": "119",
        "topic": null,
        "subject": 1,
        "period": "LM",
        "sortBy": "AP"
    };

    subjectChartData = {
                labels: "",
                datasets: [{
                    label: '# of Questions',
                    data: null,
                    fill: false,
					backgroundColor: 'rgba(255, 99, 132, 0.2)',
					borderColor: 'rgba(255, 99, 132, 0.2)',
                },
                {
                    label: '# of Correct Questions',
                    data: null,
                    fill: false,
					backgroundColor: 'green',
					borderColor: 'green',
                },
                {
                    label: '# of In-Correct Questions',
                    data: null,
                    fill: false,
					backgroundColor: 'red',
					borderColor: 'red',
                },
                {
                    label: '# of Not Attempted Questions',
                    data: null,
                    fill: false,
					backgroundColor: 'orange',
					borderColor: 'orange',
                },
                {
                    label: '# of Wasted Attempts',
                    data: null,
                    fill: false,
					backgroundColor: 'black',
					borderColor: 'black',
                },
                {
                    label: '# of Overtime Correct Questions',
                    data: null,
                    fill: false,
					backgroundColor: 'purple',
					borderColor: 'purple',
                },
                {
                    label: '# of Overtime In-Correct Questions',
                    data: null,
                    fill: false,
					backgroundColor: 'blue',
					borderColor: 'blue',
                }
                ]
            };

            subjectChartOptions = {
                legend: {
						position: 'right',
				},
				responsive: true,
				title: {
					display: true,
					text: ''
				},
				tooltips: {
					mode: 'index',
					intersect: false,
				},
				hover: {
					mode: 'nearest',
					intersect: true
				},
				scales: {
					xAxes: [{
						display: true,
						scaleLabel: {
							display: true,
							labelString: 'Period'
						}
					}],
					yAxes: [{
						display: true,
						scaleLabel: {
							display: true,
							labelString: '# of Questions'
						}
					}]
				}
            };

        topicOptions = {
                    legend: {
                            position: 'right'
                    },
                    responsive: true,
                    maintainAspectRatio: false,
                    title: {
                        display: true,
                        text: ""
                    },
                    tooltips: {
                        mode: 'index',
                        intersect: false,
                    },
                    hover: {
                        mode: 'nearest',
                        intersect: true
                    },
                    pan: {
                        enabled: true,
                        mode: 'x',
                    },
                    zoom: {
                        enabled: true,
                        mode: 'x',
                    },
                    scales: {
                        xAxes: [{
                            display: true,
                            scaleLabel: {
                                display: true,
                                labelString: 'Period'
                            }
                        }],
                        yAxes: [{
                            display: true,
                            scaleLabel: {
                                display: true,
                                labelString: '# of Questions'
                            }
                        }]
                    }
                };
  constructor(private userService: UserService,
    private studentFilterService: StudentFilterService,
    private activatedRoute: ActivatedRoute,
    public snackBar: MatSnackBar,
    public dialog: MatDialog) {
        this.studentName = null;
        /*this.activatedRoute.queryParams.subscribe(params => {
            this.selectedStudentId = params.studentId;
            this.studentName = params.studentName;
        });*/


      this.studentFilterService.getFilters.subscribe(req => {
          this.selectedStudentId = null;
          if (req && req.length > 0) {
              this.selectedStudentId = req[0];
          }
      });

    }

  ngOnInit() {
    this.registerPlugin();
    this.setUserType();
    this.initializeReportObject();
    this.model.period = "4W";
    this.model.sortBy = "AP";
    this.getSubjectList();
  }

  registerPlugin() {
    Chart.plugins.register({
        afterDraw: function(chart) {
            if(chart.data.datasets && chart.data.datasets[0].data.length === 0) {
                const ctx = chart.chart.ctx;
                const width = chart.chart.width;
                const height = chart.chart.height
                chart.clear();
                ctx.save();
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.font = "16px normal 'Helvetica Nueue'";
                ctx.fillText(chart.options.title.text + ' : No data to display', width / 2, height / 2);
                ctx.restore();
            }
        }
    });
  }

  setUserType() {
      const roles = JSON.parse(this.userService.getAttribute(AUTHORITIES));
      for(let i = 0; i < roles.length; i = i + 1) {
         if(roles[i].authority === "ROLE_STUDENT" || roles[i].authority === "ROLE_INDIVIDUAL") {
          this.isStudent = true;
        }
      }
  }

  initializeReportObject() {
      const ctx = document.getElementById("subjectGraph");
      this.myChart = new Chart(ctx, {
            type: 'line',
            data: this.subjectChartData,
            options: this.subjectChartOptions
        });
  }

  getSubjectList() {
      this.userService.executeGetRequest("subject/" + this.userService.getAttribute(DOMAIN)).subscribe (
        res => {
          this.model.subjects = res;
          this.model.selsubject = this.model.subjects[0].id;
          this.showSubjectReport();
        }
      );
  }

  showSubjectReport() {
    this.reportRequest.period = this.model.period;
    this.reportRequest.subject = this.model.selsubject;
    this.reportRequest.topic = null;
    this.reportRequest.userId = this.selectedStudentId;
    this.reportRequest.sortBy = this.model.sortBy;
    this.loadSubjectReport();
  }

    loadSubjectReport() {
        this.userService.executePostRequest("performanceReport", this.reportRequest).subscribe(
            res => {
                this.model.subjectReportData = res.subjectReportData;
                this.model.topicReportData = res.topicReportData;
                this.renderSubjectGraph();
                this.renderTopicGraphs();
            }
        );
    }

    renderSubjectGraph() {
            const subjectContainer = document.getElementById("subjectChartContainer");
            this.cleanPreviousGraphs(subjectContainer);
            const initSubjectContainer = document.getElementById("initSubjectChartContainer");
            this.cleanPreviousGraphs(initSubjectContainer);

            const subjectDiv = document.createElement('div');
            subjectDiv.id = "divSubjectCtx";
            subjectDiv.style.padding = "3px";
            subjectDiv.style.boxShadow = "3px 3px 3px 3px #888888";
            subjectDiv.style.marginRight = "5px";

            const subjectCanvas = document.createElement('canvas');
            subjectCanvas.className = 'chartjs-render-monitor';
            subjectCanvas.id = "subjcetGraph";
            subjectCanvas.style.display = "block";
            subjectCanvas.style.width =  "1000px";
            subjectCanvas.style.height = "500px";
            subjectDiv.appendChild(subjectCanvas);

            const twoDCtx = subjectCanvas.getContext('2d');

            subjectContainer.appendChild(subjectDiv);

            this.subjectChartOptions.title.text = this.model.subjectReportData.title;

            this.subjectChartData.labels = this.model.subjectReportData.startOfWeek;
            this.subjectChartData.datasets[0].data = this.model.subjectReportData.totalQuestions;
            this.subjectChartData.datasets[1].data = this.model.subjectReportData.correctQuestions;
            this.subjectChartData.datasets[2].data = this.model.subjectReportData.inCorrectQuestions;
            this.subjectChartData.datasets[3].data = this.model.subjectReportData.unAttemptedQuestions;
            this.subjectChartData.datasets[4].data = this.model.subjectReportData.wastedQuestions;
            this.subjectChartData.datasets[5].data = this.model.subjectReportData.overtimeCorrect;
            this.subjectChartData.datasets[6].data = this.model.subjectReportData.overtimeIncorrect;

            this.subjectChartData.datasets[0].label = "# of Questions " + this.model.subjectReportData.aggTotalQuestions;
            this.subjectChartData.datasets[1].label = "# of Correct Questions " + this.model.subjectReportData.aggCorrectQuestions;
            this.subjectChartData.datasets[2].label = "# of In-Correct Questions " + this.model.subjectReportData.aggInCorrectQuestions;
            this.subjectChartData.datasets[3].label = "# of Not Attempted Questions " + this.model.subjectReportData.aggUnAttemptedQuestions;
            this.subjectChartData.datasets[4].label = "# of Wasted Attempts " + this.model.subjectReportData.aggWastedQuestions;
            this.subjectChartData.datasets[5].label = "# of Overtime Correct Questions " + this.model.subjectReportData.aggOvertimeCorrectQuestions;
            this.subjectChartData.datasets[6].label = "# of Overtime In-Correct Questions " + this.model.subjectReportData.aggOvertimeInCorrectQuestions;

            this.subjectAverageTime = this.model.subjectReportData.aggAverageTime;
            this.subjectTargetTime = this.model.subjectReportData.aggTargetTime;

            const subjectChart = new Chart(twoDCtx, {
                type: 'line',
                data: this.subjectChartData,
                options: this.subjectChartOptions
            });

            const subjectAvgDiv = document.createElement('div');
            subjectAvgDiv.innerHTML = "Average Time : " + this.subjectAverageTime + " Secs, Target Time : " + this.subjectTargetTime + " Secs";
            subjectAvgDiv.className = "timeLabels";
            subjectDiv.appendChild(subjectAvgDiv);
    }

    renderTopicGraphs() {
        const topicContainer = document.getElementById("topicChartContainer");
        this.cleanPreviousGraphs(topicContainer);

        let i = 0;
        const dlg = this.dialog;
        this.model.topicReportData.forEach(element => {
            i = i + 1;
            const topicDiv = document.createElement('div');
            topicDiv.className = 'topicchartcontainer';
            topicDiv.id = "divCtx" + i;
            topicDiv.style.padding = "3px";
            topicDiv.style.boxShadow = "3px 3px 3px 3px #888888";
            topicDiv.style.marginRight = "5px";

            const topicCanvas = document.createElement('canvas');
            topicCanvas.className = 'chartjs-render-monitor';
            topicCanvas.style.display = "block";
            topicCanvas.style.width =  "1000px";
            topicCanvas.style.height = "500px";

            topicCanvas.id = "topicGraph" + i;
            topicDiv.appendChild(topicCanvas);

            const twoDCtx = topicCanvas.getContext('2d');

            topicContainer.appendChild(topicDiv);

            const topicChartData = {
                    labels: "",
                    datasets: [{
                        label: '# of Questions',
                        data: null,
                        fill: false,
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        borderColor: 'rgba(255, 99, 132, 0.2)',
                    },
                    {
                        label: '# of Correct Questions',
                        data: null,
                        fill: false,
                        backgroundColor: 'green',
                        borderColor: 'green',
                    },
                    {
                        label: '# of In-Correct Questions',
                        data: null,
                        fill: false,
                        backgroundColor: 'red',
                        borderColor: 'red',
                    },
                    {
                        label: '# of Not Attempted Questions',
                        data: null,
                        fill: false,
                        backgroundColor: 'orange',
                        borderColor: 'orange',
                    },
                    {
                        label: '# of Wasted Attempts',
                        data: null,
                        fill: false,
                        backgroundColor: 'black',
                        borderColor: 'black',
                    },
                    {
                        label: '# of Overtime Correct Questions',
                        data: null,
                        fill: false,
                        backgroundColor: 'purple',
                        borderColor: 'purple',
                    },
                    {
                        label: '# of Overtime In-Correct Questions',
                        data: null,
                        fill: false,
                        backgroundColor: 'blue',
                        borderColor: 'blue',
                    }
                    ]
                };

            this.topicOptions.title.text = element.title;

            const topicChart = new Chart(twoDCtx, {
                type: 'line',
                data: topicChartData,
                options: this.topicOptions
            });

            topicChartData.labels = this.model.subjectReportData.startOfWeek;
            topicChartData.datasets[0].data = element.totalQuestions;
            topicChartData.datasets[1].data = element.correctQuestions;
            topicChartData.datasets[2].data = element.inCorrectQuestions;
            topicChartData.datasets[3].data = element.unAttemptedQuestions;
            topicChartData.datasets[4].data = element.wastedQuestions;
            topicChartData.datasets[5].data = element.overtimeCorrect;
            topicChartData.datasets[6].data = element.overtimeIncorrect;

            topicChartData.datasets[0].label = "# of Questions " + element.aggTotalQuestions;
            topicChartData.datasets[1].label = "# of Correct Questions " + element.aggCorrectQuestions;
            topicChartData.datasets[2].label = "# of In-Correct Questions " + element.aggInCorrectQuestions;
            topicChartData.datasets[3].label = "# of Not Attempted Questions " + element.aggUnAttemptedQuestions;
            topicChartData.datasets[4].label = "# of Wasted Attempts " + element.aggWastedQuestions;
            topicChartData.datasets[5].label = "# of Overtime Correct Questions " + element.aggOvertimeCorrectQuestions;
            topicChartData.datasets[6].label = "# of Overtime In-Correct Questions " + element.aggOvertimeInCorrectQuestions;

            topicChart.update();

            document.getElementById("topicGraph" + i).onclick = function(evt)
                {

                    dlg.open(DialogPerformanceGraphComponent, {
                        width: '70%',
                        height: '70%',
                        data: {"chartData" : topicChartData, "title": element.title, "averageTime": element.aggAverageTime, "targetTime": element.aggTargetTime}
                    });
                }
        });
    }

    cleanPreviousGraphs(ctn) {
        while (ctn.firstChild) {
            ctn.removeChild(ctn.firstChild);
        }
    }

    getSubjectReportData(id) {
        this.model.selsubject = id;
        this.showSubjectReport();
    }

    getCss(idx) {
        if(idx === 0) {
            return "active";
        }
    }

    showReport () {
        this.showSubjectReport();
    }

    calculate() {
        this.userService.executeGetRequest("performance/null").subscribe(
            res => {
                this.snackBar.open ("Performance Calculated Successfully!", "", {
                   duration: 5000
                });
            }
        );
    }

    downloadPdf() {


        let period = "";
        if(this.model.period === "CW") {
          period = "Current Week";
        } else if(this.model.period === "LW") {
          period = "Last Week";
        } else if(this.model.period === "4W") {
          period = "Last 4 Weeks";
        } else if(this.model.period === "3M") {
          period = "Last 3 Months";
        } else if(this.model.period === "6M") {
          period = "Last 6 Months";
        } else if(this.model.period === "1Y") {
          period = "Last 1 Year";
        }



        const doc = new jsPDF('landscape');
        doc.setFontSize(20);
        doc.text(15, 15, "Performance Graph for " + period);

        doc.setFontSize(15);
        doc.text(15, 30, "Subject:");

        doc.addImage(this.getImageData("subjcetGraph"), 'PNG', 15, 25, 280, 150 );

        let i = 0;
        this.model.topicReportData.forEach(element => {
          i = i + 1;
          if(element.startOfWeek.length !== 0) {
            doc.addPage();

            doc.setFontSize(15);
            doc.text(15, 30, "Topic");
            
            doc.addImage(this.getImageData("topicGraph" + i), 'PNG', 15, 45, 280, 150 );
          }

        });

        doc.save("PerformanceAnalysis.pdf");
    }

    getImageData(canvasId: any) {
      const subjectOrTopicCanvas = <HTMLCanvasElement> document.getElementById(canvasId);

      const ctx = subjectOrTopicCanvas.getContext('2d');

      const canvas = ctx.canvas;

      const imageData = canvas.toDataURL("image/png");

      return imageData;
    }
}


@Component({
  selector: 'app-dialog-performance-graph.component',
  templateUrl: 'dialog-performance-graph.component.html',
})
export class DialogPerformanceGraphComponent implements OnInit {

    subjectAverageTime = "";

    subjectTargetTime = "";

    topicOptions = {
                    legend: {
                            position: 'right',
                            display: true,
                    },
                    responsive: true,
                    maintainAspectRatio: false,
                    title: {
                        display: true,
                        text: ""
                    },
                    tooltips: {
                        mode: 'index',
                        intersect: false,
                    },
                    hover: {
                        mode: 'nearest',
                        intersect: true
                    },
                    pan: {
                        enabled: true,
                        mode: 'x',
                    },
                    zoom: {
                        enabled: true,
                        mode: 'x',
                    },
                    scales: {
                        xAxes: [{
                            display: true,
                            scaleLabel: {
                                display: true,
                                labelString: 'Period'
                            }
                        }],
                        yAxes: [{
                            display: true,
                            scaleLabel: {
                                display: true,
                                labelString: '# of Questions'
                            }
                        }]
                    }
                };

  constructor(
    public dialogRef: MatDialogRef<DialogPerformanceGraphComponent>,
    @Inject(MAT_DIALOG_DATA) public dataObject: DialogData) {


    }

    ngOnInit(): void {
        const ctx = document.getElementById("topicGraph");

        this.topicOptions.title.text = this.dataObject.title;
        this.subjectAverageTime = this.dataObject.averageTime;
        this.subjectTargetTime = this.dataObject.targetTime;

         const topicChart = new Chart(ctx, {
                type: 'line',
                data: this.dataObject.chartData,
                options: this.topicOptions
        });
    }


  onNoClick(): void {
    this.dialogRef.close();
  }

}


