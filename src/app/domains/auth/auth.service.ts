import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {ITransaction} from "./auth.types";
import {FormGroup} from "@angular/forms";

const HOST = environment.apiUrl;
const BASE_URL = "/auth/";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  public getTransactions(){
    return this.http.get<ITransaction[]>(HOST + BASE_URL + "transactions");
  }

  public login(form: FormGroup){
    return this.http.post(HOST + BASE_URL + "login", form.getRawValue(), { withCredentials : true });
  }

  public register(form: FormGroup){
    document.cookie = "";
    return this.http.post(HOST + BASE_URL + "register", form.getRawValue(), { withCredentials : true });
  }

  public refreshToken() {
    let refreshToken = document.cookie;
    return this.http.post(HOST + BASE_URL + "access-token",{ value: refreshToken });
  }

  public getRoles(){
    return this.http.get<string[]>(HOST + BASE_URL + "roles");
  }

  public createCompany(companyName: string){
    let paramsC = new HttpParams().set("companyName", companyName);
    return this.http.post<null>(HOST + "/auth/company", {}, {params: paramsC});
  }

}
