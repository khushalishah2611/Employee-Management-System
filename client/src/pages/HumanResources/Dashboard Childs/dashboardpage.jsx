import { KeyDetailBoxContentWrapper } from '../../../components/common/Dashboard/contentwrappers.jsx'
import { SalaryChart } from '../../../components/common/Dashboard/salarychart.jsx'
import { DataTable } from '../../../components/common/Dashboard/datatable.jsx'
import { useEffect } from 'react'
import { HandleGetDashboard } from '../../../redux/Thunks/DashboardThunk.js'
import { useDispatch, useSelector } from 'react-redux'
import { Loading } from '../../../components/common/loading.jsx'
import { NavLink } from 'react-router-dom'
import { accessControlRows, superAdminModules } from '../../../constants/panelModules.js'

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
      path: '/HR/dashboard/leaves',
    },
  ]

  useEffect(() => {
    dispatch(HandleGetDashboard({ apiroute: 'GETDATA' }))
  }, [dispatch])

  if (DashboardState.isLoading) {
    return <Loading />
  }

  return (
    <div className='space-y-4 pb-6'>
      <section className='rounded-xl border bg-white p-5'>
        <p className='text-sm font-semibold uppercase text-blue-600'>Super Admin Panel</p>
        <h1 className='text-2xl font-bold text-slate-900'>Role-based module control</h1>
        <p className='mt-1 text-sm text-slate-600'>All modules below are scoped for Super Admin access. Employee panel remains self-service only.</p>

        <div className='mt-4 grid gap-3 md:grid-cols-2'>
          {superAdminModules.map((module) => (
            <NavLink key={module.key} to={module.route} className='rounded-lg border p-4 hover:border-blue-300 hover:bg-blue-50'>
              <h2 className='font-semibold text-slate-800'>{module.label}</h2>
              <p className='mt-1 text-sm text-slate-600'>{module.summary}</p>
            </NavLink>
          ))}
        </div>
      </section>

      <KeyDetailBoxContentWrapper imagedataarray={DataArray} data={DashboardState.data} />

      <div className='salary-notices-container h-3/4 grid min-[250px]:grid-cols-1 min-[250px]:gap-3 lg:grid-cols-2 xl:gap-3'>
        <SalaryChart balancedata={DashboardState.data} />
        <DataTable noticedata={DashboardState.data} />
      </div>

      <section className='rounded-xl border bg-white p-5'>
        <h2 className='text-lg font-semibold text-slate-900'>Access Control Summary</h2>
        <div className='mt-3 overflow-x-auto'>
          <table className='min-w-full text-left text-sm'>
            <thead>
              <tr className='border-b text-slate-600'>
                <th className='py-2 pr-4'>Module</th>
                <th className='py-2 pr-4'>Super Admin</th>
                <th className='py-2'>Employee</th>
              </tr>
            </thead>
            <tbody>
              {accessControlRows.map((row) => (
                <tr key={row.module} className='border-b last:border-none'>
                  <td className='py-2 pr-4 font-medium text-slate-800'>{row.module}</td>
                  <td className='py-2 pr-4 text-green-700'>{row.superAdmin}</td>
                  <td className='py-2 text-blue-700'>{row.employee}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
