
 
import  mongoose, { Types }  from "mongoose";
 
 
const brandschema= new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    slug:{
        type:String,
        required:true,
        trim:true,
        unique:true
    },
    createdBy:{
        type:Types.ObjectId,
        ref:"user",
        required:true,
      },
       
    image:{secure_url:String,public_id:String}, 
    customId:String
},{
    timestamps:true,
    versionKey:false
})
const brandmodel = mongoose.model("brand",brandschema)
export default brandmodel