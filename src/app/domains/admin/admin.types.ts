import {IOrderProduct, IOrderStatus, ISize} from "../products/product.types";

export interface IAdminMainCategory {
  id: number;
  name: string;
  products: number;
  sales: number;
  deleted: Date | null;
  subCategories: IAdminSubCategory[];
}

export interface IAdminSubCategory {
  id: number;
  name: string;
  products: number;
  sales: number;
  deleted: Date | null;
  filters: IAdminFilter[];
}

export interface IAdminFilter {
  id: number;
  key: string;
  values: IAdminFilterValue[];
}

export interface IAdminFilterValue {
  id: number;
  value: string;
}

export interface IAdminCompany {
  companyId: number;
  companyName: string;
  fullName: string;
  sales: number;
  moneyTurnover: number;
  products: number;
  ordersCompleted: number;
  inProgressOrders: number;
  lastActivity: Date;
  created: Date;
  banned: Date | null;
}

export interface IAdminOrder {
  id: number;
  statuses: IOrderStatus[];
  price: number;
  userid: number;
  firstName: string;
  lastName: string;
  username: string;
  sendTime: Date;
  city: string;
  street: string;
  houseNumber: number;
  zipcode: string
  phone: number;
  items: IOrderCompany[];
  amountOfProducts: number;
}

export interface IOrderCompany {
  statuses: IOrderStatus[];
  companyName: string;
  items: IOrderProduct[];
  lastStatus: IOrderStatus;
}

export interface IAdminOrders {
  id: number;
  username: string;
  price: number;
  sendtime: Date;
  status: string;
  companies: string[];
  country: string;
  city: string;
  street: string;
  addressNumber: number;
  items: number;
}

export interface IAdminUsers {
  id:number;
  username: string;
  first_name: string;
  last_name: string;
  created: Date;
  banned: Date;
  company_name: string;
  moneyTurnover: number;
  allOrders: number;
  sentOrders: number;
  balance: number;
  photo: boolean;
}

export interface IAdminUser {
  id: number;
  firstName: string;
  lastName: string;
  userName: string;
  created: Date;
  banned: Date;
  orders: IAdminUserOrder[];
  lastOrder: Date;
  photo: boolean;
}

export interface IAdminUserOrder {
  id: number;
  price: number;
  street: string;
  zip_code: string;
  apartment_number: number;
  city: string;
  created: Date;
  status: string;
}

export interface IAdminProducts {
  id: number;
  name: string;
  actualPrice: number;
  sales: number;
  companyName: string;
  addTime: Date;
  suspended: boolean
  subCategory: string;
  totalRevenue: number;
}

export interface IAdminProduct {
  id: number;
  title: string;
  description: string;
  subCategory: string;
  price: number;
  discount_price: number;
  companyName: string;
  addTime: Date;
  moneyTurnover: number;
  sales: number;
  deleted: Date;
  orders: IProductOrders[];
  types: string[];
  sizes: ISize[];
}

export interface IProductOrders {
  id: number;
  sizeValue: string;
  price: number;
  quantity: number;
  sendTime: Date;
  images: string;
  status: string;
}
