import { GetServerSideProps, NextPage } from "next";

import {
	CreditCardOffOutlined,
	CreditScoreOutlined,
} from "@mui/icons-material";

import {
	Box,
	Card,
	CardContent,
	Chip,
	Divider,
	Grid,
	Typography,
} from "@mui/material";
import { IOrder } from "../../../interfaces";
import { ShopLayout } from "../../../components/layouts";
import { CartList, OrderSummary } from "../../../components/cart";
import { dbOrders } from "../../../database";

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
	const { shippingAddress } = order;

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

	const order = await dbOrders.getOrderById(id.toString());

	//? Si no existe la order
	if (!order) {
		return {
			redirect: {
				destination: "/admin/orders",
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
