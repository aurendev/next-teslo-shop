import { ClearOutlined, SearchOutlined, ShoppingCartOutlined } from "@mui/icons-material";
import {
	AppBar,
	Badge,
	Box,
	Button,
	IconButton,
	Input,
	InputAdornment,
	Link,
	Toolbar,
	Typography,
} from "@mui/material";

import NextLink from "next/link";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { CartContext, UiContext } from "../../contexts";

import { useMedia } from "react-use";

export const Navbar = () => {
	const router = useRouter();

	const isSmallDeviceOrMayor = true /* useMedia("(min-width: 600px)") */;

	const [isVisibleSeach, setIsVisibleSeach] = useState(false);

	const currentRouteName = router.pathname.replace("/category/", "");

  const [searchTerm, setSearchTerm] = useState('')

	const { toggleSideMenu } = useContext(UiContext);

  const {cart} = useContext(CartContext)

  const executeSearch = () => {
    if(searchTerm.trim().length <=2) return false

    router.push(`/search/${searchTerm}`)
  }


	const onAction = () => {
		if (isSmallDeviceOrMayor) {
			console.log("[Small]");
			setIsVisibleSeach(true);
		} else {
			console.log("[xtraSmall]");
      toggleSideMenu()
		}
	};

	const buttonAClassctive = (type: string) => {
		return currentRouteName === type ? "contained" : "text";
	};

	return (
		<AppBar>
			<Toolbar>
				<NextLink href={"/"} passHref>
					<Link display="flex" alignItems={"center"}>
						<Typography variant="h6">Teslo | </Typography>
						<Typography sx={{ ml: 0.5 }}>Shop</Typography>
					</Link>
				</NextLink>

				<Box flex={1} />

				<Box
					sx={{ display: isVisibleSeach ? "none" : { xs: "none", sm: "flex" } }}
					className="fadeIn"
				>
					<NextLink href={"/category/men"} passHref>
						<Link>
							<Button variant={buttonAClassctive("men")}>Hombres</Button>
						</Link>
					</NextLink>
					<NextLink href={"/category/women"} passHref>
						<Link>
							<Button variant={buttonAClassctive("women")}>Mujeres</Button>
						</Link>
					</NextLink>
					<NextLink href={"/category/kid"} passHref>
						<Link>
							<Button variant={buttonAClassctive("kid")}>niños</Button>
						</Link>
					</NextLink>
				</Box>

				<Box flex={1} />

				{isVisibleSeach ? (
					<Input
						className="fadeIn"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						onKeyPress={(e) => e.key === "Enter" && executeSearch()}
						type="text"
						placeholder="Buscar..."
						endAdornment={
							<InputAdornment position="end">
								<IconButton
									onClick={()=> setIsVisibleSeach(false)}
									aria-label="toggle password visibility"
								>
									<ClearOutlined />
								</IconButton>
							</InputAdornment>
						}
					/>
				) : (
					<IconButton onClick={onAction}>
						<SearchOutlined />
					</IconButton>
				)}

				<NextLink href={"/cart"} passHref>
					<Link>
						<IconButton>
							<Badge badgeContent={cart.length > 99 ? '+99' : cart.length} color="secondary">
								<ShoppingCartOutlined />
							</Badge>
						</IconButton>
					</Link>
				</NextLink>

				<Button onClick={() => toggleSideMenu()}>Menu</Button>
			</Toolbar>
		</AppBar>
	);
};
