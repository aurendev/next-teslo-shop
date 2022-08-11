import type { NextApiRequest, NextApiResponse } from 'next'
import { Product, User } from '../../models'


import  { db, seedData } from '../../database'

type Data = {
  message: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

  if(process.env.NODE_ENV === 'production'){
    return  res.status(401).json({message: 'No tiene acceso al servicio'})
    
  }

  await db.connect()

  await User.deleteMany()
  await User.insertMany(seedData.initialData.users)

  await Product.deleteMany();
  await Product.insertMany(seedData.initialData.products)

  await db.disconnect()

  res.status(200).json({ message: 'Seed completado exitosamente (with users)' })
}