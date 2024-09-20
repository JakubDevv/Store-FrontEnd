import {ICategoryOrder} from "../products/product.types";

// export interface ICompanyOrder {
//   id: number;
//   city: string;
//   street: string;
//   houseNumber: number;
//   zipCode: string;
//   phone: number;
//   fullPrice: number;
//   dateOfOrder: Date;
//   items: ICompanyOrderProduct[];
//   status: string;
//   firstName: string;
//   lastName: string;
//   username: string;
//   sentDate: Date;
// }

export interface ICompanyOrderProduct {
  id: number;
  title: string;
  size: string;
  price: number;
  quantity: number;
  productId: number;
  parameterValues: string[];
}

export interface ICompanyOrders {
  id: number;
  quantity: number;
  date: Date;
  price: number;
  status: string;
  userId: number;
  city: string;
  street: string;
  apartment_num: number;
  items: number;
  firstName: string;
  lastName: string;
  country: string;
  photo: boolean;
  categories: ICategoryOrder[];
}

export interface ICompanyProducts {
  id: number;
  date: Date;
  name: string;
  category: string;
  categoryActive: boolean;
  sales: number;
  available: number;
  price: number;
  discount_price: number;
  income: number;
  active: boolean;
  image: ArrayBuffer;
}

export interface ICompanyOrder {
  id: number;
  city: string;
  street: string;
  houseNumber: number;
  zipCode: string;
  phone: number;
  fullPrice: number;
  dateOfOrder: Date;
  items: ICompanyOrderProduct[];
  status: string;
  firstName: string;
  lastName: string;
  username: string;
  sentDate: Date | null;
  completionDate: Date | null;
}

export interface ICompanyProducts {
  id: number;
  date: Date;
  name: string;
  category: string;
  categoryActive: boolean;
  sales: number;
  available: number;
  price: number;
  discount_price: number;
  income: number;
  active: boolean;
  image: ArrayBuffer;
}

export interface ICompanyStats {
  orders: number;
  income: number;
  soldProducts: number;
  comments: number;
  commentsChange: number;
  soldProductsChange: number;
  incomeChange: number;
  ordersChange: number;
}

export interface ICompanyUser {
  id: number;
  photo: boolean;
  firstName: string;
  lastName: string;
  money: number;
}

export interface ICountryIncome {
  name: string;
  money: number;
  amountOfOrders: number;
}

export interface IStatusIncome {
  status: string;
  income: number;
}

export interface IProductIncome {
  name: string;
  income: number;
}

export interface IStatuses {
  userId: number;
  orderId: number;
  orderPrice: number;
  date: Date;
  userName: string;
  statusTo: string;
}
