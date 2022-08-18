import bcrypt from 'bcryptjs'

import { db } from "."
import { User } from "../models"

export const checkUserEmailPassword = async( email: string, password: string ) => {

  await db.connect()
  const user = await User.findOne({ email })
  await db.disconnect()

  if ( !user ) {
    return null
  }

  if ( !bcrypt.compareSync( password, user.password! ) ) {
    return null
  }

  return {
    _id: user._id,
    email: email.toLowerCase(),
    name: user.name,
    role: user.role,
  }
}



export const oAuthToDBUser = async( oAuthEmail: string, oAuthName: string ) => {

  await db.connect()
  const user = await User.findOne({ email: oAuthEmail })

  if ( user ) {
    await db.disconnect()
    const { email, name, role, _id } = user
    return { email, name, role, _id }
  }

  const newUser = new User({ email: oAuthEmail, name: oAuthName, password: '@', role: "client" })
  await newUser.save()
  await db.disconnect()

  const { _id, name, email, role } = newUser

  return { _id, name, email, role }
}
