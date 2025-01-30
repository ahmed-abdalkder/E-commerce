
 
 
import  mongoose, { Types }  from "mongoose";
 
 
const washlistschema= new mongoose.Schema({
  
    user:{
        type:Types.ObjectId,
        ref:"user",
        required:true,
      },
     
        products:[{
            type:Types.ObjectId,
            ref:"product",
            required:true,
          },]
            
    
},{
    timestamps:true,
    versionKey:false
})
const washlistmodel = mongoose.model("washlist",washlistschema)
export default washlistmodel