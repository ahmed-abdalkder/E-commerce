
 
import  mongoose, { Types }  from "mongoose";
 

const categoryschema= new mongoose.Schema({
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
    versionKey:false,
    toJSON:{virtuals:true},
    toObject:{virtuals:true},
})
categoryschema.virtual('subcategory', {
    ref: 'subcategory',
    localField: "_id",
    foreignField: 'category',
     
  });
const categorymodel= mongoose.model("category",categoryschema)
export default categorymodel