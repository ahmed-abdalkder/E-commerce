
import { Router } from "express";
import * as CC from "./order.controler.js";
import { auth } from '../../middleware/auth.js';
import { systemroles } from "../../utils/systemroles.js";

const router=Router()

router.post("/",auth([systemroles.user]),CC.addorder);

router.put("/:id",auth([systemroles.user]),CC.caceleorder);

 router.get("/",CC.getorder);

 orderRouter.post('/webhook', express.raw({type: 'application/json'}),CC.webkook)


export default router