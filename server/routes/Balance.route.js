import express from "express"
import { HandleCreateBalance, HandleAllBalances, HandleBalance, HandleUpdateBalance, HandleDeleteBalance } from "../controllers/Balance.controller.js"
import { VerifyhHRToken } from "../middlewares/Auth.middleware.js"
import { RoleAuthorization } from "../middlewares/RoleAuth.middleware.js"
import { ADMIN_ROLES } from "../constants/roles.js"

const router = express.Router()

router.post("/add-balance", VerifyhHRToken, RoleAuthorization(...ADMIN_ROLES), HandleCreateBalance)

router.get("/all", VerifyhHRToken, RoleAuthorization(...ADMIN_ROLES), HandleAllBalances)

router.get("/:balanceID", VerifyhHRToken, RoleAuthorization(...ADMIN_ROLES), HandleBalance)

router.patch("/update-balance", VerifyhHRToken, RoleAuthorization(...ADMIN_ROLES), HandleUpdateBalance)

router.delete("/delete-balance/:balanceID", VerifyhHRToken, RoleAuthorization(...ADMIN_ROLES), HandleDeleteBalance)


export default router