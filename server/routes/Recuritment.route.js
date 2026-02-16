import express from 'express'
import { HandleCreateRecruitment, HandleAllRecruitments, HandleRecruitment, HandleUpdateRecruitment, HandleDeleteRecruitment } from '../controllers/Recruitment.controller.js'
import { VerifyhHRToken } from '../middlewares/Auth.middleware.js'
import { RoleAuthorization } from '../middlewares/RoleAuth.middleware.js'
import { ADMIN_ROLES } from '../constants/roles.js'

const router = express.Router()

router.post("/create-recruitment", VerifyhHRToken, RoleAuthorization(...ADMIN_ROLES), HandleCreateRecruitment)

router.get("/all", VerifyhHRToken, RoleAuthorization(...ADMIN_ROLES), HandleAllRecruitments)

router.get("/:recruitmentID", VerifyhHRToken, RoleAuthorization(...ADMIN_ROLES), HandleRecruitment)

router.patch("/update-recruitment", VerifyhHRToken, RoleAuthorization(...ADMIN_ROLES), HandleUpdateRecruitment)

router.delete("/delete-recruitment/:recruitmentID", VerifyhHRToken, RoleAuthorization(...ADMIN_ROLES), HandleDeleteRecruitment)

export default router