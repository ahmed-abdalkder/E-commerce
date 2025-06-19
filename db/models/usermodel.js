
 
import { Schema,model } from "mongoose";
import { systemroles } from "../../src/utils/systemroles.js";

const userschema= new Schema({
    // name:{
    //     type:String,
    //     required:true,
    //     trim:true
    // },
    // email:{
    //     type:String,
    //     required:true,
    //     trim:true,
    //     unique:true
    // },
    // password:{
    //     type:String,
    //     required:true,
    //     trim:true
    // },
    // confirmed:{
    //     type:Boolean,
    //     default:false
    // },
    // role:{
    //     type:String,
    //     default:"user",
    //     enum:Object.values(systemroles)
    // },
    // loggedIn:{
    //     type:Boolean,
    //     default:false
    // },
    
    //  code:String,
     name: {
    type: String,
     trim:true,
    required: true,

  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim:true
  },
  password: {
    type: String 
  },
  googleId: {
    type: String
    
  },
  picture: {
    type: String
     
  },
  role: {
    type: String,
    enum:Object.values(systemroles),
    default: 'user'
  },
   confirmed:{
        type:Boolean,
        default:false
    },
      loggedIn:{
        type:Boolean,
        default:false
    },
    code:String,
},{
    timestamps:true,
    versionKey:false
})
const usermodel= model("user",userschema)
export default usermodel