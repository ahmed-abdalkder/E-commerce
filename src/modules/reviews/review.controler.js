
import { AppError } from '../../utils/classApperror.js';
import { asyncHandler } from '../../utils/asyncHandeler.js';
import productmodel from '../../../db/models/productmodel.js';
import ordermodel from './../../../db/models/ordermodel.js';
import reviewmodel from '../../../db/models/reviewmodel.js';
 
 
 

export const addreview = asyncHandler(async(req,res,next)=>{

    const{ comment, rate, productId } = req.body;

    const product = await productmodel.findById(productId)
    if (!product) {
     return next(new AppError("product not exist"))
   };
 
   const order = await ordermodel.findOne({
    user: req.user._id,
    "products.productId": productId,
    status: "delivered"
  });

   if (!order) {
   return next(new AppError("order not exist"))
  };

    const reviewex = await reviewmodel.findOne({ createdBy: req.user._id })
        if(reviewex){
        return next(new AppError("review alrady exist"))

        }
         const review = await reviewmodel.create({
          comment, rate, productId,
          createdBy: req.user._id
         });

         let sum = product.rateavg * product.ratenum;
          
         sum = sum + review.rate;
         
        product.rateavg = sum / (product.ratenum + 1)

        product.ratenum += 1;

        await product.save();

         res.status(201).json({msg: "added", review})
 }); 



export const deletereview = asyncHandler(async(req,res,next)=>{

  const{ id } = req.params;

  const review =  await reviewmodel.findOneAndDelete({ _id: id, createdBy: req.user._id })
  if(!review){
    return next(new AppError("review not exist"))
};

const product = await productmodel.findById(review.productId);

         let sum = product.rateavg * product.ratenum;
          
          sum = sum - review.rate;
          
         product.rateavg = sum / (product.ratenum - 1);

         product.ratenum -= 1;

         await product.save();

    res.status(201).json({msg: "deleted", review});

}) ;