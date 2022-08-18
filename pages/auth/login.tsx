import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import NextLink from "next/link"
import { useForm } from "react-hook-form";
import { signIn, getSession, getProviders } from "next-auth/react";
import { Box, Button, Chip, Divider, Grid, Link, TextField, Typography } from "@mui/material"
import { ErrorOutline } from "@mui/icons-material";

import { AuthContext } from "../../context";
import { AuthLayout } from "../../components/layouts"
import { TextControlField } from "../../components/ui";


type FormData = {
  email: string,
  password: string,
};

const LoginPage = () => {
  const router = useRouter();
  // const { loginUser } = useContext( AuthContext );
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const [showError, setShowError] = useState(false)

  const [providers, setProviders] = useState<any>({})

  useEffect(() => {
    getProviders().then( setProviders )
  }, [])


  const onLoginUser = async( { email, password }: FormData ) => {
    setShowError(false)

    // --------- Login anterior ---------
    // const isValidLogin = await loginUser( email, password );
    // if (!isValidLogin) {
    //   setShowError(true)
    //   setTimeout(() => setShowError(false), 3000)
    //   return
    // }

    // const destination = router.query.p?.toString() || "/";
    // router.replace( destination )

    await signIn( 'credentials', { email, password } )
  }
  
  return (
    <AuthLayout title="Ingresar">
      <form onSubmit={ handleSubmit( onLoginUser ) } noValidate>
        <Box sx={{ width: 350, padding: '10px 20px' }}>
          <Grid container spacing={ 2 }>
            <Grid item xs={ 12 }>
              <Typography variant="h1" component='h1'>Iniciar Sesión</Typography>
              {
                showError && (
                  <Chip
                    label="No reconocemos ese usuario o contraseña"
                    color="error"
                    icon={ <ErrorOutline /> }
                    className="fadeIn"
                  />
                )
              }
            </Grid>

            <Grid item xs={ 12 }>
              <TextControlField
                register={ register }
                error={ errors.email?.message }
                field="email"
                label="Correo"
                type='email'
              />
            </Grid>

            <Grid item xs={ 12 }>
              <TextControlField
                register={ register }
                error={ errors.password?.message }
                field="password"
                label="Contraseña"
                minLength={ 6 }
                type='password'
              />
            </Grid>

            <Grid item xs={ 12 }> 
              <Button
                color="secondary"
                className='circular-btn'
                size='large'
                fullWidth
                type="submit"
              >
                Ingresar
              </Button>
            </Grid>

            <Grid item xs={ 12 } display='flex' justifyContent='end'> 
              <NextLink href={ `/auth/register?p=${ router.query.p?.toString() || "/" }` } passHref>
                <Link underline="always">
                  ¿No tienes una cuenta?
                </Link>
              </NextLink>
            </Grid>

            <Grid item xs={ 12 } display='flex' flexDirection='column' justifyContent='end'>
              <Divider sx={{ width: '100%', mb: 2 }} />

              {
                Object.values( providers ).map(( provider: any ) => {
                  if ( provider.id === 'credentials' ) return

                  return (
                    <Button
                      key={ provider.id }
                      variant='outlined'
                      fullWidth
                      color="primary"
                      sx={{ mb: 1 }}
                      onClick={ () => signIn( provider.id ) }
                    >
                      { provider.name }
                    </Button>
                  )
                })
              }
            </Grid>
          </Grid>
        </Box>
      </form>
    </AuthLayout>
  )
}



// You should use getServerSideProps when:

// - Only if you need to pre-render a page whose data must be fetched at request time
export const getServerSideProps: GetServerSideProps = async ( ctx ) => {
  const session = await getSession({ req: ctx.req })

  const { p = '/' } = ctx.query


  if (session) {
    return {
      redirect: {
        destination: p.toString(),
        permanent: false,
      }
    }
  }

  return {
    props: {
      
    }
  }
}



export default LoginPage