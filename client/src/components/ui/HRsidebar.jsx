import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuItem,
} from "@/components/ui/sidebar"

import { NavLink, useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { HandlePostHumanResources } from "../../redux/Thunks/HRThunk"

const menuItems = [
    { label: "Super Admin Dashboard", icon: "dashboard.png", to: "/HR/dashboard/dashboard-data" },
    { label: "Employees", icon: "employee-2.png", to: "/HR/dashboard/employees" },
    { label: "Departments", icon: "department.png", to: "/HR/dashboard/departments" },
    { label: "Salaries", icon: "Salary.png", to: "/HR/dashboard/salaries" },
    { label: "Issue Notices", icon: "notice.png", to: "/HR/dashboard/notices" },
    { label: "Leaves", icon: "leave.png", to: "/HR/dashboard/leaves" },
    { label: "Attendances", icon: "attendance.png", to: "/HR/dashboard/attendances" },
    { label: "Recruitment", icon: "recruitment.png", to: "/HR/dashboard/recruitment" },
    { label: "Interview Insights", icon: "interview-insights.png", to: "/HR/dashboard/interview-insights" },
    { label: "Requests", icon: "request.png", to: "/HR/dashboard/requests" },
    { label: "HR Profiles", icon: "HR-profiles.png", to: "/HR/dashboard/hr-profiles" },
]

export function HRdashboardSidebar() {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const HandleLogout = async () => {
        await dispatch(HandlePostHumanResources({ apiroute: "LOGOUT", data: {} }))
        navigate("/auth/HR/login")
    }

    return (
        <Sidebar>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu className="gap-3 p-2">
                            {menuItems.map((item) => (
                                <NavLink key={item.to} to={item.to} className={({ isActive }) => (isActive ? "bg-blue-200 rounded-lg" : "") }>
                                    <SidebarMenuItem className="flex gap-4 hover:bg-blue-200 rounded-lg">
                                        <img src={`/../../src/assets/HR-Dashboard/${item.icon}`} alt="" className="w-7 ms-2 my-1" />
                                        <button className="text-[16px]">{item.label}</button>
                                    </SidebarMenuItem>
                                </NavLink>
                            ))}
                            <SidebarMenuItem className="flex gap-4 hover:bg-red-100 rounded-lg cursor-pointer" onClick={HandleLogout}>
                                <img src="/../../src/assets/HR-Dashboard/settings.png" alt="" className="w-7 ms-2 my-1" />
                                <button className="text-[16px] text-red-600">Logout</button>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )

}
