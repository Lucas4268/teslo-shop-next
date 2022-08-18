import { ChangeEvent, FC, useEffect, useRef, useState } from 'react'
import { GetServerSideProps } from 'next'
import { Controller, useForm } from 'react-hook-form';
import { DriveFileRenameOutline, SaveOutlined, UploadOutlined } from '@mui/icons-material';
import { Box, Button, capitalize, Card, CardActions, CardMedia, Checkbox, Chip, Divider, FormControl, FormControlLabel, FormGroup, FormLabel, Grid, ListItem, Paper, Radio, RadioGroup, TextField } from '@mui/material';

import { AdminLayout } from '../../../components/layouts'
import { IProduct } from '../../../interfaces';
import { dbProducts } from '../../../database';
import { tesloApi } from '../../../api';
import { Product } from '../../../models';
import { useRouter } from 'next/router';


const validTypes  = ['shirts','pants','hoodies','hats']
const validGender = ['men','women','kid','unisex']
const validSizes = ['XS','S','M','L','XL','XXL','XXXL']


interface FormData {
  _id         : string;
  description : string;
  images      : string[];
  inStock     : number;
  price       : number;
  sizes       : string[];
  slug        : string;
  tags        : string[];
  title       : string;
  type        : string;
  gender      : string,
}

interface Props {
  product: IProduct;
};

