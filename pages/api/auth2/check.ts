import type { NextApiRequest, NextApiResponse } from "next";
import { jwt } from "../../../utils";


type Data = {
	isValid: boolean;
};

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {

  const { token= ''} = req.query as {token:string}
  
  // return res.status(200).json({data: 'esto viene demi propia api'+token})

  try {
    await jwt.isValidToken(token)

    return res.status(200).json({isValid: true})
  } catch (error) {
    console.log('[Redirect fail]')
    return res.status(401).json({isValid: false})
  }
	
}
