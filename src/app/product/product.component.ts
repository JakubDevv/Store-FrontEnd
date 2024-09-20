import {
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {BannerComponent} from "../banner/banner.component";
import {CartService} from "../services/cart.service";
import {ProductsService} from "../domains/products/products.service";
import {IPaging, IProduct, IProductRating, IProductReview} from "../domains/products/product.types";

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  oneStar!: number;
  twoStar!: number;
  threeStar!: number;
  fourStar!: number;
  fiveStar!: number;

  productStars!: number;

  productReviews: IProductReview[] = [];

  @ViewChildren('myButtons') myButtons: QueryList<ElementRef> | undefined;

  @ViewChild('piecesAvailablee', {static: true}) piecesAvailable: ElementRef | undefined;

  @ViewChild('piecesInp', {static: true}) piecesInp: ElementRef | undefined;

  @ViewChild(BannerComponent, {static: true}) bannerComponent!: BannerComponent;

  commentPages: number = 0;

  productId!: number;

  rating!: IProductRating;

  product!: IProduct;

  slideIndex: number = 1;

  openedFilters: string[] = [];

  productLast=false;

  isSizeSelected=false;

  constructor(public router: Router, public route: ActivatedRoute, private cartService: CartService, public productsService: ProductsService) { }


  ngOnInit(): void {
    let id = this.route.snapshot.paramMap.get('id');
    if (id != null) {
      this.productId = parseInt(id);
    }
    this.productsService.getProduct(this.productId).subscribe((data: IProduct)=>{
      this.product = data;
      this.productsService.getProductReviews(this.productId, this.commentPages).subscribe((data: IPaging<IProductReview>)=>{
        this.productReviews = data.content;
        this.commentPages++;
        this.productLast = data.last;
      });

      for (let i = 0; i < data.images; i++) {
        this.productsService.getProductPhoto(this.product.id, i).subscribe((data:any)=>{
          this.updateProfilePicture2(i.toString()+"i", data)
        });
      }
    //
    }, error => {
      this.router.navigate(['/notFound'])
    });

    this.productsService.getProductRating(this.product.id).subscribe((data: IProductRating)=>{
      this.rating = data;
    });

  }

  updateProfilePicture2(imageId: string, imageData: ArrayBuffer): void {
    const blob = new Blob([imageData], { type: 'image/png' });
    let element = (<HTMLInputElement> document.getElementById(imageId));
    element.src = URL.createObjectURL(blob);
  }

  plusSlides(val : number){
    this.showSlides(this.slideIndex+=val);
  }

  showFilters(key: string) {
    let number1 = this.openedFilters.indexOf(key);
    if(number1 > -1){
      this.openedFilters.splice(number1, 1);
    }else {
      this.openedFilters.push(key);
    }
  }

  showSlides(n: number) {
    let i;
    let slides = document.getElementsByClassName("mySlides");
    let dots = document.getElementsByClassName("dot");
    if (n > slides.length) {this.slideIndex = 1}
    if (n < 1) {this.slideIndex = slides.length}
    for (i = 0; i < slides.length; i++) {
      const slide = slides[i] as HTMLElement;
      slide.style.display = "none";
    }
    slides[this.slideIndex-1].setAttribute("style", "display: block;");
  }

  arrayBufferToImageUrl = (data: any) => {
    const uint8Array = new Uint8Array(data);
    const binaryString = uint8Array.reduce((acc, byte) => acc + String.fromCharCode(byte), '');
    const base64String = btoa(binaryString);
    return `data:image/jpeg;base64,${base64String}`;
  }

  addProductToCart(test: String) {
    let size = "Default";
    let id = 0;
    this.myButtons?.forEach(button=>{
      if(button.nativeElement.style.textDecoration === "underline 1px black"){
        size = button.nativeElement.innerHTML;
        id = button.nativeElement.id;
      }
    })

    if(size=="Default" || this.piecesInp?.nativeElement.value == null || this.piecesInp?.nativeElement.value == 0){
      return;
    }

    let find = this.product.sizes.find(sizee => sizee.sizeValue === size);
    if(find?.quantity){
      find.quantity -= this.piecesInp?.nativeElement.value;
      if(this.piecesAvailable)
      this.piecesAvailable.nativeElement.innerHTML = `out of ${find.quantity} pieces`;
    }
    this.productsService.getProductPhoto(this.product.id).subscribe((data: any) => {
      this.cartService.addToCart({
        id: this.product.id,
        quantity: parseInt(this.piecesInp?.nativeElement.value),
        name: this.product.name,
        price: this.product.discountPrice == null ? this.product.price : this.product.discountPrice,
        size: size.trim(),
        sizeId: id,
        photo: this.arrayBufferToImageUrl(data)
      });
    });
  }


  selectSize(id: number, quantity: number) {
    this.myButtons?.forEach(button=>{
      button.nativeElement.style.fontWeight="700";
      button.nativeElement.style.textDecoration="none";
      button.nativeElement.style.fontSize="1rem";
      button.nativeElement.style.color="black";
    })
    document.getElementById(String(id))!.style.fontWeight="700";
    document.getElementById(String(id))!.style.textDecoration="1px underline black";
    document.getElementById(String(id))!.style.fontSize="20px";
    this.isSizeSelected = true;
    if (this.piecesInp) {
      this.piecesInp.nativeElement.placeholder = `${quantity} Available`;
    }
  }

  placeOrder() {
    this.router.navigate(['/cart']);
  }

}




