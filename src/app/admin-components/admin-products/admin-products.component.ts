import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {Chart} from "chart.js";
import {Router} from "@angular/router";
import {AdminService} from "../../domains/admin/admin.service";
import {ProductsService} from "../../domains/products/products.service";
import {IAdminProduct, IAdminProducts} from "../../domains/admin/admin.types";

@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css']
})
export class AdminProductsComponent implements AfterViewInit {

  @ViewChild('productsChart') private productsChart!: ElementRef;

  @ViewChild('salesChart') private salesChart!: ElementRef;
  @ViewChild('rangeMax') private rangeMax!: ElementRef;
  @ViewChild('rangeMax2') private rangeMax2!: ElementRef;

  minRange: number = 0;
  maxRange: number = 100;
  minValue: number = 0;
  maxValue: number = 100;
  priceGap: number = 1;

  minRange2: number = 0;
  maxRange2: number = 1;
  minValue2: number = 0;
  maxValue2: number = 1;
  priceGap2: number = 1;

  endDate = new Date();
  currentDate = new Date('2022-01-01');

  productId = 0;

  products: IAdminProducts[] = [];

  products2: IAdminProducts[] = [];

  retiredProducts = 0;

  activeProducts = 0;

  product2!: IAdminProduct;

  sales = 0;

  category: string = "ALL";

  status: string = "ALL";

  company: string = "ALL";

  categories: string[] = [];

  companies: string[] = [];

  newProducts2: number[] =[];

  sales2: number[] =[];

  dates2: string[] = [];

  selectedTab = "ALL";

  searchText: any;

  constructor(private router: Router, private adminService: AdminService, private productsService: ProductsService) {
  }

  ngAfterViewInit() {
    while (this.currentDate <= this.endDate) {
      const monthYear = this.getMonthYear(this.currentDate);
      if (!this.dates2.includes(monthYear)) {
        this.dates2.push(monthYear);
        this.newProducts2.push(0);
        this.sales2.push(0);
      }
      this.currentDate.setDate(this.currentDate.getDate() + 1);
    }
    this.adminService.getProducts().subscribe((data: IAdminProducts[]) => {
      this.products = data;
      this.companies = [...new Set(this.products.flatMap(product => product.companyName))];
      this.categories = [...new Set(this.products.flatMap(product => product.subCategory))];
      this.maxRange = this.maxValue = this.rangeMax.nativeElement.max = Math.max(...this.products.flatMap(product => product.actualPrice));
      this.maxRange2 = this.maxValue2 = this.rangeMax2.nativeElement.max = Math.max(...this.products.flatMap(product => product.sales));
      this.sales = this.products.reduce((sum, product) => sum + product.sales, 0);
      this.activeProducts = this.products.filter(prod => !prod.suspended).length;
      this.retiredProducts = this.products.length - this.activeProducts;
    });
    this.createProductsChart();
    this.createSalesChart();
  }

  get getActiveProducts() {
    return this.products.filter(product => !product.suspended).length;
  }

  get getRetiredProducts() {
    return this.products.filter(product => product.suspended).length;
  }

  get filteredProducts() {
    return this.products.filter(product => {
      const matchesStatus = this.status == "ALL" || (this.status == "ACTIVE" && !product.suspended) || (this.status == "RETIRED" && product.suspended);
      const matchesCompany = this.company == "ALL" || this.company == product.companyName;
      const matchesCategory = this.category == "ALL" || this.category == product.subCategory;
      const matchesPrice = product.actualPrice <= this.maxValue && product.actualPrice >= this.minValue;
      const matchesItems = product.sales <= this.maxValue2 && product.sales >= this.minValue2;

      return matchesStatus && matchesCompany && matchesCategory && matchesPrice && matchesItems;
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

  // changePage(page: number) {
  //   if (this.pages > page && page > -1) {
  //     if(this.selectedTab == "ALL"){
  //       this.products2 = this.products.slice(page * 15, 15 * (page + 1));
  //     } if(this.selectedTab == "Retired"){
  //       this.products2 = this.products.filter(product=> product.suspended).slice(page * 15, 15 * (page + 1));
  //     } if(this.selectedTab == "Active"){
  //       this.products2 = this.products.filter(product=> product.suspended == null).slice(page * 15, 15 * (page + 1));
  //     }
  //     this.activePage = page;
  //   }
  // }

  createProductsChart(){
    this.adminService.getProductsInTime().subscribe((data: any) => {
      data.forEach((dat:any) => {
        this.addAmountToMonth(dat, this.newProducts2);
      });
      const myChart = new Chart(this.productsChart.nativeElement, {
        type: 'line',
        data: {
          labels: this.dates2,
          datasets: [{
            label: 'New products',
            data: this.newProducts2,
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

  createSalesChart(){
    this.adminService.getSalesInTime().subscribe((data: any) => {
      data.forEach((dat:any) => {
        this.addAmountToMonth(dat, this.sales2);
      });
      const myChart = new Chart(this.salesChart.nativeElement, {
        type: 'line',
        data: {
          labels: this.dates2,
          datasets: [{
            label: 'New products',
            data: this.sales2,
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

  showProduct(productId: number) {
    this.adminService.getProduct(productId).subscribe((data: IAdminProduct) => {
      this.product2 = data;
    });
    this.productsService.getProductPhoto(productId).subscribe((data: any) => {
      this.updateProfilePicture(productId, data);
    });
    this.productId = productId;
  }

  protected readonly close = close;

  closeProduct() {
    this.productId=0;
    this.createSalesChart();
    this.createProductsChart();
  }

  retireProduct(id: number) {
    this.adminService.retireProduct(id).subscribe(() => {
      this.product2.deleted! = new Date();
      let product = this.products.find(product => product.id == id);
      product!.suspended = true;
      let product2 = this.products2.find(product => product.id == id);
      product2!.suspended = true;
      if(this.selectedTab == 'Active'){
        // this.products2 = this.products.filter(product=> product.suspended == null);
        // this.pages = Math.ceil(this.products2.length / 15);
        // this.products2 = this.products.filter(product=> product.suspended == null).slice(this.activePage * 15, 15 * (this.activePage + 1));
      }
    });
  }

  viewOrder(id: number) {
    this.router.navigate(['/admin/order/' + id]);
  }

  updateProfilePicture(productId: number, imageData: ArrayBuffer): void {
    const blob = new Blob([imageData], { type: 'image/png' });
    let element = (<HTMLInputElement> document.getElementById(productId.toString()));
    element.src = URL.createObjectURL(blob);
  }

  filterByCategory(category: string) {
    this.category = category;
  }


  filterByCompany(company: string) {
    this.company = company;
  }

  filterByStatus(status: string) {
    this.status = status;
  }
}
