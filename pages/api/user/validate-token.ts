
import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../database";
import { User } from "../../../models";
import { jwt } from "../../../utils";
import { signToken } from "../../../utils/jwt";

type Data =
	| { message: string }
	| {
			token: string;
			user: {
				name: string;
				role: string;
				email: string;
			};
	  };

export default function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	switch (req.method) {
		case "GET":
			return checkJWT(req, res);

		default:
			res.status(400).json({ message: "Bad request" });
	}
}
const checkJWT = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
	const { token = "" } = req.cookies as { token: string };

	try {
		const userId = await jwt.isValidToken(token);

		await db.connect();

		const user = await User.findById(userId);

		await db.disconnect();

		if (!user) {
			return res.status(401).json({ message: "Usuario no encontrado " });
		}

		const { name, role, _id, email } = user;

		return res.status(200).json({
			token: signToken(JSON.parse(JSON.stringify(_id)), email),
			user: {
				name,
				role,
				email,
			},
		});
	} catch (error) {
		res.status(400).json({ message: "Token no valido" });
	}
};
