
 
import { Schema,model } from "mongoose";
import { systemroles } from "../../src/utils/systemroles.js";

const userschema= new Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        trim:true
    },
    age:{
        type:Number,
        required:true,
    },
    confirmed:{
        type:Boolean,
        
        default:false
    },role:{
        type:String,
        default:"user",
        enum:Object.values(systemroles)
    },
    loggedIn:{
        type:Boolean,
        
        default:false
    },
    phone:[String],
    address:[String],
     code:String,
},{
    timestamps:true,
    versionKey:false
})
const usermodel= model("user",userschema)
export default usermodel