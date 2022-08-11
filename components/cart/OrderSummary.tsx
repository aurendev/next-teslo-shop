import { Grid, Typography } from "@mui/material"
import { FC, useContext } from "react"
import { CartContext } from "../../contexts"
import { currency } from "../../utils"

interface Props {
  summary?: {
    numberOfItems: number;
    subTotal : number;
    taxRate : number;
    total : number;
  }
}


export const OrderSummary: FC<Props> = ({summary}) => {

  const cartContext = useContext(CartContext)

  const summaryToShow = summary ?? cartContext

  const {numberOfItems, subTotal, taxRate, total } = summaryToShow

  return (
    <Grid container>
      <Grid item xs={6}>
        <Typography>No. Productos</Typography>
      </Grid>
      <Grid item xs={6} display='flex' justifyContent={'end'} >
        <Typography>{numberOfItems} {numberOfItems > 1 ? 'productos' : 'producto'} </Typography>
      </Grid>

      <Grid item xs={6}>
        <Typography>Subtotal</Typography>
      </Grid>
      <Grid item xs={6} display='flex' justifyContent={'end'} >
        <Typography>{currency.format(subTotal)}</Typography>
      </Grid>

      <Grid item xs={6}>
        <Typography>Impuestos ({Number(process.env.NEXT_PUBLIC_TAX_RATE) * 100}%)</Typography>
      </Grid>
      <Grid item xs={6} display='flex' justifyContent={'end'} >
        <Typography>{currency.format(taxRate)}</Typography>
      </Grid>

      <Grid item xs={6} sx={{mt:2}}>
        <Typography  variant="subtitle1">Total:</Typography>
      </Grid>
      <Grid item xs={6} sx={{mt:2}} display='flex' justifyContent={'end'} >
        <Typography variant="subtitle1" >{currency.format(total)}</Typography>
      </Grid>

      
    </Grid>
  )
}
