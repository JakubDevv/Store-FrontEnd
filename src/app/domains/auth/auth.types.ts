export interface ITransaction {
  id: number;
  amount: number;
  orderId: number;
  date: Date;
  type: string;
  names: string[];
  products: string[];
}
