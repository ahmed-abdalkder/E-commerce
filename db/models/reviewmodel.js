
 
 
import  mongoose, { Types }  from "mongoose";
 
 
const reviewschema= new mongoose.Schema({
  comment:{
    type:String,
    required:true,
     
},
rate:{
  type:Number,
  required:true,
  
},
    createdBy:{
        type:Types.ObjectId,
        ref:"user",
        required:true,
      },
     
        productId:{
            type:Types.ObjectId,
            ref:"product",
            required:true,
          },
            
    
},{
    timestamps:true,
    versionKey:false
})
const reviewmodel = mongoose.model("review",reviewschema)
export default reviewmodel