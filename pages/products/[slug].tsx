import { Button, Chip, Grid, Typography, Box } from "@mui/material";
import {
	NextPage,
	GetServerSideProps,
	GetStaticPaths,
	GetStaticProps,
} from "next";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { ShopLayout } from "../../components/layouts";
import { ProductSlideshow, SizeSelector } from "../../components/products";
import { ItemCounter } from "../../components/ui";
import { CartContext } from "../../contexts";
import { dbProducts } from "../../database";

import { ICartProduct, IProduct, IValidSize } from "../../interfaces";

interface Props {
	product: IProduct;
}

const SlugPage: NextPage<Props> = ({ product }) => {

  const {addProduct,cart} = useContext(CartContext)

  const router = useRouter()

	const [tempProductInCart, setTempProductInCart] = useState<ICartProduct>({
		_id: product._id.toString(),
		image: product.images[0],
		inStock: product.inStock,
		price: product.price,
		size: undefined,
		slug: product.slug,
		title: product.title,
		gender: product.gender,
		quantity: 1,
	});

	const onChangeSelectedSize = (size: IValidSize) => {
		console.log("[cambio desdeel padre]", size);
		setTempProductInCart({...tempProductInCart, size: size})
	};

	const onUpdateQuatity = (quantity: number) => {
    setTempProductInCart(currentProduct => ({...currentProduct, quantity}))
	};

  const onAddProductIncart = () => {
    if(!tempProductInCart.size) return false

    const isProductInCart = (product: ICartProduct)=>{
      return product._id === tempProductInCart._id && product.size === tempProductInCart.size
    }

    let newCart 

    if(!!cart.find(product => isProductInCart(product) )){
      newCart = cart.map(product => {
        if(isProductInCart(product)){
          product.quantity += tempProductInCart.quantity 
        }
        return product
      })
    }else{
      newCart = [...cart, tempProductInCart]
    }

    addProduct([...newCart])

    router.push('/cart')
  }

	return (
		<ShopLayout title={product.title} pageDescription={product.description}>
			<Grid container spacing={3}>
				<Grid item xs={12} sm={7}>
					<ProductSlideshow images={product.images} />
				</Grid>

				<Grid item xs={12} sm={5}>
					<Box display={"flex"} flexDirection="column">
						<Typography variant="h1" component={"h1"}>
							{product.title}
						</Typography>
						<Typography
							variant="subtitle1"
							component={"h2"}
						>{`$${product.price}`}</Typography>

						{/* Cantidad */}
						<Box sx={{ my: 2 }}>
							<Typography variant="subtitle2">Cantidad</Typography>
							<ItemCounter
                maxItem={product.inStock}
                onChangeValue={onUpdateQuatity} 
                currenValue={tempProductInCart.quantity}/>
							<SizeSelector
								onChangeSizeSelected={onChangeSelectedSize}
								sizes={product.sizes}
							/>
						</Box>

						{product.inStock === 0 ? (
							<Chip
								label="No hay disponibles"
								color={"error"}
								variant={"outlined"}
							/>
						) : (
							<Button
                onClick={onAddProductIncart} 
                color="info" className="circular-btn">
								{tempProductInCart.size
									? "Agregar al carrito"
									: "Seleccione una talla"}
							</Button>
						)}

						<Box sx={{ mt: 3 }}>
							<Typography variant={"subtitle2"}>Description</Typography>
							<Typography variant={"body2"}>{product.description}</Typography>
						</Box>
					</Box>
				</Grid>
			</Grid>
		</ShopLayout>
	);
};

// You should use getStaticPaths if you’re statically pre-rendering pages that use dynamic routes

export const getStaticPaths: GetStaticPaths = async (ctx) => {
	const productsSlugs = await dbProducts.getSlugsAll(); // your fetch function here

	return {
		paths: productsSlugs.map((product) => {
			return {
				params: { slug: product.slug },
			};
		}),
		fallback: "blocking",
	};
};

// You should use getStaticProps when:
//- The data required to render the page is available at build time ahead of a user’s request.
//- The data comes from a headless CMS.
//- The data can be publicly cached (not user-specific).
//- The page must be pre-rendered (for SEO) and be very fast — getStaticProps generates HTML and JSON files, both of which can be cached by a CDN for performance.

export const getStaticProps: GetStaticProps = async (ctx) => {
	const { slug = "" } = ctx.params as { slug: string };

	const product = await dbProducts.getBySlug(slug);

	if (!product) {
		return {
			redirect: {
				destination: "/",
				permanent: false,
			},
		};
	}

	return {
		props: {
			product,
		},
		revalidate: 86400,
	};
};

//! Como se haria con SSR
// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

// export const getServerSideProps: GetServerSideProps = async (ctx) => {

//   const  { slug = '' } = ctx.params as {slug: string}

//   const product = await dbProducts.getBySlug(slug)

//   if(!product){
//     return {
//       redirect:{
//         destination: '/',
//         permanent: false,
//       }
//     }
//   }

//   return {
//     props: {
//       product
//     }
//   }
// }

export default SlugPage;
