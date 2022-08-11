import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import axios from "axios";
import fectchAdapter from "@vespaiach/axios-fetch-adapter";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {

  //? Para rutas que requiren Auth
  if (req.nextUrl.pathname.startsWith("/checkout/") || 
      req.nextUrl.pathname.startsWith("/admin/") ) {

    let session = await getToken({req, secret: process.env.NEXTAUTH_SECRET});

    if(!session){
      const pageDestination = req.nextUrl.pathname; 
      const url = req.nextUrl.clone();

			url.pathname = `/auth/login`;
			url.searchParams.set("p", pageDestination);

			return NextResponse.redirect(url);
    }

    
  }

  //? Para rutas Admin
  if (req.nextUrl.pathname.startsWith("/admin")) {
    let session: any = await getToken({req, secret: process.env.NEXTAUTH_SECRET});
    console.log('[Session mdw]', session)
    const validRoles = ['admin', 'super-user', 'SEO']
    if(!validRoles.includes(session.user.role)){
      const url = req.nextUrl.clone();
      url.pathname = '/';
      return NextResponse.redirect(url);
    }

  }

  return NextResponse.next();

	//? Rutas Autenticadas with custom autentication
  //* Con la nueva version de los middleware (12.2) ,no pude hacer la validacion en el propio middleware, asi que tuve que hacer una request contra la api para validar el token.
	// if (req.nextUrl.pathname.startsWith("/checkout/")) {
	// 	const token = req.cookies.get("token") ?? "";
	// 	const pageDestination = req.nextUrl.pathname;

	// 	const url = new URL("/api/auth2/check", req.url);

	// 	const axiosFull = axios.create({
	// 		adapter: fectchAdapter,
	// 	});

	// 	try {
	// 		await axiosFull.get(url.toString() + "?token=" + token);
	// 	} catch (error) {
	// 		const url = req.nextUrl.clone();
	// 		url.pathname = `/auth/login`;
	// 		url.searchParams.set("p", pageDestination);

	// 		return NextResponse.redirect(url);
	// 	}
  // }
		// try {
		//   await jwt.isValidToken2(token,process.env.JWT_SECRET_SEED ?? '')
		//   return NextResponse.next()
		// } catch (error) {

		//   const requestedPage = req.nextUrl.pathname ?? ''
		//   return NextResponse.redirect(`/auth/login?p=${requestedPage}`)
		// }
	// }
	//?Objecto donde esta toda la informacion de la paginadonde se hizo el request.(req.nextUrl)
	// console.log('[Req :::]',req.nextUrl)
	// if (req.nextUrl.pathname.startsWith("/api/user/register")) {

	// const userBody = {
	//   name: req.formData?.name ?? "",
	// }

	// console.log('[user body]', req.body)

	// try {
	//   await registerSchema.registerSchema.validate(userBody)
	// } catch (error : any) {
	//   console.log('[Error register]', error.errors)
	// }
	// }

	// return NextResponse.next()
}
