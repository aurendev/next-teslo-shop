import mongoose, { Model, Schema, model } from "mongoose";
import { IOrder } from "../interfaces";

const orderSchema = new Schema(
	{ 
  
		user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    // userId: {type: String, required: true},
		orderItems: [
			{
				_id: { type: Schema.Types.ObjectId, ref: "Product", required: true },
				title: { type: String, required: true },
				size: { type: String, required: true },
				quantity: { type: Number, required: true },
				price: { type: Number, required: true },
				slug: { type: String, required: true },
				image: { type: String, required: true },
				gender: { type: String, required: true },
			},
		],
		shippingAddress: {
			name: { type: String, required: true },
			lastname: { type: String, required: true },
			address1: { type: String, required: true },
			address2: { type: String },
			zipCode: { type: String, required: true },
			city: { type: String, required: true },
			country: { type: String, required: true },
			phone: { type: String, required: true },
		},
		numberOfItems: { type: Number, required: true },
		subTotal: { type: Number, required: true },
		taxRate: { type: Number, required: true },
		total: { type: Number, required: true },

		isPaid: { type: Boolean, required: true, default: false },
		paidAt: { type: String },
		// name: {type: String, required:true},
    transactionId: {type: String},
	},
	{ timestamps: true }
);

const Order: Model<IOrder> =
	mongoose.models.Order || model<IOrder>("Order", orderSchema);

export default Order;
