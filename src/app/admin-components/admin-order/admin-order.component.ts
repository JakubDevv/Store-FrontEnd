import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {AdminService} from "../../domains/admin/admin.service";
import {ProductsService} from "../../domains/products/products.service";
import {IAdminOrder, IOrderCompany} from "../../domains/admin/admin.types";
import {IOrderProduct, IOrderStatus} from "../../domains/products/product.types";

@Component({
  selector: 'app-admin-order',
  templateUrl: './admin-order.component.html',
  styleUrls: ['./admin-order.component.css']
})
export class AdminOrderComponent implements OnInit {

  order!: IAdminOrder;

  orderStatus!: IOrderStatus;

  constructor(private route: ActivatedRoute, private adminService: AdminService, private productsService: ProductsService) { }

  ngOnInit(): void {
    let id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.adminService.getOrder(parseInt(id)).subscribe((data: IAdminOrder) => {
        this.order = data;

        if (this.order.statuses.length > 0) {
          this.orderStatus = this.order.statuses.pop() || { status: '', time: new Date() };
        } else {
          this.orderStatus = { status: '', time: new Date() };
        }

        this.order.items.forEach((company: IOrderCompany) => {
          if (company.statuses.length === 3) {
            company.statuses.pop();
          }
          company.lastStatus = company.statuses.pop() || { status: '', time: new Date() };
        });

        this.order.items.forEach((company: IOrderCompany) => {
          company.items.forEach((item: IOrderProduct) => {
            this.productsService.getProductPhoto(item.id).subscribe((photoData: any) => {
              this.setPhoto(item.orderItemId.toString(), photoData);
            });
          });
        });
      });
    }
  }

  setPhoto(size: string, imageData: ArrayBuffer): void {
    const blob = new Blob([imageData], {type: 'image/png'});
    let element = (<HTMLInputElement>document.getElementById(size));
    element.src = URL.createObjectURL(blob);
  }

}
