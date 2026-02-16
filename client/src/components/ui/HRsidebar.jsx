import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

import { NavLink, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { HandlePostHumanResources } from '../../redux/Thunks/HRThunk'
import { superAdminModules } from '../../constants/panelModules'

const menuItems = [
  { label: 'Super Admin Dashboard', icon: 'dashboard.png', to: '/HR/dashboard/dashboard-data' },
  ...superAdminModules
    .filter((module) => module.key !== 'dashboard')
    .map((module) => ({
      label: module.label,
      icon:
        module.key === 'employees'
          ? 'employee-2.png'
          : module.key === 'departments'
            ? 'department.png'
            : module.key === 'salaries'
              ? 'Salary.png'
              : module.key === 'leaves'
                ? 'leave.png'
                : module.key === 'attendances'
                  ? 'attendance.png'
                  : 'settings.png',
      to: module.route,
    })),
]

export function HRdashboardSidebar() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const HandleLogout = async () => {
    await dispatch(HandlePostHumanResources({ apiroute: 'LOGOUT', data: {} }))
    sessionStorage.removeItem('ems_user_session')
    navigate('/auth/HR/login')
  }

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-3 p-2">
              {menuItems.map((item) => (
                <NavLink key={item.to} to={item.to} className={({ isActive }) => (isActive ? 'bg-blue-200 rounded-lg' : '')}>
                  <SidebarMenuItem className="flex gap-4 hover:bg-blue-200 rounded-lg">
                    <img src={`/../../src/assets/HR-Dashboard/${item.icon}`} alt={item.label} className="w-7 ms-2 my-1" />
                    <button className="text-[16px] text-left">{item.label}</button>
                  </SidebarMenuItem>
                </NavLink>
              ))}
              <SidebarMenuItem className="flex gap-4 hover:bg-red-100 rounded-lg cursor-pointer" onClick={HandleLogout}>
                <img src="/../../src/assets/HR-Dashboard/settings.png" alt="logout" className="w-7 ms-2 my-1" />
                <button className="text-[16px] text-red-600">Logout</button>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
