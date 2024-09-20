import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {Chart} from "chart.js";
import {AdminService} from "../../domains/admin/admin.service";
import {IAdminOrders} from "../../domains/admin/admin.types";

@Component({
  selector: 'app-admin-orders',
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.css']
})
export class AdminOrdersComponent implements OnInit {

  @ViewChild('ordersChart') private ordersChart!: ElementRef;
  @ViewChild('rangeMax') private rangeMax!: ElementRef;
  @ViewChild('rangeMax2') private rangeMax2!: ElementRef;

  minRange: number = 0;
  maxRange: number = 1;
  minValue: number = 0;
  maxValue: number = 1;
  priceGap: number = 100;

  minRange2: number = 0;
  maxRange2: number = 1;
  minValue2: number = 0;
  maxValue2: number = 1;
  priceGap2: number = 1;

  dates2: string[] = [];

  users5: number[] = [];

  orders: IAdminOrders[] = [];

  countries: string[] = [];

  country = "ALL";

  status= "ALL";

  SentOrders=0;

  CompletedOrders=0;

  InProgressOrders=0;

  searchText: any;

  constructor(private router: Router, private adminService: AdminService) { }

  ngOnInit(): void {
    let currentDate = new Date('2022-01-01');
    let endDate = new Date();
    while (currentDate <= endDate) {
      const monthYear = this.getMonthYear(currentDate);
      if (!this.dates2.includes(monthYear)) {
        this.dates2.push(monthYear);
        this.users5.push(0);
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    this.adminService.getOrders().subscribe((data: IAdminOrders[]) => {
      this.orders = data;
      this.maxValue2 = this.rangeMax2.nativeElement.max = this.maxRange2 = Math.max(...this.orders.flatMap(order => order.items));
      this.maxValue = this.rangeMax.nativeElement.max = this.maxRange = Math.max(...this.orders.flatMap(order => order.price));
      this.InProgressOrders = this.orders.filter(order=> order.status === "IN_PROGRESS").length;
      this.CompletedOrders = this.orders.filter(order=> order.status === "COMPLETED").length;
      this.SentOrders = this.orders.filter(order=> order.status === "SENT").length;
      this.countries = [...new Set(this.orders.flatMap(order => order.country).sort((a: string, b: string) => a.localeCompare(b)))];
    });
    this.createGetOrdersChart();
  }

  get filteredOrders() {
    return this.orders.filter(order => {
      const matchesCountry = this.country === "ALL" || this.country === order.country;
      const matchesStatus = this.status === "ALL" || this.status === order.status;
      const matchesPrice = order.price <= this.maxValue && order.price >= this.minValue;
      const matchesItems = order.items <= this.maxValue2 && order.items >= this.minValue2;

      return matchesCountry && matchesStatus && matchesPrice && matchesItems;
    });
  }

  get leftPercentage(): number {
    return (this.minValue / this.maxRange) * 100;
  }

  get rightPercentage(): number {
    return 100 - (this.maxValue / this.maxRange) * 100;
  }

  updateMinRange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const value = parseInt(target.value, 10);

    if (value <= this.maxValue - this.priceGap) {
      this.minValue = value;
    } else {
      target.value = String(this.minValue);
    }
  }

  updateMaxRange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const value = parseInt(target.value, 10);

    if (value >= this.minValue + this.priceGap) {
      this.maxValue = value;
    } else {
      target.value = String(this.maxValue);
    }
  }

  get leftPercentage2(): number {
    return (this.minValue2 / this.maxRange2) * 100;
  }

  get rightPercentage2(): number {
    return 100 - (this.maxValue2 / this.maxRange2) * 100;
  }

  updateMinRange2(event: Event): void {
    const target = event.target as HTMLInputElement;
    const value = parseInt(target.value, 10);

    if (value <= this.maxValue2 - this.priceGap2) {
      this.minValue2 = value;
    } else {
      target.value = String(this.minValue2);
    }
  }

  updateMaxRange2(event: Event): void {
    const target = event.target as HTMLInputElement;
    const value = parseInt(target.value, 10);

    if (value >= this.minValue2 + this.priceGap2) {
      this.maxValue2 = value;
    } else {
      target.value = String(this.maxValue2);
    }
  }

  addAmountToMonth(data: { amount: number, date: string }, list: number[]): void {
    const dateObj = new Date(data.date);
    const monthYear = this.getMonthYear(dateObj);
    const index = this.dates2.indexOf(monthYear);

    if (index !== -1) {
      list[index] += data.amount;
    } else {
      console.error(`Month ${monthYear} not found in dates array.`);
    }
  }

  getMonthYear(date: Date): string {
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();

    return `${month} ${year}`;
  }

  createGetOrdersChart() {
    this.adminService.getOrdersInTime().subscribe((data: any) => {
      data.forEach((dat:any) => {
        this.addAmountToMonth(dat, this.users5);
      });
      new Chart(this.ordersChart.nativeElement, {
        type: 'line',
        data: {
          labels: this.users5,
          datasets: [{
            label: "New orders",
            data: this.users5,
            fill: false,
            borderColor: 'rgb(27,48,98)',
          }
          ],
        },
        options: {
          elements: {
            point: {
              radius: 0
            }
          },
          plugins: {
            legend: {
              display: false,
            }
          },
          scales: {
            y: {
              display: false,
              title: {
                display: false,
              },
              ticks: {
                stepSize: 1
              }
            },
            x: {
              display: false
            },
          }
        }
      });
    });
  }

  goToOrder(id: number) {
    this.router.navigate(['admin/order/'+id]);
  }

  filterByStatus(status: string) {
    this.status = status;
  }

  filterByCountry(country: string) {
    this.country = country;
  }
}