const ProductAdminPage:FC<Props> = ({ product }) => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [ newTagValue, setNewTagValue ] = useState('');
  const [ isSaving, setIsSaving ] = useState(false);

  const { register, handleSubmit, formState: { errors }, control, getValues, setValue, watch } = useForm<FormData>({
    defaultValues: product
  });


  useEffect(() => {
    const subscription = watch(( value, { name, type }) => {
      if ( name === 'title' ) {
        const newSlug = value.title?.trim()
          .replaceAll(' ', '_')
          .replaceAll("'", '')
          .toLowerCase() || '';

          setValue('slug', newSlug);
      }
    });

    return () => subscription.unsubscribe();
  }, [ watch, setValue ]);

  const onChangeSize = ( size: string ) => {
    const currentSizes = getValues('sizes');
    if ( currentSizes.includes( size ) ) {
      setValue('sizes', currentSizes.filter( s => s !== size), { shouldValidate: true });
    } else {
      setValue('sizes', [ ...currentSizes , size ], { shouldValidate: true });
    }
  }

  const onNewTag = () => {
    const currentTags = getValues('tags');

    if ( currentTags.includes( newTagValue ) ) return;
    
    setValue('tags', [ ...currentTags, newTagValue.trim().toLowerCase() ], { shouldValidate: true });
    setNewTagValue('');
  }

  const onDeleteTag = ( tag: string ) => {
    setValue('tags', getValues('tags').filter( t => t !== tag ), { shouldValidate: true });
  }

  const onFilesSelected = async( { target }: ChangeEvent<HTMLInputElement> ) => {
    if ( !target.files || target.files.length === 0 ) return;

    try {
      for( const file of target.files ) {
        const formData = new FormData();
        formData.append('file', file);

        const { data } = await tesloApi.post<{ message: string }>('/admin/upload', formData);

        setValue('images', [ ...getValues('images'), data.message ], { shouldValidate: true });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onDeleteImage = ( image: string ) => {
    setValue('images', getValues('images').filter( img => img !== image ), { shouldValidate: true });
  }


  const onSubmit = async( formData: FormData ) => {
    if ( formData.images.length < 2 ) {
      return alert('Minimo 2 imágenes');
    };
      
    setIsSaving(true);

    try {
      const { data } = await tesloApi({
        url: '/admin/products',
        method: formData._id ? 'PUT' : 'POST',
        data: formData
      });

      if ( !formData._id ) {
        router.replace(`/admin/products/${ data.slug }`);
      } else {
        setIsSaving(false);
      }
      
    } catch (error) {
      console.log(error);
      setIsSaving(false);    
    }
  }

  return (
    <AdminLayout 
      title={'Producto'} 
      subTitle={`Editando: ${ product.title }`}
      icon={ <DriveFileRenameOutline /> }
    >
      <form onSubmit={ handleSubmit( onSubmit ) }>
        <Box display='flex' justifyContent='end' sx={{ mb: 1 }}>
          <Button 
            color="secondary"
            startIcon={ <SaveOutlined /> }
            sx={{ width: '150px' }}
            type="submit"
            disabled={ isSaving }
          >
            Guardar
          </Button>
        </Box>

        <Grid container spacing={2}>
          {/* Data */}
          <Grid item xs={12} sm={ 6 }>

            <TextField
              label="Título"
              variant="filled"
              fullWidth 
              sx={{ mb: 1 }}
              { ...register('title', {
                  required: 'Este campo es requerido',
                  minLength: { value: 2, message: 'Mínimo 2 caracteres' }
              })}
              error={ !!errors.title }
              helperText={ errors.title?.message }
            />

            {/* <TextField
              label="Descripción"
              variant="filled"
              fullWidth 
              multiline
              sx={{ mb: 1 }}
              { ...register('description', {
                required: 'Este campo es requerido',
                minLength: { value: 2, message: 'Mínimo 2 caracteres' }
              })}
              error={ !!errors.description }
              helperText={ errors.description?.message }
            /> */}

            <Controller
              name="description"
              rules={{
                required: "Este campo es requerido",
              }}
              control={ control }
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Descripción"
                  variant="filled"
                  fullWidth
                  multiline
                  sx={{ mb: 1 }}
                  error={!!errors.description}
                  helperText={errors.description?.message}
                />
              )}
            />

            <TextField
              label="Inventario"
              type='number'
              variant="filled"
              fullWidth 
              sx={{ mb: 1 }}
              { ...register('inStock', {
                required: 'Este campo es requerido',
                minLength: { value: 0, message: 'Mínimo de valor 0' }
              })}
              error={ !!errors.inStock }
              helperText={ errors.inStock?.message }
            />
            
            <TextField
              label="Precio"
              type='number'
              variant="filled"
              fullWidth 
              sx={{ mb: 1 }}
              { ...register('price', {
                required: 'Este campo es requerido',
                minLength: { value: 0, message: 'Mínimo de valor 0' }
              })}
              error={ !!errors.price }
              helperText={ errors.price?.message }
            />

            <Divider sx={{ my: 1 }} />

            <FormControl sx={{ mb: 1 }}>
              <FormLabel>Tipo</FormLabel>
              <RadioGroup
                row
                value={ getValues('type') }
                onChange={ ({ target }) => setValue('type', target.value, { shouldValidate: true }) }
              >
                {
                  validTypes.map( option => (
                    <FormControlLabel 
                      key={ option }
                      value={ option }
                      control={ <Radio color='secondary' /> }
                      label={ capitalize(option) }
                    />
                  ))
                }
              </RadioGroup>
            </FormControl>

            <FormControl sx={{ mb: 1 }}>
              <FormLabel>Género</FormLabel>
              <RadioGroup
                row
                value={ getValues('gender') }
                onChange={ ({ target }) => setValue('gender', target.value, { shouldValidate: true }) }
                // { ...register('gender')}
                // onChange={ onStatusChanged }
              >
                {
                  validGender.map( option => (
                    <FormControlLabel 
                      key={ option }
                      value={ option }
                      control={ <Radio color='secondary' /> }
                      label={ capitalize(option) }
                    />
                  ))
                }
              </RadioGroup>
            </FormControl>

            <FormGroup>
              <FormLabel>Tallas</FormLabel>
              {
                  validSizes.map(size => (
                    <FormControlLabel
                      key={ size }
                      control={<Checkbox checked={ getValues('sizes').includes(size) } />}
                      label={ size }
                      onChange={ () => onChangeSize( size ) }
                    />
                  ))
              }
            </FormGroup>
          </Grid>

          {/* Tags e imagenes */}
          <Grid item xs={12} sm={ 6 }>
            <TextField
                label="Slug - URL"
                variant="filled"
                fullWidth
                sx={{ mb: 1 }}
                { ...register('slug', {
                  required: 'Este campo es requerido',
                  validate: ( value ) => value.trim().includes(' ') ? 'No puede contener espacios' : undefined
                })}
                error={ !!errors.slug }
                helperText={ errors.slug?.message }
            />

            <TextField
                label="Etiquetas"
                variant="filled"
                fullWidth 
                sx={{ mb: 1 }}
                helperText="Presiona [spacebar] para agregar"
                value={ newTagValue }
                onChange={ ({ target }) => setNewTagValue( target.value ) }
                onKeyUp={ (e) => e.code === 'Space' ? onNewTag() : undefined }
            />
                  
            <Box sx={{
                display: 'flex',
                flexWrap: 'wrap',
                listStyle: 'none',
                p: 0,
                m: 0,
              }}
              component="ul"
            >
              { 
                getValues('tags').map((tag) => {

                return (
                  <Chip
                    key={tag}
                    label={tag}
                    onDelete={ () => onDeleteTag(tag)}
                    color="primary"
                    size='small'
                    sx={{ ml: 1, mt: 1}}
                  />
                );
              })}
            </Box>

            <Divider sx={{ my: 2  }}/>
                  
            <Box display='flex' flexDirection="column">
              <FormLabel sx={{ mb:1}}>Imágenes</FormLabel>

              <Button
                color="secondary"
                fullWidth
                startIcon={ <UploadOutlined /> }
                sx={{ mb: 3 }}
                onClick={ () => fileInputRef.current?.click() }
              >
                Cargar imagen
              </Button>
              <input
                ref={ fileInputRef }
                type="file"
                multiple
                accept='image/png, image/jpeg, image/gif'
                style={{ display: 'none' }}
                onChange={ onFilesSelected }
              />

              <Chip 
                  label="Es necesario al menos 2 imagenes"
                  color='error'
                  variant='outlined'
                  sx={{ display: getValues('images').length < 2 ? 'flex' : 'none' }}
              />

              <Grid container spacing={2}>
                {
                  getValues('images').map( img => (
                    <Grid item xs={4} sm={3} key={img}>
                      <Card>
                        <CardMedia 
                          component='img'
                          className='fadeIn'
                          image={ img }
                          alt={ img }
                        />
                        <CardActions>
                          <Button
                            fullWidth
                            color="error"
                            onClick={ () => onDeleteImage(img) }
                          >
                            Borrar
                          </Button>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))
                }
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </form>
    </AdminLayout>
  )
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time


export const getServerSideProps: GetServerSideProps = async ({ query }) => {
    
  const { slug = ''} = query;

  let product: IProduct | null;

  if ( slug === 'new' ) {
    const tempProduct = JSON.parse( JSON.stringify( new Product ) );
    delete tempProduct._id;
    // tempProduct.images = ['img1.jpg', 'img2.jpg'];
    product = tempProduct;
  } else {
    product = await dbProducts.getProductBySlug(slug.toString());
  }
  

  if ( !product ) {
    return {
      redirect: {
        destination: '/admin/products',
        permanent: false,
      }
    }
  }
    

  return {
    props: {
      product
    }
  }
}


export default ProductAdminPage