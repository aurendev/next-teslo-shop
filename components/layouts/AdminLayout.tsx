import { Box, Typography } from "@mui/material";
import Head from "next/head";
import { FC } from "react";
import { AdminNavbar } from "../admin";
import { SideBar } from "../ui/Sidebar";

interface Props {
	title: string;
	subtitle: string;
	icon?: React.ReactNode;
	children: React.ReactNode;
}

export const AdminLayout: FC<Props> = ({ children, subtitle, icon, title }) => {
	return (
		<>
      <Head>
        <title>{title}</title>
        <meta name="description" content={subtitle} />
      </Head>
      
			<AdminNavbar />

			<SideBar />

			<main
				style={{
					margin: "80px auto",
					maxWidth: "1440px",
					padding: "0px 30px",
				}}
			>
				<Box>
					<Typography variant="h1" component={"h1"}>
						{icon}
            {' '}
						{title}
					</Typography>
					<Typography variant="h2" sx={{ mb: 1 }} component={"h2"}>
						{subtitle}
					</Typography>
				</Box>

				<Box className="fadeIn">{children}</Box>
			</main>

			<footer></footer>
		</>
	);
};
