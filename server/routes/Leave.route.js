import express from 'express'
import { HandleAllLeaves, HandleCreateLeave, HandleDeleteLeave, HandleLeave, HandleUpdateLeaveByEmployee, HandleUpdateLeavebyHR } from '../controllers/Leave.controller.js'
import { VerifyEmployeeToken, VerifyhHRToken } from '../middlewares/Auth.middleware.js'
import { RoleAuthorization } from '../middlewares/RoleAuth.middleware.js'
import { ADMIN_ROLES } from '../constants/roles.js'


const router = express.Router()

router.post("/create-leave", VerifyEmployeeToken, HandleCreateLeave)

router.get("/all", VerifyhHRToken, RoleAuthorization(...ADMIN_ROLES), HandleAllLeaves)

router.get("/:leaveID", VerifyhHRToken, RoleAuthorization(...ADMIN_ROLES), HandleLeave)

router.patch("/employee-update-leave", VerifyEmployeeToken, HandleUpdateLeaveByEmployee)

router.patch("/HR-update-leave", VerifyhHRToken, RoleAuthorization(...ADMIN_ROLES), HandleUpdateLeavebyHR)

router.delete("/delete-leave/:leaveID", VerifyEmployeeToken, HandleDeleteLeave)

export default router