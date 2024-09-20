import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Chart} from "chart.js";
import {AdminService} from "../../domains/admin/admin.service";
import {IAdminFilter, IAdminMainCategory, IAdminSubCategory} from "../../domains/admin/admin.types";

@Component({
  selector: 'app-admin-category',
  templateUrl: './admin-category.component.html',
  styleUrls: ['./admin-category.component.css']
})
export class AdminCategoryComponent implements OnInit {

  @ViewChild('productsByCategory') private productsByCategory!: ElementRef;

  @ViewChild('productsBySubCategory') private productsBySubCategory!: ElementRef;

  @ViewChild('salesBySubCategory') private salesBySubCategory!: ElementRef;

  categories: IAdminMainCategory[] = [];

  openedFilters: string[] = [];

  name: string = "";

  datePlaceholder = new Date('2019-12-12');

  id: number = 0;

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    this.adminService.getCategories().subscribe((data: IAdminMainCategory[]) => {
      this.categories = data;
    });
    this.createMainCategoryChart();
    this.createSubCategoryChart();
    this.createMainCategorySalesChart();
  }

  showFilters(key: string) {
    let number1 = this.openedFilters.indexOf(key);
    if(number1 > -1){
      this.openedFilters.splice(number1, 1);
    }else {
      this.openedFilters.push(key);
    }
    console.log(this.openedFilters)
  }

  deleteCategory(categoryId: number) {
    this.adminService.deleteCategory(categoryId).subscribe(() => {
      let find = this.categories.find(category => category.id == categoryId);
      find!.deleted = new Date();
      find!.subCategories.forEach(subCategory => subCategory!.deleted = new Date());
    });
  }

  randomColor(number: number){
    let colors = ['#292F33','#66757F','#131334','#071d21','#CCD6DD','#FFFFFF'];
    return colors.splice(0, number);
  }

  createSubCategoryChart() {
    this.adminService.getSubCategoryAmountOfProducts().subscribe((data: any) => {
      let data2: string[] = [];
      let data3: number[] = [];
      data.forEach((dat:any) => {
        data2.push(dat.name);
        data3.push(dat.amountOfProducts);
      })
      const myChart = new Chart(this.productsBySubCategory.nativeElement, {
        type: 'doughnut',
        data: {
          labels: data2,
          datasets: [{
            label: 'Products',
            data: data3,
            backgroundColor: this.randomColor(data2.length)
          }]
        },
        options: {
          plugins: {
            legend: {
              display: false,
            }
          },
          elements: {
            point: {
              radius: 0
            }
          },
          scales: {
            y: {
              title: {
                display: false,
              },
              display: false
            },
            x: {
              title: {
                display: false,
              },
              display: false
            },
          }
        }
      });
    });
  }

  createMainCategoryChart() {
    this.adminService.getCategoryAmountOfProducts().subscribe((data: any) => {
      let data2: string[] = [];
      let data3: number[] = [];
      data.forEach((dat:any) => {
        data2.push(dat.name);
        data3.push(dat.amountOfProducts);
      })
      const myChart = new Chart(this.productsByCategory.nativeElement, {
        type: 'doughnut',
        data: {
          labels: data2,
          datasets: [{
            label: 'Products',
            data: data3,
            backgroundColor: this.randomColor(data2.length)
          }]
        },
        options: {
          plugins: {
            legend: {
              display: false,
            }
          },
          elements: {
            point: {
              radius: 0
            }
          },
          scales: {
            y: {
              title: {
                display: false,
              },
              display: false
            },
            x: {
              title: {
                display: false,
              },
              display: false
            },
          }
        }
      });
    });
  }

  createMainCategorySalesChart() {
    this.adminService.getSubCategorySales().subscribe((data: any) => {
      let data2: string[] = [];
      let data3: number[] = [];
      data.forEach((dat:any) => {
        data2.push(dat.name);
        data3.push(dat.amountOfProducts);
      })
      const myChart = new Chart(this.salesBySubCategory.nativeElement, {
        type: 'doughnut',
        data: {
          labels: data2,
          datasets: [{
            label: 'Sales',
            data: data3,
            backgroundColor: this.randomColor(data2.length)
          }]
        },
        options: {
          plugins: {
            legend: {
              display: false,
            }
          },
          elements: {
            point: {
              radius: 0
            }
          },
          scales: {
            y: {
              title: {
                display: false,
              },
              display: false
            },
            x: {
              title: {
                display: false,
              },
              display: false
            },
          }
        }
      });
    });
  }

  deleteFilter(filterId: number, subCategoryId: number){
    this.adminService.deleteFilter(filterId).subscribe(() => {
      let subCategory = this.findSubCategoryById(subCategoryId);
      let findIndex = subCategory?.filters.findIndex(filter => filter.id == filterId);
      // @ts-ignore
      subCategory?.filters.splice(findIndex, 1);
    });
  }

  deleteFilterValue(filterValueId: number, filterId: number){
    this.adminService.deleteFilterValue(filterValueId).subscribe(() => {
      let filter = this.findFilterById(filterId);
      let findIndex = filter?.values.findIndex(val => val.id == filterValueId);
      // @ts-ignore
      filter?.values.splice(findIndex, 1);
    });
  }

  createFilter(subCategoryId: number){
    let filterValue = (document.getElementById("filter"+subCategoryId) as HTMLInputElement);
    this.adminService.createFilter(subCategoryId, filterValue.value).subscribe((data:any) => {
      this.findSubCategoryById(subCategoryId)?.filters.push(data);
    });
    (document.getElementById("filter"+subCategoryId) as HTMLInputElement).value = "";
  }

  createFilterValue(filterId: number){
    let filterValueInput = document.getElementById("filterValue" + filterId.toString()) as HTMLInputElement;
    this.adminService.createFilterValue(filterId, filterValueInput.value).subscribe((data: any) => {
      let foundFilter = this.findFilterById(filterId);

      // @ts-ignore
      if (!foundFilter.values) {
        // @ts-ignore
        foundFilter.values = [];
      }

      // @ts-ignore
      foundFilter.values.push(data);

      filterValueInput.value = "";
    });
  }

  createCategory() {
    let categoryName = (document.getElementById("categoryName2") as HTMLInputElement);
    this.adminService.createCategory(categoryName.value).subscribe(() => {
      this.adminService.getCategories().subscribe((data: IAdminMainCategory[]) => {
        this.categories = data;
      });
    });
    (document.getElementById("categoryName2") as HTMLInputElement).value = "";
  }

  createSubCategory(id: number) {
    let subCategoryName = (document.getElementById("subCategory" + id) as HTMLInputElement);
    return this.adminService.createSubCategory(id, subCategoryName.value).subscribe(() => {
      this.adminService.getCategories().subscribe((data:IAdminMainCategory[]) => {
        this.categories = data;
      });
    });
  }

  findSubCategoryById(subCategoryId: number): IAdminSubCategory | undefined {
    const findSubCategory = (subCategory: IAdminSubCategory) => subCategory.id === subCategoryId;
    const findMainCategory = (mainCategory: IAdminMainCategory) => mainCategory.subCategories.find(findSubCategory);

    return this.categories.find(findMainCategory)?.subCategories.find(findSubCategory);
  }

  findFilterById(filterId: number): IAdminFilter | undefined {
    for (const mainCategory of this.categories) {
      for (const subCategory of mainCategory.subCategories) {
        const foundFilter = subCategory.filters.find((filter) => filter.id === filterId);

        if (foundFilter) {
          return foundFilter;
        }
      }
    }
    return undefined;
  }

  deleteCategory2(id: number) {
    let find = this.categories.find(category => category.id === id);

    if (find !== undefined && find.deleted == undefined) {
      find.deleted = this.datePlaceholder;
    }
  }

  showNormal(id: number) {
    let find = this.categories.find(category => category.id === id);

    if (find !== undefined && find.deleted == this.datePlaceholder) {
      find.deleted = null;
    }
  }


  deleteCategory3(id: number) {
    let find = this.findSubCategoryById(id);

    if (find !== undefined && find.deleted == undefined) {
      find.deleted = this.datePlaceholder;
    }
    console.log(find);
  }

  showNormal3(id: number) {
    let find = this.findSubCategoryById(id);

    if (find !== undefined && find.deleted == this.datePlaceholder) {
      find.deleted = null;
    }
  }

  deleteSubCategory(subCategoryId: number){
    this.adminService.deleteSubCategory(subCategoryId).subscribe(() => {
      let subCategoryy = this.findSubCategoryById(subCategoryId);
      subCategoryy!.deleted = new Date();
    });
  }

}
