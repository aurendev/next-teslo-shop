import NextAuth, { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { dbUsers } from "../../../database";


export const authOptions: NextAuthOptions = {
	// Configure one or more authentication providers
	providers: [
		GithubProvider({
			clientId: process.env.GITHUB_ID!,
			clientSecret: process.env.GITHUB_SECRET!,
		}),
    
		CredentialsProvider({
			name: "With Credentials",
			credentials: {
				email: { label: "Email", type: "email", placeholder: "Email" },
				password: {
					label: "Password",
					type: "password",
					placeholder: "password",
				},
			},

			async authorize(credentials) {
				// console.log({ credentials });
       
				return  dbUsers.checkUserWithEmailAndPassword( credentials!.email, credentials!.password) ;
			},
		}),
		// ...add more providers here
	],

  //Custom page
  pages:{
    signIn: "/auth/login",
    newUser: "/auth/register",
  },

  session:{
    maxAge: 2592000, // 30d
    strategy:'jwt',
    updateAge: 86400, // 1d
    
  },

	//Callback...
	jwt: {},

	callbacks: {
		async jwt(credentials) {
			// console.log({ JWTC: credentials }); // => { user,account,profile?,isNewUser, token}

			const { token, account, user } = credentials;

      token.accessToken = account?.access_token

			switch (account?.type) {
				case "oauth":
					token.user = await dbUsers.checkUserOrVericate(user!.email!, user!.name!);
					break;

				case "credentials":
					token.user = user;
					break;
			}

			return token;
		},


		async session(credentials) {
			// console.log({ SessionC: credentials }); // => { user,session, token}

      const {session, token} = credentials;

      session.accessToken = token.accessToken;
      session.user = token.user as any;

			return session;
		},
	},
};

export default NextAuth(authOptions);
