import bcrypt from "bcryptjs";
import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../database";
import { User } from "../../../models";
import { signToken } from "../../../utils/jwt";
import { registerSchema } from "../../../yup-dalidations";

type Data =
	| { message: string | any }
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
			return userRegister(req, res);

		default:
			res.status(400).json({ message: "Bad request" });
	}
}
const userRegister = async (
	req: NextApiRequest,
	res: NextApiResponse<Data>
) => {
	const { name = "", password = "", email = "" } = req.body;

	try {
		await db.connect();

		//? Validando si el Correo existe
		const userAlreadyExists = await User.findOne({ email });

		if (userAlreadyExists) {
			return res
				.status(400)
				.json({ message: "Este correo ya ha sido registrado" });
		}

		//? Validate the data
		await registerSchema.validate({ name, password, email });

		const newUser = new User({
			name,
			password: bcrypt.hashSync(password),
			email: email.toLowerCase(),
			role: "client",
		});

		await newUser.save({ validateBeforeSave: true });

		await db.disconnect();

		const { role, _id } = newUser;

		const token = signToken(JSON.parse(JSON.stringify(_id)), email);

		return res.status(200).json({
			token,
			user: {
				name,
				role,
				email,
			},
		});
	} catch (error: any) {
		return res.status(400).json({ message: error.errors });
	}
};
