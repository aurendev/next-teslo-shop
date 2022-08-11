import { Chip, Grid, Link, Typography } from "@mui/material"
import { ShopLayout } from "../../components/layouts"

import { DataGrid, GridColDef, GridRenderCellParams} from '@mui/x-data-grid'
import NextLink from "next/link"

import { GetServerSideProps, NextPage } from 'next'
import { getToken } from "next-auth/jwt"
import { dbOrders } from "../../database"
import { IOrder } from "../../interfaces"

const columns : GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 100},
  { field: 'fullname', headerName: 'Nombre Completo', width: 300},
  { 
    field: 'paid', 
    headerName: 'Pagada', 
    description: 'Muestra informacion si esta pagada la orden',
    width: 200,
    renderCell: (params: GridRenderCellParams )=> {
      return (
        params.row.paid
          ? <Chip color='success' label='Pagada' variant="outlined" />
          : <Chip color='error' label='No Pagada' variant="outlined" />
      )
    }
  },
  { 
    field: 'orden', 
    headerName: 'Ver orden', 
    width: 200,
    sortable: false,
    renderCell: (params: GridRenderCellParams )=> {
      return (
        <NextLink href={`/orders/${params.row.orderId}`}  passHref>
          <Link sx={{ textDecoration: 'underline'}} > Ver orden</Link>
        </NextLink>
      )
    }
  },
  
]

interface Props {
  orders: IOrder[]
}

const HistoryPage : NextPage<Props> = ({orders}) => {

  console.log('[orders]', orders)

  const rows = orders.map((order, index) => {
    return{
      id: index + 1,
      paid: order.isPaid,
      fullname: order.shippingAddress.name +' '+ order.shippingAddress.lastname,
      orderId: order._id
    }
  })

  return (
    <ShopLayout title={"Historial de ordenes"} pageDescription={"Historial de ordenes"} >
      <Typography variant="h1" component={'h1'}>Historial de ordenes</Typography>

      <Grid container >
        <Grid item xs={12} sx={{height: 650, width: '100%'}}>
          <DataGrid 
            columns={columns} 
            rows={rows}  
            pageSize={10}
            rowsPerPageOptions={[10]}        
          />
        </Grid>
      </Grid>

    </ShopLayout>
  )
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time


export const getServerSideProps: GetServerSideProps = async ({req}) => {
  
  const session: any = await getToken({
		req,
		secret: process.env.NEXTAUTH_SECRET,
	});

	//?Si no esta autenticado
	if (!session) {
		return {
			redirect: {
				destination: '/auth/login?p=/orders/history',
				permanent: false,
			},
		};
	}

  const orders = await dbOrders.getOrdersByUser(session.user._id)

  return {
    props: {
      orders
    }
  }
}

export default HistoryPage