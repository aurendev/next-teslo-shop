import { GetServerSideProps, NextPage } from "next";

import {
	CreditCardOffOutlined,
	CreditScoreOutlined,
} from "@mui/icons-material";

import {
	Box,
	Button,
	Card,
	CardContent,
	Chip,
	CircularProgress,
	Divider,
	Grid,
	Link,
	Typography,
} from "@mui/material";
import NextLink from "next/link";
import { CartList, OrderSummary } from "../../components/cart";
import { ShopLayout } from "../../components/layouts";
import { getToken } from "next-auth/jwt";
import { dbOrders } from "../../database";
import { IOrder } from "../../interfaces";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { tesloApi } from "../../api";
import { useRouter } from "next/router";
import { useState } from "react";

interface Props {
	order: IOrder;
}

export type OrderResponseBody = {
	id: string;
	status:
		| "COMPLETED"
		| "SAVED"
		| "APPROVED"
		| "VOIDED"
		| "PAYER_ACTION_REQUIRED";
};

const OrderPage: NextPage<Props> = ({ order }) => {
	console.log("[Order]", order);

	const { shippingAddress } = order;

	const [isPaying, setIsPaying] = useState(false);

	const router = useRouter();

	const onOrderCompleted = async (details: OrderResponseBody) => {
		if (details.status !== "COMPLETED") {
			return alert("Orden no pagada");
		}

		setIsPaying(true);

		try {
			const { data } = await tesloApi.post("/orders/pay", {
				transactionId: details.id,
				orderId: order._id,
			});

			router.reload();
		} catch (error) {
			console.log(error);
			setIsPaying(false);
		}
	};

	return (
		<ShopLayout
			title={"Resumen de la orden"}
			pageDescription={`Resumen de la orden ${order._id}`}
		>
			<Typography variant="h1" component={"h1"}>
				Orden: {order._id}
			</Typography>

			{order.isPaid ? (
				<Chip
					sx={{ my: 2 }}
					label="Orden ya pagada"
					variant="outlined"
					color="success"
					icon={<CreditScoreOutlined />}
				/>
			) : (
				<Chip
					sx={{ my: 2 }}
					label="Orden no pagada"
					variant="outlined"
					color="error"
					icon={<CreditCardOffOutlined />}
				/>
			)}

			<Grid container>
				<Grid item xs={12} sm={7}>
					<CartList products={order.orderItems} />
				</Grid>

				<Grid item xs={12} sm={5}>
					<Card className="summary-card">
						<CardContent>
							<Typography variant="h2">
								Resumen ({order.numberOfItems}{" "}
								{order.numberOfItems > 0 ? "productos" : "producto"} )
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
							</Box>
							<Typography>
								{shippingAddress.name} {shippingAddress.lastname}
							</Typography>
							<Typography>
								{shippingAddress.address1}, {shippingAddress.address2 ?? ""}{" "}
							</Typography>
							<Typography>{shippingAddress.city}</Typography>
							<Typography>{shippingAddress.country}</Typography>
							<Typography>{shippingAddress.phone}</Typography>

							<Divider sx={{ my: 1 }} />

							<OrderSummary summary={order} />

							<Box sx={{ mt: 3 }} display="flex" flexDirection={"column"}>
								<Box
									display="flex"
									justifyContent={"center"}
									className="fadeIn"
									sx={{ display: isPaying ? "flex" : "none" }}
								>
									<CircularProgress />
								</Box>

								<Box
									display="flex"
									justifyContent={"center"}
									flexDirection={"column"}
									sx={{ display: isPaying ? "none" : "flex" }}
								>
									{!order.isPaid ? (
										<PayPalButtons
											createOrder={(data, actions) => {
												return actions.order.create({
													purchase_units: [
														{
															amount: {
																value: `${order.total}`,
															},
														},
													],
												});
											}}
											onApprove={(data, actions) => {
												return actions.order!.capture().then((details) => {
													console.log("[Details order paid]", details);
													onOrderCompleted(details);
												});
											}}
										/>
									) : (
										<Chip
											sx={{ my: 2 }}
											label="Orden ya pagada"
											variant="outlined"
											color="success"
											icon={<CreditScoreOutlined />}
										/>
									)}
								</Box>
							</Box>
						</CardContent>
					</Card>
				</Grid>
			</Grid>
		</ShopLayout>
	);
};

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({
	req,
	query,
}) => {
	const { id = "" } = query;

	const session: any = await getToken({
		req,
		secret: process.env.NEXTAUTH_SECRET,
	});

	//?Si no esta autenticado
	if (!session) {
		return {
			redirect: {
				destination: `/auth/login?p=/orders/${id}`,
				permanent: false,
			},
		};
	}

	const order = await dbOrders.getOrderById(id.toString());

	//? Si no existe la order
	if (!order) {
		return {
			redirect: {
				destination: "/orders/history",
				permanent: false,
			},
		};
	}

	//? Comprueba que el usuario sea el mismo de la orden
	if (order.user !== session.user._id) {
		return {
			redirect: {
				destination: "/orders/history",
				permanent: false,
			},
		};
	}

	return {
		props: {
			order,
		},
	};
};

export default OrderPage;
