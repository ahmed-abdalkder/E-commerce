import mongoose from "mongoose";

 const connectionDB=async()=>{
 return await mongoose.connect(process.env.DB_url).
 then(()=>{
    console.log("connection database successfully")
 }).catch((err)=>{
    console.log({msg:"catch error",err});
    
 })
}
 export default connectionDB


 