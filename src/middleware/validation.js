 

let datamethod=["body","params","query","header","file","files"]

export const validation=(schema)=>{

    return (req,res,next)=>{

      let list=[]

      datamethod.forEach((e)=>{

        if(schema[e]){
            const{error}=schema[e].validate(req[e],{abortEarly:false})

            if(error?.details){
                list.push(error.details)
            }
        }
      });
      if(list.length){
        return res.status(400).json({msg:"error",errors:list})
      }
      next()
    }
}