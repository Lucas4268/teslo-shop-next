import type { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcryptjs'
import { db } from '../../../database'
import { User } from '../../../models'
import { jwt, validations } from '../../../utils'

type Data = 
| { message: string }
| { token: string, user: { name: string, email: string, role: string } }

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

  switch (req.method) {
    case 'POST':
      return registerUser(req, res)
  
    default:
      res.status(405).json({ message: 'Method Not Allowed' })
  }
}

const registerUser = async(req: NextApiRequest, res: NextApiResponse<Data>) => {

  const { name = '', email = '', password = '' } = req.body

  if ( password.length < 6 ) {
    await db.disconnect()
    return res.status( 400 ).json({
      message: 'La contraseña debe tener al menos 6 caracteres.'
    })
  }

  if ( name.length < 3 ) {
    await db.disconnect()
    return res.status( 400 ).json({
      message: 'El nombre debe tener al menos 3 caracteres.'
    })
  }

  if ( validations.isEmail(email) ) {
    await db.disconnect()
    return res.status( 400 ).json({
      message: 'El correo no es válido.'
    })
  }

  await db.connect()
  const user = await User.findOne({ email })

  if (user) {
    await db.disconnect()
    return res.status(400).json({ message: 'El email ingresado posee una cuenta' })
  }
  
  
  const newUser = new User({
    name,
    email: email.toLowerCase(),
    password: bcrypt.hashSync( password ),
    role: 'client'
  })

  try {
    await newUser.save({ validateBeforeSave: false })
    await db.disconnect()

  } catch (error) {
    await db.disconnect()
    console.log(error)
    return res.status(500).json({ message: 'Error al registrar el usuario' })
  }


  const { role, _id } = newUser

  const token = jwt.signToken( _id, email )
  
  return res.status(200).json({
    token,
    user: {
      name,
      email,
      role
    }
  })
}
