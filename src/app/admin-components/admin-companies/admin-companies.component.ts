import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Chart} from "chart.js";
import {IAdminCompany} from "../../domains/admin/admin.types";
import {AdminService} from "../../domains/admin/admin.service";

@Component({
  selector: 'app-admin-companies',
  templateUrl: './admin-companies.component.html',
  styleUrls: ['./admin-companies.component.css']
})
export class AdminCompaniesComponent implements OnInit {

  @ViewChild('companiesChart') private companiesChart!: ElementRef;
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

  companies: IAdminCompany[] = [];

  dates2: string[] = [];

  endDate = new Date();

  currentDate = new Date('2022-01-01');

  activeCompanies = 0;

  bannedCompanies = 0;

  companies5: number[] = [];

  datePlaceholder = new Date('2019-12-12');

  status= "ALL";

  searchText: any;

  constructor(private adminService: AdminService) {
  }

  ngOnInit(): void {
    while (this.currentDate <= this.endDate) {
      const monthYear = this.getMonthYear(this.currentDate);
      if (!this.dates2.includes(monthYear)) {
        console.log(monthYear);
        this.dates2.push(monthYear);
        this.companies5.push(0);
      }
      this.currentDate.setDate(this.currentDate.getDate() + 1);
    }
    this.adminService.getCompanies().subscribe((data: IAdminCompany[]) => {
      this.companies = data;
      this.maxRange = this.maxValue = this.rangeMax.nativeElement.max = Math.max(...this.companies.flatMap(company => company.moneyTurnover));
      this.maxRange2 = this.maxValue2 = this.rangeMax2.nativeElement.max = Math.max(...this.companies.flatMap(company => company.sales));
      this.activeCompanies = this.companies.filter(comp => comp.banned == null).length;
      this.bannedCompanies = this.companies.length - this.activeCompanies;
      data.forEach((dat: any) => {
        this.addAmountToMonth(dat, this.companies5);
      })
      this.createNewUsersChart();
    });
  }

  get filteredCompanies() {
    return this.companies.filter(company => {
      const matchesStatus = this.status == "ALL" || (this.status == "ACTIVE" && company.banned == null) || (this.status == "BANNED" && company.banned != null);
      const matchesMoneyTurnover = company.moneyTurnover <= this.maxValue && company.moneyTurnover >= this.minValue;
      const matchesSales = company.sales <= this.maxValue2 && company.sales >= this.minValue2;

      return matchesStatus && matchesMoneyTurnover && matchesSales;
    })
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

  createNewUsersChart() {
    new Chart(this.companiesChart.nativeElement, {
      type: 'line',
      data: {
        labels: this.dates2,
        datasets: [{
          label: 'New company',
          data: this.companies5,
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
  }

  addAmountToMonth(data: IAdminCompany, list: number[]): void {
    const dateObj = new Date(data.created);
    const monthYear = this.getMonthYear(dateObj);
    const index = this.dates2.indexOf(monthYear);
    if (index !== -1) {
      list[index] += 1;
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

  banCompany(companyId: number){
    this.adminService.deleteCompany(companyId).subscribe((data: any) => {
      let find = this.companies.find(company => company.companyId == companyId);
      find!.banned = new Date();
    });
  }

  deleteCategory3(id: number) {
    let find = this.companies.find(company => company.companyId == id);

    if (find !== undefined && find.banned == undefined) {
      find.banned = this.datePlaceholder;
    }
  }

  showNormal3(id: number) {
    let find = this.companies.find(company => company.companyId == id);

    if (find !== undefined && find.banned == this.datePlaceholder) {
      find.banned = null;
    }
  }

  filterByStatus(status: string) {
    this.status = status;
  }
}
