
import  bcrypt  from 'bcrypt';
import  jwt  from 'jsonwebtoken';
import { customAlphabet } from 'nanoid';
import { sendemail } from './../../service/sendemail.js';
import { AppError } from './../../utils/classApperror.js';
import  usermodel from './../../../db/models/usermodel.js';
import { asyncHandler } from '../../utils/asyncHandeler.js';


export const signup = asyncHandler(async(req,res,next)=>{
    
   const{ name, email, password, age, phone, address ,role} = req.body;

  const userex = await usermodel.findOne({ email })
  if(userex){
      next(new AppError("user is exist"))
  };

    const hash = bcrypt.hashSync(password, +process.env.count);
   
    const token = jwt.sign({ email },process.env.signatuer);
    const link =`${req.protocol}://${req.headers.host}/users/confirm/${token}`;

    await sendemail(email, "hello", `<a href="${link}">klick her</a>`);

    const user = await usermodel.create(
       { name, email,
      password: hash,
      age, phone, address ,role});
      
       res.status(201).json({msg: "added", user});

});

export const confrim = asyncHandler(async(req,res,next)=>{

  const{ token } = req.params;

  const decoded = jwt.verify(token, process.env.signatuer)
  if(!decoded){
      next(new AppError("token not exist"))
  };

  const user = await usermodel.findOneAndUpdate(

  { email: decoded.email, confirmed: false },{ confirmed: true },{ new:true });

  res.status(200).json({msg: "done", user});

});

export const forget = asyncHandler(async(req,res,next)=>{

  const{ email } = req.body;

  const user = await usermodel.findOne({ email })
  if(!user){
      return next(new AppError("user not exist"))
    };

  const code = customAlphabet("0123456789",5);

  const newcode = code();

  await sendemail(email, "hello", `<h1>your code is ${newcode}</h1>`);

  await usermodel.updateOne({ email },{ code: newcode });

  res.status(200).json({ msg: "done" });

});

export const resetpassword = asyncHandler(async(req,res,next)=>{

  const{ email, password, code } = req.body;

  const user = await usermodel.findOne({ email })
  if(!user){
      return next(new AppError("user not exist"))
    };

    if(user.code !== code){
      return next(new AppError("code  invalid"))

    };

  const hash = bcrypt.hashSync(password, +process.env.count);
  
  await usermodel.updateOne({ email },{ password: hash, code: "" });
  
  res.status(200).json({ msg: "done" });

});

export const signin = asyncHandler(async(req,res,next)=>{

  const{ email, password } = req.body;

  const user = await usermodel.findOne({ email, confirmed: true })

  if(!user || !bcrypt.compareSync(password, user.password)){
    return next(new AppError("user not found or invalid password"))
 };

 const token = jwt.sign ({ id: user.id, role:user.role },process.env.signatuer);
 
 await usermodel.updateOne({ email },{ loggedIn: true });

  res.status(200).json({msg: "done", token});

});

export const getuser = asyncHandler(async(req,res,next)=>{

  const users = await usermodel.find({})
  if(!users){
    return next(new AppError("users does not exist "))

  };
  res.status(200).json({msg: "done", users});

});
