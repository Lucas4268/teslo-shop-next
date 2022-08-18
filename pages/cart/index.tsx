import { useContext, useEffect } from "react"
import { useRouter } from "next/router"
import { Box, Button, Card, CardContent, Divider, Grid, Typography } from "@mui/material"

import { CartContext } from "../../context"
import { CartList, OrderSummary } from "../../components/cart"
import { ShopLayout } from "../../components/layouts"

const CartPage = () => {

  const router = useRouter()
  const { isLoaded, cart } = useContext( CartContext )

  useEffect(() => {
    if ( isLoaded && cart.length === 0 ) {
      router.replace( "/cart/empty" )
    }
  }, [ isLoaded, cart, router ])


  if ( !isLoaded || cart.length === 0 ) {
    return (
      <></>
    )
  }

  return (
    <ShopLayout title="Carrito - 3" pageDescription="Carrito de compras de la tienda">
      <Typography variant="h1" component='h1'>Carrito </Typography>

      <Grid container>
        <Grid item xs={ 12 } sm={ 7 }>
          <CartList editable />
        </Grid>

        <Grid item xs={ 12 } sm={ 5 }>
          <Card className="summary-card">
            <CardContent>
              <Typography variant="h2">Orden</Typography>

              <Divider sx={{ my: 1 }}/>

              <OrderSummary />

              <Box mt={ 3 }>
                <Button
                  color="secondary"
                  className="circular-btn"
                  fullWidth
                  href='/checkout/address'
                >
                  Checkout
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

    </ShopLayout>
  )
}
export default CartPage