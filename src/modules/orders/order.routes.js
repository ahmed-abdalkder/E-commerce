
import express,{ Router } from "express";
import * as CC from "./order.controler.js";
import { auth } from '../../middleware/auth.js';
import { systemroles } from "../../utils/systemroles.js";
 

const router=express.Router()

router.post("/",auth([systemroles.user]),CC.addorder);

router.put("/:id",auth([systemroles.user]),CC.caceleorder);

 router.get("/",CC.getorder);

 router.post('/webhook',CC.webkook)


export default router