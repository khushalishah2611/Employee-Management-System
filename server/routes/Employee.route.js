import express from "express"
import { HandleAllEmployees, HandleEmployeeUpdate, HandleEmployeeDelete, HandleEmployeeByHR, HandleEmployeeByEmployee, HandleAllEmployeesIDS } from "../controllers/Employee.controller.js"
import { VerifyhHRToken } from "../middlewares/Auth.middleware.js"
import { RoleAuthorization } from "../middlewares/RoleAuth.middleware.js"
import { ADMIN_ROLES } from "../constants/roles.js"
import { VerifyEmployeeToken } from "../middlewares/Auth.middleware.js"

const router = express.Router()


router.get("/all", VerifyhHRToken, RoleAuthorization(...ADMIN_ROLES), HandleAllEmployees)

router.get("/all-employees-ids", VerifyhHRToken, RoleAuthorization(...ADMIN_ROLES), HandleAllEmployeesIDS)

router.patch("/update-employee", VerifyEmployeeToken, HandleEmployeeUpdate)

router.delete("/delete-employee/:employeeId", VerifyhHRToken, RoleAuthorization(...ADMIN_ROLES), HandleEmployeeDelete)

router.get("/by-HR/:employeeId", VerifyhHRToken, RoleAuthorization(...ADMIN_ROLES), HandleEmployeeByHR)

router.get("/by-employee", VerifyEmployeeToken, HandleEmployeeByEmployee)



export default router