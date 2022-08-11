import * as yup from 'yup';


const  registerSchema = yup.object({
  name: yup.string().required().min(5),
  email: yup.string().required().email(),
  password: yup.string().required().min(6),
})


interface Register extends yup.InferType<typeof registerSchema >{}

export default registerSchema;