
 
 
import  mongoose, { Types }  from "mongoose";
 
 
const cartschema= new mongoose.Schema({
    
    user:{
        type:Types.ObjectId,
        ref:"user",
        required:true,
      },
      products:[{
        productId:{
            type:Types.ObjectId,
            ref:"product",
            required:true,
          },
          quantity:{
            type:Number,
            required:true,
          
          }
      }], 
      
},{
    timestamps:true,
    versionKey:false
})
const cartmodel = mongoose.model("cart",cartschema)
export default cartmodel