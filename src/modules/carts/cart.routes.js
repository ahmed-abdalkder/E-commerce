
import { Router } from "express";
import * as CC from "./cart.controler.js";
import { auth } from '../../middleware/auth.js';
import { systemroles } from "../../utils/systemroles.js";

const router=Router()

router.post("/",auth([systemroles.user]),CC.addcart)

router.patch("/",auth([systemroles]),CC.updatecart)

router.patch("/clear",auth([systemroles]),CC.clearcart)

router.get("/getCart",auth([systemroles]),CC.getCart)



export default router