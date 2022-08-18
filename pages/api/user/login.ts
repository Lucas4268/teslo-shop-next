import type { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcryptjs'
import { db } from '../../../database'
import { User } from '../../../models'
import { jwt } from '../../../utils'

type Data = 
| { message: string }
| { token: string, user: { name: string, email: string, role: string } }

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

  switch (req.method) {
    case 'POST':
      return loginUser(req, res)
  
    default:
      res.status(405).json({ message: 'Method Not Allowed' })
  }
}

const loginUser = async(req: NextApiRequest, res: NextApiResponse<Data>) => {

  const { email = '', password = '' } = req.body

  await db.connect()
  const user = await User.findOne({ email })
  await db.disconnect()

  if (!user) {
    return res.status(400).json({ message: 'Email o contraseña incorrecto.' })
  }

  if ( !bcrypt.compareSync( password, user.password! ) ) {
    return res.status(400).json({ message: 'Email o contraseña incorrecto.' })
  }

  const { name, role, _id } = user

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
