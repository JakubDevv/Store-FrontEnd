import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {IHomeStats} from "./stat.types";
import {IUserStats} from "../user/user.types";

const HOST = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class StatsService {

  constructor(private http: HttpClient) { }

  public getHomeStats(){
    return this.http.get<IHomeStats>(HOST + "/products/stats");
  }

  public getUserStats(){
    return this.http.get<IUserStats>(HOST + "/user/stats");
  }

}
