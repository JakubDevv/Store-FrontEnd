export interface IUser {
  firstName: string;
  lastName: string;
  username: string;
  createdAt: Date;
  roles: string[];
  companyName: string;
  balance: number;
}

export interface IUserOrder2 {
  id: number;
  date: Date;
  price: number;
  companies: string[];
  companiesId: number[];
  items: IUserOrderProduct[];
  status: string;
  zipCode: string;
  country: string;
  city: string;
  street: string;
  num: number;
  send: Date | null;
  productsId: number[];
  dateReceipt: Date | null;
  phone: number;
}

export interface IUserOrderProduct {
  id: number;
  title: string;
  size: string;
  price: number;
  quantity: number;
  productId: number;
  companyName: string;
  parameters: string[];
}

export interface IUserStats2 {
  spent: number;
  spentChange: number;
  income: number;
  incomeChange: number;
  amountOfTransactions: number;
  amountOfTransactionsChange: number;
}

export interface IUserStats {
  spending: IAmountDate[];
  avgMonthlySpend: number;
  last6MonthTotal: number;
  lastYearTotal: number;
  expenseByCategory: IExpenseByCategory[];
}

export interface IExpenseByCategory {
  category: string;
  amount: number;
  percentage: number;
}

export interface IAmountDate {
  date: Date;
  amount: number;
}
