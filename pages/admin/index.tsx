import useSWR from "swr"
import { Grid, Typography } from "@mui/material"
import { AccessTimeOutlined, AttachMoneyOutlined, CancelPresentationOutlined, CategoryOutlined, CreditCardOffOutlined, CreditCardOutlined, DashboardOutlined, GroupOutlined, ProductionQuantityLimitsOutlined } from "@mui/icons-material"

import { AdminLayout } from "../../components/layouts"
import { SummaryTitle } from "../../components/admin"
import { DashboardSummaryResponse } from "../../interfaces"
import { useEffect, useState } from "react"

const DashboardPage = () => {
  const { data, error } = useSWR<DashboardSummaryResponse>('/api/admin/dashboard', {
    refreshInterval: 30 * 1000, // 30 seconds
  })

  const [refreshIn, setRefreshIn] = useState(30);

  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshIn(refreshIn => refreshIn > 0 ? refreshIn - 1 : 30);
    }, 1000);

    return () => clearInterval(interval);
  }, [])

  if ( !data && !error ) 
    return <></>

  if ( error ) {
    console.log( error );
    return <Typography>Error al cargar la información</Typography>
  }

  const {
    lowInventory,
    notPaidOrders,
    numberOfClients,
    numberOfProducts,
    numberOfOrders,
    paidOrders,
    productsWithNoInventory
  } = data!;

  return (
    <AdminLayout
      title="Dashboard"
      subTitle="Estadisticas generales"
      icon={ <DashboardOutlined /> }
    >
      <Grid container spacing={ 2 }>
        <SummaryTitle
          title={ numberOfOrders }
          subTitle="Ordenes totales"
          icon={ <CreditCardOutlined color='secondary' sx={{ fontSize: 40 }} /> }
        />

        <SummaryTitle
          title={ paidOrders }
          subTitle="Ordenes pagadas"
          icon={ <AttachMoneyOutlined color='success' sx={{ fontSize: 40 }} /> }
        />

        <SummaryTitle
          title={ notPaidOrders }
          subTitle="Ordenes pendientes"
          icon={ <CreditCardOffOutlined color='error' sx={{ fontSize: 40 }} /> }
        />

        <SummaryTitle
          title={ numberOfClients }
          subTitle="Clientes"
          icon={ <GroupOutlined color='primary' sx={{ fontSize: 40 }} /> }
        />

        <SummaryTitle
          title={ numberOfProducts }
          subTitle="Productos"
          icon={ <CategoryOutlined color='warning' sx={{ fontSize: 40 }} /> }
        />

        <SummaryTitle
          title={ productsWithNoInventory }
          subTitle="Sin existencias"
          icon={ <CancelPresentationOutlined color='error' sx={{ fontSize: 40 }} /> }
        />

        <SummaryTitle
          title={ lowInventory }
          subTitle="Bajo inventario"
          icon={ <ProductionQuantityLimitsOutlined color='warning' sx={{ fontSize: 40 }} /> }
        />

        <SummaryTitle
          title={ refreshIn }
          subTitle="Actualizacion en: "
          icon={ <AccessTimeOutlined color='secondary' sx={{ fontSize: 40 }} /> }
        />
      </Grid>

    </AdminLayout>
  )
}
export default DashboardPage
