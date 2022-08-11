import {
	Box,
	Button,
	Chip,
	Divider,
	Grid,
	Link,
	TextField,
	Typography,
} from "@mui/material";
import NextLink from "next/link";
import { AuthLayout } from "../../components/layouts";

import { useForm, SubmitHandler } from "react-hook-form";
import { validations } from "../../utils";
import { tesloApi } from "../../api";
import { useContext, useEffect, useState } from "react";
import { ErrorOutline } from "@mui/icons-material";
import { AuthContext } from "../../contexts/auth";
import { useRouter } from "next/router";
import { getSession, signIn, getProviders } from "next-auth/react";

import { authOptions } from "../api/auth/[...nextauth]";

import { GetServerSideProps } from "next";
import { unstable_getServerSession } from "next-auth";

type formData = {
	password: string;
	email: string;
};

const LoginPage = () => {
	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm<formData>();

	const [showErrors, setShowErrors] = useState(false);
	const [providers, setProviders] = useState<any>({});

	const router = useRouter();

	useEffect(() => {
		getProviders().then((prov) => setProviders(prov));
	}, []);

	const onLogin = async ({ email, password }: formData) => {
		setShowErrors(false);

		signIn("credentials", { email, password });
	};

	return (
		<AuthLayout title="Auth | Login">
			<form onSubmit={handleSubmit(onLogin)}>
				<Box sx={{ width: 350, padding: "10px 20px" }}>
					<Grid container spacing={2}>
						<Grid item xs={12}>
							<Typography variant="h1" component={"h1"}>
								Login
							</Typography>
							<Chip
								label="No reconocemos ese Usuario/Password"
								color="error"
								icon={<ErrorOutline />}
								className="fadeIn"
								sx={{ display: showErrors ? "flex" : "none" }}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								{...register("email", {
									required: "El Email es requerido",
									validate: validations.isEmail,
								})}
								error={!!errors.email}
								helperText={errors.email?.message}
								label="Email"
								variant="filled"
								fullWidth
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								{...register("password", {
									required: "El password es requerido",
									minLength: {
										value: 6,
										message: "El password debe tener al menos 6 caracteres",
									},
								})}
								error={!!errors.password}
								helperText={errors.password?.message}
								label="Password"
								type={"password"}
								variant="filled"
								fullWidth
							/>
						</Grid>
						<Grid item xs={12}>
							<Button
								type="submit"
								className="circular-btn"
								color="secondary"
								sx={{ width: "100%", color: "white" }}
							>
								Login
							</Button>
						</Grid>

						<Grid item xs={12} display="flex" justifyContent="end">
							<NextLink
								href={`/auth/register?p=${router.query.p ?? ""}`}
								passHref
							>
								<Link sx={{ textDecoration: "underline" }} underline="always">
									no tienes cuenta ?
								</Link>
							</NextLink>
						</Grid>
            
            <Grid item xs={12} display="flex" flexDirection={'column'} justifyContent="end">
              <Divider sx={{width:'100%', mb:2}} />
              {
                Object.values(providers).map((provider: any) => {
                  if(provider.id !=='credentials'){
                    return (
                      <Button 
                        key={provider.id}
                        variant="outlined"
                        fullWidth
                        color="primary"
                        sx={{mb:1}}
                        onClick={()=> signIn(provider.id)}
                      >
                        {provider.name}
                      </Button>
                    )
                  }
                })
              }
						</Grid>

					</Grid>
				</Box>
			</form>
		</AuthLayout>
	);
};

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time
export const getServerSideProps: GetServerSideProps = async (ctx) => {
	const session = await unstable_getServerSession(
		ctx.req,
		ctx.res,
		authOptions
	);

	const { p = "/" } = ctx.query;

	if (session) {
		return {
			redirect: {
				destination: p.toString(),
				permanent: false,
			},
		};
	}

	return {
		props: {},
	};
};

export default LoginPage;
