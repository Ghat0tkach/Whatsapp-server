import express from "express"
import trimRequest from "trim-request";
const router=express.Router();
import { searchUsers} from "../controllers/user.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";


router.route('/').get(trimRequest.all,authMiddleware,searchUsers);
 

export default router;