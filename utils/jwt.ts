import jwt from 'jsonwebtoken'

export const signToken = (_id:string, email:string)=> {
  if(!process.env.JWT_SECRET_SEED){
    throw new Error('JWT_SECRET_SEED is not defined')
  }

  return jwt.sign(
    // Payload
    {_id, email},
    // Seed
    process.env.JWT_SECRET_SEED,
    // Options(Expiration)
    {expiresIn: '30d'}
  )

}

export const isValidToken2 = (token:string, seed:string):Promise<string> => {
  console.log('[entro a isValidToken2]')
  if(token.length<=10) return Promise.reject('Token is not valid')

  return new  Promise((resolve,reject)=> {
    try {
      console.log('[entro a la promesa]')
      jwt.verify(token,seed ?? '',(err, payload)=>{
        if(err) return reject('jwt no valido')

        const {_id} = payload as {_id:string}

        resolve(_id)

      })

    } catch (error) {
      console.log('[entro a  catch]')
      reject('jwt no valido')
    }
  })
}

export const isValidToken = (token:string):Promise<string> => {
  if(!process.env.JWT_SECRET_SEED){
    throw new Error('JWT_SECRET_SEED is not defined')
  }

  if(token.length<=10) return Promise.reject('Token is not valid')

  return new  Promise((resolve,reject)=> {
    try {
      jwt.verify(token,process.env.JWT_SECRET_SEED ?? '',(err, payload)=>{
        if(err) return reject('jwt no valido')

        const {_id} = payload as {_id:string}

        resolve(_id)

      })

    } catch (error) {
      reject('jwt no valido')
    }
  })
}