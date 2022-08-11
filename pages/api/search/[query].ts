import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../database";
import { IProduct } from "../../../interfaces";
import { Product } from "../../../models";

type Data = {message: string} | IProduct []

export default function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {

  switch (req.method) {
    case 'GET':
      return searchByTitleAndTags(req, res)
  
    default:
      return res.status(200).json({ message: "Bad request" });
  }

}
const searchByTitleAndTags = async  (req: NextApiRequest, res: NextApiResponse<Data>) =>{

  let { query = ''} = req.query 

  if(query.length === 0){
    return res.status(400).json({message: 'Debe especificar el campo para la busqueda'})
  }
   
  await db.connect()
  
  //? el query debe ser un string
  query = query.toString().toLowerCase()

  const products = await Product.find({
    $text:{ $search: query }
  })
  .select('title price slug inStock images tags -_id')
  .lean()


  await db.disconnect()

  return res.status(200).json(products)

}

