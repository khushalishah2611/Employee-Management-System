import express from 'express'
import { HandleAllHR, HandleDeleteHR, HandleHR, HandleUpdateHR } from '../controllers/HR.controller.js'
import { VerifyhHRToken } from '../middlewares/Auth.middleware.js'
import { RoleAuthorization } from '../middlewares/RoleAuth.middleware.js'
import { ADMIN_ROLES } from '../constants/roles.js'

const router = express.Router()


router.get("/all", VerifyhHRToken, RoleAuthorization(...ADMIN_ROLES), HandleAllHR)

router.get("/:HRID", VerifyhHRToken, RoleAuthorization(...ADMIN_ROLES), HandleHR)

router.patch("/update-HR", VerifyhHRToken, RoleAuthorization(...ADMIN_ROLES), HandleUpdateHR)

router.delete("/delete-HR/:HRID", VerifyhHRToken, RoleAuthorization(...ADMIN_ROLES), HandleDeleteHR) 


export default router