import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Chart, registerables} from "chart.js";
import {CompanyService} from "../../domains/company/company.service";
import {ICompanyStats} from "../../domains/company/company.types";
Chart.register(...registerables)

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {

  @ViewChild('myChart1') private chartRef1!: ElementRef;

  @ViewChild('myChart2') private chartRef2!: ElementRef;

  @ViewChild('myChart3') private chartRef3!: ElementRef;

  stats: ICompanyStats = {orders: 0, income: 0, soldProducts: 0, comments: 0, commentsChange: 0, soldProductsChange: 0, incomeChange: 0, ordersChange: 0 };

  selectedTab= 4;

  startDate = new Date();

  endDate = new Date();

  startDateStr = "";

  endDateStr = "";

  color=-1;

  dates2: string[] = [];

  users5: number[] = [];

  money: number[] = [];

  datesTest: string[] = [];

  private chartInstances: Chart[] = [];

  constructor(private companyService: CompanyService) { }

  ngOnInit(): void {
    this.endDate.setFullYear(this.startDate.getFullYear()-1);
    this.endDate.setMonth(this.startDate.getMonth() + 1);
    this.endDate.setDate(1);
    this.startDateStr = this.getMonthYear(this.startDate);
    this.endDateStr = this.getMonthYear(this.endDate);
    this.companyService.getCompanyStats(this.endDate).subscribe((data: ICompanyStats)=> {
      this.stats = data;
      this.createCategoryChart();
      this.createOrdersChart();
      this.createIncomeChart();
    });

    this.getMonths();
  }

  getDatesMonth(){
    this.dates2=[];
    this.users5=[];
    this.money=[];
    this.datesTest=[];
    let actualDate = new Date();
    let endDate = new Date();
    endDate.setMonth(actualDate.getMonth() - 1);
    endDate.setDate(endDate.getDate()+1)
    while (endDate <= actualDate) {
      this.datesTest.push(endDate.getDate().toString());
      endDate.setDate(endDate.getDate() + 1);
      this.users5.push(0);
      this.money.push(0);
    }
  }

  getMonths(){
    const monthNames = [
      "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
      "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
    ];
    this.dates2=[];
    this.users5=[];
    this.money=[];
    this.datesTest=[];
    let actualDate = new Date();
    let endDate = new Date();
    endDate.setDate(1);
    endDate.setFullYear(endDate.getFullYear() - 1);
    endDate.setMonth(endDate.getMonth() + 1);
    while (endDate <= actualDate) {
      this.datesTest.push(monthNames[endDate.getMonth()]);
      endDate.setMonth(endDate.getMonth() + 1);
      this.users5.push(0);
      this.money.push(0);
    }
  }

  getAllDays(){
    const monthNames = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
    this.dates2=[];
    this.users5=[];
    this.money=[];
    this.datesTest=[];
    let actualDate = new Date();
    let endDate = new Date();
    endDate.setDate(endDate.getDate() - 6);

    while (endDate <= actualDate) {
      this.datesTest.push(monthNames[endDate.getDay()]);
      endDate.setDate(endDate.getDate() + 1);
      this.users5.push(0);
      this.money.push(0);
    }
  }

  getAllDates() {
    this.dates2=[];
    this.users5=[];
    this.money=[];
    this.datesTest=[];
    let actualDate = new Date();
    let endDate = new Date('2022-01-01');
    let month = "";
    while (endDate <= actualDate) {
      if(endDate.getMonth()+1 < 4){
        month = "1st";
      }else if (endDate.getMonth()+1 > 3 && endDate.getMonth()+1 < 7) {
        month = "2st";
      } else if (endDate.getMonth()+1 > 6 && endDate.getMonth()+1 < 10) {
        month = "3st";
      } else {
        month = "4st";
      }
      this.users5.push(0);
      this.money.push(0);
      this.datesTest.push(month + " " + endDate.getFullYear());
      endDate.setMonth(endDate.getMonth() + 3);
    }
  }


  getMonthYear(date: Date): string {
    const monthNames = [
      "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
      "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
    ];

    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    const day = date.getUTCDate();

    return `${month} ${day} ${year}`;
  }

  randomColor(number: number){
    let colors = ['#17295d','#576b36','#604242','#234444','#ad5a5a','#5e3737'];
    return colors.splice(0, number);
  }

  getMonth(date: Date): string {
    const monthNames = [
      "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
      "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
    ];

    return monthNames[date.getMonth()];
  }

  getDay(dayNum: number) {
    const monthNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

    return monthNames[dayNum];
  }

  addAmountToMonth(data: { amount: number, date: string }, list: number[]): void {
    const dateObj = new Date(data.date);
    const monthYear = this.getMonth(dateObj);
    const index = this.datesTest.indexOf(monthYear);
    if (index !== -1) {
      list[index] += data.amount;
    } else {
      console.error(`Month ${monthYear} not found in dates2 array.`);
    }
  }

  addAmountToDay(data: { amount: number, date: string }, list: number[]): void {
    const dateObj = new Date(data.date);
    const index = this.datesTest.indexOf(this.getDay(dateObj.getDay()));

    if (index !== -1) {
      list[index] += data.amount;
    } else {
      console.error(`Day not found in dates2 array.`);
    }
  }

  addAmountToDay2(data: { amount: number, date: string }, list: number[]): void {
    const dateObj = new Date(data.date);

    const index = this.datesTest.indexOf(dateObj.getDate().toString());

    if (index !== -1) {
      list[index] += data.amount;
    } else {
      console.error(`Day not found in dates2 array.`);
    }
  }

  addAmountToTimeInAYear(data: { amount: number, date: string }, list: number[]): void {
    const dateObj = new Date(data.date);

    const monthYear = this.getMonth(dateObj);

    let month: string;

    if(dateObj.getMonth()+1 < 4){
      month = "1st";
    }else if (dateObj.getMonth()+1 > 3 && dateObj.getMonth()+1 < 7) {
      month = "2st";
    } else if (dateObj.getMonth()+1 > 6 && dateObj.getMonth()+1 < 10) {
      month = "3st";
    } else {
      month = "4st";
    }

    let full = month + " " + dateObj.getFullYear();

    const index = this.datesTest.findIndex(date2 => date2 == full);

    if (index !== -1) {
      list[index] += data.amount;
    } else {
      console.error(`Month ${monthYear} not found in dates2 array.`);
    }
  }

  deleteCharts(){
    this.chartInstances.forEach(chart => {
      chart.destroy();
    });
  }

  createIncomeChart() {
    this.deleteCharts();
    this.companyService.getIncomeInTime(this.endDate).subscribe((data: any) => {
      const dataMap = new Map<string, number>(Object.entries(data));
      dataMap.forEach((value: number, key: string) => {
        let object: {amount: number, date:string} = {
          amount: value,
          date: key
        };
        if(this.selectedTab == 1){
          this.addAmountToTimeInAYear(object, this.money);
        } else if (this.selectedTab == 2){
          this.addAmountToDay(object, this.money);
        } else if (this.selectedTab == 3){
          this.addAmountToDay2(object, this.money);
        } else if (this.selectedTab == 4){
          this.addAmountToMonth(object, this.money);
        }
      });

      const myChart = new Chart(this.chartRef3.nativeElement, {
        type: 'line',
        data: {
          labels: this.datesTest,
          datasets: [{
            data: this.money,
            fill: false,
            borderColor: 'rgb(27,48,98)',
            tension: 0.4
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: false,
            }
          },
          interaction: {
            intersect: false,
          },
          elements: {
            point: {
              radius: 0
            }
          },
          scales: {
            y: {
              title: {
                display: false,
              },
              ticks: {
                stepSize: 1
              },
              display: true,
              suggestedMin: 0,
              beginAtZero: true
            },
            x: {
              title: {
                display: true,
              },
              display: true
            },
          }
        }
      });
      this.chartInstances.push(myChart);
    });
  }

  createOrdersChart() {
    this.deleteCharts();

    this.companyService.getOrdersInTime(this.endDate).subscribe((data: any) => {
      data.forEach((dat:any) => {
        if(this.selectedTab == 1){
          this.addAmountToTimeInAYear(dat, this.users5);
        } else if (this.selectedTab == 2){
          this.addAmountToDay(dat, this.users5);
        } else if (this.selectedTab == 3){
          this.addAmountToDay2(dat, this.users5);
        } else if (this.selectedTab == 4){
          this.addAmountToMonth(dat, this.users5);
        }
      });

      const myChart = new Chart(this.chartRef2.nativeElement, {
          type: 'bar',
          data: {
            labels: this.datesTest,
            datasets: [{
              data: this.users5,
              backgroundColor: 'rgb(27,48,98)',
            }]
          },
          options: {
            plugins: {
              legend: {
                display: false
              },
              title: {
                display: false,
                text: ''
              },
            },
            responsive: true,
            scales: {
              x: {
                stacked: false,
              },
              y: {
                ticks: {
                  stepSize: 1
                },
                stacked: false
              }
            }
          }
        }
      );
      this.chartInstances.push(myChart);
    });
  }

  createCategoryChart() {
    this.deleteCharts();
    this.companyService.getSalesByCategory(this.endDate).subscribe((data: any) => {
      const dataMap = new Map<string, number>(Object.entries(data));
      let keys: string[] = [];
      let values: number[] = [];
      dataMap.forEach((value: number, key: string) => {
        keys.push(key);
        values.push(value);
      });

      const myChart = new Chart(this.chartRef1.nativeElement, {
        type: 'doughnut',
        data: {
          labels: keys,
          datasets: [
            {
              data: values,
              backgroundColor: this.randomColor(keys.length),
            }
          ]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: false,
            }
          }
        },
      });
      this.chartInstances.push(myChart);
    });
  }


  selectDate(number: number) {
    let date1 = new Date();
    this.selectedTab = number;
    if(number==1){
      date1 = new Date('2022-01-01');
      this.getAllDates();
    } else if (number==2){
      date1.setDate(date1.getDate() - 7);
      this.getAllDays();
    } else if (number==3){
      date1.setMonth(date1.getMonth() - 1);
      this.getDatesMonth();
    } else if (number==4){
      date1.setFullYear(date1.getFullYear() - 1);
      date1.setMonth(date1.getMonth() + 1);
      date1.setDate(1);
      this.getMonths();
    }
    this.endDateStr = this.getMonthYear(date1);
    this.endDate = date1;
    this.createCategoryChart();
    this.createOrdersChart();
    this.createIncomeChart();
    this.companyService.getCompanyStats(date1).subscribe((data: ICompanyStats)=> {
      this.stats = data;
    });
  }

}
