import {Injectable, OnInit} from '@angular/core';
import {BehaviorSubject, forkJoin, map} from "rxjs";
import {ProductsService} from "../domains/products/products.service";
import {ICartItem, IPaging} from "../domains/products/product.types";
import {BannerComponent} from "../banner/banner.component";

@Injectable({
  providedIn: 'root'
})
export class CartService implements OnInit{

  cart$ = new BehaviorSubject<ICartItem | undefined>(undefined);
  refresh$ = new BehaviorSubject<boolean>(false);

  actualCart: ICartItem[] = [];

  constructor(private productsService: ProductsService) {}

  ngOnInit(): void {
    let storedProducts = localStorage.getItem("products");

    if (storedProducts !== null) {
      this.actualCart = [...JSON.parse(storedProducts)];
    }

    this.productsService.validateProducts(this.actualCart).subscribe((data: ICartItem[]) => {
      this.actualCart = data;
      this.updateCart();
    });

  }

  arrayBufferToImageUrl = (data: any) => {
    const uint8Array = new Uint8Array(data);
    const binaryString = uint8Array.reduce((acc, byte) => acc + String.fromCharCode(byte), '');
    const base64String = btoa(binaryString);
    return `data:image/jpeg;base64,${base64String}`;
  }

  updateCart(){
    const productObservables = this.actualCart.map(product =>
      this.productsService.getProductPhoto(product.id).pipe(
        map((data: any) => {
          product.photo = this.arrayBufferToImageUrl(data);
          return product;
        })
      )
    );

    forkJoin(productObservables).subscribe(updatedProducts => {
      localStorage.setItem("products", JSON.stringify(updatedProducts));
    });
  }

  updateCart2(items: ICartItem[]){
    this.actualCart = items.map(product => {
      this.productsService.getProductPhoto(product.id).subscribe((data: any) => {
        product.photo = this.arrayBufferToImageUrl(data);
      });
      return product;
    });
    this.updateCart();
    this.refresh$.next(true);
  }

  getCart(){
    const storedData = localStorage.getItem("products");

    if (storedData !== null) {
      this.actualCart = JSON.parse(storedData);
      return JSON.parse(storedData);
    } else {
      localStorage.setItem("products", JSON.stringify([]));
      return [];
    }
  }

  addToCart(item: ICartItem) {
    let itm = this.actualCart.find(_item => _item.sizeId === item.sizeId);
    if(itm) {
      itm.quantity += item.quantity;
      this.cart$.next(itm);
    } else {
      this.actualCart.push(item);
      this.cart$.next(item);
    }
    this.updateCart();
  }

  deleteQty(sizeId: number){
    let itm = this.actualCart.find(_item => _item.sizeId === sizeId);
    if(itm) {
      if(--itm.quantity == 0) {
        let index =  this.actualCart.indexOf(itm,0);
        if (index > -1) {
          this.actualCart.splice(index, 1);
        }
      }
      this.cart$.next(itm);
    }
    this.updateCart();
  }

  addQty(sizeId: number){
    let itm = this.actualCart.find(_item => _item.sizeId === sizeId);
    if(itm){
      itm.quantity++;
      this.cart$.next(itm);
    }
    this.updateCart();
  }

}

