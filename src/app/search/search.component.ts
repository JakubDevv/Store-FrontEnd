import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, NavigationExtras, Router} from "@angular/router";
import {ProductsService} from "../domains/products/products.service";
import {IPaging, IProducts} from "../domains/products/product.types";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  searchQuery = "";

  products: IProducts[] = [];

  totalPages!:number;

  pageNumber!: number;

  totalElements!: number;
  last!: boolean;
  number!: number;
  first!: boolean;

  constructor(public route: ActivatedRoute, public router: Router, public productsService: ProductsService) { }

  ngOnInit(): void {
    this.pageNumber = parseInt(this.route.snapshot.queryParamMap.get("page") ?? "1");
    this.searchQuery = this.route.snapshot.queryParamMap.get("query") ?? "";
    this.productsService.getProductsByText(this.searchQuery, this.pageNumber).subscribe((data: IPaging<IProducts>) => {
      this.handleProductData(data);
    });
  }

  goToProduct(id: number) {
    this.router.navigate(['/product/'+id]);
  }

  goToNextPage(number: number) {
    const navigationExtras: NavigationExtras = {
      queryParams: {"page": number, "query": this.searchQuery},
    };

    if(number<=this.totalPages && number > 0)
      this.router.navigate(['/search'], navigationExtras).then(()=> { window.location.reload() });
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
    this.totalElements = data.totalElements;
    this.products = data.content.map((productData: any) => this.mapProductData(productData));
  }

  mapProductData(product: IProducts): IProducts {

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
