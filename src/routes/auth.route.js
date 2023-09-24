import express from "express"
import trimRequest from "trim-request";
const router=express.Router();
import { register,login } from "../controllers/auth.controller.js";


router.route('/register').post(trimRequest.all,register);
router.route('/login').post(trimRequest.all,login);

export default router;