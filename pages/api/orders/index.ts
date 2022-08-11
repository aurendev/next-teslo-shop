import type { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import { db } from "../../../database";
import { IOrder } from "../../../interfaces";
import { Order, Product, User } from "../../../models";

type Data = {message: string;} | IOrder

export default function hnadler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	switch (req.method) {
		case "POST":
			return createOrder(req, res);

		default:
			return res.status(400).json({ message: "bad request" });
	}
}

const createOrder = async (req: NextApiRequest, res: NextApiResponse<Data>)=> {

  const  {orderItems, total } = req.body as IOrder

  //Verificar que tengamos un usuario
  const session: any = await getToken({req, secret: process.env.NEXTAUTH_SECRET});

  console.log('[SESSION]',session, session.user._id  )

  if(!session){
    return res.status(401).json({ message: 'Debe de estar autenticado para hacer esto' });
  }
  //Crear un arreglo con los productos que la personaquiere
  const productsIds = orderItems.map(product => product._id)
  await db.connect()

  const dbProducts = await Product.find({ _id: { $in: productsIds } })

  try {
    
    const subtotal = orderItems.reduce((prev, current)=> {
      const currentPrice = dbProducts.find(product => product.id ===current._id)?.price 

      if(!currentPrice){
        throw new Error('Verifique el carrito de nuevo ,producto no encontrado')
      }

      return (currentPrice * current.quantity) + prev
    }, 0)

    const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0) * subtotal;

    const backendTotal = subtotal + taxRate;

    if(total !== backendTotal){
      throw new Error('El total no coincide con el calculado')
    }

    //? Se guarda la orden 
    const newOrder = new Order({...req.body, isPaid: false, user: session.user._id })
    // Fijar 2 decimales
    newOrder.total = Math.round(newOrder.total * 100) / 100

    await newOrder.save()

    return res.status(201).json(newOrder)

  } catch (error:any) {
    await db.disconnect();
    console.log('[Error in Create Order]',error )
    return res.status(400).json({ message: error.message  || 'Revise loslogs del servidors'})
  }

}

