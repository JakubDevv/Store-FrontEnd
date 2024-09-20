import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {CompanyService} from "../../domains/company/company.service";
import {UserService} from "../../domains/user/user.service";
import {Chart, registerables} from "chart.js";
import {
  ICompanyOrders,
  ICountryIncome,
  IProductIncome, IStatuses,
} from "../../domains/company/company.types";
import {ProductsService} from "../../domains/products/products.service";
Chart.register(...registerables)

@Component({
  selector: 'app-company-orders',
  templateUrl: './company-orders.component.html',
  styleUrls: ['./company-orders.component.css']
})
export class CompanyOrdersComponent implements OnInit {

  @ViewChild('newCustomersProgressBar') newCustomersProgressBar!: ElementRef;
  @ViewChild('rangeMax') private rangeMax!: ElementRef;

  @ViewChild('myChart8') private chartRef8!: ElementRef;
  @ViewChild('myChart9') private chartRef9!: ElementRef;
  @ViewChild('myChart10') private chartRef10!: ElementRef;
  @ViewChild('myChart11') private chartRef11!: ElementRef;
  @ViewChild('myChart12') private chartRef12!: ElementRef;
  @ViewChild('myChart13') private chartRef13!: ElementRef;
  @ViewChild('myChart14') private chartRef14!: ElementRef;

  statusesChart: Chart | undefined;
  usersChart: Chart | undefined;
  categoryChart: Chart | undefined;
  productsChart: Chart | undefined;
  allStatusesChart: Chart | undefined;

  categories: string[] = [];
  categoriesVal: number[] = [];

  productsL: string[] = [];
  productsVal: number[] = [];

  total: number = 0;

  minRange: number = 0;
  maxRange: number = 1000;
  minValue: number = 0;
  maxValue: number = 1000;
  priceGap: number = 100;

  selectedOrders: number[] = [];

  allOrders: ICompanyOrders[] = [];

  countriesList=false;
  categoriesList = false;

  pages: number = 5;
  page: number = 0;

  searchText: string = '';

  countries: ICountryIncome[] = [];

  users2: string[] = [];
  usersPrice: number[] = [];

  products: IProductIncome[] = [];
  statusChanges: IStatuses[] = [];

  activeFilters= ['COMPLETED', 'SENT', 'IN_PROGRESS'];

  countries2: string[] = [];
  countriesIncome: number[] = [];
  countriesAmount: number[] = [];

  categories2: string[] = [];

  allStatuses: number[] = [0, 0, 0];
  statuses: number[] = [0, 0, 0];
  totalIncome: number = 0;

  yearChange!: number;
  weekChange!: number;
  monthChange!: number;

  selectedCategory: string = 'all';
  selectedCountry: string = 'all';

  allCustomers= 0;
  newCustomers= 0;
  newCountries= 0;

  currentIndex: number = 0;
  visibleItemsCount: number = 4;

  countriesStats: ICountryIncome[] = [];

  selectedTotalIncome= 0;

  selectedTab= 'year';

  usersPhotos = new Map<number, any>();

  constructor(private router: Router, private companyService: CompanyService, private userService: UserService, private productsService: ProductsService) {
  }

  ngOnInit(): void {
    this.productsService.getCategories().subscribe((data: any) => {
      this.categories2 = data.flatMap((mainCategory: any) => mainCategory.subCategory.map((subCat: any) => subCat.name));
    });
    this.companyService.getOrdersUpdates().subscribe((data: any) => {
      this.statusChanges = data;
      this.statusChanges.forEach(status => {
        if(!this.usersPhotos.has(status.userId))
          this.userService.getUserPhoto2(status.userId).subscribe((data: any) => {
            this.usersPhotos.set(status.userId, this.arrayBufferToImageUrl(data));
          });
      });
    });
    this.companyService.getIncomeByCountry().subscribe((data: any) => {
      this.countriesStats = data

      this.countries2 = data.map((dat: ICountryIncome) => dat.name).sort((a: string, b: string) => {
        const nameA = a || "";
        const nameB = b || "";
        return nameA.localeCompare(nameB);
      });
      this.totalIncome = this.countriesStats.reduce((sum, item) => sum + item.money, 0);
      this.countriesIncome = data.sort((a: ICountryIncome, b: ICountryIncome) => a.name.localeCompare(b.name)).map((dat: ICountryIncome) => dat.money);
      this.countriesAmount = data.sort((a: ICountryIncome, b: ICountryIncome) => a.name.localeCompare(b.name)).map((dat: ICountryIncome) => dat.amountOfOrders);
      this.countries = data.sort((a: ICountryIncome, b: ICountryIncome) => b.money - a.money).slice(0, 5);
    });

    this.companyService.getIncomeChange().subscribe((data: any) => {
      this.monthChange = data.month;
      this.weekChange = data.week;
      this.yearChange = data.year;
    });

    this.companyService.getCompanyOrders().subscribe((data: ICompanyOrders[]) => {
      this.allOrders = data.map((order: ICompanyOrders) => ({
        ...order,
        date: new Date(order.date)
      })).sort((a: ICompanyOrders, b: ICompanyOrders) => b.date.getTime() - a.date.getTime());
      if (this.allOrders && this.allOrders.length > 0) {
        this.rangeMax.nativeElement.max = this.maxRange = this.maxValue = this.allOrders.reduce((prev, current) => (prev.price > current.price) ? prev : current).price;
      } else {
        this.rangeMax.nativeElement.max = this.maxRange = this.maxValue = 0;
      }
      this.updateOrders();
      this.allCustomers = new Set(this.allOrders.map(order => order.userId)).size;
      this.allStatuses[0] = this.allOrders.filter(order => order.status === "IN_PROGRESS").length;
      this.allStatuses[1] = this.allOrders.filter(order => order.status === "SENT").length;
      this.allStatuses[2] = this.allOrders.filter(order => order.status === "COMPLETED").length;
      this.updateChartData2(this.allStatusesChart, ['Pending', 'Sent', 'Completed'], this.allStatuses)
      this.createStatsChart();
      this.createCountryStats();
    });
    this.selectDate('year');
  }

