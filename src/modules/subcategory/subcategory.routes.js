import { Router } from "express";
import { auth } from '../../middleware/auth.js';
import * as CC from "./subcategory.controler.js";
import { systemroles } from "../../utils/systemroles.js";
import { datahost, multerhost } from "../../service/hostmulter.js";

const router=Router()

router.post("/",multerhost(datahost.image).single("image"),auth([systemroles.admin,systemroles.superadmin]),CC.addsubcategory);

router.patch("/:id",multerhost(datahost.image).single("image"),auth([systemroles.admin,systemroles.superadmin]),CC.updatesubcategory);

router.get("/",CC.getsubcategory );

export default router