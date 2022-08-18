import { useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { Controller, useForm } from "react-hook-form";
import Cookies from "js-cookie";
import { Box, Button, FormControl, Grid, MenuItem, TextField, Typography } from "@mui/material"

import { ShopLayout } from "../../components/layouts"
import { TextControlField } from "../../components/ui";
import { countries } from "../../utils/countries"
import { CartContext } from "../../context";


type FormData = {
  firstName: string;
  lastName: string;
  address: string;
  address2?: string;
  zip: string;
  city: string;
  country: string;
  phone: string;
}


const getAddressFromCookies = (): FormData => {
  return {
    firstName: Cookies.get('firstName') || '',
    lastName: Cookies.get('lastName') || '',
    address: Cookies.get('address') || '',
    address2: Cookies.get('address2') || '',
    zip: Cookies.get('zip') || '',
    city: Cookies.get('city') || '',
    country: Cookies.get('country') || '',
    phone: Cookies.get('phone') || '',
  }
}


const AddressPage = () => {
  const router = useRouter()
  const { updateAddress } = useContext( CartContext )
  const { register, handleSubmit, formState: { errors }, reset, control } = useForm<FormData>({
    defaultValues: {
      firstName: '',
      lastName: '',
      address: '',
      address2: '',
      zip: '',
      city: '',
      country: '',
      phone: '',
    }
  })

  useEffect(() => {
    reset(getAddressFromCookies())
  }, [ reset ])

  const onSubmitForm = (data: FormData) => {
    updateAddress( data )
    router.push('/checkout/summary')
  }

  return (
    <ShopLayout title="Dirección" pageDescription="Confirmar dirección de destino">
      <form onSubmit={ handleSubmit( onSubmitForm ) }>
        <Typography variant="h1" component='h1'>Dirección</Typography>

        <Grid container spacing={ 2 } mt={ 2 }>
          <Grid item xs={ 12 } sm={ 6 }>
            <TextControlField
              label="Nombre"
              field="firstName"
              register={ register }
              error={ errors.firstName?.message }
            />
          </Grid>

          <Grid item xs={ 12 } sm={ 6 }>
            <TextControlField
              label="Apellido"
              field="lastName"
              register={ register }
              error={ errors.lastName?.message }
            />
          </Grid>

          <Grid item xs={ 12 } sm={ 6 }>
            <TextControlField
              label="Dirección"
              field="address"
              register={ register }
              error={ errors.address?.message }
            />
          </Grid>
          
          <Grid item xs={ 12 } sm={ 6 }>
            <TextControlField
              label="Dirección 2 (opcional)"
              field="address2"
              required={ false }
              register={ register }
              error={ errors.address2?.message }
            />
          </Grid>

          <Grid item xs={ 12 } sm={ 6 }>
            <TextControlField
              label='Código Postal'
              field="zip"
              register={ register }
              error={ errors.zip?.message }
            />
          </Grid>

          <Grid item xs={ 12 } sm={ 6 }>
            <TextControlField
              label='Ciudad'
              field="city"
              register={ register }
              error={ errors.city?.message }
            />
          </Grid>

          <Grid item xs={ 12 } sm={ 6 }>
            <Controller
              name="country"
              control={ control }
              defaultValue=""
              render={ ({ field }) => (
                <FormControl fullWidth error={ !!errors.country?.message }>
                  {/* <InputLabel>País</InputLabel> */}
                  <TextField
                    { ...field }
                    select
                    variant="filled"
                    label='País'
                  >
                    {
                      countries.map( country => (
                        <MenuItem key={ country.code } value={ country.code }>{ country.name }</MenuItem>
                      ))
                    }
                  </TextField>
                </FormControl>
              )}
            />
            
          </Grid>
          <Grid item xs={ 12 } sm={ 6 }>
            <TextControlField
              label='Teléfono'
              field="phone"
              register={ register }
              error={ errors.phone?.message }
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 5 }} display='flex' justifyContent='center'>
          <Button color="secondary" className='circular-btn' size="large" type="submit">
            Revisar pedido
          </Button>
        </Box>
      </form>
    </ShopLayout>
  )
}



// verificar si el usuario esta autenticado con server side props, la pagina es server side render, por eso se hace con middlewares y puede ser estatica
// export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  
//   const { token = '' } = req.cookies;
//   let isValidToken = false

//   try {
//     await jwt.isValidToken( token )
//     isValidToken = true
//   } catch (error) {
//     isValidToken = false
//   }

//   if ( !isValidToken ) {
//     return {
//       redirect: {
//         destination: '/auth/login?p=/checkout/address',
//         permanent: false
//       }
//     }
//   }

//   return {
//     props: {}
//   }
// }



export default AddressPage