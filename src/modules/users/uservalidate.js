
 
import joi from 'joi'

export const signupvalidate={body:joi.object({
name:joi.string().trim().required(),
email:joi.string().email().trim().required(),
password:joi.string().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/)).required(),
 

})
}
export const signinvalidate={body:joi.object({
      email:joi.string().email().trim().required(),
    password:joi.string().pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)) .required(),
 })
    }