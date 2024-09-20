import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, NavigationExtras, Router} from "@angular/router";
import {IProducts} from "../domains/products/product.types";
import {ProductsService} from "../domains/products/products.service";

@Component({
  selector: 'app-premieres',
  templateUrl: './premieres.component.html',
  styleUrls: ['./premieres.component.css']
})
export class PremieresComponent implements OnInit {

  products: IProducts[] = [];

  totalPages!:number;

  pageNumber!: number;

  totalElements!: number;
  last!: boolean;
  number!: number;
  first!: boolean;

  constructor(public router: Router, public route: ActivatedRoute, public productsService: ProductsService) { }

  ngOnInit(): void {
    let queryParam = this.route.snapshot.queryParamMap.get("page") ?? "1";
    this.pageNumber = parseInt(queryParam);
    this.productsService.getNewProducts(parseInt(queryParam)).subscribe((data:any)=>{
      this.handleProductData(data);
    })
  }

  goToProduct(id: number) {
    this.router.navigate(['/product/'+id]);
  }

  goToNextPage(number: number) {
    const navigationExtras: NavigationExtras = {
      queryParams: {"page": number},
    };

    if(number<=this.totalPages && number > 0)
      this.router.navigate(['/new'], navigationExtras).then(()=> { window.location.reload() });
  }

  updateProfilePicture(product: IProducts, imageData: ArrayBuffer): void {
    const blob = new Blob([imageData], { type: 'image/png' });
    let element = (<HTMLInputElement> document.getElementById(product.id.toString()));
    element.src = URL.createObjectURL(blob);
  }

  showSecondImage(product: IProducts) {
    if(product.amountOfImages > 1){
      this.updateProfilePicture(product, product.image2);
    }
  }

  showFirstImage(product: IProducts) {
    this.updateProfilePicture(product, product.image1)
  }

  handleProductData(data: any): void {
    this.last = data.last;
    this.number = data.number;
    this.first = data.first;
    this.totalPages = data.totalPages;
    this.products = data.content.map((productData: any) => this.mapProductData(productData));
  }

  mapProductData(product: any): IProducts {

    if (product.amountOfImages > 1) {
      this.productsService.getProductPhoto(product.id, 1).subscribe((data2: any) => {
        product.image2 = data2;
      });
    }

    this.productsService.getProductPhoto(product.id).subscribe((data: any) => {
      product.image1 = data;
      this.updateProfilePicture(product, data);
    });

    return product;
  }

}

