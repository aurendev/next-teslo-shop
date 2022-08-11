import {
	Box,
	Button,
	CardActionArea,
	CardMedia,
	Grid,
	Link,
	Typography,
} from "@mui/material";

import NextLink from "next/link";
import { ItemCounter } from "../ui";
import { FC, useContext } from "react";
import { CartContext } from "../../contexts";
import { ICartProduct, IOrderItem } from "../../interfaces";

interface Props {
	editable?: boolean;
  products?: IOrderItem[];
}

export const CartList: FC<Props> = ({ editable = false, products }) => {
	const { cart,updateCart,removeProductInCart } = useContext(CartContext);


  const productsToShow = products ?? cart

  const updateProductQuantity = (value:number, product: ICartProduct)=>{
    product.quantity = value
    updateCart(product)
  }

	return (
		<>
			{productsToShow.map((product: ICartProduct | IOrderItem) => (
				<Grid container spacing={2} key={product.slug+ product.size} sx={{ mb: 1 }}>
					<Grid item xs={3}>
						{/* // Todo: Llevar a la pagina del producto */}
						<NextLink href={product.slug} passHref>
							<Link>
								<CardActionArea>
									<CardMedia
										image={`/products/${product.image}`}
										component="img"
										sx={{ borderRadius: "5px" }}
									/>
								</CardActionArea>
							</Link>
						</NextLink>
					</Grid>

					<Grid item xs={7}>
						<Box display={"flex"} flexDirection="column">
							<Typography variant="body1">{product.title}</Typography>
							<Typography variant="body1">
								Talla: <strong>{product.size}</strong>
							</Typography>

							{editable ? (
								<ItemCounter
									maxItem={10}
									currenValue={product.quantity}
									onChangeValue={(value) => updateProductQuantity(value, product as ICartProduct)}
								/>
							) : (
								<Typography variant="subtitle1"> 
                  {product.quantity} {product.quantity > 1? 'productos' : 'producto'}
                </Typography>
							)}
						</Box>
					</Grid>

					<Grid
						item
						xs={2}
						display="flex"
						alignItems={"center"}
						flexDirection="column"
					>
						<Typography variant="subtitle1">{`$${product.price}`}</Typography>
						{editable && (
							<Button
                onClick={()=> removeProductInCart(product as ICartProduct)}
                variant="text" color="secondary">
								Remover
							</Button>
						)}
					</Grid>
				</Grid>
			))}
		</>
	);
};
