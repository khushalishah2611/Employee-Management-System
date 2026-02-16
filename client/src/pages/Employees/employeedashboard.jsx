import { employeeModules } from '../../constants/panelModules'

export const EmployeeDashboard = () => {
  const currentSession = JSON.parse(sessionStorage.getItem('ems_user_session') || '{}')

  return (
    <div className='min-h-screen bg-slate-100 p-6 md:p-10'>
      <div className='mx-auto max-w-6xl space-y-6'>
        <div className='rounded-xl bg-white p-6 shadow-sm'>
          <p className='text-sm font-semibold uppercase text-blue-600'>Employee Panel</p>
          <h1 className='mt-1 text-2xl font-bold text-slate-900'>Welcome to your self-service dashboard</h1>
          <p className='mt-2 text-sm text-slate-600'>
            Access is restricted to your own records only (attendance, leaves, salary, and profile settings).
          </p>
          <div className='mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3'>
            <div className='rounded-lg border border-slate-200 p-3'>
              <p className='text-xs text-slate-500'>Current Role</p>
              <p className='font-semibold text-slate-800'>{currentSession?.role || 'Employee'}</p>
            </div>
            <div className='rounded-lg border border-slate-200 p-3'>
              <p className='text-xs text-slate-500'>Panel</p>
              <p className='font-semibold text-slate-800'>{currentSession?.panel || 'Employee'}</p>
            </div>
            <div className='rounded-lg border border-slate-200 p-3'>
              <p className='text-xs text-slate-500'>Organization</p>
              <p className='font-semibold text-slate-800 truncate'>{currentSession?.organizationID || 'Session based'}</p>
            </div>
          </div>
        </div>

        <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-3'>
          {employeeModules.map((module) => (
            <article key={module.title} className='rounded-xl border border-slate-200 bg-white p-5 shadow-sm'>
              <div className='flex items-start justify-between gap-2'>
                <h2 className='text-lg font-semibold text-slate-800'>{module.title}</h2>
                <span className='rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700'>{module.access}</span>
              </div>
              <ul className='mt-3 list-disc space-y-1 pl-5 text-sm text-slate-600'>
                {module.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
