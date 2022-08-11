import {
	Box,
	Button,
	FormControl,
	Grid,
	MenuItem,
	Select,
	TextField,
	Typography,
} from "@mui/material";
import { ShopLayout } from "../../components/layouts";

import { GetServerSideProps } from "next";
import { countries, jwt } from "../../utils";

import { useForm } from "react-hook-form";
import { string } from "yup";
import { InputWithValidation } from "../../components/ui";
import Cookies from "js-cookie";
import { useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { CartContext } from "../../contexts";

interface formData {
	name: string;
	lastname: string;
	address1: string;
	address2?: string;
	zipCode: string;
	city: string;
	country: string;
	phone: string;
}

const loadDataInitial = (): formData => {
	const userAddress = Cookies.get("user-address") ?? null;

	return userAddress
		? JSON.parse(userAddress)
		: {
				name: "",
				lastname: "",
				address1: "",
				address2: "",
				zipCode: "",
				city: "",
				country: "VEN",
				phone: "",
		  };
};

const AddressPage = () => {

	const router = useRouter();

  const {updateShippingAddress} = useContext(CartContext)

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<formData>({
		defaultValues: loadDataInitial(),
	});

	const onSubmit = (data: formData) => {
	
    updateShippingAddress(data)

		router.push("/checkout/summary");
	};

	return (
		<ShopLayout
			title={"Direccion"}
			pageDescription={"Confirmar direccion del destino"}
		>
			<Typography variant="h1" component={"h1"}>
				Direccion
			</Typography>

			<form onSubmit={handleSubmit(onSubmit)}>
				<Grid container sx={{ mt: 5 }} spacing={2}>
					<Grid item xs={12} sm={6}>
						{/* <TextField label='Nombre' variant='filled' fullWidth /> */}

						<InputWithValidation
							fieldValue="name"
							label="Nombre"
							required
							register={register}
							hasError={errors.name}
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							{...register("lastname", {
								required: "El apellido es requerido",
							})}
							error={!!errors.lastname}
							helperText={errors.lastname?.message}
							label="Apellido"
							variant="filled"
							fullWidth
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<InputWithValidation
							fieldValue="address1"
							label="Direccion 1"
							required
							register={register}
							hasError={errors.address1}
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<InputWithValidation
							fieldValue="address2"
							label="Direccion 2"
							register={register}
							hasError={errors.address2}
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<InputWithValidation
							fieldValue="zipCode"
							label="Codigo Postal"
							required
							register={register}
							hasError={errors.zipCode}
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<InputWithValidation
							fieldValue="city"
							label="Ciudad"
							required
							register={register}
							hasError={errors.city}
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							fullWidth
							select
							defaultValue={loadDataInitial().country}
							{...register("country", {
								required: "El pais es requerido",
							})}
							error={!!errors.country}
							helperText={errors.country?.message}
							variant="filled"
							label="Pais"
						>
							{countries.map((country) => (
								<MenuItem key={country.code} value={country.code}>
									{country.name}
								</MenuItem>
							))}
						</TextField>
					</Grid>
					<Grid item xs={12} sm={6}>
						<InputWithValidation
							fieldValue="phone"
							label="Telefono"
							required
							register={register}
							hasError={errors.phone}
						/>
					</Grid>

					<Grid item xs={12}>
						<Box sx={{ mt: 5 }} display="flex" justifyContent={"center"}>
							<Button
								type="submit"
								color="secondary"
								sx={{ color: "white" }}
								className="circular-btn"
								size="large"
							>
								Revisar pedido
							</Button>
						</Box>
					</Grid>
				</Grid>
			</form>
		</ShopLayout>
	);
};

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time
//* Validadno que el usuario este autenticado.(with SSR)
// export const getServerSideProps: GetServerSideProps = async (ctx) => {

//   const { token= ''} = ctx.req.cookies

//   let isValidtoken = false;

//   try {
//     await jwt.isValidToken(token)
//     isValidtoken = true
//   } catch (error) {
//     isValidtoken = false
//   }

//   if(!isValidtoken) {
//     return {
//       redirect: {
//         destination: '/auth/login?p=/checkout/address',
//         permanent: false
//       }
//     }
//   }

//   return {
//     props: {

//     }
//   }
// }

export default AddressPage;
