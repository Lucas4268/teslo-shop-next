import { useContext } from "react"
import { NextPage } from "next"
import { Grid, Typography } from "@mui/material"

import { CartContext } from "../../context"
import { currency } from "../../utils"
import { IOrder } from "../../interfaces"


interface Props {
  order?: IOrder;
}

export const OrderSummary: NextPage<Props> = ({ order }) => {

  const { numberOfItems, subTotal, tax, total } = useContext( CartContext )

  const summaryValues = order ? order : { numberOfItems, subTotal, tax, total }
  
  return (
    <Grid container>
      <Grid item xs={ 6 }>
        <Typography>No. Productos</Typography>
      </Grid>

      <Grid item xs={ 6 } display='flex' justifyContent='end'>
        <Typography>{ summaryValues.numberOfItems }</Typography>
      </Grid>

      <Grid item xs={ 6 }>
        <Typography>Subtotal</Typography>
      </Grid>

      <Grid item xs={ 6 } display='flex' justifyContent='end'>
        <Typography>{ currency.format( summaryValues.subTotal ) }</Typography>
      </Grid>

      <Grid item xs={ 6 }>
        <Typography>Impuestos ({ +process.env.NEXT_PUBLIC_TAX_RATE! * 100 }%)</Typography>
      </Grid>

      <Grid item xs={ 6 } display='flex' justifyContent='end'>
        <Typography>{ currency.format( summaryValues.tax ) }</Typography>
      </Grid>

      <Grid item xs={ 6 } mt={ 2 }>
        <Typography variant="subtitle1">Total: </Typography>
      </Grid>

      <Grid item xs={ 6 } display='flex' justifyContent='end' mt={ 2 }>
        <Typography variant="subtitle1">{ currency.format( summaryValues.total ) }</Typography>
      </Grid>

    </Grid>
  )
}