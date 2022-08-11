import { IValidSize } from "./products";
import { IUser } from "./user";


export interface IOrder {
  _id?: string;
  user?:IUser | string;
  orderItems: IOrderItem[];
  shippingAddress: ShippingAddress;
  paymentResult?: string;

  numberOfItems: number;
	subTotal: number;
	taxRate: number;
	total: number;

  isPaid: boolean;
  paidAt?: string;

  transactionId?: string;

  createdAt?: string;

}


export interface IOrderItem {
  _id: string;
  title: string;
  size: IValidSize;
  quantity: number;
  price: number;
  slug: string;
  image: string;
  gender: string;

}


export interface ShippingAddress {
	name: string;
	lastname: string;
	address1: string;
	address2?: string;
	zipCode: string;
	city: string;
	country: string;
	phone: string;
}