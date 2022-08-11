import { Box, Button } from "@mui/material";
import { FC, useState } from "react";
import { IValidSize } from "../../interfaces"


interface Props{
  sizes: IValidSize[];
  onChangeSizeSelected?:(size: IValidSize) => void; 
}

export const SizeSelector: FC<Props> = ({ sizes, onChangeSizeSelected}) => {

  const [sizeSelected, setSizeSelected] = useState<IValidSize| null>()

  const onClick = (size : IValidSize) => {
    if(onChangeSizeSelected) onChangeSizeSelected(size)
    setSizeSelected(size)
  }

  return (
    <Box>
      {
        sizes.map(size => (
          <Button 
            variant="contained"
            onClick={()=> onClick(size)}
            key={size}
            size={'small'}
            color={ sizeSelected === size? 'primary' : 'info' }
          >
            {size}
          </Button>
        ))
      }
    </Box>
  )
}
