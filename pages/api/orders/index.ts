import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { db } from '../../../database'
import { IOrder } from '../../../interfaces'
import { Product, Order } from '../../../models'

type Data = 
| { message: string }
| IOrder

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

  switch ( req.method ) {
    case 'POST':
      return createOrder( req, res )

    default:
      res.status(400).json({ message: 'Bad request' })
  }
}

const createOrder = async( req: NextApiRequest, res: NextApiResponse<Data> ) => {
  const { orderItems, total } = req.body as IOrder;

  const session = await getSession({ req }) as any

  if ( !session )
    return res.status(401).json({ message: 'Unauthorized' })


  const productsIds = orderItems.map( product => product._id )
  await db.connect()
  const dbProducts = await Product.find({ _id: { $in: productsIds } }) // productos con los ids del array

  try {

    // calcular el precio contra db
    const subTotal = orderItems.reduce( ( prev, current ) => {
      const currentPrice = dbProducts.find( p => p.id === current._id )!.price

      return (currentPrice * current.quantity) + prev
    }, 0 );

    const tax = Number( process.env.NEXT_PUBLIC_TAX_RATE || 0 );    
    const backendTotal = Number((subTotal * ( tax + 1 )).toFixed(2));

    if ( +total.toFixed(2) !== backendTotal ) 
      throw new Error('Total is not correct')

    // aca todo pasa
    const userId = session.user._id
    const newOrder = new Order({ ...req.body, isPaid: false, user: userId })
    await newOrder.save()

    db.disconnect()
    return res.status(201).json( newOrder )

  } catch (error) {
    db.disconnect()
    console.log(error)
    return res.status(400).json({ message: 'Error creating order' })
  }

  // return res.status( 201 ).json({ message: 'Order created' })
}
