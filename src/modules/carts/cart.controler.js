
import cartmodel from '../../../db/models/cartmodel.js';
import { AppError } from '../../utils/classApperror.js';
import { asyncHandler } from '../../utils/asyncHandeler.js';
import productmodel from './../../../db/models/productmodel.js';
 
 
 

export const addcart = asyncHandler(async(req,res,next)=>{

    const{productId, quantity} = req.body
         
    const product = await productmodel.findOne({ _id:productId, stock:{ $gte: quantity } })

     if (!product) {
     return next(new AppError("product not exist"))
  
}

    const cartex = await cartmodel.findOne({user: req.user._id })

        if(!cartex){

         const cart = await cartmodel.create(

          {user: req.user._id, products:[{ productId, quantity }]

        }); 

         return res.status(201).json({msg:"added",cart})

        }
     
      let flag = false

      for (const product of cartex.products) {

        if(productId == product.productId){

          product.quantity = quantity

          flag = true
        };
      }

      if(!flag){

        cartex.products.push({productId, quantity})
      }
      

         await cartex.save()
      

      res.status(201).json({msg:"added",carts:cartex})
});

export const updatecart=asyncHandler(async(req,res,next)=>{
  const{ productId,count} = req.body
  
  const cart=await cartmodel.findOneAndUpdate(
    {user:req.user._id,"products.productId":productId},{
    $inc: { "products.$.quantity": count }
    },{new:true})
      
    res.status(201).json({msg:"updated",cart})
});

export const clearcart=asyncHandler(async(req,res,next)=>{

  const cart=await cartmodel.findOneAndUpdate(
    {user:req.user._id,},{
       products:[]
    },{new:true})
      
    res.status(201).json({msg:"updated",cart})
}); 

export const deletProductOfCart =asyncHandler(async(req,res,next)=>{
const{id}=req.params
  const cart=await cartmodel.findOneAndUpdate({user:req.user._id },
     {
      $pull: { products: { productId: id } }
    },
    {new:true})
       if(!cart) {
     return next(new AppError("product not exist"))
       }
    res.status(201).json({msg:"updated",cart})
}); 

export const getCart=asyncHandler(async(req,res,next)=>{
 
  const cart = await cartmodel.findOne({ user: req.user._id }).populate('products.productId')
    if(!cart){
     return next(new AppError("cart not exist"))
    }  
    res.status(201).json({msg:"done",cart})
   
});