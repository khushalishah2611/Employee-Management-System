import { getEquivalentRoles } from '../constants/roles.js'

export const RoleAuthorization = (...AuthRoles) => {
    return (req, res, next) => {
        const normalizedAllowedRoles = AuthRoles.flatMap((role) => getEquivalentRoles(role))
        const requestRoles = getEquivalentRoles(req.Role)

        const isAllowed = requestRoles.some((role) => normalizedAllowedRoles.includes(role))

        if (!isAllowed) {
            return res.status(403).json({ success: false, message: 'You are not athourized to access this route' })
        }
        next()
    }
}
