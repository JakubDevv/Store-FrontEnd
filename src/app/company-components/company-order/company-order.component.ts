import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {CompanyService} from "../../domains/company/company.service";
import {ProductsService} from "../../domains/products/products.service";
import {ICompanyOrder, ICompanyOrderProduct} from "../../domains/company/company.types";

@Component({
  selector: 'app-company-order',
  templateUrl: './company-order.component.html',
  styleUrls: ['./company-order.component.css']
})
export class CompanyOrderComponent implements OnInit {

  order!: ICompanyOrder;

  price: number = 0;

  quantity: number = 0;
  constructor(private route: ActivatedRoute, private companyService: CompanyService, private productsService: ProductsService) { }

  ngOnInit(): void {
    let id = this.route.snapshot.paramMap.get('id');
    if(id) {
      this.companyService.getCompanyOrder(parseInt(id)).subscribe((data:ICompanyOrder)=> {
        this.order = data;
        this.quantity = data.items.map((vsl: ICompanyOrderProduct) => vsl.quantity).reduce((acc: any, quantity: any) => acc + quantity, 0);
        this.price = data.items.map((vsl: ICompanyOrderProduct) => vsl.price * vsl.quantity).reduce((acc: any, price: any) => acc + price, 0);
        this.order.items.forEach(item => {
          this.productsService.getProductPhoto(item.productId).subscribe((data: any) => {
            this.updateProfilePicture(item.productId.toString(), data);
          });
        })
      });
    }
  }

  changeStatus(status: string){
    this.companyService.sendOrder(this.order.id, status).subscribe(() => {
      this.order.sentDate = new Date();
    });
  }

  updateProfilePicture(productId: string, imageData: ArrayBuffer): void {
    const blob = new Blob([imageData], { type: 'image/png' });
    let element = (<HTMLInputElement> document.getElementById(productId.toString()));
    element.src = URL.createObjectURL(blob);
  }

}
