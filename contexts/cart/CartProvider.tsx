import { FC, useEffect, useReducer } from "react";
import { ICartProduct, IOrder, ShippingAddress } from "../../interfaces";
import { CartContext, cartReducer } from "./";

import Cookie from "js-cookie";
import { tesloApi } from "../../api";
import axios from "axios";

export interface CartState {
	cart: ICartProduct[];
  shippingAddress?: ShippingAddress;
	isLoaded: boolean;
	numberOfItems: number;
	subTotal: number;
	taxRate: number;
	total: number;
}



const CART_INITIAL_STATE: CartState = {
	cart: [],
	isLoaded: false,
	numberOfItems: 0,
	subTotal: 0,
	taxRate: 0,
	total: 0,
  shippingAddress: undefined
};

interface Props {
	children?: React.ReactNode;
}

export const CartProvider: FC<Props> = ({ children }) => {
	const [state, dispatch] = useReducer(cartReducer, CART_INITIAL_STATE);

	useEffect(() => {
		LoadCartFromCookies(JSON.parse(Cookie.get("cart") ?? "[]"));
	}, []);

  useEffect(() => {
    const userAddress = Cookie.get("user-address") ?? null;
    if(userAddress) {
      const address = JSON.parse(userAddress);
      dispatch({
        type: "[Cart] - Load user adreess from cookies",
        payload: address
      });
    }
  }, [])
  

	useEffect(() => {
		if (state.cart.length > 0) {
			Cookie.set("cart", JSON.stringify(state.cart));
		}
	}, [state.cart]);

	useEffect(() => {
		const numberOfItems = state.cart.reduce(
			(prev, current) => current.quantity + prev,
			0
		);

		const subTotal = state.cart.reduce(
			(prev, current) => current.price * current.quantity + prev,
			0
		);

		const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0) * subTotal;

		const orderSummary = {
			numberOfItems,
			subTotal,
			taxRate,
			total: subTotal + taxRate,
		};
		dispatch({ type: "[Cart] - Update order Summary", payload: orderSummary });
	}, [state.cart]);

	const addProduct = (products: ICartProduct[]) => {
		dispatch({ type: "[Cart] - Add Product", payload: products });
	};

	const LoadCartFromCookies = (products: ICartProduct[]) => {
		dispatch({
			type: "[Cart] - LoadCart from cookies | storage",
			payload: products,
		});
	};

	const updateCart = (product: ICartProduct) => {
		dispatch({ type: "[Cart] - Update Product", payload: product });
	};

	const removeProductInCart = (product: ICartProduct) => {
		dispatch({ type: "[Cart] - Remove Product", payload: product });
	};

  const updateShippingAddress = (address: ShippingAddress) => {
    Cookie.set("user-address", JSON.stringify(address));
    
    dispatch({
      type: "[Cart] - Update user adreess from cookies",
      payload: address
    });
  }

  const createOrder = async  () :Promise<{hasError:boolean, message: string}> => {

    if(!state.shippingAddress) {
      throw new Error("No shipping address :(");
    }

    const body : IOrder = {
      orderItems: state.cart.map(product => ({
        ...product,
        size: product.size!
      })),
      shippingAddress: state.shippingAddress,
      numberOfItems: state.numberOfItems,
      subTotal: state.subTotal,
      taxRate: state.taxRate,
      total: state.total,
      isPaid: false,
    }

    try {
      const {data} = await tesloApi.post("/orders", body)

      dispatch({type: '[Cart] - Order complete'})

      return {hasError: false, message: data._id}
      
    } catch (error:any) {
      if(axios.isAxiosError(error)){

        const  {message } = error.response!.data as  {message:string}
        return {hasError: true, message}
      }

      return {
        hasError: true,
        message: 'Error no controlado, hable con el administrador'
      }

    }

  }

	return (
		<CartContext.Provider
			value={{
				...state,
        //Methods
				addProduct,
				updateCart,
				removeProductInCart,
        updateShippingAddress,
        //Orders
        createOrder
			}}
		>
			{children}
		</CartContext.Provider>
	);
};
