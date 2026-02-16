import express from 'express'
import { HandleInitializeAttendance, HandleAllAttendance, HandleAttendance, HandleUpdateAttendance, HandleDeleteAttendance } from '../controllers/Attendance.controller.js'
import { VerifyEmployeeToken, VerifyhHRToken } from '../middlewares/Auth.middleware.js'
import { RoleAuthorization } from '../middlewares/RoleAuth.middleware.js'
import { ADMIN_ROLES } from '../constants/roles.js'

const router = express.Router()

router.post("/initialize", VerifyEmployeeToken, HandleInitializeAttendance)

router.get("/all", VerifyhHRToken, RoleAuthorization(...ADMIN_ROLES), HandleAllAttendance)

router.get("/:attendanceID", VerifyhHRToken, RoleAuthorization(...ADMIN_ROLES), HandleAttendance)

router.patch("/update-attendance", VerifyEmployeeToken, HandleUpdateAttendance)

router.delete("/delete-attendance/:attendanceID", VerifyhHRToken, RoleAuthorization(...ADMIN_ROLES), HandleDeleteAttendance)

export default router