export interface IPaging<T> {
  content: T[];
  last: boolean;
  number: number;
  first: boolean;
  totalPages: number;
}

export interface IProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  discountPrice: number;
  sizes: ISize[];
  parameters: IParameter[];
  images: number;
  companyName: String;
}

export interface IProducts {
  id: number;
  title: string;
  companyName: string;
  sizeList: ISize[];
  price: number;
  discountPrice: number;
  starsRate: number;
  premiere: Date;
  sales: number;
  discountPercentage: number;
  image1: ArrayBuffer;
  image2: ArrayBuffer;
  category: string;
  amountOfImages: number;
}

export interface IProducts2 {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPrice: number;
  starsRate: number;
  amountOfImages: number;
  image1: ArrayBuffer;
  image2: ArrayBuffer;
}
export interface ISize {
  id: number;
  sizeValue: string;
  quantity: number;
}

export interface IParameter {
  key: string;
  value: string;
}

export interface IProductReview {
  id: number;
  message: string;
  rating: number;
  sendTime: Date;
  userName: string;
}

export interface IProductRating {
  average: number;
  amount: number;
  fiveStar: number;
  fourStar: number;
  threeStar: number;
  twoStar: number;
  oneStar: number;
}

export interface IFilter {
  key: string;
  values: IFilterValue[];
}

export interface IFilterValue {
  id: number;
  value: string;
}

export interface IMainCategory {
  id: number;
  name: string;
  subCategory: ISubCategory[];
}

export interface ISubCategory {
  id: number;
  name: string;
}

export interface IOrderStatus {
  status: string;
  time: Date;
}

export interface  IOrderProduct {
  title: string;
  parameterValues: string[];
  size: string;
  price: number;
  quantity: number;
  id: number;
  orderItemId: number;
}

export interface ICartItem {
  id: number;
  quantity: number;
  name: string;
  price: number;
  sizeId: number;
  size: string;
  photo: any;
}

export interface ICategory {
  id: number;
  name: string;
  products: IProducts2[];
}

export interface ICategoryOrder {
  id: number;
  name: string;
  price: number;
  products: IProductExpense[];
}

export interface IProductExpense {
  id: number;
  name: string;
  amount: number;
}
