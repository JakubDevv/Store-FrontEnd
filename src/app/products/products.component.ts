import {AfterContentInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {HttpParams} from "@angular/common/http";
import {ActivatedRoute, NavigationExtras, Router} from "@angular/router";
import {ProductsService} from "../domains/products/products.service";
import {IFilter, IPaging, IProducts} from "../domains/products/product.types";

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit, AfterContentInit {

  products: IProducts[]=[];

  filters: IFilter[] = [];

  selectedFilters: { [key: string]: string[] } = {};

  selected = 0;

  @ViewChild("fromPrice", { static: false }) fromPrice!: ElementRef;

  @ViewChild("toPrice", { static: false }) toPrice!: ElementRef;

  totalPages!:number;

  pageNumber!: number;

  last!: boolean;
  number!: number;
  first!: boolean;

  filtersSelected = false;

  openedFilters: string[] = [];

  sorting = "";

  category: string | null = "";

  constructor(public route: ActivatedRoute, public router: Router, private productsService: ProductsService) {}

  ngAfterContentInit(): void {
    let queryParam = this.route.snapshot.queryParamMap.get("page") ?? "1";
    this.pageNumber = parseInt(queryParam);
    this.category = this.route.snapshot.paramMap.get('category');
    let paramsC = new HttpParams().set("page", this.pageNumber);
    this.route.snapshot.queryParamMap.keys.forEach(elem => {
      if(elem != "page") {
        let values = this.route.snapshot.queryParamMap.getAll(elem);
        paramsC = paramsC.set(elem, values.join(', '));
      }
    });
    if(this.category)
      this.productsService.getProductsByCategory(this.category, this.pageNumber).subscribe((data: IPaging<IProducts>) => {
        this.handleProductData(data);
      });
  }

  sortBy(val: string){
    let list = ["asc", "desc", "rate", "sold"];
    this.sorting = val;
    list.forEach(elem => {
      if(elem == val){
        // @ts-ignore
        document.getElementById(val).classList.add("activeSort");
      }else {
        // @ts-ignore
        if(document.getElementById(elem).classList.contains("activeSort")){
          // @ts-ignore
          document.getElementById(elem).classList.remove("activeSort");
        }
      }
    })
    this.applyFilters();
  }

  ngOnInit(): void {
    this.category = this.route.snapshot.paramMap.get('category');
    if(this.category)
      this.productsService.getFiltersByCategory(this.category).subscribe((data: IFilter[])=>{
        this.filters = data;
      });
  }

  goToProduct(id: number) {
    this.router.navigate(['/product/'+id]);
  }

  applyFilters() {
    this.filtersSelected = true;
    let paramsC = new HttpParams();
    let from = this.fromPrice.nativeElement.value;
    let to = this.toPrice.nativeElement.value;
    if(from != ""){
      this.selectedFilters["from"] = [from];
    }if (to != ""){
      this.selectedFilters["to"] = [to];
    }if (this.sorting != ""){
      this.selectedFilters["sort"] = [this.sorting];
    }
    for (const key in this.selectedFilters) {
      let filterValuesConcatenate = this.selectedFilters[key].reduce((acc, value, index) => {
        if (index === 0) {
          return acc + value;
        } else {
          return acc + ',' + value;
        }
      }, '');
      paramsC = paramsC.set(key, filterValuesConcatenate)
    }
    const navigationExtras: NavigationExtras = {
      queryParams: null
    };
    navigationExtras.queryParams = {...this.selectedFilters}
    this.router.navigate(['/products/'+this.category], navigationExtras).then(() => {
      window.location.reload()
    });
  }

  onFilterChange(key: string, value: string) {
    if (!this.selectedFilters[key]) {
      this.selectedFilters[key] = [];
    }
    if(this.selectedFilters[key].indexOf(value) == -1){
      this.selectedFilters[key].push(value);
      this.selected++;
    } else {
      const index = this.selectedFilters[key].indexOf(value);
      this.selectedFilters[key].splice(index, 1);
      this.selected--;
      if (this.selectedFilters[key].length == 0){
        delete this.selectedFilters[key];
      }
    }
  }

  goToNextPage(number: number) {
    const navigationExtras: NavigationExtras = {
      queryParams: {"page": number}
    };
    this.route.snapshot.queryParamMap.keys.forEach(elem => {
      if(elem != "page"){
        let ele = this.route.snapshot.queryParamMap.getAll(elem);
        // @ts-ignore
        navigationExtras.queryParams[elem] = ele;
      }
    });
    if (number <= this.totalPages && number > 0)
      this.router.navigate(['/products/'+this.category], navigationExtras).then(() => {
        window.location.reload();
      });
  }

  updateProfilePicture2(product: string, imageData: ArrayBuffer): void {
    const blob = new Blob([imageData], { type: 'image/png' });
    let element =  (<HTMLInputElement> document.getElementById(product.toString()));
    element.src = URL.createObjectURL(blob);
  }

  showFilters(key: string) {
    let number1 = this.openedFilters.indexOf(key);
    if(number1 > -1){
      this.openedFilters.splice(number1, 1);
    }else {
      this.openedFilters.push(key);
    }
  }

  clearFilters() {
    this.router.navigate(['/products/'+this.category]).then(() => {
      window.location.reload();
    });
  }

  setFilters() {
    if(this.route.snapshot.queryParamMap.get("from") != null){
      this.fromPrice.nativeElement.value = this.route.snapshot.queryParamMap.get("from");
    }
    if(this.route.snapshot.queryParamMap.get("to") != null){
      this.toPrice.nativeElement.value = this.route.snapshot.queryParamMap.get("to");
    }
    if(this.route.snapshot.queryParamMap.get("sort") != null){
      // @ts-ignore
      document.getElementById(this.route.snapshot.queryParamMap.get("sort")).classList.add("activeSort");
    }
    this.route.queryParamMap.subscribe((queryParams) => {
      queryParams.keys.forEach((key) => {
        let values = queryParams.getAll(key);
        values.forEach(elem => {
          const checkbox = document.getElementById(elem) as HTMLInputElement;
          this.onFilterChange(key, elem);
          checkbox.checked = true;
        });
      });
    });
  }

  showSecondImage(product: IProducts) {
    if(product.amountOfImages > 1){
      this.updateProfilePicture2("productImage"+product.id, product.image2);
    }
  }

  showFirstImage(product: IProducts) {
    this.updateProfilePicture2("productImage"+product.id, product.image1)
  }

  handleProductData(data: IPaging<IProducts>): void {
    this.last = data.last;
    this.number = data.number;
    this.first = data.first;
    this.totalPages = data.totalPages;
    this.products = data.content.map((productData: IProducts) => this.mapProductData(productData));
    this.setFilters();
  }

  mapProductData(product: IProducts): IProducts {
    if (product.amountOfImages > 1) {
      this.productsService.getProductPhoto(product.id, 1).subscribe((data2: any) => {
        product.image2 = data2;
      });
    }

    this.productsService.getProductPhoto(product.id).subscribe((data: any) => {
      product.image1 = data;
      this.updateProfilePicture2("productImage" + product.id, data);
    });

    return product;
  }

}
