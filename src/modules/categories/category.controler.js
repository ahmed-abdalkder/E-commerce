
import subcategorymodel from '../../../db/models/subcategorymodel.js';
import categorymodel from './../../../db/models/categorymodel.js';
import { asyncHandler } from './../../utils/asyncHandeler.js';
import { AppError } from './../../utils/classApperror.js';
import cloudinary from '../../service/cloudinary.js';
import { nanoid } from 'nanoid';
import slugify from 'slugify';
 
 
 

export const addcategory = asyncHandler(async(req,res,next)=>{

    const{name} = req.body

    const categoryex = await categorymodel.findOne({name})
        if(categoryex){
          return next(new AppError("category is exist"))
        }

       if(!req.file){
        return next(new AppError("please add image"))
      }

      const customId = nanoid(5)

      const{secure_url,public_id} = await cloudinary.uploader.upload(req.file.path,
        {folder:`Ecommerslast/categories/${customId}`})

         req.filepath=`Ecommers_last/categories/${customId}`
       
       const category=await categorymodel.create({
        name,
        slug:slugify(name, {
            replacement: '-',   
            lower: true,       
         }), 
         createdBy:req.user._id,
         image:{secure_url,public_id}
      });

       req.data={
        model:categorymodel,
        id:category._id
      };

      res.status(201).json({msg:"added",category})
})

export const updatecategory = asyncHandler(async(req,res,next)=>{

    const{name} = req.body

    const{id} = req.params

    const category = await categorymodel.findById({_id:id,createdBy:req.user.id})

        if(!category){
          return next(new AppError("category is exist"))
        }
        if(name){
            if(category.name == name){
              return next(new AppError("category name is exist"))
           }

        if(await categorymodel.findOne({name:name})){ 
          return next(new AppError("name is exist"))
         }

        category.name = name
        category.slug = slugify(name,{
            replacement:"-",
            lower:true
        });
        };

       if(req.file){

        await cloudinary.uploader.destroy(category.image.public_id)

        const{secure_url,public_id } = await cloudinary.uploader.upload(req.file.path,
          {folder:`E-commers_last/category/${category.customId}`})
  
        category.image = {secure_url,public_id}
       };

       await category.save()

      res.status(201).json({msg:"added",category})
})

export const getcategory = async(req,res,next)=>{

  const  categories = await categorymodel.find({}).populate([
    {path:"subcategory"}
  ]);

  // let list=[]
  //   for (const category of categories) {
  //     const subcategory = await subcategorymodel.find({category:category._id})
  //     const newcategory = category.toObject()
  //     newcategory.subcategory = subcategory
  //    list.push(newcategory)
  //   }
  res.status(201).json({msg:"done", categories})

};

 
export const deletecategory = asyncHandler(async (req, res, next) => {

  const { id } = req.params;

   const category = await categorymodel.findOneAndDelete({ _id: id, createdBy: req.user._id });
  if (!category) {
    return next(new AppError("Category does not exist", 404));
  }

  await subcategorymodel.deleteMany({ category: category._id });

   const resourcePrefix =`Ecommerslast/categories/${category.customId}`;
   
  await cloudinary.api.delete_resources_by_prefix(resourcePrefix);
     
  await cloudinary.api.delete_folder(resourcePrefix);
   
        res.status(200).json({ msg: "done" });
});

