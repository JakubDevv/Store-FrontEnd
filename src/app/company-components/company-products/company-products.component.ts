import {AfterContentInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {FormControl} from "@angular/forms";
import {filter} from "rxjs";
import {environment} from "../../../environments/environment";
import {Chart} from "chart.js";
import {ProductsService} from "../../domains/products/products.service";
import {CompanyService} from "../../domains/company/company.service";
import {ICompanyProducts} from "../../domains/company/company.types";

@Component({
  selector: 'app-company-products',
  templateUrl: './company-products.component.html',
  styleUrls: ['./company-products.component.css']
})
export class CompanyProductsComponent implements OnInit, AfterContentInit {

  private apiUrl = environment.apiUrl;

  @ViewChild('sizes') sizes!: ElementRef;

  @ViewChild('myChart4') private chartRef4!: ElementRef;
  @ViewChild('myChart5') private chartRef5!: ElementRef;
  @ViewChild('myChart6') private chartRef6!: ElementRef;

  selected: string = "default";

  products: ICompanyProducts[] = [];

  products2: ICompanyProducts[] = [];

  product: Product = new Product();

  stat: Stats = new Stats();

  productAdd = new AddProduct2();

  categories: Category[] = [];

  selectControl: FormControl = new FormControl();

  addProductt!: AddProduct;

  filterByStatus: string = "All";

  statuses: string[] = ["All", "Active", "Retired"];

  addProductImages: string[] = [];

  slideIndex = 1;

  searchText: any;

  constructor(private productsService: ProductsService, private companyService: CompanyService) {
  }

  ngAfterContentInit(): void {
    this.createChart();
  }


  ngOnInit(): void {
    this.companyService.getProducts().subscribe((data: ICompanyProducts[]) => {
      this.products = data;
      this.products2 = data;
      this.createChart();
      this.refreshPhotos(this.products);
    });
    this.productsService.getSubCategories().subscribe((data: any) => {
      this.categories = data;
    });
  }

  refreshPhotos(products: ICompanyProducts[]){
    products.forEach(product => {
      this.productsService.getProductPhoto(product.id).subscribe((data: any) => {
        this.updateProfilePicture2(product.id, data);
      });
    })
  }

  addParameter() {
    this.product.parameters.push(new Parameter("", ""));
  }

  addParameter2() {
    this.productAdd.parameters.push(new Parameter("", ""));
    console.log(this.productAdd.parameters);
  }

  showProduct(id: number) {
    this.product.images = [];
    this.selected = 'product';
    this.companyService.getProduct(id).subscribe((data: any) => {
      let arr: string[] = []
      for (let i = 0; i < data.images; i++) {
        arr.push(i.toString());
      }
      this.product = data;
      this.product.images = arr;

      this.product.images.forEach((key: string) => {
        this.productsService.getProductPhoto(this.product.id, +key).subscribe((data: any) => {
          this.updateProfilePicture3(this.product.id+'product'+key, data);
        });
      })
      this.selected = 'product';
    });
  }

  updateProfilePicture2(productId: number, imageData: ArrayBuffer): void {
    const blob = new Blob([imageData], {type: 'image/png'});
    let element = (<HTMLInputElement>document.getElementById(productId.toString()));
    element.src = URL.createObjectURL(blob);
  }

  updateProfilePicture3(productId: string, imageData: ArrayBuffer): void {
    const blob = new Blob([imageData], {type: 'image/png'});
    let element = (<HTMLInputElement>document.getElementById(productId));
    element.src = URL.createObjectURL(blob);
  }

  createChart() {
    this.companyService.getCompanyProductsStats().subscribe((data: any) => {
      this.stat = data;
      if(data.expenseCategoryList[0] != undefined)
        new Chart(this.chartRef4.nativeElement, {
          type: 'doughnut',
          data: {
            datasets: [
              {
                data: [100 - data.expenseCategoryList[0].percentage, data.expenseCategoryList[0].percentage],
                backgroundColor: ["#FFFFFF", "#000000"],
              }
            ]
          },
          options: {
            responsive: true,
            cutout: 28,
            elements: {
              arc: {
                borderWidth: 0,
              }
            },
            plugins: {
              legend: {
                display: false,
              },
              title: {
                display: false,
              }
            }
          },
        });
      if(data.expenseCategoryList[1] != undefined)
        new Chart(this.chartRef5.nativeElement, {
          type: 'doughnut',
          data: {
            datasets: [
              {
                data: [100 - data.expenseCategoryList[1].percentage, data.expenseCategoryList[1].percentage],
                backgroundColor: ["#FFFFFF", "#000000"],
              }
            ]
          },
          options: {
            responsive: true,
            cutout: 28,
            elements: {
              arc: {
                borderWidth: 0,
              }
            },
            plugins: {
              legend: {
                display: false,
              },
              title: {
                display: false,
              }
            }
          },
        });
      if(data.expenseCategoryList[2] != undefined)
        new Chart(this.chartRef6.nativeElement, {
          type: 'doughnut',
          data: {
            datasets: [
              {
                data: [100 - data.expenseCategoryList[2].percentage, data.expenseCategoryList[2].percentage],
                backgroundColor: ["#ffffff", "#000000"],
              }
            ]
          },
          options: {
            responsive: true,
            cutout: 28,
            elements: {
              arc: {
                borderWidth: 0,
              }
            },
            plugins: {
              legend: {
                display: false,
              },
              title: {
                display: false,
              }
            }
          },
        });
    });
  }

  updateProduct(id: number) {
    this.addProductt = new AddProduct();
    this.addProductt.id = id;
    this.addProductt.title = (<HTMLInputElement>document.getElementById('titleValue')).value;
    this.addProductt.description = (<HTMLInputElement>document.getElementById('descriptionValue')).value;
    let price = (<HTMLInputElement>document.getElementById('priceValue')).value;
    this.addProductt.price = parseFloat(price);
    let discount = (<HTMLInputElement>document.getElementById('discountPriceValue')).value;
    this.addProductt.discountPrice = parseFloat(discount);
    this.addProductt.parameters = this.product.parameters;
    this.addProductt.sizes = this.product.sizes;
    let formData = new FormData();

    let images2 = (<HTMLInputElement>document.getElementById("images2"));

    let images;
    if (images2) {
      images = images2.files;
    }
    if (images) {
      for (let i = 0; i < images.length; i++) {
        formData.append("file", images[i]);
      }
    }

    this.companyService.setProductImages(id, formData).subscribe((data: any) => {});
    this.companyService.updateProduct(this.addProductt);
    this.companyService.getProducts().subscribe((data: any) => {
      this.products = data;
      this.products2 = data;
      this.refreshPhotos(this.products);
    });

    this.addProductt = new AddProduct();
    this.selected = 'default';
    this.createChart();
  }

  addSize() {
    this.productAdd.sizes.push(new Size2("", 0));
  }

  addProduct() {
    let subcategory = (<HTMLOptionElement>document.getElementById("subcategory"));
    this.productAdd.subcategoryId = parseInt(subcategory.value);
    this.productAdd.title = (<HTMLInputElement>document.getElementById('title')).value;
    this.productAdd.description = (<HTMLInputElement>document.getElementById('description')).value;
    let price = (<HTMLInputElement>document.getElementById('price')).value;
    let images = (<HTMLInputElement>document.getElementById("images")).files;
    const formData = new FormData();
    if (images) {
      for (let i = 0; i < images.length; i++) {
        formData.append("file", images[i]);
      }
    }
    this.productAdd.price = parseFloat(price);
    this.companyService.createProduct(this.productAdd).subscribe((data2: any) => {
      this.companyService.setProductImages(data2, formData).subscribe((data: any) => {
        this.companyService.getProducts().subscribe((data: any) => {
          this.products = data;
          this.products2 = data;
        });
      });
      this.selected = 'default';
      this.createChart();
    });
  }

  deleteSize(i: number) {
    this.productAdd.sizes.splice(i, 1);
  }

  addSizeProduct() {
    this.product.sizes.push(new Size2("", 0));
  }

  deleteParameter(i: number) {
    this.product.parameters.splice(i, 1);
  }

  deleteSize2(i: number) {
    this.product.sizes.splice(i, 1);
  }

  deleteParameter2(i: number) {
    this.productAdd.parameters.splice(i, 1);
  }

  plusSlides(val: number) {
    this.showSlides(this.slideIndex += val);
  }

  showSlides(n: number) {
    let i;
    let slides = document.getElementsByClassName("mySlides");
    let dots = document.getElementsByClassName("dot");
    if (n > slides.length) {
      this.slideIndex = 1
    }
    if (n < 1) {
      this.slideIndex = slides.length
    }
    for (i = 0; i < slides.length; i++) {
      const slide = slides[i] as HTMLElement;
      slide.style.display = "none";
    }
    slides[this.slideIndex - 1].setAttribute("style", "display: block;");
  }

  removeProduct(id: number) {
    this.companyService.retireProduct(id).subscribe(() => {
      this.companyService.getProducts().subscribe((data: any) => {
        this.products2 = data;
        this.products = data;
        this.filterByStatus = 'All';
        this.selected = 'default';
        this.createChart();
        this.refreshPhotos(this.products2);
      });
    });
  }

  protected readonly filter = filter;

  uploadImages(): void {
    this.addProductImages = [];

    const inputElement = document.getElementById('images') as HTMLInputElement;
    const files: FileList | null = inputElement.files;

    if (files) {
      for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();
        const file = files[i];

        reader.onloadend = () => {
          const base64String = (reader.result as string).split(',')[1];
          this.addProductImages.push('data:image/' + file.type + ';base64,' + base64String);
        };

        reader.readAsDataURL(file);
      }
    }
  }

  changeStatus() {
    const currentIndex = this.statuses.indexOf(this.filterByStatus);
    const newIndex = (currentIndex + 1) % this.statuses.length;
    this.filterByStatus = this.statuses[newIndex];
    if (this.filterByStatus == 'Active') {
      this.products = this.products2.filter(product => product.active);
    } else if (this.filterByStatus == 'Retired') {
      this.products = this.products2.filter(product => !product.active);
    } else {
      this.products = this.products2;
    }

    this.refreshPhotos(this.products);
  }

  updateImages() {
    this.product.images = [];

    const inputElement = document.getElementById('images2') as HTMLInputElement;
    const files: FileList | null = inputElement.files;

    if (files) {
      for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();
        const file = files[i];

        reader.onloadend = () => {
          const base64String = (reader.result as string).split(',')[1];
          this.product.images.push('data:image/' + file.type + ';base64,' + base64String);
        };

        reader.readAsDataURL(file);
      }
    }
  }

}

