import { useContext, useState } from "react"
import { GetServerSideProps, GetStaticPaths, GetStaticProps, NextPage } from "next"
import { useRouter } from "next/router"
import { Box, Button, Chip, Grid, Typography } from "@mui/material"

import { ShopLayout } from "../../components/layouts"
import { ProductSlideshow, SizeSelector } from "../../components/products"
import { ItemCounter } from "../../components/ui"
import { ICartProduct, IProduct, ISizes } from "../../interfaces"
import { dbProducts } from "../../database"
import { CartContext } from "../../context"


interface Props {
  product: IProduct
}

const ProductPage: NextPage<Props> = ({ product }) => {

  const router = useRouter()
  const { addProductToCart } = useContext( CartContext )

  const [tempCartProduct, setTempCartProduct] = useState<ICartProduct>({
    _id: product._id, 
    image: product.images[0], 
    price: product.price, 
    size: undefined,
    slug: product.slug,
    title: product.title, 
    gender: product.gender, 
    quantity: 1
  })

  const onSelectedSize = (size: ISizes) => {
    setTempCartProduct( currentProduct => ({
      ...currentProduct,
      size
    }))
  }

  const updatedQuantity = (quantity: number) => {
    setTempCartProduct( currentProduct => ({
      ...currentProduct,
      quantity
    }))
  }

  const onAddProduct = () => {
    if (!tempCartProduct.size) return

    addProductToCart(tempCartProduct)

    router.push('/cart')
  }

  return (
    <ShopLayout title={ product.title } pageDescription={ product.description } >
      <Grid container spacing={ 3 }>
        <Grid item xs={ 12 } sm={ 7 }>
          <ProductSlideshow images={ product.images } />
        </Grid>

        <Grid item xs={ 12 } sm={ 5 }>
          <Box display='flex' flexDirection='column'>

            <Typography variant="h1" component='h1'>{ product.title }</Typography>
            <Typography variant="subtitle1" component='h2'>${ product.price }</Typography>

            <Box my={ 2 }>
              <Typography variant="subtitle2">Cantidad</Typography>
              <ItemCounter
                currentValue={ tempCartProduct.quantity }
                maxValue={ product.inStock }
                updatedQuantity={ updatedQuantity }
              />
              <SizeSelector
                onSelectedSize={ onSelectedSize }
                selectedSize={ tempCartProduct.size }
                sizes={ product.sizes }
              />
            </Box>

            {
              product.inStock > 0 
                ? (
                  <Button
                    color="secondary"
                    className="circular-btn"
                    onClick={ onAddProduct }
                  >
                    { tempCartProduct.size ?  'Agregar al carrito' : 'Seleccione una talla' }
                  </Button>
                ) : (
                  <Chip label='Sin stock' color="error" variant="outlined" />
                )
            }

            <Box mt={ 3 }>
              <Typography variant="subtitle2">Descripción</Typography>
              <Typography variant="body2">{ product.description }</Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ShopLayout>
  )
}

// ESTO SERIA SERVER SIDE RENDERING - no usar aca
// export const getServerSideProps: GetServerSideProps = async (ctx) => {
//   const product = await dbProducts.getProductBySlug(ctx.params?.slug as string)

//   if (!product) {
//     return {
//       redirect: {
//         destination: '/',
//         permanent: false
//       }
//     }
//   }

//   return {
//     props: {
//       product
//     }
//   }
// }




// CONTENIDO ESTATICO
// You should use getStaticPaths if you’re statically pre-rendering pages that use dynamic routes
export const getStaticPaths: GetStaticPaths = async (ctx) => {
  const slugs = await  dbProducts.getAllProductSlugs()

  return {
    paths: slugs.map(({slug}) => ({ params: { slug } })),

    // paths: [
    //   {
    //     params: {
    //       slug: ''
    //     }
    //   }
    // ],
    fallback: "blocking"
  }
}


// You should use getStaticProps when:
//- The data required to render the page is available at build time ahead of a user’s request.
//- The data comes from a headless CMS.
//- The data can be publicly cached (not user-specific).
//- The page must be pre-rendered (for SEO) and be very fast — getStaticProps generates HTML and JSON files, both of which can be cached by a CDN for performance.
export const getStaticProps: GetStaticProps = async (ctx) => {
  const product = await dbProducts.getProductBySlug(ctx.params?.slug as string || '')

  if (!product) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  return {
    props: {
      product
    },
    revalidate: 60*60*24
  }
}


export default ProductPage