import { KeyDetailBoxContentWrapper } from '../../../components/common/Dashboard/contentwrappers.jsx'
import { SalaryChart } from '../../../components/common/Dashboard/salarychart.jsx'
import { DataTable } from '../../../components/common/Dashboard/datatable.jsx'
import { useEffect } from 'react'
import { HandleGetDashboard } from '../../../redux/Thunks/DashboardThunk.js'
import { useDispatch, useSelector } from 'react-redux'
import { Loading } from '../../../components/common/loading.jsx'

const superAdminModules = [
  'Dashboard: Employees, Departments, Salary Summary, Attendance, Leave Requests',
  'Employee Management: Add/Edit/Delete, Department & Role assignment, Salary config, Activate/Deactivate',
  'Department Management: CRUD, employee assignment, reports',
  'Salary Management: Components, monthly salary, payslips, history',
  'Leave Management: Leave types, approve/reject, leave balance controls',
  'Attendance Management: Full attendance view, manual correction, rule-based controls',
  'Settings: Company profile, working hours, leave/salary rules',
]

export const HRDashboardPage = () => {
  const DashboardState = useSelector((state) => state.dashboardreducer)
  const dispatch = useDispatch()

  const DataArray = [
    {
      image: '/../../src/assets/HR-Dashboard/employee-2.png',
      dataname: 'employees',
      path: '/HR/dashboard/employees',
    },
    {
      image: '/../../src/assets/HR-Dashboard/department.png',
      dataname: 'departments',
      path: '/HR/dashboard/departments',
    },
    {
      image: '/../../src/assets/HR-Dashboard/leave.png',
      dataname: 'leaves',
      path: '/HR/dashboard/leaves',
    },
    {
      image: '/../../src/assets/HR-Dashboard/request.png',
      dataname: 'requestes',
      path: '/HR/dashboard/requestes',
    },
  ]

  useEffect(() => {
    dispatch(HandleGetDashboard({ apiroute: 'GETDATA' }))
  }, [dispatch])

  if (DashboardState.isLoading) {
    return <Loading />
  }

  return (
    <>
      <section className="mb-3 rounded-xl border border-slate-200 bg-white p-4">
        <p className="text-sm font-semibold uppercase text-blue-600">Super Admin Panel</p>
        <h2 className="text-xl font-bold text-slate-900">Role-based full control access</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
          {superAdminModules.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <KeyDetailBoxContentWrapper imagedataarray={DataArray} data={DashboardState.data} />
      <div className="salary-notices-container h-3/4 grid min-[250px]:grid-cols-1 min-[250px]:gap-3 lg:grid-cols-2 xl:gap-3">
        <SalaryChart balancedata={DashboardState.data} />
        <DataTable noticedata={DashboardState.data} />
      </div>
    </>
  )
}
