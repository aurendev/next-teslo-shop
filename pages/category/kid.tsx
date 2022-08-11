import { Typography } from "@mui/material";
import type { NextPage } from "next";
import { ShopLayout } from "../../components/layouts";
import { ProductList } from "../../components/products";
import { FullLoadingScreen } from "../../components/ui";
import { useProducts } from "../../hooks";

const KidPage: NextPage = () => {
	const { products, isLoading } = useProducts("/products?gender=kid");

	return (
		<ShopLayout
			title={"Category | Kid"}
			pageDescription={"Encuentra lo que necesitas"}
		>
			<Typography variant="h1" component={"h1"}>
				Tienda
			</Typography>
			<Typography variant="h2" component={"h2"} sx={{ mb: 1 }}>
				Tienda
			</Typography>

			{isLoading ? <FullLoadingScreen /> : <ProductList products={products!} />}
		</ShopLayout>
	);
};

export default KidPage;
