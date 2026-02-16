import express from "express"
import { HandleHRDashboard } from "../controllers/Dashboard.controller.js"
import { VerifyhHRToken } from "../middlewares/Auth.middleware.js"
import { RoleAuthorization } from "../middlewares/RoleAuth.middleware.js"
import { ADMIN_ROLES } from "../constants/roles.js"

const router = express.Router()

router.get("/HR-dashboard", VerifyhHRToken, RoleAuthorization(...ADMIN_ROLES), HandleHRDashboard) 

export default router