import {
	Box,
	Divider,
	Drawer,
	IconButton,
	Input,
	InputAdornment,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	ListSubheader,
} from "@mui/material";
import {
	AccountCircleOutlined,
	AdminPanelSettings,
	CategoryOutlined,
	ConfirmationNumberOutlined,
	DashboardCustomizeOutlined,
	EscalatorWarningOutlined,
	FemaleOutlined,
	LoginOutlined,
	MaleOutlined,
	SearchOutlined,
	VpnKeyOutlined,
} from "@mui/icons-material";
import { useContext, useState } from "react";
import { AuthContext, UiContext } from "../../contexts";
import { useRouter } from "next/router";

export const SideBar = () => {
	const { isMenuOpen, toggleSideMenu } = useContext(UiContext);

	const { isLoggedIn, user, authLogout } = useContext(AuthContext);

	const [searchTerm, setSearchTerm] = useState("");

	const executeSearch = () => {
		if (searchTerm.trim().length <= 2) return false;

		navigateTo(`/search/${searchTerm}`);
	};

	const router = useRouter();

	const navigateTo = (url: string) => {
		toggleSideMenu();
		router.push(url);
	};

	return (
		<Drawer
			open={isMenuOpen}
			anchor="right"
			sx={{ backdropFilter: "blur(4px)", transition: "all 0.5s ease-out" }}
			onClose={() => toggleSideMenu()}
		>
			<Box sx={{ width: 250, paddingTop: 5 }}>
				<List>
					<ListItem>
						<Input
							autoFocus
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							onKeyPress={(e) => e.key === "Enter" && executeSearch()}
							type="text"
							placeholder="Buscar..."
							endAdornment={
								<InputAdornment position="end">
									<IconButton
										onClick={executeSearch}
										aria-label="toggle password visibility"
									>
										<SearchOutlined />
									</IconButton>
								</InputAdornment>
							}
						/>
					</ListItem>

					{isLoggedIn && (
						<>
							<ListItem button>
								<ListItemIcon>
									<AccountCircleOutlined />
								</ListItemIcon>
								<ListItemText primary={"Perfil"} />
							</ListItem>

							<ListItem button onClick={()=> navigateTo('/orders/history')} >
								<ListItemIcon>
									<ConfirmationNumberOutlined />
								</ListItemIcon>
								<ListItemText primary={"Mis Ordenes"} />
							</ListItem>
						</>
					)}

					<ListItem
						onClick={() => navigateTo("/category/men")}
						button
						sx={{ display: { xs: "", sm: "none" } }}
					>
						<ListItemIcon>
							<MaleOutlined />
						</ListItemIcon>
						<ListItemText primary={"Hombres"} />
					</ListItem>

					<ListItem
						onClick={() => navigateTo("/category/women")}
						button
						sx={{ display: { xs: "", sm: "none" } }}
					>
						<ListItemIcon>
							<FemaleOutlined />
						</ListItemIcon>
						<ListItemText primary={"Mujeres"} />
					</ListItem>

					<ListItem
						onClick={() => navigateTo("/category/kid")}
						button
						sx={{ display: { xs: "", sm: "none" } }}
					>
						<ListItemIcon>
							<EscalatorWarningOutlined />
						</ListItemIcon>
						<ListItemText primary={"Niños"} />
					</ListItem>

					{!isLoggedIn ? (
						<ListItem onClick={() => navigateTo(`/auth/login?p=${router.asPath}`)} button>
							<ListItemIcon>
								<VpnKeyOutlined />
							</ListItemIcon>
							<ListItemText primary={"Ingresar"} />
						</ListItem>
					) : (
						<ListItem onClick={authLogout} button>
							<ListItemIcon>
								<LoginOutlined />
							</ListItemIcon>
							<ListItemText primary={"Salir"} />
						</ListItem>
					)}

					{/* Admin */}
					{isLoggedIn && user!.role === "admin" && (
						<>
							<Divider />
							<ListSubheader>Admin Panel</ListSubheader>
              <ListItem button onClick={()=> navigateTo('/admin')} >
								<ListItemIcon>
                  <DashboardCustomizeOutlined />
								</ListItemIcon>
								<ListItemText primary={"Dashboard"} />
							</ListItem>
							<ListItem button onClick={()=> navigateTo('/admin/products')}>
								<ListItemIcon>
									<CategoryOutlined />
								</ListItemIcon>
								<ListItemText primary={"Productos"} />
							</ListItem>
							<ListItem button onClick={()=> navigateTo('/admin/orders')}>
								<ListItemIcon>
									<ConfirmationNumberOutlined />
								</ListItemIcon>
								<ListItemText primary={"Ordenes"} />
							</ListItem>
							<ListItem button onClick={()=> navigateTo('/admin/users')}>
								<ListItemIcon>
									<AdminPanelSettings />
								</ListItemIcon>
								<ListItemText primary={"Usuarios"} />
							</ListItem>
						</>
					)}
				</List>
			</Box>
		</Drawer>
	);
};
