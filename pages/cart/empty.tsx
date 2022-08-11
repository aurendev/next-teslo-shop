import { RemoveShoppingCartOutlined } from "@mui/icons-material"
import { Box, Link, Typography } from "@mui/material"
import { ShopLayout } from "../../components/layouts"

import NextLink from 'next/link'
import { useContext, useEffect } from "react"
import { CartContext } from "../../contexts"
import { useRouter } from "next/router"

const EmptyPage = () => {

  const {cart, isLoaded} = useContext(CartContext)

  const router = useRouter()

  //* Este bloque hace que rediccione a la página si el carrito tiene items
  useEffect(() => {
    if(isLoaded && cart.length> 0) {
      router.replace('/cart')
    }
  }, [isLoaded, cart, router])
  
  if(!isLoaded || cart.length > 0) return (<></>)

  return (
    <ShopLayout title={"Carrito vacio"} pageDescription={"No hay articulos en el carrito de compras"}>

      <Box
        display="flex"
        justifyContent={'center'}
        alignItems={'center'}
        height='calc(100vh - 200px)'
        sx={{ flexDirection: {xs: 'column' ,sm:'row'}}}
      >
        <RemoveShoppingCartOutlined sx={{fontSize: 100}} />
        <Box display={'flex'} flexDirection='column' alignItems={'center'}  >
          <Typography>Su carrito esta vacio</Typography>
          <NextLink href={'/'} passHref >
            <Link >
              <Typography  variant="h4" color={'secondary'} >Regresar</Typography>
             </Link>
          </NextLink>
        </Box>    
      </Box>

    </ShopLayout>
  )
}

export default EmptyPage