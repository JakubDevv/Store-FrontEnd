import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {ICategory, IProducts, IProducts2} from "../domains/products/product.types";
import {ProductsService} from "../domains/products/products.service";
import {IHomeStats} from "../domains/stats/stat.types";
import {StatsService} from "../domains/stats/stats.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  slideIndex = 1

  stats!: IHomeStats;

  productsMostPurchased: IProducts[]=[];

  // mostRatedProducts: IProducts2[]=[];

  categories: ICategory[]=[];

  selectedCategory: number = 1;

  productsPhotos = new Map<number, any>();

  constructor(public router: Router, private productsService: ProductsService, private statsService: StatsService) { }

  ngOnInit(): void {
    this.slideIndex = 1;
    this.statsService.getHomeStats().subscribe((data: IHomeStats) => {
      this.stats = data;
    });
    this.productsService.getProductsSortByRating().subscribe((data: IProducts[]) => {
      this.productsMostPurchased = data.map((productData: IProducts) => this.mapProduct(productData));
    });
    this.productsService.getProductsSortBySales().subscribe((data: ICategory[]) => {
      this.categories = data;
      this.categories.flatMap(category => category.products).forEach(product => {
        if(!this.productsPhotos.has(product.id)) {
          this.productsService.getProductPhoto(product.id).subscribe((data2: any) => {
            this.productsPhotos.set(product.id, this.arrayBufferToImageUrl(data2));
          });
        }
      });
    });
  }

  arrayBufferToImageUrl = (data: any) => {
    const uint8Array = new Uint8Array(data);
    const binaryString = uint8Array.reduce((acc, byte) => acc + String.fromCharCode(byte), '');
    const base64String = btoa(binaryString);
    return `data:image/jpeg;base64,${base64String}`;
  }

  goToProduct(id: number) {
    this.router.navigate(['/product/'+id]);
  }

  updateProfilePicture(product: IProducts | IProducts2, imageData: ArrayBuffer): void {
    const blob = new Blob([imageData], { type: 'image/png' });
    if (!this.isIProducts2(product)) {
      let element = document.getElementById(product.id.toString()) as HTMLInputElement;
      element.src = URL.createObjectURL(blob);
    }
  }

  showSecondImage(product: IProducts | IProducts2) {
    if(product.amountOfImages > 1){
      this.updateProfilePicture(product, product.image2);
    }
  }

  showFirstImage(product: IProducts | IProducts2) {
    this.updateProfilePicture(product, product.image1)
  }

  mapProduct(product: IProducts): IProducts {
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

  mapProduct2(product: IProducts2): IProducts2 {
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

  isIProducts2(product: IProducts | IProducts2): product is IProducts2 {
    return (product as IProducts2).description !== undefined;
  }

  setCategory(category: number) {
    this.selectedCategory = category;
  }
}


