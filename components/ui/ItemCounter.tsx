import { AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material'
import { Box, IconButton, Typography } from '@mui/material'
import { FC, useState } from 'react'

interface Props {
  currentValue: number,
  maxValue: number,
  updatedQuantity: (quantity: number) => void
}

export const ItemCounter:FC<Props> = ({ currentValue, maxValue, updatedQuantity }) => {

  const incrementCounter = () => {
    if (currentValue === maxValue) return
    updatedQuantity( currentValue + 1 )
  }

  const decrementCounter = () => {
    if (currentValue === 1) return
    updatedQuantity(currentValue - 1)
  }

  return (
    <Box display='flex' alignItems='center'>
      <IconButton onClick={ decrementCounter }>
        <RemoveCircleOutline />
      </IconButton>

      <Typography sx={{ width: 40, textAlign: 'center' }}>{ currentValue }</Typography>

      <IconButton onClick={ incrementCounter }>
        <AddCircleOutline />
      </IconButton>
    </Box>
  )
}