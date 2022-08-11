import { ConfirmationNumberOutlined } from "@mui/icons-material";
import { Chip, Grid } from "@mui/material";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import useSWR from "swr";
import { AdminLayout } from "../../../components/layouts";
import { IOrder, IUser } from "../../../interfaces";

const columns: GridColDef[] = [
	{ field: "id", headerName: "Orden ID", width: 250 },
	{ field: "email", headerName: "Correo", width: 150 },
	{ field: "name", headerName: "Nombre Completo", width: 200 },
	{ field: "total", headerName: "Monto total", width:100 },
	{
		field: "isPaid",
		headerName: "Pagada",
    width: 150,
		renderCell: ({ row }: GridValueGetterParams) => {
			return row.isPaid ? (
				<Chip variant="outlined" label="Pagada" color="success" />
			) : (
				<Chip variant="outlined" label="Pendiente" color="error" />
			);
		},
	},
	{
		field: "noProducts",
		headerName: "No.Productos",
		align: "center",
		width: 50,
	},
	{
		field: "check",
		headerName: "Ver orden",
		renderCell: ({ row }: GridValueGetterParams) => {
			return (
				<a href={`/admin/orders/${row.id}`} target="_blank" rel="noreferrer">
					Ver orden
				</a>
			);
		},
	},
	{ field: "createdAt", headerName: "Creada en", width: 200 },
];

const OrdersPage = () => {
	const { data, error } = useSWR<IOrder[]>("/api/admin/orders");

	if (!data && !error) return <></>;

	const rows = data!.map((order) => ({
		id: order._id,
		email: (order.user as IUser).email,
		name: (order.user as IUser).name,
		total: order.total,
		isPaid: order.isPaid,
		noProducts: order.numberOfItems,
		createdAt: order.createdAt,
	}));

	return (
		<AdminLayout
			title={"Ordenes"}
			subtitle={"Mantenimiento de ordenes"}
			icon={<ConfirmationNumberOutlined />}
		>
			<Grid container sx={{ mt: 2 }}>
				<Grid item xs={12} sx={{ height: 650, width: "100%" }}>
					<DataGrid
						columns={columns}
						rows={rows}
						pageSize={10}
						rowsPerPageOptions={[10]}
					/>
				</Grid>
			</Grid>
		</AdminLayout>
	);
};

export default OrdersPage;
