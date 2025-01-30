
 
import  mongoose, { Types }  from "mongoose";
 
 
const productschema= new mongoose.Schema({
    title:{
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
    description:{
        type:String,
        required:true,
        trim:true,
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
      subcategory:{
        type:Types.ObjectId,
        ref:"subcategory",
        required:true,
      },
      brand:{
        type:Types.ObjectId,
        ref:"brand",
        required:true,
      },
       image:{secure_url:String,public_id:String}, 
       customId:String,
       coverimages:[{secure_url:String,public_id:String}],
      price:{
        type:Number,
        required:true,
    },
    subprice:{
        type:Number,
         default:1
    },
    discount:{
        type:Number,
        default:1

    },
    stock:{
        type:Number,
        required:true,
        default:1
  },
    rateavg:{
        type:Number,
        default:0
    },
    ratenum:{
        type:Number,
        default:0
    },
},{
    timestamps:true,
    versionKey:false
})
const productmodel = mongoose.model("product",productschema)
export default productmodel