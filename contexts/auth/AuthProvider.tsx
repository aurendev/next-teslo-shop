import axios, { AxiosError, AxiosResponse } from "axios";
import Cookies from "js-cookie";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { FC, useEffect, useReducer } from "react";
import { tesloApi } from "../../api";
import { IUser } from "../../interfaces";
import { AuthContext, authReducer} from "./";

export interface AuthState {
	isLoggedIn: boolean;
  user?: IUser;
}

const Auth_INITIAL_STATE: AuthState = {
	isLoggedIn: false,
  user: undefined
};

interface Props {
	children?: React.ReactNode;
}

export const AuthProvider: FC<Props> = ({ children }) => {
	const [state, dispatch] = useReducer(authReducer, Auth_INITIAL_STATE);

  const { data, status} = useSession()

  const router = useRouter()

  useEffect(() => {
    if(status === 'authenticated'){
      console.log('[User]', data.user)

      dispatch({type:'[Auth] - Login',payload: data.user as IUser})
    }
  }, [data,status])
  


  //!old autentication
  // useEffect(() => {
  //   checkToken()
  // }, [])

  // const checkToken = async ()=>{

  //   if(!Cookies.get("token")) return;

  //   try {
  //     const {data} = await tesloApi.get("/user/validate-token");

  //     Cookies.set("token", data.token);

  //     dispatch({type: "[Auth] - Login", payload: data.user});
  //   } catch (error) {
  //     Cookies.remove("token");
  //   }

  // }
  

  const authLogin = async(email:string, password:string):Promise<boolean> => {
    try {
      const {data} = await tesloApi.post("/user/login", {email, password});
      const  {token, user} = data

      Cookies.set("token", token);
      dispatch({type: "[Auth] - Login", payload: user});
      return true
    } catch (error) {
      return false
    }
    
  }

  const authRegister = async(name:string, email:string, password:string) :Promise<{hasError: boolean, message?:string}> => {
    try {
      const {data} = await tesloApi.post("/user/register", {name,email, password});
      const  {token, user} = data

      Cookies.set("token", token);
      dispatch({type: "[Auth] - Login", payload: user});
      return {
        hasError: false,
      }
    } catch (error: any | AxiosError<any, any>) {
      if(axios.isAxiosError(error)){

        const {message} = error.response!.data as {message:string}

        return {
          hasError: true,
          message,
        }
      }

      return {
        hasError: true,
        message: 'No se pudo crear el usuario'
      }
    }
    
  }

  const authLogout = () => {
 
    Cookies.remove("cart");
    Cookies.remove("user-address");

    signOut()
  }

	return (
		<AuthContext.Provider
			value={{
				...state,
        authLogin,
        authRegister,
        authLogout,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};
