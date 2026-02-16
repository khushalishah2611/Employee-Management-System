import express from 'express'
import { HandleSystemOverview } from '../controllers/SystemOverview.controller.js'
import { VerifyhHRToken } from '../middlewares/Auth.middleware.js'
import { RoleAuthorization } from '../middlewares/RoleAuth.middleware.js'
import { ADMIN_ROLES } from '../constants/roles.js'

const router = express.Router()

router.get('/overview', VerifyhHRToken, RoleAuthorization(...ADMIN_ROLES), HandleSystemOverview)

export default router
