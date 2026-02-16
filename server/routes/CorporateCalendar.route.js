import express from 'express'
import { HandleAllEvents, HandleCreateEvent, HandleDeleteEvent, HandleEvent, HandleUpdateEvent } from '../controllers/CorporateCalendar.controller.js'
import { VerifyhHRToken } from "../middlewares/Auth.middleware.js"
import { RoleAuthorization } from "../middlewares/RoleAuth.middleware.js"
import { ADMIN_ROLES } from "../constants/roles.js"

const router = express.Router()

router.post("/create-event",  VerifyhHRToken, RoleAuthorization(...ADMIN_ROLES), HandleCreateEvent)

router.get("/all",  VerifyhHRToken, RoleAuthorization(...ADMIN_ROLES), HandleAllEvents)

router.get("/:eventID",  VerifyhHRToken, RoleAuthorization(...ADMIN_ROLES), HandleEvent)

router.patch("/update-event",  VerifyhHRToken, RoleAuthorization(...ADMIN_ROLES), HandleUpdateEvent)

router.delete("/delete-event/:eventID",  VerifyhHRToken, RoleAuthorization(...ADMIN_ROLES), HandleDeleteEvent) 

export default router