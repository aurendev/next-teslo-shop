import { FC } from "react";
import { Slide } from "react-slideshow-image";

import styles from './styles.module.css'

import 'react-slideshow-image/dist/styles.css'


interface Props {
  images: string[];
}

export const ProductSlideshow : FC<Props> = ({images}) => {
  return (
    <Slide
      easing="ease"
      duration={7000}
      indicators
    >
      {
        images.map(image => {
          return (
            <div className={styles['each-slide-effect']} key={image} >
              <div style={{
                backgroundImage: `url(${image})`,
                backgroundSize: 'cover'
              }}>

              </div>
            </div>
          )
        })
      }
    </Slide>
  )
}