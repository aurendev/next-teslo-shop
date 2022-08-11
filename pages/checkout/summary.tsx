import {
	Box,
	Button,
	Card,
	CardContent,
	Chip,
	Divider,
	Grid,
	Link,
	Typography,
} from "@mui/material";
import Cookies from "js-cookie";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { CartList, OrderSummary } from "../../components/cart";
import { ShopLayout } from "../../components/layouts";
import { CartContext } from "../../contexts";
import { countries } from "../../utils";

const SummaryPage = () => {
	const { cart, shippingAddress, createOrder } = useContext(CartContext);

  const [isSaving, setIsSaving] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const router = useRouter();

	useEffect(() => {
		const userAddress = Cookies.get("user-address") ?? null;

		if (!userAddress) {
			router.replace("/checkout/address");
		}
	}, [router]);


	const countryName = countries.find((c) => c.code === shippingAddress?.country)?.name;

	const onCreateOrder = async () => {
   setIsSaving(true)
    const { hasError,message} = await createOrder()

    if(hasError){
      setIsSaving(false)
      setErrorMessage(message)
      return ;
    }

    router.replace(`/orders/${message}`)
  }

	return (
		<ShopLayout
			title={"Resumen de la orden"}
			pageDescription={"Resumen de la orden"}
		>
			<Typography variant="h1" component={"h1"}>
				Resumen de la orden
			</Typography>

			<Grid container>
				<Grid item xs={12} sm={7}>
					<CartList />
				</Grid>

				<Grid item xs={12} sm={5}>
					<Card className="summary-card">
						<CardContent>
							<Typography variant="h2">
								Resumen ({cart.length > 1 ? "productos" : "producto"})
							</Typography>
							<Divider sx={{ my: 1 }} />

							<Box
								display={"flex"}
								justifyContent="space-between"
								alignItems={"center"}
							>
								<Typography variant="subtitle1">
									Direccion de entrega
								</Typography>
								<NextLink href={"/checkout/address"} passHref>
									<Link underline="always">
										<Typography sx={{ textDecoration: "underline" }}>
											Editar
										</Typography>
									</Link>
								</NextLink>
							</Box>
							<Typography>{shippingAddress? shippingAddress.name + shippingAddress?.lastname : ''}</Typography>
							<Typography>{shippingAddress?.city}</Typography>
							<Typography>{shippingAddress?.address1}</Typography>
							<Typography>{countryName}</Typography>
							<Typography>{shippingAddress?.phone}</Typography>

							<Divider sx={{ my: 1 }} />
							<Box display={"flex"} justifyContent="end" alignItems={"center"}>
								<NextLink href={"/cart"} passHref>
									<Link underline="always">
										<Typography sx={{ textDecoration: "underline" }}>
											Editar
										</Typography>
									</Link>
								</NextLink>
							</Box>
							<OrderSummary />

							<Box sx={{ mt: 3 }}>
								<Button
									sx={{ color: "white" }}
									color="secondary"
									className="circular-btn"
									fullWidth
                  onClick={onCreateOrder}
                  disabled={isSaving}
								>
									Confirmar Orden
								</Button>
							</Box>

              <Chip label={errorMessage} color='error' sx={{display: errorMessage? 'flex': 'none', mt: 2}} />
						</CardContent>
					</Card>
				</Grid>
			</Grid>
		</ShopLayout>
	);
};

export default SummaryPage;
