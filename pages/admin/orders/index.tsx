import useSWR from "swr"
import { ConfirmationNumberOutlined } from "@mui/icons-material"
import { Chip, Grid } from "@mui/material"
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid"

import { AdminLayout } from "../../../components/layouts"
import { IOrder, IUser } from "../../../interfaces"


const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID de Orden', width: 250 },
  { field: 'email', headerName: 'Correo', width: 250 },
  { field: 'name', headerName: 'Nombre', width: 300 },
  { field: 'total', headerName: 'Total' },
  {
    field: 'isPaid',
    headerName: 'Pagada',
    renderCell: ( { row }: GridValueGetterParams ) => {
      return row.isPaid
        ? <Chip label='Pagada' variant="outlined" color="success" />
        : <Chip label='Pendiente' variant="outlined" color="error" />
    }
  },
  { field: 'noProducts', headerName: 'No.Productos', align: 'center', width: 300 },
  {
    field: 'check',
    headerName: 'Ver orden',
    width: 300,
    renderCell: ( { row }: GridValueGetterParams ) => (
      <a href={ `/admin/orders/${ row.id }` } target='_blank' rel="noreferrer">
        Ver orden
      </a>
    )
  },
  { field: 'createdAt', headerName: 'Creada en', width: 300 },
]

const OrdersPage = () => {

  const { data, error } = useSWR<IOrder[]>('/api/admin/orders');

  if ( !data && !error ) return <></>;

  const rows = data!.map( order => ({
    id: order._id,
    email: (order.user as IUser)!.email,
    name : (order.user as IUser)!.name,
    total: order.total,
    isPaid: order.isPaid,
    noProducts: order.numberOfItems,
    createdAt: order.createdAt
  }))

  return (
    <AdminLayout
      title="Ordenes"
      subTitle="Mantenimiento de ordenes"
      icon={ <ConfirmationNumberOutlined /> }
    >
      <Grid container className="fadeIn">
        <Grid item xs={ 12 } sx={{ height: 650, width: '100%' }}>
          <DataGrid
            rows={ rows }
            columns={ columns }
            pageSize={ 10 }
            rowsPerPageOptions={ [10] }
          />
        </Grid>
      </Grid>
    </AdminLayout>
  )
}
export default OrdersPage