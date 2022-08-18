import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import NextLink from "next/link";
import Cookies from "js-cookie";
import { Box, Button, Card, CardContent, Chip, Divider, Grid, Link, Typography } from "@mui/material"

import { CartList, OrderSummary } from "../../components/cart"
import { ShopLayout } from "../../components/layouts"
import { CartContext } from "../../context";
import { countries } from '../../utils/countries'

const SummaryPage = () => {

  const router = useRouter()
  const { shippingAddress, numberOfItems, createOrder } = useContext( CartContext )

  const [isPosting, setIsPosting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  
  useEffect(() => {
    if ( !Cookies.get('firstName') ) {
      router.push('/checkout/address')
    }
  }, [ router ])

  const onCreateOrder = async() => {
    setIsPosting( true )

    const { hasError, message } = await createOrder()
    setIsPosting( false )

    if ( hasError ) {
      return setErrorMessage( message )
    }

    router.replace(`/orders/${ message }`)
  }

  return (
    <ShopLayout title="Resumen de orden" pageDescription="Resumen de la orden">
      <Typography variant="h1" component='h1'>Resumen de la orden</Typography>

      <Grid container>
        <Grid item xs={ 12 } sm={ 7 }>
          <CartList />
        </Grid>

        <Grid item xs={ 12 } sm={ 5 }>
          <Card className="summary-card">
            <CardContent>
              <Typography variant="h2">Resumen ({ numberOfItems } { numberOfItems === 0 ? 'producto' : 'productos' })</Typography>

              <Divider sx={{ my: 1 }}/>

              <Box display='flex' justifyContent='space-between'>
                <Typography variant="subtitle1">Dirección de entrega</Typography>

                <NextLink href='/checkout/address' passHref>
                  <Link underline="always">
                    Editar
                  </Link>
                </NextLink>
              </Box>

              <Typography>{ shippingAddress?.firstName } { shippingAddress?.lastName }</Typography>
              <Typography>{ shippingAddress?.address } { shippingAddress?.address2 || '' }</Typography>
              <Typography>{ shippingAddress?.city }, { shippingAddress?.zip }</Typography>
              <Typography>{ countries.find( c => c.code === shippingAddress?.country )?.name }</Typography>
              <Typography>{ shippingAddress?.phone }</Typography>

              <Divider sx={{ my: 1 }}/>

              <Box display='flex' justifyContent='end'>
                <NextLink href='/cart' passHref>
                  <Link underline="always">
                    Editar
                  </Link>
                </NextLink>
              </Box>

              <OrderSummary />

              <Box mt={ 3 } display='flex' flexDirection='column'>
                <Button
                  color="secondary"
                  className="circular-btn"
                  fullWidth
                  onClick={ onCreateOrder }
                  disabled={ isPosting }
                >
                  Confirmar Orden
                </Button>

                <Chip
                  color="error"
                  label={ errorMessage }
                  sx={{ display: errorMessage ? 'flex' : 'none', mt: 2 }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

    </ShopLayout>
  )
}
export default SummaryPage