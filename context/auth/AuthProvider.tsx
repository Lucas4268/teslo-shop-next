import { FC, useEffect, useReducer } from 'react';
import { useRouter } from 'next/router';
import { useSession, signOut } from 'next-auth/react' 
import axios from 'axios';
import Cookies from 'js-cookie';

import { tesloApi } from '../../api';
import { IUser } from '../../interfaces';
import { AuthContext, authReducer } from './';

export interface AuthState {
  isLoggedIn: boolean;
  user?: IUser;
}

interface Props {
  children: JSX.Element;
}

const AUTH_INITIAL_STATE: AuthState = {
  isLoggedIn: false,
  user: undefined,
}

export const AuthProvider:FC<Props> = ({ children }) => {

  const router = useRouter()
  const [state, dispatch] = useReducer( authReducer, AUTH_INITIAL_STATE );
  const { data, status } = useSession()

  useEffect(() => {
    if ( status === 'authenticated' ){
      // console.log({ data })
      dispatch({ type: '[AUTH] Login', payload: data?.user as IUser })
    }
  }, [ data, status ])
  
  
  // useEffect(() => {
  //   checkToken()
  // }, [])

  const checkToken = async () => {
    if ( !Cookies.get('token') ) {
      return;
    }

    try {
      const { data } = await tesloApi.get('/user/validate-token')
      const { user, token } = data

      Cookies.set('token', token);
      dispatch({ type: '[AUTH] Login', payload: user });
      
    } catch (error) {
      Cookies.remove('token');
    }
  }


  const loginUser = async( email: string, password: string ): Promise<boolean> => {
    try {
      const { data } = await tesloApi.post('/user/login', { email, password });
      const { token, user } = data

      Cookies.set( 'token', token );
      dispatch({ type: '[AUTH] Login', payload: user });
      return true;
    } catch (error) {
      return false;
    }
  }


  const registerUser = async( name: string, email: string, password: string ): Promise<{ hasError: boolean, message?: string }> => {
    try {
      const { data } = await tesloApi.post('/user/register', { name, email, password });
      const { token, user } = data

      Cookies.set( 'token', token );
      dispatch({ type: '[AUTH] Login', payload: user });
      return {
        hasError: false
      }
    } catch (error) {
      if ( axios.isAxiosError( error ) ) {
        const { message } = error.response?.data as { message: string };
        return {
          hasError: true,
          message
        }
      }

      return {
        hasError: true,
        message: 'No se pudo crear el usuario, intente nuevamente'
      }
    }
  }


  const logout = () => {
    Cookies.remove('cart');
    
    Cookies.remove('firstName')
    Cookies.remove('address')
    Cookies.remove('lastName')
    Cookies.remove('address2')
    Cookies.remove('zip')
    Cookies.remove('city')
    Cookies.remove('country')
    Cookies.remove('phone')

    signOut()
    
    // Cookies.remove('token');
    // con el reload se limpian los estados de auth y del carrito
    // router.reload()
  }

  return (
    <AuthContext.Provider value={{
      ...state,

      loginUser,
      registerUser,
      logout,
    }}>
      { children }
    </AuthContext.Provider>
  )
}