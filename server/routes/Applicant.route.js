import express from "express"
import { HandleCreateApplicant, HandleAllApplicants, HandleApplicant, HandleUpdateApplicant, HandleDeleteApplicant } from "../controllers/Applicant.controller.js"
import { VerifyhHRToken } from '../middlewares/Auth.middleware.js'
import { RoleAuthorization } from '../middlewares/RoleAuth.middleware.js'
import { ADMIN_ROLES } from '../constants/roles.js'


const router = express.Router()

router.post("/create-applicant", VerifyhHRToken, RoleAuthorization(...ADMIN_ROLES), HandleCreateApplicant)

router.get("/all", VerifyhHRToken, RoleAuthorization(...ADMIN_ROLES), HandleAllApplicants)

router.get("/:applicantID", VerifyhHRToken, RoleAuthorization(...ADMIN_ROLES), HandleApplicant)

router.patch("/update-applicant", VerifyhHRToken, RoleAuthorization(...ADMIN_ROLES), HandleUpdateApplicant)

router.delete("/delete-applicant/:applicantID", VerifyhHRToken, RoleAuthorization(...ADMIN_ROLES), HandleDeleteApplicant)

export default router