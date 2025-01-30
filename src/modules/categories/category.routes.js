
import { Router } from "express";
import * as CC from "./category.controler.js";
import { auth } from './../../middleware/auth.js';
import { systemroles } from "../../utils/systemroles.js";
import { datahost, multerhost } from "../../service/hostmulter.js";
 

const router=Router()

router.post("/",multerhost(datahost.image).single("image"),auth([systemroles.admin]),CC.addcategory)

router.patch("/:id",multerhost(datahost.image).single("image"),auth([systemroles.user]),CC.updatecategory)

router.delete("/:id",auth([systemroles.user]),CC.deletecategory)

router.get("/",CC.getcategory)

export default router