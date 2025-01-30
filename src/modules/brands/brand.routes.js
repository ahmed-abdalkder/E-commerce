import { Router } from "express";
import * as CC from "./brand.controler.js";
import { datahost, multerhost } from "../../service/hostmulter.js";
import { auth } from '../../middleware/auth.js';
import { systemroles } from "../../utils/systemroles.js";

const router=Router()

router.post("/",multerhost().single("image"),auth([systemroles.user]),CC.addbrand)

router.patch("/:id",multerhost(datahost.image).single("image"),auth([systemroles.user]),CC.updatebrand)

router.get("/",CC.getbrand)

export default router
