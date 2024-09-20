import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {IUser} from "./user.types";
import {environment} from "../../../environments/environment";
import {ICartItem} from "../products/product.types";

const HOST = environment.apiUrl;
const BASE_URL = "/user/";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  public getUser(){
    return this.http.get<IUser>(HOST + BASE_URL);
  }

  public updateUserPhoto(file: File){
    let formData = new FormData();
    formData.set('file', file);
    return this.http.put(HOST + BASE_URL + "photo", formData);
  }

  public getUserPhoto(){
    return this.http.get(HOST + BASE_URL + "photo", { responseType: 'arraybuffer' });
  }

  public getUserPhoto2(userId: number){
    let paramsC = new HttpParams().set("userId2", userId);
    return this.http.get(HOST + BASE_URL + "userImage", { params: paramsC, responseType: 'arraybuffer' });
  }

  public completeOrder(orderId: number){
    return this.http.put( HOST + BASE_URL + `order/${orderId}/complete`, {})
  }

  public getUserOrders(){
    return this.http.get(HOST + BASE_URL + `orders`);
  }

  public createOrder(country: string, city: string, street: string, addressNumber: number, zip_code: string, phone: number, items: ICartItem[]){
    return this.http.post(HOST + BASE_URL + `order`, { country: country, city: city, street: street, addressNumber: addressNumber, zip_code: zip_code, phone: phone, items: items });
  }

  public getTransactionStats(date: Date){
    let paramsC = new HttpParams().set("date", date.toISOString().slice(0, 10))
    return this.http.get("http://localhost:8080/user/transaction/stats", { params: paramsC });
  }
}
