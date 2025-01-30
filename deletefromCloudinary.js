 
import cloudinary from './src/service/cloudinary.js';
 
import  { model } from 'mongoose';
 
export const deleteCloudinary=async(req,res,next)=>{
    if(req?.filepath){
        await cloudinary.api.delete_resources_by_prefix(req.filepath)
        await cloudinary.api.delete_folder(req.filepath)
        next()
    }
}
export const deleteDB=async(req,res,next)=>{
    if(req?.data){
        const{model,id}=req.data
        await model.deleteOne({_id:id})
    }
}