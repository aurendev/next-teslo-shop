import { ICartProduct } from "./../../interfaces/cart";

import { CartState } from "./";
import { ShippingAddress } from "../../interfaces";

type CartActionType =
	| {
			type: "[Cart] - LoadCart from cookies | storage";
			payload: ICartProduct[];
	  }
	| {
			type: "[Cart] - Load user adreess from cookies";
			payload: ShippingAddress;
	  }
	| {
			type: "[Cart] - Update user adreess from cookies";
			payload: ShippingAddress;
	  }
	| { type: "[Cart] - Add Product"; payload: ICartProduct[] }
	| { type: "[Cart] - Update Product"; payload: ICartProduct }
	| { type: "[Cart] - Remove Product"; payload: ICartProduct }
	| {
			type: "[Cart] - Update order Summary";
			payload: {
				numberOfItems: number;
				subTotal: number;
				taxRate: number;
				total: number;
			};
	  }
	| { type: "[Cart] - Order complete" };

export const cartReducer = (
	state: CartState,
	action: CartActionType
): CartState => {
	switch (action.type) {
		case "[Cart] - LoadCart from cookies | storage":
			return {
				...state,
				isLoaded: true,
				cart: [...action.payload],
			};

		case "[Cart] - Add Product":
			return {
				...state,
				cart: [...action.payload],
			};

		case "[Cart] - Update Product":
			return {
				...state,
				cart: state.cart.map((product) => {
					if (
						product._id === action.payload._id &&
						product.size === action.payload.size
					) {
						return action.payload;
					}
					return product;
				}),
			};

		case "[Cart] - Remove Product":
			return {
				...state,
				cart: state.cart.filter((product) => {
					if (
						product._id !== action.payload._id ||
						product.size !== action.payload.size
					) {
						return product;
					}
				}),
			};

		case "[Cart] - Update order Summary":
			return {
				...state,
				...action.payload,
			};

		case "[Cart] - Order complete":
			return {
				...state,
				cart: [],
				numberOfItems: 0,
				subTotal: 0,
				taxRate: 0,
				total: 0,
			};

		case "[Cart] - Load user adreess from cookies":
		case "[Cart] - Update user adreess from cookies":
			return {
				...state,
				shippingAddress: action.payload,
			};

		default:
			return state;
	}
};
