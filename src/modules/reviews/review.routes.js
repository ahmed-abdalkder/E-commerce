
import { Router } from "express";
import * as CC from "./review.controler.js";
import { auth } from '../../middleware/auth.js';
import { systemroles } from "../../utils/systemroles.js";

const router=Router()

router.post("/",auth([systemroles.user]),CC.addreview);

router.delete("/:id",auth([systemroles.user]),CC.deletereview);

//router.patch("/clear",auth([systemroles.user]),CC.clearreview)

export default router