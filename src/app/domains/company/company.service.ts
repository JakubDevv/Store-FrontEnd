import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {ICompanyOrder, ICompanyOrders, ICompanyProducts, ICompanyStats} from "./company.types";
import {AddProduct, AddProduct2} from "../../company-components/company-products/company-products.component";

const HOST = environment.apiUrl;
const BASE_URL = "/company/";

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  constructor(private http: HttpClient) { }

  public getCompanyOrders(){
    return this.http.get<ICompanyOrders[]>(HOST + BASE_URL + "orders");
  }

  public getCompanyOrder(orderId: number){
    let paramsC = new HttpParams().set("orderId", orderId);
    return this.http.get<ICompanyOrder>(HOST + BASE_URL + "order", { params: paramsC });
  }

  public sendOrder(orderId: number, status: string){
    return this.http.put<null>(HOST + BASE_URL + "order/status", { orderId: orderId, status: status });
  }

  public getProducts(){
    return this.http.get<ICompanyProducts[]>(HOST + BASE_URL + "products");
  }

  public getIncomeInTime(date: Date){
    let paramsC = new HttpParams().set("startDate", date.toISOString().split('T')[0]);
    return this.http.get(HOST + BASE_URL + "income/time", { params: paramsC });
  }

  public getOrdersInTime(date: Date){
    let paramsC = new HttpParams().set("startDate", date.toISOString().split('T')[0]);
    return this.http.get(HOST + BASE_URL + "orders/time", { params: paramsC });
  }

  public getSalesByCategory(date: Date){
    let paramsC = new HttpParams().set("startDate", date.toISOString().split('T')[0]);
    return this.http.get(HOST + BASE_URL + "sales/category", { params: paramsC });
  }

  public getCompanyStats(date: Date){
    let paramsC = new HttpParams().set("startDate", date.toISOString().split('T')[0]);
    return this.http.get<ICompanyStats>(HOST + BASE_URL + "stats", { params: paramsC });
  }

  public getCompanyNewCustomers(date: Date){
    let paramsC = new HttpParams().set("startDate", date.toISOString().split('T')[0]);
    return this.http.get<ICompanyStats>(HOST + BASE_URL + "new-customers", { params: paramsC });
  }

  public getCompanyProductsStats(){
    return this.http.get(HOST + BASE_URL + "product/stats");
  }

  public getProduct(productId: number){
    let customParams = new HttpParams().set("productId", productId);
    return this.http.get(HOST + BASE_URL + "product", {params: customParams});
  }

  public setProductImages(productId: number, formData: FormData){
    const params = { productId: productId };
    return this.http.post(HOST + BASE_URL +  "product/images", formData,{ params });
  }

  public updateProduct(product: AddProduct){
    this.http.put(HOST + BASE_URL +  "product", product).subscribe((data: any) => { });
  }

  public createProduct(product: AddProduct2){
    return this.http.post(HOST + BASE_URL +  "product", product);
  }

  public retireProduct(id: number) {
    let paramsC = new HttpParams().set("productId", id);
    return this.http.put(HOST + BASE_URL + "product/retire", {}, {params: paramsC});
  }

  public getIncomeChange() {
    return this.http.get(HOST + BASE_URL + "income/change");
  }

  public getIncomeByCountry() {
    return this.http.get(HOST + BASE_URL + "income/country");
  }

  public getOrdersUpdates() {
    return this.http.get(HOST + BASE_URL + "updates");
  }
}
