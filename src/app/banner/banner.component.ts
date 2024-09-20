import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {Router} from "@angular/router";
import {CartService} from "../services/cart.service";
import {AuthService} from "../domains/auth/auth.service";
import {ProductsService} from "../domains/products/products.service";
import {UserService} from "../domains/user/user.service";
import {ICartItem, IMainCategory} from "../domains/products/product.types";

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css'],
})
export class BannerComponent implements OnInit {

  categories: IMainCategory[] = [];

  isAuthenticated = false;

  cart: ICartItem[] = [];

  roles: string[] = [];

  show = false;

  quantity = 0;

  showCart = false;

  querying = false;

  companyName = "";

  price = 0;

  searchInput = "";

  dataInsideComponent = this.cartService.cart$;
  refresh = this.cartService.refresh$;

  @ViewChild("products") products!: ElementRef;

  constructor(public router: Router, public cartService: CartService, public productsService: ProductsService, public authService: AuthService, public userService: UserService) {
  }

  ngOnInit(): void {
    this.cart = this.cartService.getCart();
    this.calculateCart();
    this.dataInsideComponent.subscribe(elem => {
      if (elem?.id) {
        let itm = this.cart.find(_item => _item.sizeId === elem.sizeId);
        if (itm) {
          if(elem.quantity <= 0) {
            let index = this.cart.indexOf(itm, 0);
            if (index > -1) {
              this.cart.splice(index, 1);
            }
          } else {
            itm.quantity = elem.quantity;
          }
        }
        else {
          this.cart.push(elem);
        }
      } else {
        this.cart = this.cartService.getCart();
      }
      this.calculateCart();
      }
    );
    this.refresh.subscribe(data => {
      if(data)
        this.cart = this.cartService.getCart();
      this.calculateCart();
    });

    this.productsService.getCategories().subscribe((data: any) => {
      this.categories = data;
    });
    this.authService.getRoles().subscribe((data: any) => {
      this.roles = data;
      this.isAuthenticated = true;
      if (this.roles.indexOf('company') !== -1) {
        this.userService.getUser().subscribe((data: any) => {
          this.companyName = data.companyName;
        });
      }
    });
  }

  calculateCart() {
    let quantity2 = 0;
    let price2 = 0;
    this.cart.forEach((item: ICartItem) => {
      price2 += item.price * item.quantity;
      quantity2 += item.quantity;
    });
    this.price = price2;
    this.quantity = quantity2;
  }

  logout() {
    this.deleteCookie();
    this.router.navigate(['/']).then(() => {
      document.cookie = "";
      window.location.reload();
    });
  }

  goToCategoryPage(name: string) {
    this.router.navigate(['/products/' + name]).then(() => {
      window.location.reload();
    });
  }

  deleteCookie() {
    document.cookie = "cookie";
  }

  searchForProductsButton($event?: KeyboardEvent) {
    if(this.searchInput.length > 0)
      this.router.navigate(['/search'], {queryParams: {"query": this.searchInput}}).then(() => {
        window.location.reload()
      });
  }

  search() {
    this.querying = !this.querying;
  }

  delQuantity(sizeId: number) {
    this.cartService.deleteQty(sizeId);
    this.calculateCart();
  }

  addQuantity(sizeId: number) {
    this.cartService.addQty(sizeId);
    this.calculateCart();
  }

  goToProduct(id: number) {
    this.router.navigate(['/product/' + id]).then(() => window.location.reload());
  }
}


