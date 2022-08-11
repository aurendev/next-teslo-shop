import { disconnect } from '../../../database/db';
import { bnBD } from "@mui/material/locale";
import { isValidObjectId } from "mongoose";
import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../database";
import { IUser } from "../../../interfaces";
import { User } from "../../../models";

type Data = 
  | { message: string }
  | IUser[]

export default function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	switch (req.method) {
		case "GET":
			return getUsers(req, res);

		case "PUT":
			return updateUseRole(req, res);

		default:
			return res.status(400).json({ message: "Bad request" });
	}
}


const getUsers = async (req: NextApiRequest, res: NextApiResponse<Data>)=> {
  
  await db.connect()

  const users = await User.find().select("-password").lean()

  await db.disconnect()

  return res.status(200).json(users);

}

const updateUseRole = async  (req: NextApiRequest, res: NextApiResponse<Data>) => {
  
  const { userId= '', role= '' } = req.body;

  const validRoles = ['admin', 'super-user', 'SEO','client']

  if(!isValidObjectId(userId)){
    return res.status(404).json({ message: "Id no valido" });
  }

  if(!validRoles.includes(role)){
    return res.status(404).json({ message: role+" - Role no valido" });
  }

  await db.connect()

  const user = await User.findById(userId)

  if(!user){
    db.disconnect()
    return res.status(404).json({ message: "Usuario no encontrado" });
  }

  db.disconnect()

  user.role = role
  await user.save()

  return res.status(200).json({ message: "Usuario actualizado con exito" });

}

