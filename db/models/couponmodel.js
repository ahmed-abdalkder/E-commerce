
 
import  mongoose, { Types }  from "mongoose";
 
 
const couponschema= new mongoose.Schema({
    code:{
        type:String,
        required:true,
        trim:true,
        unique:true
    },
    amount:{
        type:Number,
        required:true,
        trim:true,
       
    },
    createdBy:{
        type:Types.ObjectId,
        ref:"user",
        required:true,
      },
      uesedBy:{
        type:Types.ObjectId,
        ref:"user",
      }, 
    fromDate:{
        type:Date,
        required:true,
    },
      toDate:{
       type:Date,
       required:true,
  },
},{
    timestamps:true,
    versionKey:false
})
const couponmodel = mongoose.model("coupon",couponschema)
export default couponmodel