
import productmodel from './../../../db/models/productmodel.js';
import couponmodel from './../../../db/models/couponmodel.js';
import { asyncHandler } from '../../utils/asyncHandeler.js';
import ordermodel from '../../../db/models/ordermodel.js';
import { AppError } from '../../utils/classApperror.js';
import cartmodel from './../../../db/models/cartmodel.js';
import { sendemail } from './../../service/sendemail.js';
import { createInvoice } from '../../service/pdf.js';
import { payment } from '../../../payment.js';
import Stripe from 'stripe';
 
 
 
 

export const addorder = asyncHandler(async(req,res,next)=>{

  const{couponcode,paymentmethod,phone,address } = req.body

     if(couponcode){
        const coupon = await couponmodel.findOne(
        {code:couponcode,uesedBy: {$nin: [req.user._id] }
        });

       if (!coupon || coupon.toDate < new Date()) {
          return next(new AppError("coupon not exist or coupon invalid"))
        }
         req.body.coupon = coupon
      }
        let flag = false;

        let products = [];

         
        const cart = await cartmodel.findOne({ user: req.user._id })

         if (!cart.products.length) {
           return next(new AppError("cart not exist"))
          }

          products = cart.products

            flag = true
        

          let finalproducts = [];

          let subprice = 0;

          for (let product of products) {

            const checkproduct = await productmodel.findOne(
            {_id: product.productId,stock: { $gte: product.quantity }})

           if (!checkproduct) {
             return next(new AppError("product does not exist"))
           }
           if(flag){
             product = product.toObject()
           } 
          product.title = checkproduct.title,
          product.price = checkproduct.price,
          product.finalprice = checkproduct.price * product.quantity,
          subprice += product.finalprice,
          finalproducts.push(product)
        }
    
         const order = await ordermodel.create({
            user: req.user._id,
            products: finalproducts,
            paymentmethod,
            address,
            phone,
            couponId: req.body?.coupon?._id,
            subprice,
            totleprice: subprice - (subprice * (req.body.coupon?.amount || 0) / 100),
            status: paymentmethod == "cash"? "plased": "waitpayment",
          })
          if(req.body?.coupon){
            await couponmodel.updateOne({ _id: req.body.coupon._id },{
              $push: { uesedBy: req.user._id }
            });
          }
          for (const product of finalproducts) {
            await productmodel.updateOne({ _id: product.productId },{$inc: {stock: - product.quantity }})
          }
          if(flag){
            await cartmodel.updateOne({ _id: req.user._id },{ products: [] })
          }
          
const invoice =  {
  shipping: {
    name: req.user.name,
    address: req.user.address,
    city: " cairo",
    state: "CA",
    country: "egypt",
    postal_code: 94111
  },
  items: order.products,
  subtotal: subprice,
  paid: order.totleprice,
  invoice_nr: order._id,
  Date: order.createdAt,
  coupon: req.body?.coupon?.amount || 0
};

 await createInvoice(invoice, "invoice.pdf");

await sendemail(req.user.email,"hello","your order has been succeeded",[
  { path: "invoice.pdf",
    contentType: "application/pdf"
  },
  { path: "imag.jpeg",
    contentType: "image/jpeg"
  }
])

if(paymentmethod == "card"){

 const stripe = new Stripe(process.env.stripe_secret)

  if(req.body?.coupon){

  const coupon = await stripe.coupons.create({
      percent_off: req.body.coupon.amount,
      duration: "once"
    });
    req.body.couponId = coupon.id
  }
 
const session = await payment({

payment_method_types : ["card"],
mode:"payment",
customer_email: req.user.email,
metadata: { orderId:order._id.toString() },
success_url: `${process.env.FRONTEND_URL}/orders/success/${order._id}`,
cancel_url: `${process.env.FRONTEND_URL}/orders/cancel/${order._id}`,
line_items: order.products.map((product)=>{
  return{
    price_data: {
      currency: "egp",
      product_data: {
      name: product.title,
      },
      unit_amount: product.price * 100,
    },
    quantity: product.quantity,
  }
}),

 discounts: req.body?.coupon?[{coupon: req.body.couponId}]: []

})

     return res.status(201).json({msg:"added",url:session.url})

}

         res.status(201).json({msg:"added",order})

}) 


export const caceleorder = asyncHandler(async(req,res,next)=>{

  const{ id } = req.params

  const{ reason } = req.body

  const order = await ordermodel.findOne({ _id: id,user: req.user._id })
      if(!order){
     return next(new AppError("order does not exist"))
    }
 if((order.paymentmethod == "cash" && order.status != "plased") && 
 (order.paymentmethod == "card" && order.status != "waitpayment")){

     return next(new AppError("order not cancelled"))

    }

    await ordermodel.updateOne({ _id: id }, { status: "cacelled", canselledBy: req.user._id, reason })

    if(order?.couponId){
      await couponmodel.updateOne({ _id: order?.couponId },{
      $pull: { uesedBy: req.user._id }})
    }

       for (const product of order.products) {

        await productmodel.updateOne({ _id: product.productId },{

          $inc: { stock: product.quantity }
        });
      }

    res.status(201).json({msg:"updated",order})
});


export const getorder = async(req,res,next)=>{

  const order = await ordermodel.find({})

  res.status(201).json({msg:"updated",order})

}