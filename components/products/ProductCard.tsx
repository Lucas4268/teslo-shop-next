import { FC, useMemo, useState } from "react"
import NextLink from 'next/link'
import { Box, Card, CardActionArea, CardMedia, Chip, Grid, Link, Typography } from "@mui/material"
import { IProduct } from "../../interfaces"

interface Props {
  product: IProduct
}

export const ProductCard:FC<Props> = ({ product }) => {

  const [isHovered, setIsHovered] = useState(false)
  const [isImageLoaded, setIsImageLoaded] = useState(false)

  const productImage = useMemo(() => {
    return isHovered
      ? product.images[1]
      : product.images[0]
  }, [ isHovered, product.images ])

  return (
    <Grid
      item
      xs={ 6 }
      sm={ 4 }
      onMouseEnter={ () => setIsHovered(true) }
      onMouseLeave={ () => setIsHovered(false) }
    >
      <Card>
        <NextLink href={`/product/${ product.slug }`} passHref prefetch={ false }>
          <Link>
            <CardActionArea>
              
              {
                product.inStock === 0 && (
                    <Chip
                      label='Sin stock'
                      color='primary'
                      sx={{ position: 'absolute', zIndex: 99, top: '10px', left: '10px' }}
                    />
                )
              }

              <CardMedia
                className="fadeIn"
                component='img'
                image={ productImage }
                alt={ product.title }
                onLoad={ () => setIsImageLoaded(true) }
              />
            </CardActionArea>
          </Link>
        </NextLink>
      </Card>

      <Box mt={ 1 } display={ isImageLoaded ? 'block' : 'block' } className='fadeIn'> {/* ARREGLAR */}
        <Typography fontWeight={ 700 }>{ product.title }</Typography>
        <Typography fontWeight={ 500 }>${ product.price }</Typography>
      </Box>
    </Grid>
  )
}