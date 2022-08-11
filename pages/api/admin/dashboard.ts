import type { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import { db } from "../../../database";
import { Order, Product, User } from "../../../models";

type Data =
	| {
			numberOfOrders: number;
			paidOrders: number;
			notPaidOrders: number;
			numberOfClients: number;
			numberOfProducts: number;
			productsWithNoInventary: number;
			lowInventary: number;
	  }
	| { message: string };

const runMiddleware = async (req: NextApiRequest, res: NextApiResponse) => {
  let session : any = await getToken({req, secret: process.env.NEXTAUTH_SECRET});

  const validRoles = ['admin', 'super-user', 'SEO']

  if(!session){
    return res.status(401).json({ message: "Unauthorized" });
  }

  if(!validRoles.includes(session.user.role)){
    return res.status(403).json({ message: "Forbidden" });
  }
}

export default function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	switch (req.method) {
		case "GET":
			return getGeneralStatistics(req, res);

		default:
			res.status(400).json({ message: "Bad request" });
	}
}
const getGeneralStatistics = async (
	req: NextApiRequest,
	res: NextApiResponse<Data>
) => {

  await runMiddleware(req, res);

	await db.connect();

	// const ordersTotal = await Order.find().lean();

	// const numberOfOrders = ordersTotal.length;

	// const paidOrders = ordersTotal.filter((order) => order.isPaid).length;

	// const notPaidOrders = numberOfOrders - paidOrders;

	// const numberOfClients = await (
	// 	await User.find({ role: "client" }).lean()
	// ).length;

	// const productsTotal = await Product.find().lean();

	// const numberOfProducts = productsTotal.length;

	// const productsWithNoInventary = productsTotal.filter(
	// 	(product) => product.inStock === 0
	// ).length;

	// const lowInventary = productsTotal.filter(
	// 	(product) => product.inStock < 10
	// ).length;

  const [
    numberOfOrders,
		paidOrders,
		notPaidOrders,
		numberOfClients,
		numberOfProducts,
		productsWithNoInventary,
		lowInventary,
  ] = await Promise.all([
    Order.countDocuments(),
    Order.find({ isPaid: true }).countDocuments(),
    Order.find({ isPaid: false }).countDocuments(),
    User.find({ role: "client" }).countDocuments(),
    Product.countDocuments(),
    Product.find({ inStock: 0 }).countDocuments(),
    Product.find({ inStock: { $lte: 10 } }).countDocuments(),
  ])

	return res.status(200).json({
		numberOfOrders,
		paidOrders,
		notPaidOrders,
		numberOfClients,
		numberOfProducts,
		productsWithNoInventary,
		lowInventary,
	});
};
