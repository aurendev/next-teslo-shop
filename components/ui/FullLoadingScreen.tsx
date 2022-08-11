import { Box, CircularProgress, Typography } from "@mui/material";
import React from "react";

export const FullLoadingScreen = () => {
	return (
		<Box
			display="flex"
			justifyContent="center"
			alignItems="center"
			height={"calc(100vh - 200px)"}
			sx={{
				flexDirection: { xs: "column" },
			}}
		>
			<Typography variant="subtitle2" sx={{mb:2}} >Cargando ...</Typography>
      <CircularProgress thickness={3}  />
		</Box>
	);
};
