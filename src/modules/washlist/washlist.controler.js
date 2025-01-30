
import { AppError } from '../../utils/classApperror.js';
import { asyncHandler } from '../../utils/asyncHandeler.js';
import productmodel from './../../../db/models/productmodel.js';
import washlistmodel from './../../../db/models/washlistmodel.js';
 
 
 

export const addwashlist = asyncHandler(async(req,res,next)=>{

    const{ productId } = req.body;

    const product = await productmodel.findOne({ _id: productId })
    if (!product) {
     return next(new AppError("product not exist"))
    };

      const washlist = await washlistmodel.findOne({ user: req.user._id })
       if (!washlist) {
 
         const newwashlist = await washlistmodel.create({
          products: [productId],
          user: req.user._id
         });

           res.status(201).json({msg: "added", washlist:newwashlist});

        };

          await washlistmodel.updateOne({
          $addToSet: { products: productId},
          
         });

         res.status(201).json({msg: "added", washlist});

 });



export const deletewashlist = asyncHandler(async(req,res,next)=>{

  const{ id } = req.params;

  const washlist = await washlistmodel.findOneAndDelete({ _id: id, createdBy: req.user._id})
  if(!washlist){
    return next(new AppError("washlist not exist"))
};

const product = await productmodel.findById(washlist.products.productId);

         let sum = product.rateavg * product.ratenum;
          
          sum = sum -  washlist.rate;
          
         product.rateavg = sum / (product.ratenum - 1);

         product.ratenum -= 1;

         await product.save();

    res.status(201).json({msg: "deleted", washlist});

}); 