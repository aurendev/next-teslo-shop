import { Box, Typography } from "@mui/material";
import type { NextPage, GetServerSideProps } from "next";

import { ShopLayout } from "../../components/layouts";
import { ProductList } from "../../components/products";

import { dbProducts } from "../../database";
import { IProduct } from "../../interfaces";

interface Props {
	products: IProduct[];
	foundProducts: boolean;
	query: string;
}

const Home: NextPage<Props> = ({ products, query, foundProducts }) => {
	return (
		<ShopLayout
			title={"Tesla-shop | Search"}
			pageDescription={"Busqueda de producto"}
		>
			<Typography variant="h1" component={"h1"}>
				Buscar Producto
			</Typography>
			{foundProducts ? (
				<Typography variant="h2" component={"h2"} sx={{ mb: 1 }}>
					Termino : {query}
				</Typography>
			) : (
				<Box display={'flex'} alignItems='center' >
					<Typography variant="h2" component={"h2"} sx={{ mb: 1 }}>
						No se encontro Productos para : 
					</Typography>
					<Typography variant="h2" color='secondary' component={"h2"} sx={{ mb: 1 }}>
						{query}
					</Typography>
				</Box>
			)}

			<ProductList products={products!} />
		</ShopLayout>
	);
};

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time
export const getServerSideProps: GetServerSideProps = async (ctx) => {
	const { query = "" } = ctx.params as { query: string };

	let products = await dbProducts.searchByTerm(query);

	const foundProducts = products.length > 0;

	if (!foundProducts) {
		products = await dbProducts.getAll();
	}

	return {
		props: {
			products,
			query,
			foundProducts,
		},
	};
};

export default Home;
