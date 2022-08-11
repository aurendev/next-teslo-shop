
import { AddCircleOutline, RemoveCircleOutline } from "@mui/icons-material"
import { Box, IconButton, Typography } from "@mui/material"
import { FC} from "react"


interface Props {
  maxItem: number;
  currenValue: number
  onChangeValue: (currentCounter: number) => void;
}

export const ItemCounter: FC<Props> = ({ maxItem, onChangeValue, currenValue}) => {

  const onAction = (action: '-'| '+' = '+')=> {
    if(action === '+' ){
      if(currenValue < maxItem ) onChangeValue(currenValue +1)
      
    }else{
      if(currenValue > 1) onChangeValue(currenValue -1)
    }
  }

  return (
    <Box display={'flex'} alignItems='center' >
      <IconButton
        disabled={currenValue === 1}
        onClick={()=> onAction('-')}
      >
        <RemoveCircleOutline />
      </IconButton>

      <Typography  sx={{width: 40, textAlign: 'center'}} >{currenValue}</Typography>

      <IconButton
        disabled={currenValue === maxItem}
        onClick={()=> onAction()}
      >
        <AddCircleOutline />
      </IconButton>
    </Box>
  )
}
