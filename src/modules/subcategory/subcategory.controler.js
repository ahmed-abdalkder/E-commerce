
import slugify from 'slugify';
import { nanoid } from 'nanoid';
import cloudinary from '../../service/cloudinary.js';
import { AppError } from '../../utils/classApperror.js';
import { asyncHandler } from '../../utils/asyncHandeler.js';
import categorymodel from './../../../db/models/categorymodel.js';
import subcategorymodel from '../../../db/models/subcategorymodel.js';
 
 

export const addsubcategory = asyncHandler(async(req,res,next)=>{

    const{ name, category } = req.body;
    
    const categoryex = await categorymodel.findById(category)
    if(!categoryex){
      return next(new AppError("subcategory is exist"))
    };

    const subcategoryex = await subcategorymodel.findOne({ name })
        if(subcategoryex){
          return next(new AppError("subcategory is exist"))
        };
        if(!req.file){
          return next(new AppError("please add image"))
      };

      const customId = nanoid(5);

      const{ secure_url, public_id } = await cloudinary.uploader.upload(req.file.path,
        {folder: `Ecommerslast/categories/subcategory/${customId}`});

      const subcategory = await subcategorymodel.create({
        name,
        slug: slugify(name, {
            replacement: '-',   
            lower: true,       
         }), 
         createdBy: req.user._id,
         image: { secure_url, public_id },
         category,
         customId,
      });

      res.status(201).json({msg: "added", subcategory});

});

export const updatesubcategory = asyncHandler(async(req,res,next)=>{

        const{ name, category } = req.body;

        const{ id } = req.params;

        const categoryex = await categorymodel.findById(category)
        if(!categoryex){
         return next(new AppError("subcategory is exist"))
       };
       
        const subcategory = await subcategorymodel.findById({ _id: id, createdBy: req.user.id })
         if(!subcategory){
          return next(new AppError("subcategory is exist"))
         };

          if(name){
            if(subcategory.name == name){
             return next(new AppError("subcategory name is exist"))
           };

            if(await subcategorymodel.findOne({name: name})){
            return next(new AppError("name is exist"))
            };

          subcategory.name = name
          subcategory.slug = slugify(name, {
            replacement: "-",
            lower: true
        });

        };

        if(req.file){
          await cloudinary.uploader.destroy(subcategory.image.public_id)

          const{ secure_url, public_id } = await cloudinary.uploader.upload(req.file.path,
          {folder: `Ecommerslast/subcategories/${subcategory.customId}`})
  
        subcategory.image = { secure_url, public_id }
       };

        await subcategory.save();


      res.status(201).json({msg: "added", subcategory});

});

export const getsubcategory = async(req,res,next)=>{

  const subcategory = await subcategorymodel.find({}).populate([
    {path: "category", select: "name email"},
    {path: "createdBy", select: "name email"},
  ]);

  if(!subcategory){
    return next(new AppError("subcategory not exist"))

  };

  res.status(201).json({msg: "done", subcategory});

};