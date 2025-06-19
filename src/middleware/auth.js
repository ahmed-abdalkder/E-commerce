
import  jwt from "jsonwebtoken"
import usermodel from "../../db/models/usermodel.js"

export const auth=(roles=[])=>{

    return async(req,res,next)=>{

        const{token}=req.headers
        if(!token){
          return  res.status(401).json("token not found")
        }

        if(!token.startsWith("ahmed__")){
          
           return res.status(401).json("invalid token")
          }

          const newtoken=token.split("ahmed__")[1]
          if(!newtoken){
           return res.status(401).json("invalid newtoken")
          }

          const decoded= jwt.verify(newtoken,process.env.signatuer)
          if(!decoded?.id){
           return res.status(401).json("newtoken not found")
        }

        const user= await usermodel.findById(decoded.id)
        if(!user){
           return res.status(401).json("user not found")
         }

         if(!roles.includes(user.role)){
           return res.status(401).json("you have not permission")
          }

         req.user= user
         next()
}
}
export const authgraphql=async(token,roles=[])=>{
  
      
      if(!token){
        throw new Error("token not found")
      }
      if(!token.startsWith("ahmed__")){
        
         throw new Error("invalid token")
        }
        const newtoken=token.split("ahmed__")[1]
        if(!newtoken){
          throw new Error("invalid newtoken")
        }
        const decoded= jwt.verify(newtoken,"ahmed")
        if(!decoded?.id){
          throw new Error("newtoken not found")
      }
      const user= await usermodel.findById(decoded.id)
      if(!user){
        throw new Error("user not found")
       }
       if(!roles.includes(user.role)){
        throw new Error("you have not permission")

       }
      return user
      
}
 