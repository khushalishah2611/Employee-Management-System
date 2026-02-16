import express from 'express'
import { HandleCreateSalary, HandleAllSalary, HandleSalary, HandleUpdateSalary, HandleDeleteSalary } from '../controllers/Salary.controller.js'
import { VerifyhHRToken } from '../middlewares/Auth.middleware.js'
import { RoleAuthorization } from '../middlewares/RoleAuth.middleware.js'
import { ADMIN_ROLES } from '../constants/roles.js'
const router = express.Router()

router.post("/create-salary", VerifyhHRToken, RoleAuthorization(...ADMIN_ROLES), HandleCreateSalary)

router.get("/all", VerifyhHRToken, RoleAuthorization(...ADMIN_ROLES), HandleAllSalary)

router.get("/:salaryID", VerifyhHRToken, RoleAuthorization(...ADMIN_ROLES), HandleSalary)

router.patch("/update-salary", VerifyhHRToken, RoleAuthorization(...ADMIN_ROLES), HandleUpdateSalary)

router.delete("/delete-salary/:salaryID", VerifyhHRToken, RoleAuthorization(...ADMIN_ROLES), HandleDeleteSalary)

export default router