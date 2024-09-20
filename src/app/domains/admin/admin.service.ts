import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {
  IAdminCompany,
  IAdminMainCategory,
  IAdminOrder,
  IAdminOrders,
  IAdminProduct,
  IAdminProducts, IAdminUser, IAdminUsers
} from "./admin.types";

const HOST = environment.apiUrl;
const BASE_URL = "/admin/";

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient) { }

  public deleteSubCategory(subCategoryId: number){
    return this.http.delete<null>(HOST + BASE_URL + `subcategory/${subCategoryId}`);
  }

  public createSubCategory(categoryId: number, subCategoryName: string){
    return this.http.post(HOST + BASE_URL + `subcategory`, { mainCategoryId: categoryId, name: subCategoryName });
  }

  public createCategory(categoryName: string){
    let params1 = new HttpParams().set("categoryName", categoryName);
    return this.http.post(HOST + BASE_URL + `category`, {},{params: params1});
  }

  public deleteFilterValue(filterValueId: number){
    return this.http.delete<null>(HOST + BASE_URL + `filter/value/${filterValueId}`);
  }

  public deleteFilter(filterId: number){
    return this.http.delete<null>(HOST + BASE_URL + `filter/${filterId}`);
  }

  public createFilter(subCategoryId: number, filterValue: string){
    return this.http.post(HOST + BASE_URL + `filter`, {subCategoryId: subCategoryId, name: filterValue});
  }

  public createFilterValue(filterId: number, filterValue: string){
    return this.http.post(HOST + BASE_URL + `filterValue`, {filterId: filterId, name: filterValue});
  }

  public deleteCategory(categoryId: number){
    return this.http.delete<null>(HOST + BASE_URL + `category/${categoryId}`);
  }

  public getCategoryAmountOfProducts() {
    return this.http.get(HOST + BASE_URL + `subcategory/products`);
  }

  public getSubCategoryAmountOfProducts() {
    return this.http.get(HOST + BASE_URL + `category/products`);
  }

  public getSubCategorySales() {
    return this.http.get(HOST + BASE_URL + `category/sales`);
  }

  public getCompanies(){
    return this.http.get<IAdminCompany[]>(HOST + BASE_URL + `companies`);
  }

  public deleteCompany(companyId: number){
    return this.http.delete<null>(HOST + BASE_URL + `company/${companyId}`);
  }

  public getCategories(){
    return this.http.get<IAdminMainCategory[]>(HOST + BASE_URL + "categories");
  }

  public getOrder(orderId: number) {
    return this.http.get<IAdminOrder>(HOST + BASE_URL + `order/${orderId}`);
  }

  public getOrders() {
    return this.http.get<IAdminOrders[]>(HOST + BASE_URL + `orders`);
  }

  public getOrdersInTime() {
    return this.http.get(HOST + BASE_URL + `orders/time`);
  }

  public getProducts() {
    return this.http.get<IAdminProducts[]>(HOST + BASE_URL + `products`);
  }

  public getProductsInTime() {
    return this.http.get(HOST + BASE_URL + `products/time`);
  }

  public getSalesInTime() {
    return this.http.get(HOST + BASE_URL + `sales/time`);
  }

  public retireProduct(productId: number) {
    return this.http.delete<null>(HOST + BASE_URL + `product/${productId}/retire`);
  }

  public getProduct(productId: number){
    return this.http.get<IAdminProduct>(HOST + BASE_URL + `product/${productId}`);
  }

  public getUsers() {
    return this.http.get<IAdminUsers[]>(HOST + BASE_URL + `users`);
  }

  public getUser(userId: number){
    return this.http.get<IAdminUser>(HOST + BASE_URL + `user/${userId}`);
  }

  public getUsersInTime(){
    return this.http.get(HOST + BASE_URL + `users/time`);
  }

  public deleteUser(userId: number){
    return this.http.delete<null>(HOST + BASE_URL + `user/${userId}`);
  }

}
