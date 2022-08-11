import bcrypt from "bcryptjs";
import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../database";
import { User } from "../../../models";
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
		case "POST":
			return userLogin(req, res);

		default:
			res.status(400).json({ message: "Bad request" });
	}
}
const userLogin = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
	const { email = "", password = "" } = req.body;

	await db.connect();

	const user = await User.findOne({ email });

	await db.disconnect();

	if (!user) {
		return res.status(401).json({ message: "Usuario no encontrado | Email" });
	}

	if (!bcrypt.compareSync(password, user.password!)) {
		return res
			.status(400)
			.json({ message: "Usuario no encontrado | Password" });
	}

	const { name, role, _id } = user;

  const token = signToken(JSON.parse(JSON.stringify(_id)), email);

	return res.status(200).json({
		token,
		user: {
			name,
			role,
			email,
		},
	});
};
