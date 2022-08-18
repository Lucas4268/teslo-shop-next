import { useEffect, useState } from "react";
import useSWR from "swr";
import { PeopleOutline } from "@mui/icons-material"
import { Grid, MenuItem, Select } from "@mui/material";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";

import { AdminLayout } from "../../components/layouts"
import { IUser } from "../../interfaces";
import { tesloApi } from "../../api";


const UsersPage = () => {

  const { data, error } = useSWR<IUser[]>('/api/admin/users');
  const [users, setUsers] = useState<IUser[]>([]);

  useEffect(() => {
    if (data) {
      setUsers(data);
    }
  }, [ data ]);

  if ( !data && !error ) return <></>;

  const onRoleUpdate = async( userId: string, newRole: string) => {
    const previousUsers = users.map( user => ({ ...user }));

    setUsers( users.map( user => user._id === userId ? { ...user, role: newRole } : user ) );

    try {
      await tesloApi.put('/admin/users', {
        userId,
        role: newRole
      })
      
    } catch (error) {
      setUsers( previousUsers );
      console.log(error);
      alert('Error al actualizar el rol');
    }
  }

  const columns: GridColDef[] = [
    { field: 'email', headerName: 'Correo', width: 250 },
    { field: 'name', headerName: 'Nombre completo', width: 300 },
    {
      field: 'role',
      headerName: 'Rol',
      width: 300,
      renderCell: ( { row }: GridValueGetterParams ) => {
        return (
          <Select
            value={ row.role }
            label='Rol'
            onChange={ ({ target }) => onRoleUpdate( row.id, target.value ) }
            sx={{ width: '300px' }}
          >
            <MenuItem value='client'>Cliente</MenuItem>
            <MenuItem value='admin'>Admin</MenuItem>
          </Select>
        )
      } 
    },
  ];

  const rows = users.map( user => ({
    id: user._id,
    email: user.email,
    name: user.name,
    role: user.role,
  }))

  return (
    <AdminLayout
      title="Usuarios"
      subTitle="Lista de usuarios"
      icon={ <PeopleOutline /> }
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
export default UsersPage