import type { NextApiRequest, NextApiResponse } from "next";
import { db, SHOP_CONSTANTS } from "../../../database";
import { IProduct } from "../../../interfaces";
import { Product } from "../../../models";

type Data = { message: string } | IProduct[];

export default function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	switch (req.method) {
		case "GET":
			return getProducts(req, res);

		default:
			return res.status(200).json({ message: "Bad request" });
	}
}
const getProducts = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
	const { gender = "all" } = req.query;

	let condition = {};

	if (gender !== "all" && SHOP_CONSTANTS.validGenders.includes(`${gender}`)) {
		condition = { gender };
	}

	await db.connect();

	let products = await Product.find(condition)
		.select("title price slug inStock images -_id")
		.lean();

	products = products.map((product) => {
		product.images = product.images.map((image) => {
			return image.includes("http")
				? image
				: `${process.env.HOST_NAME}/products/${image}`;
		});

		return product;
	});

	await db.disconnect();

	return res.status(200).json(products);
};
