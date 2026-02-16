import express from 'express'
import { HandleHRSignup, HandleHRVerifyEmail, HandleHRResetverifyEmail, HandleHRLogin, HandleHRCheck, HandleHRLogout, HandleHRForgotPassword, HandleHRResetPassword, HandleHRcheckVerifyEmail } from '../controllers/HRAuth.controller.js'
import { VerifyhHRToken } from '../middlewares/Auth.middleware.js'
import { RoleAuthorization } from '../middlewares/RoleAuth.middleware.js'
import { ADMIN_ROLES } from '../constants/roles.js'

const router = express.Router()

router.post("/signup", HandleHRSignup)

router.post("/verify-email", VerifyhHRToken, RoleAuthorization(...ADMIN_ROLES), HandleHRVerifyEmail)

router.post("/resend-verify-email", VerifyhHRToken, RoleAuthorization(...ADMIN_ROLES), HandleHRResetverifyEmail)

router.post("/login", HandleHRLogin)

router.get("/check-login", VerifyhHRToken, RoleAuthorization(...ADMIN_ROLES), HandleHRCheck)

router.get("/check-verify-email", VerifyhHRToken, RoleAuthorization(...ADMIN_ROLES), HandleHRcheckVerifyEmail)

router.post("/logout", HandleHRLogout)

router.post("/forgot-password", VerifyhHRToken, RoleAuthorization(...ADMIN_ROLES), HandleHRForgotPassword)

router.post("/reset-password/:token", HandleHRResetPassword)


export default router