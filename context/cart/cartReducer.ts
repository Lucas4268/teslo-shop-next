import { CartState } from './';
import { ICartProduct, ShippingAddress } from '../../interfaces';


  type CartActionType = 
  | { type: '[CART] Load Cart from cookies', payload: ICartProduct[] }
  | { type: '[CART] Add Product', payload: ICartProduct[] }
  | { type: '[CART] Change cart quantity', payload: ICartProduct }
  | { type: '[CART] Remove product in cart', payload: ICartProduct }
  | { type: '[CART] LoadAddress From Cookies', payload?: ShippingAddress }
  | {
      type: '[CART] Update order Summary', 
      payload: {
        numberOfItems: number;
        subTotal: number;
        tax: number;
        total: number;
      }
    }
  | { type: '[CART] Order complete' }

  export const cartReducer = ( state: CartState, action: CartActionType ): CartState => {

    switch ( action.type ) {
      case '[CART] Load Cart from cookies':
        return {
          ...state,
          isLoaded: true,
          cart: [ ...action.payload ]
        }

      case '[CART] Add Product':
        return {
          ...state,
          cart: [ ...action.payload ]
        }

      case '[CART] Change cart quantity':
        return {
          ...state,
          cart: state.cart.map(p => 
            (p._id === action.payload._id && p.size === action.payload.size)
              ? action.payload 
              : p
          )
        }

      case '[CART] Remove product in cart':
        return {
          ...state,
          cart: state.cart.filter( p => !(p._id === action.payload._id && p.size === action.payload.size) )
        }

      case '[CART] Update order Summary':
        return {
          ...state,
          ...action.payload
        }
      
      case '[CART] LoadAddress From Cookies':
        return {
          ...state,
          shippingAddress: action.payload
        }

      case '[CART] Order complete':
        return {
          ...state,
          cart: [],
          numberOfItems: 0,
          subTotal: 0,
          tax: 0,
          total: 0,
        }

      default:
        return state;
  }
}