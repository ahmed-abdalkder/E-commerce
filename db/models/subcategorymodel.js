
 
import  mongoose, { Types }  from "mongoose";
 
 

const subcategoryschema= new mongoose.Schema({
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
      category:{
        type:Types.ObjectId,
        ref:"category",
        required:true,
      },
    image:{secure_url:String,public_id:String}, 
    customId:String
},{
    timestamps:true,
    versionKey:false
})
const subcategorymodel = mongoose.model("subcategory",subcategoryschema)
export default subcategorymodel