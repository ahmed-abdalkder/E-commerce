
 
 
import  mongoose, { Types }  from "mongoose";
 
 
const orderschema= new mongoose.Schema({
    products:[{
        productId:{ type:Types.ObjectId,ref:"product",required:true },
         quantity:{type:Number,required:true},
        title:{ type:String, required:true, },
        price:{type:Number,required:true},
        finalprice:{type:Number,required:true},
    }],
      user:{type:Types.ObjectId,ref:"user",required:true},
      subprice:{type:Number,required:true},
      totleprice:{type:Number,required:true},
       couponId:{type:Types.ObjectId,ref:"coupon"},
       phone:{ type:String, required:true},
       address:{ type:String, required:true},
       paymentmethod:{ type:String, required:true,enum:["cash","card"] },
       status:{ type:String, required:true,
        enum:["plased","delivered","onway","cacelled","rejected","pending"],
        default:"pending"
     },
     canselledBy:{ type:Types.ObjectId,ref:"user"},
     reason:String
},{
    timestamps:true,
    versionKey:false
})

const ordermodel = mongoose.model("order",orderschema)
export default ordermodel