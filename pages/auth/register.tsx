import { useContext, useState } from "react";
import { GetServerSideProps } from "next";
import NextLink from "next/link"
import { useRouter } from "next/router";
import { signIn, getSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { Box, Grid, Typography, Button, Link, Chip } from "@mui/material"
import { ErrorOutline } from "@mui/icons-material";

import { AuthContext } from "../../context";
import { AuthLayout } from "../../components/layouts"
import { TextControlField } from "../../components/ui";

type FormData = {
  name: string,
  email: string,
  password: string,
};

const RegisterPage = () => {
  const router = useRouter();
  const { registerUser } = useContext( AuthContext );
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const [showError, setShowError] = useState('')

  const onRegisterForm = async( { email, name, password }: FormData ) => {
    setShowError('')

    const { hasError, message } = await registerUser( name, email, password )

    if (hasError) {
      setShowError( message! )
      setTimeout(() => setShowError(''), 3000)
      return
    }
    
    // const destination = router.query.p?.toString() || "/";
    // router.replace( destination )

    await signIn( 'credentials', { email, password } )
  }

  return (
    <AuthLayout title="Registro">
      <form onSubmit={ handleSubmit( onRegisterForm ) } noValidate>
        <Box sx={{ width: 350, padding: '10px 20px' }}>
          <Grid container spacing={ 2 }>
            <Grid item xs={ 12 }>
              <Typography variant="h1" component='h1'>Registrarse</Typography>
              {
                showError && (
                  <Chip
                    label={ showError }
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
                error={ errors.name?.message }
                field="name"
                label="Nombre"
                minLength={ 2 }
              />
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
                Registrarse
              </Button>
            </Grid>

            <Grid item xs={ 12 } display='flex' justifyContent='end'> 
              <NextLink href={ `/auth/login?p=${ router.query.p?.toString() || "/" }` } passHref>
                <Link underline="always">
                  ¿Ya tienes una cuenta?
                </Link>
              </NextLink>
            </Grid>
          </Grid>
        </Box>
      </form>
    </AuthLayout>
  )
}


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




export default RegisterPage