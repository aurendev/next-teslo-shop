import { Box, Button, Chip, Grid, Link, TextField, Typography } from "@mui/material";
import NextLink from "next/link";
import { AuthLayout } from "../../components/layouts";
import { useForm, SubmitHandler } from "react-hook-form";
import { validations } from "../../utils";
import { useContext, useState } from "react";
import { ErrorOutline } from "@mui/icons-material";
import { AuthContext } from "../../contexts/auth";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import { GetServerSideProps } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";

type formData = {
	name: string;
	password: string;
	email: string;
};

const RegisterPage = () => {
  const router = useRouter();
  const [showErrors, setShowErrors] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const {authRegister} = useContext(AuthContext);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<formData>();

	const onRegister = async ({name,email,password}: formData) => {

    setShowErrors(false);

    const {hasError, message} = await  authRegister(name,email,password)

    if(hasError){
      setShowErrors(true);
      setErrorMessage(message!);
      setTimeout(() => setShowErrors(false), 5000);

      return ;
    }
    // const destination = router.query.p?.toString() ?? '/'
    // router.replace(destination)

    signIn('credentials', {email,password})
    
  }

	return (
		<AuthLayout title="Auth | Register">
			<form onSubmit={handleSubmit(onRegister)}>
				<Box sx={{ width: 350, padding: "10px 20px" }}>
					<Grid container spacing={2}>
						<Grid item xs={12}>
							<Typography variant="h1" component={"h1"}>
								Registro
							</Typography>
              <Chip
								label={errorMessage}
								color="error"
								icon={<ErrorOutline />}
                className='fadeIn'
                sx={{ display: showErrors ? "flex" : "none" }}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								{...register("name", {
									required: "El nombre es requerido",
									minLength: {
										value: 5,
										message: "El nombre debe tener al menos 5 caracteres",
									},
								})}
								error={!!errors.name}
								helperText={errors.name?.message}
								label="Nombre"
								variant="filled"
								fullWidth
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								{...register("email", {
									required: "El email es requerido",
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
                  minLength: {value: 6, message: "El password debe tener al menos 6 caracteres"},
								})}
								label="Password"
								type={"password"}
                error={!!errors.password}
                helperText={errors.password?.message}
								variant="filled"
								fullWidth
							/>
						</Grid>

						{/* <Grid item xs={12}>
							<TextField
								label="Password Confirmation"
								type={"password"}
								variant="filled"
								fullWidth
							/>
						</Grid> */}
						<Grid item xs={12}>
							<Button
                type="submit"
								className="circular-btn"
								color="secondary"
								sx={{ width: "100%", color: "white" }}
							>
								Register
							</Button>
						</Grid>

						<Grid item xs={12} display="flex" justifyContent="end">
							<NextLink href={`/auth/login?p=${router.query.p ?? ''}`} passHref>
								<Link sx={{ textDecoration: "underline" }} underline="always">
									Ya tienes cuenta ?
								</Link>
							</NextLink>
						</Grid>
					</Grid>
				</Box>
			</form>
		</AuthLayout>
	);
};

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

export default RegisterPage;
