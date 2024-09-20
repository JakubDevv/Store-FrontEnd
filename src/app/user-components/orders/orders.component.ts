import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {UserService} from "../../domains/user/user.service";
import {IUserOrder2} from "../../domains/user/user.types";
import {ProductsService} from "../../domains/products/products.service";

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {

  @ViewChild('rangeMax') private rangeMax!: ElementRef;

  minRange: number = 0;
  maxRange: number = 1000;
  minValue: number = 0;
  maxValue: number = 1000;
  priceGap: number = 100;

  companies: string[] = [];
  products: string[] = [];
  sizes: string[] =[]

  allOrders: IUserOrder2[] = [];

  openedFilters: string[] = [];

  orderId!: number;

  quantity: number = 0;

  price!: number;

  selectedStatus= "ALL";
  selectedCompany= "ALL";
  selectedProduct= "ALL";
  selectedSize= "ALL";

  category = "ALL";

  productsAmount=0;
  searchText: any;
  productPhotos =  new Map<number, any>;

  constructor(private userService: UserService, private productsService: ProductsService) {}

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

  ngOnInit(): void {
    this.userService.getUserOrders().subscribe((data: any) => {
      let companySet = new Set<string>();
      let productsSet = new Set<string>();
      let sizesSet = new Set<string>();
      this.allOrders = data;
      this.allOrders.forEach(order => {
        order.companies.forEach(company => {
          companySet.add(company);
        });
        order.items.forEach(item => {
          productsSet.add(item.title);
          sizesSet.add(item.size.toUpperCase());
        })
      });
      this.productsAmount = this.allOrders
        .flatMap(order => order.items)
        .reduce((sum, item) => sum + item.quantity, 0);
      this.allOrders
        .flatMap(order => order.items)
        .flatMap(item => item.productId)
        .forEach(id => {
          if(!this.productPhotos.has(id)){
            this.productsService.getProductPhoto(id).subscribe((data: any) => {
              this.productPhotos.set(id, this.arrayBufferToImageUrl(data));
            })
          }
        })
      this.rangeMax.nativeElement.max = this.maxRange = this.maxValue = this.allOrders.reduce((prev, current) => (prev.price > current.price) ? prev : current).price;
      this.companies = Array.from(companySet).sort((a: any, b: any) => a.localeCompare(b));
      this.products = Array.from(productsSet).sort((a: any, b: any) => a.localeCompare(b));
      this.sizes = Array.from(sizesSet).sort((a: any, b: any) => a.localeCompare(b));
    });
  }

  arrayBufferToImageUrl = (data: any) => {
    const uint8Array = new Uint8Array(data);
    const binaryString = uint8Array.reduce((acc, byte) => acc + String.fromCharCode(byte), '');
    const base64String = btoa(binaryString);
    return `data:image/jpeg;base64,${base64String}`;
  }

  uniqueProducts(order: IUserOrder2){
    return [...new Set(order.items.flatMap(item => item.productId))].slice(0, 3);
  }

  showFilters(key: string) {
    let number1 = this.openedFilters.indexOf(key);
    if(number1 > -1){
      this.openedFilters.splice(number1, 1);
    }else {
      this.openedFilters.push(key);
    }
  }

  completeOrder(id: number) {
    this.userService.completeOrder(id).subscribe((data: any) => {
      let order = this.orders.find(order => order.id == id);
      let order2 = this.allOrders.find(order => order.id == id);
      if(order){
        order.dateReceipt = new Date();
        order.status = 'COMPLETED';
      }
      if(order2){
        order2.dateReceipt = new Date();
        order2.status = 'COMPLETED';
      }
    });
  }

  filterByProduct(product: string) {
    this.selectedProduct = product;
  }

  filterBySize(size: string) {
    this.selectedSize = size;
  }

  filterByCompany(company: string) {
    this.selectedCompany = company;
  }

  filterByStatus(status: string) {
    this.selectedStatus = status;
  }

  get orders() {
    return this.allOrders.filter(order => {
      const matchesPrice = order.price <= this.maxValue && order.price >= this.minValue;
      const matchesProduct = this.selectedProduct == "ALL" || order.items.some(item => item.title == this.selectedProduct);
      const matchesSize = this.selectedSize == "ALL" || order.items.some(item => item.size == this.selectedSize);
      const matchesCompany = this.selectedCompany == "ALL" || order.items.some(item => item.companyName == this.selectedCompany);
      const matchesStatus = this.selectedStatus == "ALL" || order.status == this.selectedStatus;

      return matchesPrice && matchesProduct && matchesSize && matchesCompany && matchesStatus;
    })
  }

}
