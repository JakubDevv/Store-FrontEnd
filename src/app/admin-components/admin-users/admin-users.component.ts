import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Chart, registerables} from "chart.js";
import {Router} from "@angular/router";
import {AdminService} from "../../domains/admin/admin.service";
import {ProductsService} from "../../domains/products/products.service";
import {IAdminUser, IAdminUsers} from "../../domains/admin/admin.types";
Chart.register(...registerables)

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css']
})
export class AdminUsersComponent implements OnInit {

  @ViewChild('usersChart') private usersChart!: ElementRef;
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
  priceGap2: number = 100;

  user!: IAdminUser;

  userid=0;

  users: IAdminUsers[] = [];

  dates2: string[] = [];

  endDate = new Date();
  currentDate = new Date('2022-01-01');

  users5: number[] = [];

  userSelect=false;

  bannedUsers=0;

  activeUsers=0;

  status = 'ALL';

  company = false;

  searchText: any;

  constructor(private router: Router, private adminService: AdminService, private productsService: ProductsService) { }

  ngOnInit(): void {
    while (this.currentDate <= this.endDate) {
      const monthYear = this.getMonthYear(this.currentDate);
      if (!this.dates2.includes(monthYear)) {
        this.dates2.push(monthYear);
        this.users5.push(0);
      }
      this.currentDate.setDate(this.currentDate.getDate() + 1);
    }
    this.adminService.getUsers().subscribe((data: any) => {
      this.users = data;
      this.maxRange = this.maxValue = this.rangeMax.nativeElement.max = Math.max(...this.users.flatMap(user => user.balance));
      this.maxRange2 = this.maxValue2 = this.rangeMax2.nativeElement.max = Math.max(...this.users.flatMap(user => user.moneyTurnover));
      this.activeUsers = this.users.filter(user => user.banned == null).length;
      this.bannedUsers = this.users.length - this.activeUsers;
      this.filteredUsers.filter(user => user.photo).forEach((user) => {
        this.productsService.getUserPhoto(user.id).subscribe((data: any) => {
          this.setPicture(user.id.toString(), data);
        });
      });
    });
    this.createNewUsersChart();
  }


  get filteredUsers() {
    return this.users.filter(user => {
      const matchesStatus = this.status == "ALL" || (this.status == "ACTIVE" && user.banned == null) || (this.status == "RETIRED" && user.banned != null);
      const matchesCompany = !this.company || this.company && user.company_name != null;
      const matchesBalance = user.balance <= this.maxValue && user.balance >= this.minValue;
      const matchesMoneyTurnover = user.moneyTurnover <= this.maxValue2 && user.moneyTurnover >= this.minValue2;

      return matchesStatus && matchesCompany && matchesBalance && matchesMoneyTurnover;
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

  getUser(userId: number){
    this.userSelect=true;
    this.userid = userId;
    this.adminService.getUser(userId).subscribe((data: any) => {
      this.user = data;
      if(this.user.photo){
        this.productsService.getUserPhoto(userId).subscribe((data: any) => {
          this.setPicture("profile", data);
        });
      }else {
        let element = (<HTMLInputElement>document.getElementById("profile"));
        element.src="assets/img/default-profile-pic.png";
      }
    });

  }

  addAmountToMonth(data: { amount: number, date: string }, list: number[]): void {
    const dateObj = new Date(data.date);
    const monthYear = this.getMonthYear(dateObj);
    const index = this.dates2.indexOf(monthYear);

    if (index !== -1) {
      list[index] += data.amount;
    } else {
      console.error(`Month ${monthYear} not found in dates2 array.`);
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

  setPicture(productId: string, imageData: ArrayBuffer): void {
    const blob = new Blob([imageData], {type: 'image/png'});
    let element = (<HTMLInputElement>document.getElementById(productId.toString()));
    element.src = URL.createObjectURL(blob);
  }

  createNewUsersChart() {
    this.adminService.getUsersInTime().subscribe((data: any) => {
      Object.keys(data).map(key => (this.addAmountToMonth({ amount: data[key], date: key }, this.users5)))
      new Chart(this.usersChart.nativeElement, {
        type: 'line',
        data: {
          labels: this.dates2,
          datasets: [{
            label: 'New users',
            data: this.users5,
            fill: false,
            borderColor: 'rgb(27,48,98)',
          }]
        },
        options: {
          plugins: {
            legend: {
              display: false,
            }
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
              display: false
            },
            x: {
              title: {
                display: false,
              },
              display: false
            },
          }
        }
      });
    });
  }

  blockUser(id: number) {
    this.adminService.deleteUser(id).subscribe(() => {
      this.user.banned = new Date();
      let user = this.users.find(user => user.id == id);
      user!.banned = new Date();
    });
  }

  closeUser() {
    this.userSelect = false;
    this.createNewUsersChart();
  }

  viewOrder(id: number) {
    this.router.navigate(['/admin/order/' + id]);
  }

  filterByStatus(status: string) {
    this.status = status;
  }
}

