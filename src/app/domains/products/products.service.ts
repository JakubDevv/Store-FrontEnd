import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {
  ICartItem, ICategory,
  IFilter,
  IMainCategory,
  IPaging,
  IProduct,
  IProductRating,
  IProductReview,
  IProducts, IProducts2,
  ISubCategory
} from "./product.types";
import {environment} from "../../../environments/environment";
import {IHomeStats} from "../stats/stat.types";

const HOST = environment.apiUrl;
const BASE_URL = '/products/';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(private http: HttpClient) { }

  public getProduct(productId: number){
    return this.http.get<IProduct>(HOST + BASE_URL + "product/" + productId);
  }

  public getProductReviews(productId: number, page?: number){
    return this.http.get<IPaging<IProductReview>>(HOST + BASE_URL + "reviews/" + productId + "/page/" + page);
  }

  public getProductRating(productId: number){
    return this.http.get<IProductRating>(HOST + BASE_URL + "rating/" + productId);
  }

  public getFiltersByCategory(category: string){
    return this.http.get<IFilter[]>(HOST + BASE_URL + "filters/" + category);
  }

  public getProductsByCategory(category: string, page: number){
    let paramsC = new HttpParams().set("page", page);
    return this.http.get<IPaging<IProducts>>(HOST + BASE_URL + category,{params: paramsC});
  }

  public getProductPhoto(productId: number, index: number = 0){
    let paramsC = new HttpParams().set("index", index);
    return this.http.get(HOST + BASE_URL + productId + "/photo", { params: paramsC, responseType: 'arraybuffer' });
  }

  public getProductsByText(text: string, page: number){
    let paramsC = new HttpParams().set("query", text).set("page", page-1);
    return this.http.get<IPaging<IProducts>>(HOST + BASE_URL + "search", { params: paramsC });
  }

  public getProductsSortByRating(){
    return this.http.get<IProducts[]>(HOST + BASE_URL + "rating");
  }

  public getProductsSortBySales(){
    return this.http.get<ICategory[]>(HOST + BASE_URL + "sales");
  }

  public getCategories() {
    return this.http.get<IMainCategory>(HOST + BASE_URL + "categories");
  }

  public getSubCategories(){
    return this.http.get<ISubCategory>(HOST + BASE_URL + "subCategories");
  }

  public getUserPhoto(userId: number) {
    return this.http.get(HOST + BASE_URL + `user/${userId}`, { responseType: 'arraybuffer'});
  }

  public getDiscountedProducts(page: number) {
    let paramsC = new HttpParams().set("pageNum", page-1);
    return this.http.get(HOST + BASE_URL + `discounted`, { params: paramsC });
  }

  public getNewProducts(page: number) {
    let paramsC = new HttpParams().set("page", page-1);
    return this.http.get(HOST + BASE_URL + `new`, { params: paramsC });
  }

  public validateProducts(products: ICartItem[]){
    return this.http.post<ICartItem[]>(HOST + BASE_URL + `validate-products`, products);
  }

}
