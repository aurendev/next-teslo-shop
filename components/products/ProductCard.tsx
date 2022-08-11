import NextLink from "next/link";

import {
	Box,
	Card,
	CardActionArea,
	CardMedia,
	Chip,
	Grid,
	Link,
	Typography,
} from "@mui/material";
import { FC, useMemo, useState } from "react";
import { IProduct } from "../../interfaces";

interface Props {
	product: IProduct;
}

export const ProductCard: FC<Props> = ({ product }) => {
	const [hovered, setHovered] = useState(false);

	const [isImageLoaded, setIsImageLoaded] = useState(false);

	const productImage = useMemo(() => {
		return hovered
			? product.images[1]
			: product.images[0];
	}, [hovered, product.images]);

	return (
		<Grid
			onMouseEnter={() => setHovered(true)}
			onMouseLeave={() => setHovered(false)}
			item
			xs={6}
			sm={4}
			key={product.slug}
		>
			<Card>
				<NextLink href={`/products/${product.slug}`} passHref prefetch={false}>
					<Link>
						<CardActionArea>
							{product.inStock === 0 && (
								<Chip
									label="No hay Disponible"
									color="primary"
									sx={{ position: "absolute", zIndex: 99, top: 10, left: 10 }}
								/>
							)}
							<CardMedia
								component={"img"}
								image={productImage}
								alt={product.title}
								onLoad={() => setIsImageLoaded(true)}
							/>
						</CardActionArea>
					</Link>
				</NextLink>
			</Card>

			<Box
				sx={{ mt: 1, display: isImageLoaded ? "block" : "none" }}
				className="fadeIn"
			>
				<Typography fontWeight={700}>{product.title}</Typography>
				<Typography fontWeight={500}>{`$${product.price}`}</Typography>
			</Box>
		</Grid>
	);
};
