import { db } from "."
import { IProduct } from "../interfaces"
import { Product } from "../models"

export const getProductBySlug = async (slug: string): Promise<IProduct | null> => {
  db.connect()
  const product = await Product.findOne({ slug }).lean()
  db.disconnect()

  if (!product) {
    return null
  }

  product.images = product.images.map((image: string) => {
    return image.includes( 'http' )
      ? image
      : `${ process.env.HOST_NAME }products/${ image }`
  })

  return JSON.parse( JSON.stringify( product )) 
}



interface ProductSlug {
  slug: string
}
export const getAllProductSlugs = async():Promise<ProductSlug[]> => {
  await db.connect()
  const slugs = await Product.find().select('slug -_id').lean()
  await db.disconnect()

  return slugs
}



export const getProductsByTerm = async (term: string):Promise<IProduct[]> => {
  term = term.toString().toLowerCase()

  db.connect()
  const products = await Product.find({
    $text: { $search: term }
  })
  .select('title images price inStock slug -_id')
  .lean()

  db.disconnect()

  const updatedProducts = products.map((product: IProduct) => {
    product.images = product.images.map((image: string) => {
      return image.includes( 'http' )
        ? image
        : `${ process.env.HOST_NAME }products/${ image }`
    });
    return product;
  })

  return updatedProducts
}


export const getAllProducts = async():Promise<IProduct[]> => {
  db.connect()
  const products = await Product.find().lean()
  db.disconnect()

  const updatedProducts = products.map((product: IProduct) => {
    product.images = product.images.map((image: string) => {
      return image.includes( 'http' )
        ? image
        : `${ process.env.HOST_NAME }products/${ image }`
    });
    return product;
  })

  return JSON.parse( JSON.stringify( updatedProducts ) )
}
