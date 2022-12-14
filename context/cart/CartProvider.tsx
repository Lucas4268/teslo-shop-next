import { FC, useEffect, useReducer, useRef } from 'react';
import Cookies from 'js-cookie';

import { ICartProduct, IOrder, ShippingAddress } from '../../interfaces';
import { CartContext, cartReducer } from './';
import { tesloApi } from '../../api';
import axios from 'axios';

export interface CartState {
  isLoaded: boolean,
  cart: ICartProduct[];
  numberOfItems: number;
  subTotal: number;
  tax: number;
  total: number;
  shippingAddress?: ShippingAddress;
}

interface Props {
  children: JSX.Element;
}

const CART_INITIAL_STATE: CartState = {
  isLoaded: false,
  cart: [],
  numberOfItems: 0,
  subTotal: 0,
  tax: 0,
  total: 0,
  shippingAddress: undefined
}

export const CartProvider:FC<Props> = ({ children }) => {

  const [state, dispatch] = useReducer( cartReducer, CART_INITIAL_STATE );

  const isCartReload = useRef(true)

  useEffect(() => {
    if (isCartReload.current) {
      // se usa try catch por si las cookies son manipuladas
      try {
        const cart = JSON.parse( Cookies.get('cart') || '[]' );
        dispatch({ type: '[CART] Load Cart from cookies', payload: cart });
      } catch (error) {
        dispatch({ type: '[CART] Load Cart from cookies', payload: [] });
      }
      isCartReload.current = false;
    }
  }, [])

  useEffect(() => {
    try {
      if ( Cookies.get('firstName') ) {
        const addressCookies = {
          firstName: Cookies.get('firstName') || '',
          lastName: Cookies.get('lastName') || '',
          address: Cookies.get('address') || '',
          address2: Cookies.get('address2') || '',
          zip: Cookies.get('zip') || '',
          city: Cookies.get('city') || '',
          country: Cookies.get('country') || '',
          phone: Cookies.get('phone') || '',
        }
        dispatch({ type: '[CART] LoadAddress From Cookies', payload: addressCookies });
      }
    } catch (error) {
      dispatch({ type: '[CART] LoadAddress From Cookies', payload: undefined });      
    }
  }, [])

  useEffect(() => {
    Cookies.set( 'cart', JSON.stringify(state.cart) )
  }, [ state.cart ]);

  useEffect(() => {

    const numberOfItems = state.cart.reduce( ( prev, current ) => current.quantity + prev, 0 );
    const subTotal = state.cart.reduce( ( prev, current ) => (current.price * current.quantity) + prev, 0 );
    const tax = subTotal * Number( process.env.NEXT_PUBLIC_TAX_RATE || 0 );

    const orderSummary = {
      numberOfItems,
      subTotal,
      tax,
      total: subTotal + tax
    }

    dispatch({ type: '[CART] Update order Summary', payload: orderSummary });
  }, [ state.cart ]);



  const addProductToCart = ( product: ICartProduct ) => {
    const index = state.cart.findIndex( productInCart => productInCart._id === product._id && productInCart.size === product.size )

    if (index === -1) {
      return dispatch({
        type: '[CART] Add Product',
        payload: [...state.cart, product]
      })
    }

    const updatedProduct = state.cart.map( (p, i) => {
      if (i === index) 
        return { ...p, quantity: p.quantity + product.quantity }
      
      return p
    })

    dispatch({
      type: '[CART] Add Product',
      payload: updatedProduct
    })
  }


  const updateCartQuantity = ( product: ICartProduct ) => {
    dispatch({ type: '[CART] Change cart quantity', payload: product })
  }

  const removeCartProduct = ( product: ICartProduct ) => {
    dispatch({ type: '[CART] Remove product in cart', payload: product })
  }

  const updateAddress = ( address: ShippingAddress ) => {
    Cookies.set('firstName', address.firstName)
    Cookies.set('lastName', address.lastName)
    Cookies.set('address', address.address)
    Cookies.set('address2', address.address2 || '')
    Cookies.set('zip', address.zip)
    Cookies.set('city', address.city)
    Cookies.set('country', address.country)
    Cookies.set('phone', address.phone)
    
    dispatch({ type: '[CART] LoadAddress From Cookies', payload: address })
  }


  const createOrder = async(): Promise<{ hasError: boolean; message: string }> => {

    if (!state.shippingAddress) {
      throw new Error('No hay direccion de entrega')
    }

    const body: IOrder = {
      orderItems: state.cart.map( p => ({ ...p, size: p.size! })),
      shippingAddress: state.shippingAddress,
      numberOfItems: state.numberOfItems,
      subTotal: state.subTotal,
      tax: state.tax,
      total: state.total,
      isPaid: false,
    }

    try {
      const { data } = await tesloApi.post<IOrder>('/orders', body)

      dispatch({ type: '[CART] Order complete' })

      return {
        hasError: false,
        message: data._id!
      }

    } catch (error) {
      if ( axios.isAxiosError( error ) ) {
        return {
          hasError: true,
          // message: error.response?.data.message
          message: 'Error al crear la orden'
        }
      }
      return {
        hasError: true,
        message: 'Por favor, hable con el administrador'
      }
    }
  }


  return (
    <CartContext.Provider value={{
      ...state,

      addProductToCart,
      updateCartQuantity,
      removeCartProduct,
      updateAddress,

      createOrder
    }}>
      { children }
    </CartContext.Provider>
  )
}