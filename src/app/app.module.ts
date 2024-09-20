import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent} from './app.component';
import {HomeComponent} from './home/home.component';
import {AppRoutingModule} from "./app-routing.module";
import {BannerComponent} from './banner/banner.component';
import {FooterComponent} from './footer/footer.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {ProductComponent} from './product/product.component';
import {ProductsComponent} from './products/products.component';
import {CartComponent} from './cart/cart.component';
import {PremieresComponent} from './premieres/premieres.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {LoginComponent} from './login/login.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AuthInterceptor} from "./interceptor/auth.interceptor";
import {DiscountedComponent} from './discounted/discounted.component';
import {OverviewComponent} from './company-components/overview/overview.component';
import {SearchComponent} from './search/search.component';
import {RegisterComponent} from './register/register.component';
import {ErrorComponent} from './error/error.component';
import {MatSortModule} from "@angular/material/sort";
import {MatTableModule} from "@angular/material/table";
import {AdminUsersComponent} from './admin-components/admin-users/admin-users.component';
import {MatPaginatorModule} from "@angular/material/paginator";
import {AdminProductsComponent} from './admin-components/admin-products/admin-products.component';
import {AdminOrdersComponent} from './admin-components/admin-orders/admin-orders.component';
import {MatInputModule} from "@angular/material/input";
import {
  MatDatepickerModule
} from "@angular/material/datepicker";
import {MatNativeDateModule} from "@angular/material/core";
import {MatSliderModule} from "@angular/material/slider";
import {AdminOrderComponent} from './admin-components/admin-order/admin-order.component';
import {PhoneNumberPipe} from './pipe/phone-number.pipe';
import {SearchPipe} from './pipe/search.pipe';
import {AdminCategoryComponent} from './admin-components/admin-category/admin-category.component';
import {AdminCompaniesComponent} from './admin-components/admin-companies/admin-companies.component';
import {MatButtonModule} from "@angular/material/button";
import {CompanyOrderComponent} from './company-components/company-order/company-order.component';
import {DatePipe} from "@angular/common";
import {CompanyOrdersComponent} from "./company-components/company-orders/company-orders.component";
import {CompanyProductsComponent} from "./company-components/company-products/company-products.component";
import {OrdersComponent} from "./user-components/orders/orders.component";
import {TransactionsComponent} from "./user-components/transactions/transactions.component";
import { DateDifferencePipe } from './pipe/date-difference.pipe';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    BannerComponent,
    FooterComponent,
    ProductComponent,
    ProductsComponent,
    CartComponent,
    PremieresComponent,
    LoginComponent,
    OrdersComponent,
    DiscountedComponent,
    CompanyProductsComponent,
    OverviewComponent,
    CompanyOrdersComponent,
    SearchComponent,
    RegisterComponent,
    ErrorComponent,
    AdminUsersComponent,
    AdminProductsComponent,
    AdminOrdersComponent,
    AdminOrderComponent,
    PhoneNumberPipe,
    SearchPipe,
    AdminCategoryComponent,
    AdminCompaniesComponent,
    CompanyOrderComponent,
    TransactionsComponent,
    DateDifferencePipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    MatSortModule,
    MatTableModule,
    MatPaginatorModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSliderModule,
    MatButtonModule,
  ],
  providers: [
    [DatePipe],
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }],
  bootstrap: [AppComponent]
})
export class AppModule {
}