  arrayBufferToImageUrl = (data: any) => {
    const uint8Array = new Uint8Array(data);
    const binaryString = uint8Array.reduce((acc, byte) => acc + String.fromCharCode(byte), '');
    const base64String = btoa(binaryString);
    return `data:image/jpeg;base64,${base64String}`;
  }

  get leftPercentage(): number {
    return (this.minValue / this.maxRange) * 100;
  }

  get rightPercentage(): number {
    return 100 - (this.maxValue / this.maxRange) * 100;
  }

  createCountryStats() {
    new Chart(this.chartRef12.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ['Pending','0'],
        datasets: [{
          label: 'Amount',
          data: [this.allStatuses[0], this.allOrders.length-this.allStatuses[0]],
          backgroundColor: [
            '#000000',
            '#d6ef3f'
          ],
        }]
      },
      options: {
        elements: {
          arc: {
            borderWidth: 0,
          }
        },
        cutout: '90%',
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
    new Chart(this.chartRef13.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ['Sent', '0'],
        datasets: [{
          label: 'Amount',
          data: [this.allStatuses[1], this.allOrders.length-this.allStatuses[1]],
          backgroundColor: [
            '#000000',
            '#d6ef3f'
          ]
        }]
      },
      options: {
        elements: {
          arc: {
            borderWidth: 0,
          }
        },
        cutout: '91%',
        responsive: true,
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
    new Chart(this.chartRef14.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ['Completed', '0'],
        datasets: [{
          label: 'Amount',
          data: [this.allStatuses[2], this.allOrders.length-this.allStatuses[2]],
          backgroundColor: [
            '#000000',
            '#d6ef3f'
          ]
        }]
      },
      options: {
        elements: {
          arc: {
            borderWidth: 0,
          }
        },
        cutout: '92%',
        responsive: true,
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

  updateProgressBar(newCustomers: number){
    this.newCustomersProgressBar.nativeElement.style.setProperty('--value', (newCustomers/this.allCustomers) * 100);
  }

  updateMinRange(event: any): void {
    // @ts-ignore
    if (event.target instanceof HTMLInputElement) {
      // @ts-ignore
      const target = event.target;
      const value = parseInt(target.value, 10);

      if (value <= this.maxValue - this.priceGap) {
        this.minValue = value;
      } else {
        target.value = String(this.minValue);
      }
    } else {
      // @ts-ignore
      console.error('Event target is not an HTMLInputElement', event.target);
    }
  }

  updateMaxRange(event: any): void {
    // @ts-ignore
    if (event.target instanceof HTMLInputElement) {
      // @ts-ignore
      const target = event.target;
      const value = parseInt(target.value, 10);

      if (value >= this.minValue + this.priceGap) {
        this.maxValue = value;
      } else {
        target.value = String(this.maxValue);
      }
    } else {
      // @ts-ignore
      console.error('Event target is not an HTMLInputElement', event.target);
    }
  }

  goToOrder(id: number) {
    this.router.navigate(['/companyOrder/' + id]);
  }

  updateStatusesAdd(status: string) {
    if (status == "IN_PROGRESS") {
      this.statuses[0] = ++this.statuses[0];
    } else if (status == "SENT") {
      this.statuses[1] = ++this.statuses[1];
    } else {
      this.statuses[2] = ++this.statuses[2];
    }
    this.updateChartData(this.statusesChart, this.statuses);
  }

  updateStatusesDel(status: string) {
    if (status == "IN_PROGRESS") {
      this.statuses[0] = --this.statuses[0];
    } else if (status == "SENT") {
      this.statuses[1] = --this.statuses[1];
    } else {
      this.statuses[2] = --this.statuses[2];
    }
    this.updateChartData(this.statusesChart, this.statuses);
  }

  updateChartData(chart: any, newData: number[]) {
    if (chart) {
      chart.data.datasets[0].data = newData;
      chart.update();
    }
  }

  updateChartData2(chart: any, labels: string[], newData: number[]) {
    if (chart) {
      chart.data.labels = labels;
      chart.data.datasets[0].data = newData;
      chart.update();
    }
  }

  createStatsChart() {
    this.categoryChart = new Chart(this.chartRef8.nativeElement, {
      type: 'doughnut',
      data: {
        labels: this.categories,
        datasets: [{
          label: 'Price',
          data: this.categoriesVal,
          backgroundColor: [
            '#d6ef3f',
            '#f8f8f8',
            '#3a3a3a',
            '#ff542f'
          ],
          hoverOffset: 4
        }]
      },
      options: {
        cutout: 70,
        elements: {
          arc: {
            borderWidth: 5,
          }
        },
        responsive: true,
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
    this.usersChart = new Chart(this.chartRef9.nativeElement, {
      type: 'doughnut',
      data: {
        labels: this.users2,
        datasets: [{
          label: 'Price',
          data: this.usersPrice,
          backgroundColor: [
            '#d6ef3f',
            '#f8f8f8',
            '#3a3a3a',
            '#ff542f'
          ],
          hoverOffset: 4
        }]
      },
      options: {
        cutout: 70,
        elements: {
          arc: {
            borderWidth: 5,
          }
        },
        responsive: true,
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
    this.productsChart = new Chart(this.chartRef10.nativeElement, {
      type: 'doughnut',
      data: {
        labels: this.productsL,
        datasets: [{
          label: 'Amount',
          data: this.productsVal,
          backgroundColor: [
            '#d6ef3f',
            '#f8f8f8',
            '#3a3a3a',
            '#ff542f'
          ],
          hoverOffset: 4
        }]
      },
      options: {
        cutout: 70,
        elements: {
          arc: {
            borderWidth: 5,
          }
        },
        responsive: true,
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
    this.statusesChart = new Chart(this.chartRef11.nativeElement, {
      type: 'doughnut',
      data: {
        labels: [
          'Pending',
          'Sent',
          'Completed'
        ],
        datasets: [{
          label: 'Amount',
          data: this.statuses,
          backgroundColor: [
            '#e03b30',
            '#fda23b',
            '#ffd700'
          ],
          hoverOffset: 4
        }]
      },
      options: {
        cutout: 70,
        elements: {
          arc: {
            borderWidth: 5,
          }
        },
        responsive: true,
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

  prev() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }

  next() {
    if (this.currentIndex < this.statusChanges.length - this.visibleItemsCount) {
      this.currentIndex++;
    }
  }

  updateStats(id: number, status: string, price: number, firstName: string, lastName: string) {
    if (this.selectedOrders.includes(id)) {
      this.updatePriceByUserDel(price, firstName, lastName);
      this.updateStatusesDel(status);
      let order = this.orders.find(order => order.id === id);
      order?.categories.forEach(category => {
        this.updatePriceByCategoryDel(category.name, category.price);
        category.products.forEach(product => {
          this.updateProductAmountDel(product.amount, product.name);
        })
      });
      this.selectedOrders.splice(this.selectedOrders.indexOf(id, 0), 1);
    } else {
      this.updatePriceByUserAdd(price, firstName, lastName);
      this.updateStatusesAdd(status);
      let order = this.orders.find(order => order.id === id);
      order?.categories.forEach(category => {
        this.updatePriceByCategoryAdd(category.name, category.price);
        category.products.forEach(product => {
          this.updateProductAmountAdd(product.amount, product.name);
        })
      });
      this.selectedOrders.push(id);
    }
    this.selectedTotalIncome = this.categoriesVal.reduce((sum, item) => sum + item, 0);
  }

  private updatePriceByUserAdd(price: number, firstName: string, lastName: string) {
    const fullName = firstName + " " + lastName;
    this.total += price;
    if (this.users2.includes(fullName)) {
      this.usersPrice[this.users2.indexOf(fullName, 0)] = this.usersPrice[this.users2.indexOf(fullName, 0)] + price;
    } else {
      this.users2.push(fullName);
      this.usersPrice.push(price);
    }
    this.updateChartData2(this.usersChart, this.users2, this.usersPrice);
  }

  private updatePriceByUserDel(price: number, firstName: string, lastName: string) {
    const fullName = firstName + " " + lastName;
    this.total -= price;
    this.usersPrice[this.users2.indexOf(fullName, 0)] = this.usersPrice[this.users2.indexOf(fullName, 0)] - price;
    if (this.usersPrice[this.users2.indexOf(fullName, 0)] == 0) {
      this.usersPrice.splice(this.users2.indexOf(fullName, 0), 1);
      this.users2.splice(this.users2.indexOf(fullName, 0), 1);
    }
    this.updateChartData2(this.usersChart, this.users2, this.usersPrice);
  }

  private updateProductAmountAdd(amount: number, product: string) {
    if (this.productsL.includes(product)) {
      this.productsVal[this.productsL.indexOf(product, 0)] = this.productsVal[this.productsL.indexOf(product, 0)] + amount;
    } else {
      this.productsL.push(product);
      this.productsVal.push(amount);
    }
    this.updateChartData2(this.productsChart, this.productsL, this.productsVal);
  }

  private updateProductAmountDel(amount: number, product: string) {
    this.productsVal[this.productsL.indexOf(product, 0)] = this.productsVal[this.productsL.indexOf(product, 0)] - amount;
    if (this.productsVal[this.productsL.indexOf(product, 0)] == 0) {
      this.productsVal.splice(this.productsL.indexOf(product, 0), 1);
      this.productsL.splice(this.productsL.indexOf(product, 0), 1);
    }
    this.updateChartData2(this.productsChart, this.productsL, this.productsVal);
  }

  private updatePriceByCategoryAdd(category: string, amount: number) {
    if (this.categories.includes(category)) {
      this.categoriesVal[this.categories.indexOf(category, 0)] = this.categoriesVal[this.categories.indexOf(category, 0)] + amount;
    } else {
      this.categories.push(category);
      this.categoriesVal.push(amount);
    }
    this.updateChartData2(this.categoryChart, this.categories, this.categoriesVal);
  }

  private updatePriceByCategoryDel(category: string, amount: number) {
    this.categoriesVal[this.categories.indexOf(category, 0)] = this.categoriesVal[this.categories.indexOf(category, 0)] - amount;
    if (this.categoriesVal[this.categories.indexOf(category, 0)] == 0) {
      this.categoriesVal.splice(this.categories.indexOf(category, 0), 1);
      this.categories.splice(this.categories.indexOf(category, 0), 1);
    }
    this.updateChartData2(this.categoryChart, this.categories, this.categoriesVal);
  }

  changePage(number: number) {
    this.page = number;
  }

  get orders() {
    let filteredOrders = this.allOrders.filter(order => {
      const matchesSearchText =
        order.firstName.toLowerCase().includes(this.searchText.toLowerCase()) ||
        order.lastName.toLowerCase().includes(this.searchText.toLowerCase());

      const matchesPriceRange = order.price <= this.maxValue && order.price >= this.minValue;
      const matchesCountry = this.selectedCountry === 'all' || order.country === this.selectedCountry;
      const matchesCategory = this.selectedCategory === 'all' || order.categories.some(category => category.name === this.selectedCategory);
      const matchesStatus = this.activeFilters.includes(order.status);
      return matchesSearchText && matchesPriceRange && matchesCountry && matchesCategory && matchesStatus;
    });
    this.pages = Math.ceil(filteredOrders.length / 9);
    return filteredOrders.slice(this.page * 9, this.page * 9 + 9)
  }

  updateOrders() {
    this.pages = Math.ceil(this.allOrders.length / 9);
    this.changePage(this.page);
  }

  selectCountry(country: string) {
    this.selectedCountry = country;
    this.countriesList=false;
  }

  selectCategory(category: string) {
    this.selectedCategory = category;
    this.countriesList=false;
  }

  protected readonly Array = Array;

  selectStatus(status: string) {
    if(this.activeFilters.includes(status) && this.activeFilters.length > 1){
      let index = this.activeFilters.findIndex(filter => filter == status);
      this.activeFilters.splice(index, 1);
    } else {
      this.activeFilters.push(status);
    }
  }

  selectDate(time: string) {
    let actualDate = new Date();
    this.selectedTab = time;
    if(time=='week'){
      actualDate.setDate(actualDate.getDate() - 7);
    } else if (time=='month'){
      actualDate.setMonth(actualDate.getMonth() - 1);
    } else if (time=='year'){
      actualDate.setFullYear(actualDate.getFullYear() - 1);
    }
    this.companyService.getCompanyNewCustomers(actualDate).subscribe((data: any)=> {
      this.newCustomers = data.customers;
      this.updateProgressBar(this.newCustomers);
      this.newCountries = data.countries;
    });
  }

  protected readonly Math = Math;
}
