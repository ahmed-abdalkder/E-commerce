
import { Router } from "express";
import * as UC from "./user.controler.js";
import { signupvalidate } from "./uservalidate.js";
import { validation } from "../../middleware/validation.js";
 

const router=Router()

 
router.post("/", validation(signupvalidate), UC.signup);

router.get("/confirm/:token", UC.confrim);

router.patch("/forget", UC.forget);

router.patch("/reset", UC.resetpassword);

router.post("/signin", UC.signin);

router.get("/", UC.getuser);

export default router