
import { asyncHandler } from '../../utils/asyncHandeler.js';
import brandmodel from '../../../db/models/brandmodel.js';
import { AppError } from '../../utils/classApperror.js';
import cloudinary from '../../service/cloudinary.js';
import { nanoid } from 'nanoid';
import slugify from 'slugify';
import categorymodel from './../../../db/models/categorymodel.js';
 
 

export const addbrand=asyncHandler(async(req,res,next)=>{
    const{name}=req.body
    
    const brandexist=await brandmodel.findOne({name})
        if(brandexist){
          return next(new AppError("brand is exist"))
        }
    if(!req.file){
        return next(new AppError("please add image"))
      }
      const customId=nanoid(5)
      const{secure_url,public_id}=await cloudinary.uploader.upload(req.file.path,
        {folder:`E-commers_last/brand/${customId}`})

      const brand=await brandmodel.create({
        name,
        slug:slugify(name, {
            replacement: '-',   
            lower: true,       
         }), 
         createdBy:req.user._id,
         image:{secure_url,public_id},
        
         customId,
      })
      res.status(201).json({msg:"added",brand})
})

export const updatebrand=asyncHandler(async(req,res,next)=>{

    const{name,category}=req.body
    const{id}=req.params

    const categoryex=await categorymodel.findById(category)
    if(!categoryex){
      return next(new AppError("brand is exist"))
    }

    const brand=await brandmodel.findById({_id:id,createdBy:req.user.id})
        if(!brand){
          return next(new AppError("brand is exist"))
        }

        if(name){
         if(brand.name == name){
          return next(new AppError("brand name is exist"))
           }

        if(await brandmodel.findOne({name:name})){
          return next(new AppError("name is exist"))
         }

            brand.name = name
            brand.slug = slugify(name,{
            replacement:"-",
            lower:true
        })

        }

       if(req.file){
          await cloudinary.uploader.destroy(brand.image.public_id)
          const{secure_url,public_id} = await cloudinary.uploader.upload(req.file.path,
          {folder:`brand/${brand.customId}`})
  
          brand.image = {secure_url,public_id}
       }

       await brand.save()

      res.status(201).json({msg:"added",brand})
})

export const getbrand=async(req,res,next)=>{

  let page = req.query.page * 1
  if(page < 1) page = 1
  let limit = 2
  let skip = (page - 1) * limit

 const brand=await brandmodel.find({}).skip(skip).limit(limit)

  res.status(201).json({msg:"done",brand})

}