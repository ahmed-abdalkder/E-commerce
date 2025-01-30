
import { AppError } from "../utils/classApperror.js"
import multer from "multer"

export const datahost={
    image:["image/JFIF","image/jpeg","image/jpg","image/webp"],
    pdf:["application/pdf"],
    video:["video/mp4"]
}
export const localmulter=(customvalidation)=>{

  const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null,'uploads')
      },
      filename: function (req, file, cb) {
         
        cb(null, nanoid(5) + file.originalname )
      }
    });
    const fileFilter = function(req, file, cb) {
   
  if(customvalidation.includes(file.mimetype)){
     
   return cb(null, true)
  
  }
    cb(new AppError('I do not have a clue!'))
  
  }
    const upload = multer({ storage ,fileFilter })
    return upload
  }
  

export const multerhost=()=>{

const storage = multer.diskStorage({})

  
  const upload = multer({ storage })
  return upload
}