class Product {
  id!: number;
  title!: string;
  description!: string;
  price!: number;
  discountPrice!: number
  addTime!: Date;
  sales!: number;
  sizes!: Size2[];
  parameters!: Parameter[];
  images: string[] = [];
  suspended!: Date;
  numOfClients!: number;
  rating!: number;
  numOfComments!: number;
  valOfStoredProducts!: number;
  category!: string;

  constructor() {
  }
}

export class AddProduct2 {
  title!: string;
  description!: string;
  price!: number;
  sizes: Size2[] = [];
  parameters: Parameter[] = [];
  subcategoryId!: number;

  constructor() {
  }
}

class Size2 {
  sizeValue!: string;
  quantity!: number;

  constructor(sizeValue: string, quantity: number) {
    this.sizeValue = sizeValue;
    this.quantity = quantity;
  }
}

export class AddProduct {
  id!: number;
  title!: string;
  description!: string;
  price!: number;
  discountPrice!: number
  sizes: Size2[] = [];
  parameters: Parameter[] = [];
  subcategoryId!: number;

  constructor() {
  }
}

class Parameter {
  key!: string;
  value!: string;

  constructor(key: string, value: string) {
    this.key = key;
    this.value = value;
  }
}

class Category {
  id!: number;
  name!: string;
}

class Stats {
  avgMonthlyIncome!: number;
  activeProducts!: number;
  retiredProducts!: number;
  noOfClients!: number;
  overallRating!: number;
  valueOfProducts!: number;
  expenseCategoryList!: Expense[];
}

class Expense {
  category!: string;
  amount!: number;
  percentage!: number;
}
