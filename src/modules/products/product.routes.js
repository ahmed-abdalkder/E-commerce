 
import { Router } from "express";
import * as CC from "./product.controler.js";
import { auth } from '../../middleware/auth.js';
import { systemroles } from "../../utils/systemroles.js";
import { datahost, multerhost } from "../../service/hostmulter.js";

const router=Router()

router.post("/",multerhost(datahost.image).fields([
    {name:"image",maxCount:1},
    {name:"coverimages",maxCount:3},
]),auth([systemroles.user]),CC.addproduct);

router.put("/:id",multerhost(datahost.image).fields([
    {name:"image",maxCount:1},
    {name:"coverimages",maxCount:3},
]),auth([systemroles.user]),CC.updateproduct);
 

export default router