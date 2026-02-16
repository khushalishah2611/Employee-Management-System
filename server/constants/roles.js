export const ROLE_SUPER_ADMIN = 'Super Admin'
export const ROLE_HR_ADMIN_LEGACY = 'HR-Admin'
export const ROLE_EMPLOYEE = 'Employee'

export const ADMIN_ROLES = [ROLE_SUPER_ADMIN, ROLE_HR_ADMIN_LEGACY]

const ROLE_ALIASES = {
  [ROLE_SUPER_ADMIN]: [ROLE_SUPER_ADMIN, ROLE_HR_ADMIN_LEGACY],
  [ROLE_HR_ADMIN_LEGACY]: [ROLE_SUPER_ADMIN, ROLE_HR_ADMIN_LEGACY],
  [ROLE_EMPLOYEE]: [ROLE_EMPLOYEE],
}

export const getEquivalentRoles = (role) => ROLE_ALIASES[role] || [role]
