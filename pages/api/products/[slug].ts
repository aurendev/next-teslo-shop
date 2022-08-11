import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../database";
import { IProduct } from "../../../interfaces";
import { Product } from "../../../models";

type Data = {message: string}| IProduct

export default function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {

  switch (req.method) {
    case 'GET':
      return getBySlug(req, res)
  
    default:
      return res.status(400).json({ message: "Bad request" });
  }

	
}
const getBySlug = async (req: NextApiRequest, res: NextApiResponse<Data>) =>{
  const { slug } = req.query;

	await db.connect();

	const product = await Product.findOne({slug})
                .select('title price slug inStock images -_id')
                .lean();

	if (!product) {
		await db.disconnect();
		return res.status(400).json({ message: "El slug no es valido" });
	}

  return res.status(200).json(product)
}

