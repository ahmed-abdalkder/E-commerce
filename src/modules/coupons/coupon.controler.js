
import { asyncHandler } from '../../utils/asyncHandeler.js';
import couponmodel from '../../../db/models/couponmodel.js';
import { AppError } from '../../utils/classApperror.js';
 
 
 

export const addcoupon = asyncHandler(async(req,res,next)=>{

    const{ code,amount,fromDate,toDate } = req.body
    
    const couponex = await couponmodel.findOne({ code })
        if(couponex){
          return next(new AppError("coupon is exist"))
        }
     
     const coupon=await couponmodel.create({
        code,
        amount,
        fromDate,
        toDate,
        createdBy: req.user._id,
       });

      res.status(201).json({msg:"added",coupon})
});

export const updatecoupon = asyncHandler(async(req,res,next)=>{

  const{ code,amount,fromDate,toDate } = req.body

  const{ id } = req.params

  const couponex = await couponmodel.findOne({ _id: id })
      if(!couponex && toDate < new Date()){
        
        return next(new AppError("coupon is expire"))
      }
   
   const coupon = await couponmodel.updateOne({ _id:id,createdBy: req.user._id },{
      code,
      amount,
      fromDate,
      toDate,
      createdBy: req.user._id,
     });

    res.status(201).json({msg:"added",coupon})
}) 