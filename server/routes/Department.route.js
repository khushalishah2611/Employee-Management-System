import express from "express"
import { HandleCreateDepartment, HandleAllDepartments, HandleDepartment, HandleUpdateDepartment, HandleDeleteDepartment } from "../controllers/Department.controller.js"
import { VerifyhHRToken } from "../middlewares/Auth.middleware.js"
import { RoleAuthorization } from "../middlewares/RoleAuth.middleware.js"
import { ADMIN_ROLES } from "../constants/roles.js"

const router = express.Router()

router.post("/create-department", VerifyhHRToken, RoleAuthorization(...ADMIN_ROLES), HandleCreateDepartment)

router.get("/all", VerifyhHRToken, RoleAuthorization(...ADMIN_ROLES), HandleAllDepartments) 

router.get("/:departmentID", VerifyhHRToken, RoleAuthorization(...ADMIN_ROLES), HandleDepartment)

router.patch("/update-department", VerifyhHRToken, RoleAuthorization(...ADMIN_ROLES), HandleUpdateDepartment)

router.delete("/delete-department", VerifyhHRToken, RoleAuthorization(...ADMIN_ROLES), HandleDeleteDepartment) 


export default router 