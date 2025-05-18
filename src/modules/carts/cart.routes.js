
import { Router } from "express";
import * as CC from "./cart.controler.js";
import { auth } from '../../middleware/auth.js';
import { systemroles } from "../../utils/systemroles.js";

const router=Router()

router.post("/",auth([systemroles.user]),CC.addcart)

router.put("/",auth([systemroles.user]),CC.updatecart)

router.put("/clear",auth([systemroles.user]),CC.clearcart)

router.get("/getCart",auth([systemroles.user]),CC.getCart)

router.delete("/:id",auth([systemroles.user]),CC.deletProductOfCart)

export default router