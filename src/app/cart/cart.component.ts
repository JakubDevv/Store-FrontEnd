import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {CartService} from "../services/cart.service";
import {UserService} from "../domains/user/user.service";
import {ProductsService} from "../domains/products/products.service";
import {ICartItem} from "../domains/products/product.types";

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  @ViewChild('quantity') quantity: ElementRef | undefined;

  cart: ICartItem[] = [];

  alertClasses: string[][] = [['alert1', 'hide'], ['alert2', 'hide'], ['alert3', 'hide']];

  fullPrice = 0;

  quantityVal = 0;

  dataInsideComponent = this.cartService.cart$;

  phone!: number;
  apartmentnumber!: number;
  street!: string;
  zipcode!: string;
  city!: string;
  country!: string;

  constructor(private router: Router, private cartService: CartService, private userService: UserService, private productsService: ProductsService) {
  }

  ngOnInit(): void {
    this.cart = this.cartService.getCart();
    this.calculateFullPrice();
    this.dataInsideComponent.subscribe(elem => {
      if (elem) {
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
      }
      this.calculateFullPrice();
    });
  }

  arrayBufferToImageUrl = (data: any) => {
    const uint8Array = new Uint8Array(data);
    const binaryString = uint8Array.reduce((acc, byte) => acc + String.fromCharCode(byte), '');
    const base64String = btoa(binaryString);
    return `data:image/jpeg;base64,${base64String}`;
  }

  addQuantity(sizeId: number) {
    this.cartService.addQty(sizeId);
    this.calculateFullPrice();
  }

  delQuantity(sizeId: number) {
    this.cartService.deleteQty(sizeId);
    this.calculateFullPrice();
  }

  proceedOrder() {
    if (this.cart.length > 0) {
      this.userService.createOrder(this.country, this.city, this.street, this.apartmentnumber, this.zipcode, this.phone, this.cart).subscribe((data: any) => {
        this.cart = [];
        this.fullPrice = 0;
        this.quantityVal = 0;
        localStorage.clear();
        this.showWarning(0);
        this.city = this.street = this.country = this.zipcode = "";
        this.apartmentnumber = this.phone = 0;
        this.cartService.updateCart2([]);
      }, error => {
        if(error.status == 404){
          this.cart = error.error.message;
          this.cart = this.cart.map(product => {
            this.productsService.getProductPhoto(product.id).subscribe((data: any) => {
              product.photo = this.arrayBufferToImageUrl(data);
            });
            return product;
          })
          this.showWarning(2);
          this.cartService.updateCart2(this.cart);
        }
        if(error.status == 406){
          this.showWarning(1);
        }
      });
    }

  }

  calculateFullPrice() {
    this.fullPrice = 0;
    this.quantityVal = 0;
    this.cart.forEach((product: any) => this.fullPrice += product.price * product.quantity);
    this.cart.forEach((product: any) => this.quantityVal += product.quantity);
  }

  goToProduct(id: number) {
    this.router.navigate(['/product/' + id]).then(() => window.location.reload());
  }

  showWarning(num: number) {
    this.alertClasses[num] = ['alert' + parseInt(String(num + 1)), 'show', 'showAlert'];

    setTimeout(() => {
      this.closeWarning(num);
    }, 5000);
  }

  closeWarning(num: number) {
    this.alertClasses[num] = ['alert' + parseInt(String(num + 1)), 'hide', 'hideAlert' + parseInt(String(num + 1))];
  }

}
