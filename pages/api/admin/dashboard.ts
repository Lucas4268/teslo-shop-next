import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database';
import { Order, Product } from '../../../models';

type Data = { 
  numberOfOrders: number;
  paidOrders: number;
  notPaidOrders: number;
  numberOfClients: number;
  numberOfProducts: number;
  productsWithNoInventory: number;
  lowInventory: number; // menos de 10 articulos
}
| { message: string }

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

  switch ( req.method ) {
    case 'GET':
      return getData( req, res )

    default:
      return res.status(400).json({ message: 'Method not allowed' })
  }
}

const getData = async( req: NextApiRequest, res: NextApiResponse<Data> ) => {

  await db.connect()
  
  const [
    numberOfOrders,
    paidOrders,
    notPaidOrders,
    numberOfClients,
    numberOfProducts,
    productsWithNoInventory,
    lowInventory
  ] = await Promise.all([
    Order.count(),
    Order.count({ isPaid: true }),
    Order.count({ isPaid: false }),
    Order.count({ role: 'client' }),
    Product.count(),
    Product.count({ inStock: 0 }),
    Product.count({ inStock: { $lte: 10 }}) // menor o igual a 10
  ])

  db.disconnect()

  return res.status(200).json({
    numberOfOrders,
    paidOrders,
    notPaidOrders,
    numberOfClients,
    numberOfProducts,
    productsWithNoInventory,
    lowInventory
  })
}
