import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from "./home/home.component";
import {ProductComponent} from "./product/product.component";
import {ProductsComponent} from "./products/products.component";
import {PremieresComponent} from "./premieres/premieres.component";
import {CartComponent} from "./cart/cart.component";
import {BannerComponent} from "./banner/banner.component";
import {LoginComponent} from "./login/login.component";
import {AuthGuard} from "./guard/auth.guard";
import {OverviewComponent} from "./company-components/overview/overview.component";
import {SearchComponent} from "./search/search.component";
import {RegisterComponent} from "./register/register.component";
import {ErrorComponent} from "./error/error.component";
import {AdminUsersComponent} from "./admin-components/admin-users/admin-users.component";
import {AdminProductsComponent} from "./admin-components/admin-products/admin-products.component";
import {AdminOrdersComponent} from "./admin-components/admin-orders/admin-orders.component";
import {AdminOrderComponent} from "./admin-components/admin-order/admin-order.component";
import {AdminCategoryComponent} from "./admin-components/admin-category/admin-category.component";
import {AdminCompaniesComponent} from "./admin-components/admin-companies/admin-companies.component";
import {CompanyOrderComponent} from "./company-components/company-order/company-order.component";
import {CompanyOrdersComponent} from "./company-components/company-orders/company-orders.component";
import {CompanyProductsComponent} from "./company-components/company-products/company-products.component";
import {OrdersComponent} from "./user-components/orders/orders.component";
import {TransactionsComponent} from "./user-components/transactions/transactions.component";
import {DiscountedComponent} from "./discounted/discounted.component";

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'product/:id', component: ProductComponent },
  { path: 'products/:category', component: ProductsComponent },
  { path: 'new', component: PremieresComponent },
  { path: 'cart', component: CartComponent, canActivate:[AuthGuard], data: {expectedRoles: ['client']} },
  { path: 'banner', component: BannerComponent },
  { path: 'login', component: LoginComponent },
  { path: 'orders', component: OrdersComponent , canActivate:[AuthGuard], data: {expectedRoles: ['client']} },
  { path: 'discounted', component: DiscountedComponent },
  { path: 'company/products', component: CompanyProductsComponent, canActivate: [AuthGuard], data:{ expectedRoles: ['company']} },
  { path: 'overview', component: OverviewComponent, canActivate: [AuthGuard], data:{ expectedRoles: ['company']}  },
  { path: 'companyOrders', component: CompanyOrdersComponent, canActivate: [AuthGuard], data:{ expectedRoles: ['company']} },
  { path: 'companyOrder/:id', component: CompanyOrderComponent, canActivate: [AuthGuard], data:{ expectedRoles: ['company']} },
  { path: 'transactions', component: TransactionsComponent, canActivate:[AuthGuard], data: {expectedRoles: ['client']}},
  { path: 'search', component: SearchComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'admin/users', component: AdminUsersComponent, canActivate: [AuthGuard], data:{ expectedRoles: ['admin']} },
  { path: 'admin/products', component: AdminProductsComponent, canActivate: [AuthGuard], data:{ expectedRoles: ['admin']} },
  { path: 'admin/orders', component: AdminOrdersComponent, canActivate: [AuthGuard], data:{ expectedRoles: ['admin']} },
  { path: 'admin/order/:id', component: AdminOrderComponent, canActivate: [AuthGuard], data:{ expectedRoles: ['admin']} },
  { path: 'admin/categories', component: AdminCategoryComponent, canActivate: [AuthGuard], data:{ expectedRoles: ['admin']} },
  { path: 'admin/companies', component: AdminCompaniesComponent, canActivate: [AuthGuard], data:{ expectedRoles: ['admin']} },
  { path: '**', pathMatch: 'full',component: ErrorComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
