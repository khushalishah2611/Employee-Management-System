import express from 'express'
import { HandleAllGenerateRequest, HandleCreateGenerateRequest, HandleDeleteRequest, HandleGenerateRequest, HandleUpdateRequestByEmployee, HandleUpdateRequestByHR } from '../controllers/GenerateRequest.controller.js'

import { VerifyEmployeeToken, VerifyhHRToken } from '../middlewares/Auth.middleware.js'
import { RoleAuthorization } from '../middlewares/RoleAuth.middleware.js'
import { ADMIN_ROLES } from '../constants/roles.js'

const router = express.Router()


router.post("/create-request", VerifyEmployeeToken, HandleCreateGenerateRequest)

router.get("/all", VerifyhHRToken, RoleAuthorization(...ADMIN_ROLES), HandleAllGenerateRequest)

router.get("/:requestID", VerifyhHRToken, RoleAuthorization(...ADMIN_ROLES), HandleGenerateRequest)

router.patch("/update-request-content", VerifyEmployeeToken, HandleUpdateRequestByEmployee)

router.patch("/update-request-status", VerifyhHRToken, RoleAuthorization(...ADMIN_ROLES), HandleUpdateRequestByHR)

router.delete("/delete-request/:requestID", VerifyhHRToken, RoleAuthorization(...ADMIN_ROLES), HandleDeleteRequest)

export default router



