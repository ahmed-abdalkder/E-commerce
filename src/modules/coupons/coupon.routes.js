
import { Router } from "express";
import * as CC from "./coupon.controler.js";
import { auth } from '../../middleware/auth.js';
import { systemroles } from "../../utils/systemroles.js";

const router=Router()

router.post("/",auth([systemroles.user]),CC.addcoupon)

router.patch("/:id",auth([systemroles.user]),CC.updatecoupon)

export default router