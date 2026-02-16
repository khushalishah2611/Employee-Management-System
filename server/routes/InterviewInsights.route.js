import express from 'express'
import { HandleAllInterviews, HandleCreateInterview, HandleInterview, HandleUpdateInterview, HandleDeleteInterview } from '../controllers/InterviewInsights.controller.js'
import { VerifyhHRToken } from '../middlewares/Auth.middleware.js'
import { RoleAuthorization } from '../middlewares/RoleAuth.middleware.js'
import { ADMIN_ROLES } from '../constants/roles.js'



const router = express.Router()

router.post("/create-interview", VerifyhHRToken, RoleAuthorization(...ADMIN_ROLES), HandleCreateInterview)

router.get("/all", VerifyhHRToken, RoleAuthorization(...ADMIN_ROLES), HandleAllInterviews)

router.get("/:interviewID", VerifyhHRToken, RoleAuthorization(...ADMIN_ROLES), HandleInterview)

router.patch("/update-interview", VerifyhHRToken, RoleAuthorization(...ADMIN_ROLES), HandleUpdateInterview)

router.delete("/delete-interview/:interviewID", VerifyhHRToken, RoleAuthorization(...ADMIN_ROLES), HandleDeleteInterview)


export default router