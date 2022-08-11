import { createContext } from "react";
import { ICartProduct, ShippingAddress } from "../../interfaces";

interface ContextProps {
	cart: ICartProduct[];
  isLoaded:boolean;
  shippingAddress?: ShippingAddress;
	numberOfItems: number;
	subTotal: number;
	taxRate: number;
	total: number;
	addProduct: (products: ICartProduct[]) => void;
	updateCart: (product: ICartProduct) => void;
	removeProductInCart: (product: ICartProduct) => void;
  updateShippingAddress: (address: ShippingAddress) => void,
  //Orders
  createOrder: () => Promise<{hasError:boolean, message: string}>,
}

export const CartContext = createContext({} as ContextProps);
