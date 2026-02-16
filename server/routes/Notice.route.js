import express from "express"
import { HandleCreateNotice, HandleAllNotice, HandleNotice, HandleUpdateNotice, HandleDeleteNotice } from "../controllers/Notice.controller.js"
import { VerifyhHRToken } from "../middlewares/Auth.middleware.js"
import { RoleAuthorization } from "../middlewares/RoleAuth.middleware.js"
import { ADMIN_ROLES } from "../constants/roles.js"

const router = express.Router()


router.post("/create-notice", VerifyhHRToken, RoleAuthorization(...ADMIN_ROLES), HandleCreateNotice)

router.get("/all/", VerifyhHRToken, RoleAuthorization(...ADMIN_ROLES), HandleAllNotice)

router.get("/:noticeID", VerifyhHRToken, RoleAuthorization(...ADMIN_ROLES), HandleNotice)

router.patch("/update-notice", VerifyhHRToken, RoleAuthorization(...ADMIN_ROLES), HandleUpdateNotice)

router.delete("/delete-notice/:noticeID", VerifyhHRToken, RoleAuthorization(...ADMIN_ROLES), HandleDeleteNotice) 


export default router