import mongoose, { Model, Schema,model } from "mongoose";
import { IUser } from "../interfaces";


const userSchema = new Schema({

  name: {type: String, required:true},
  email: {type: String, required:true, unique: true},
  password: {type: String, required:true},
  role:{
    type:String,
    enum:{
      values:['client','admin','super-user', 'SEO'],
      message:'{VALUE} is not a valid role',
      default:'client',
      required:true
    }
  },
  orders: [{type: Schema.Types.ObjectId, ref: "Order"}],

},{timestamps:true});

const User: Model<IUser> = mongoose.models.User || model<IUser>("User", userSchema);


export default User;