import { db } from ".";
import { IProduct } from "../interfaces";
import { Product } from "../models";


interface ProductSlug {
  slug: string
}

export const getAll = async (): Promise<IProduct[]> => {
	await db.connect();

  let products = await Product.find().lean()

	await db.disconnect();

  products = products.map(product => {
    product.images = product.images.map(image=>{
      return image.includes('http')? image : `${process.env.HOST_NAME}/products/${image}`
    })

    return product
  })

  return JSON.parse(JSON.stringify(products))

};

export const getBySlug = async (slug: string): Promise<IProduct| null> => {
	await db.connect();

  const product = await Product.findOne({slug}).lean()

	await db.disconnect();

  if(product){
    product.images = product.images.map(image=>{
      return image.includes('http')? image : `${process.env.HOST_NAME}/products/${image}`
    })
  }

  return !product ? null : JSON.parse(JSON.stringify(product))

};


export const getSlugsAll = async (): Promise<ProductSlug[]> => {

  await db.connect()

  const slugs = await Product.find().select('slug -_id').lean()

  await db.disconnect()

  return slugs

}

export const searchByTerm = async (term : string): Promise<IProduct[]> => {
  await db.connect()
  
  //? el query debe ser un string
  term = term.toString().toLowerCase()

  let products = await Product.find({
    $text:{ $search: term }
  })
  .select('title price slug inStock images tags -_id')
  .lean()

  products = products.map(product => {
    product.images = product.images.map(image=>{
      return image.includes('http')? image : `${process.env.HOST_NAME}/products/${image}`
    })

    return product
  })


  await db.disconnect()

  return  products
}
