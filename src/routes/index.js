import express from "express"
import authRoutes from "./auth.route.js"
const router=express.Router();

router.use("/auth",authRoutes)
//http://localhost:8000/auth/register
export default router;