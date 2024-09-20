import {AfterContentInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Chart, registerables} from "chart.js";
import {IUser, IUserStats, IUserStats2} from "../../domains/user/user.types";
import {UserService} from "../../domains/user/user.service";
import {StatsService} from "../../domains/stats/stats.service";
import {ITransaction} from "../../domains/auth/auth.types";
import {AuthService} from "../../domains/auth/auth.service";
Chart.register(...registerables)

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit, AfterContentInit {

  transactions: ITransaction[] = [];

  stats: IUserStats = { spending: [], avgMonthlySpend: 0, last6MonthTotal: 0, lastYearTotal: 0, expenseByCategory: []};

  months: string[] = [];

  selectedId = 0;

  user: IUser = {
    firstName: "",
    lastName: "",
    username: "",
    createdAt: new Date(),
    roles: [],
    companyName: "",
    balance: 0 };

  filters: string[]=["Year", "Month", "Week"];

  activeFilter: string="Year";

  companyName="";

  stat: IUserStats2 = { spent: 0, spentChange: 0, income: 0, incomeChange: 0, amountOfTransactions: 0, amountOfTransactionsChange: 0 };

  income = [0, 0, 0, 0, 0, 0];
  spent= [0, 0, 0, 0, 0, 0];

  @ViewChild('myChart2') private chartRef2!: ElementRef;
  @ViewChild('myChart4') private chartRef4!: ElementRef;
  @ViewChild('myChart5') private chartRef5!: ElementRef;
  @ViewChild('myChart6') private chartRef6!: ElementRef;

  constructor(private userService: UserService, private statsService: StatsService, private authService: AuthService) {}

  ngAfterContentInit(): void {
    this.createChart();
  }

  ngOnInit(): void {
    this.changeTime();
    this.getMonths();
    this.authService.getTransactions().subscribe((data: ITransaction[]) => {
      this.transactions = data;
      this.createChart();
    });
    this.userService.getUser().subscribe((data: IUser)=> {
      this.user = data;
    });
    this.userService.getUserPhoto().subscribe((data: ArrayBuffer) => { this.updateProfilePicture2(data) });
  }

  addValue(date: Date, val: number, list: number[]) {
    let monthNum = new Date(date).getMonth();
    let month = this.getMonthByNumb(monthNum);
    let find = this.months.findIndex(monthh => monthh == month);
    if(find > -1) {
      list[find] += val;
    }
    return list;
  }

  getMonthByNumb(num: number) {
    const monthNames = [
      "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
      "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
    ];

    return monthNames[num];
  }

  getMonths(){
    let actualDate = new Date();
    let endDate = new Date();
    endDate.setMonth(endDate.getMonth() - 5);
    while (endDate <= actualDate) {
      this.months.push(this.getMonthByNumb(endDate.getMonth()));
      endDate.setMonth(endDate.getMonth() + 1);
    }
  }

  createChart() {
    this.statsService.getUserStats().subscribe((data: any) => {
      this.stats = data;
      if(data.expenseByCategory[0] !== undefined) {
        new Chart(this.chartRef4.nativeElement, {
          type: 'doughnut',
          data: {
            datasets: [
              {
                data: [100 - data.expenseByCategory[0].percentage, data.expenseByCategory[0].percentage],
                backgroundColor: ["#FFFFFF", "#000000"],
              }
            ]
          },
          options: {
            responsive: true,
            cutout: 28,
            elements: {
              arc: {
                borderWidth: 0,
              }
            },
            plugins: {
              legend: {
                display: false,
              },
              title: {
                display: false,
              }
            }
          },
        });
      }

      if(data.expenseByCategory[1] !== undefined)
        new Chart(this.chartRef5.nativeElement, {
          type: 'doughnut',
          data: {
            datasets: [
              {
                data: [100 - data.expenseByCategory[1].percentage, data.expenseByCategory[1].percentage],
                backgroundColor: ["#FFFFFF", "#000000"],
              }
            ]
          },
          options: {
            responsive: true,
            cutout: 28,
            elements: {
              arc: {
                borderWidth: 0,
              }
            },
            plugins: {
              legend: {
                display: false,
              },
              title: {
                display: false,
              }
            }
          },
        });
      if(data.expenseByCategory[2] !== undefined)
        new Chart(this.chartRef6.nativeElement, {
          type: 'doughnut',
          data: {
            datasets: [
              {
                data: [100 - data.expenseByCategory[2].percentage, data.expenseByCategory[2].percentage],
                backgroundColor: ["#ffffff", "#000000"],
              }
            ]
          },
          options: {
            responsive: true,
            cutout: 28,
            elements: {
              arc: {
                borderWidth: 0,
              }
            },
            plugins: {
              legend: {
                display: false,
              },
              title: {
                display: false,
              }
            }
          },
        });
      data.spending.forEach((sp: any) => {
        this.income = this.addValue(sp.date, sp.amount, this.income);
      })
      data.expenses.forEach((sp: any) => {
        this.spent = this.addValue(sp.date, sp.amount, this.spent);
      })
      new Chart(this.chartRef2.nativeElement, {
          type: 'line',
          data: {
            labels: this.months,
            datasets: [{
              data: this.income,
              tension: 0.2,
              borderColor: 'rgb(112,6,6)',
            },
            {
              data: this.spent,
              tension: 0.2,
              borderColor: 'rgb(27,48,98)',
            }]
          },
          options: {
            plugins: {
              legend: {
                display: false
              },
              title: {
                display: false,
              },
            },
            responsive: true,
            scales: {
              x: {
                stacked: false,
              },
              y: {
                suggestedMin: 0,
                beginAtZero: true,
                stacked: false
              }
            }
          }
        }
      );
    });

  }

  createCompanyFunc() {
    if(this.companyName.length > 0)
      this.authService.createCompany(this.companyName).subscribe(()=>{
        this.user.companyName = this.companyName;
      });
  }

  changeImage() {
    let files = (<HTMLInputElement> document.getElementById("profilePic")).files;
    if(files){
      this.userService.updateUserPhoto(files[0]).subscribe(()=>{
        if(files){
          this.updateProfilePicture(files[0]);
        }
      });
    }
  }

  updateProfilePicture(file: File): void {
    const reader = new FileReader();
    reader.onload = (event: any) => {
      const profilePictureElement = document.getElementById('profilePicture') as HTMLImageElement;
      if (profilePictureElement) {
        profilePictureElement.src = event.target.result;
      }
    };
    reader.readAsDataURL(file);
  }

  updateProfilePicture2(imageData: ArrayBuffer): void {
    const blob = new Blob([imageData], { type: 'image/png' });
    const imageUrl = URL.createObjectURL(blob);

    const profilePictureElement = document.getElementById('profilePicture') as HTMLImageElement;
    if (profilePictureElement) {
      profilePictureElement.src = imageUrl;
    }
  }

  changeTime() {
    const currentIndex: number = this.filters.indexOf(this.activeFilter);
    const nextIndex: number = (currentIndex + 1) % this.filters.length;
    this.activeFilter = this.filters[nextIndex];
    let date = new Date();
    if(this.activeFilter == "Week"){
      date.setDate(new Date().getDate()-7);
    }else if(this.activeFilter == "Month"){
      date.setMonth(new Date().getMonth()-1);
    }else if(this.activeFilter == "Year"){
      date.setFullYear(new Date().getFullYear()-1);
    }
    this.userService.getTransactionStats(date).subscribe((data: any) => {
      this.stat = data;
    });
  }

}
