
import slugify from 'slugify';
import { nanoid } from 'nanoid';
import cloudinary from '../../service/cloudinary.js';
import { AppError } from '../../utils/classApperror.js';
import brandmodel from '../../../db/models/brandmodel.js';
import { asyncHandler } from '../../utils/asyncHandeler.js';
import productmodel from '../../../db/models/productmodel.js';
import categorymodel from '../../../db/models/categorymodel.js';
import subcategorymodel from './../../../db/models/subcategorymodel.js';
 
 

 export const addproduct = asyncHandler(async(req, res, next)=>{

  const{ title, description, category, subcategory, brand,price, discount, stock } = req.body;

    const categoryex = await categorymodel.findById(category)
    if(!categoryex){
      return next(new AppError("category not exist"))
    };

    const subcategoryex = await subcategorymodel.findOne({ _id: subcategory, category })
    if(!subcategoryex){
      return next(new AppError("subcategory not exist"))
    };

    const brandex = await brandmodel.findById(brand)
    if(!brandex){
      return next(new AppError("brand not exist"))
    };

    const productex = await productmodel.findOne({ title })
        if(productex){
          return next(new AppError("product is exist"))
        };

        const subprice = price - (price * (discount || 0 ) / 100);


     if(!req.files){
      return next(new AppError("please inter images"))

     };
      const customId = nanoid(5);

      let list = [];

      for (const file of req.files.coverimages) {

        const{ secure_url, public_id } = await cloudinary.uploader.upload(file.path,
         {folder:`E-commers_last/category/${categoryex.customId}/subcategory/${subcategoryex.customId}/product/${customId}`})

          list.push({ secure_url, public_id })
      };

      const{ secure_url, public_id } = req.files.image[0];

      const product = await productmodel.create({
        title,
        slug: slugify(title, {
            replacement: '-',   
            lower: true,       
         }), 
         createdBy: req.user._id,
         stock,
         price,
         discount, 
         image: { secure_url, public_id },
         coverimages: list,
         category,
         subcategory,
         brand,
         customId,
         subprice,
         description
      });
      res.status(201).json({msg: "added", product});
});

export const updateproduct=asyncHandler(async(req,res,next)=>{

    const{ title, description, category, subcategory, brand, price, discount, stock } = req.body;

    const{ id } = req.params;

    const categoryex = await categorymodel.findById(category)
    if(!categoryex){
      return next(new AppError("category not exist"))
    };

    const product = await productmodel.findOne({ _id: id, createdBy: req.user.id })
        if(!product){
          return next(new AppError("product not exist"))
        };

        const subcategoryex = await subcategorymodel.findOne({ _id: subcategory, category })
       if(!subcategoryex){
         return next(new AppError("subcategory not exist"))
       };

      const brandex = await brandmodel.findById(brand)
      if(!brandex){
       return next(new AppError("brand not exist"))
       };

        if(title){
            if(product.title == title){
             return next(new AppError("product name is exist"))
           };

        if(await productmodel.findOne({ title: title })){
          return next(new AppError("title is exist"))
         };

          product.title = title
          product.slug = slugify(title,{
            replacement: "-",
            lower: true
        });
        };

        if(req.files){
          if(req.files?.image){

            await cloudinary.uploader.destroy(product.image.public_id)

            const{ secure_url, public_id } = await cloudinary.uploader.upload(req.file.image.path,
              {folder: `E-commers_last/category/${categoryex.customId}/subcategory/${subcategoryex.customId}/product/${customId}/mainimage`})
              product.image = { secure_url, public_id }
          };

           if(req.files?.length){
           await cloudinary.api.delete_resources_by_prefix(`E-commers_last/category/${categoryex.customId}/subcategory/${subcategoryex.customId}/product/${customId}/coverimages`)
        
          let list = [];
           for (const file of req.files.coverimages) {

            const{ secure_url, public_id } = await cloudinary.uploader.upload( file.path,
            {folder: `E-commers_last/category/${categoryex.customId}/subcategory/${subcategoryex.customId}/product/${customId}`})

            list.push({ secure_url, public_id })
        };

         product.coverimages = list

       };
       };
         if(description){
          product.description = description
       };

       if(stock){
        product.stock = stock
       };

       if(price && discount){
        product.subprice = price - (price * (discount || 0 ) / 100);

       product.price = price
       product.discount = discount
       }
         else if(price){
        product.subprice = price - (price * (product.discount || 0 ) / 100)
        product.price = price
       }
       else if(discount){
        product.subprice = product.price - (product.price * (discount || 0 ) / 100)
       product.discount = discount
      }
     
      
       await product.save()

      res.status(201).json({msg: "added", product})
})
 