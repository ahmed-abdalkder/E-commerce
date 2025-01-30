
import { Router } from "express";
import * as CC from "./washlist.controler.js";
import { auth } from '../../middleware/auth.js';
import { systemroles } from "../../utils/systemroles.js";

const router=Router()

router.post("/", auth([systemroles.user]), CC.addwashlist);

router.delete("/:id", auth([systemroles.user]), CC.deletewashlist);

//router.patch("/clear",auth([systemroles.user]),CC.clearwashlist);

export default router