const employeeModules = [
  {
    title: 'Dashboard (Own Data)',
    items: ['Own attendance summary', 'Leave balance', 'Salary overview', 'Notifications'],
  },
  {
    title: 'Leave',
    items: ['Apply leave', 'Track status', 'View leave history'],
  },
  {
    title: 'Attendance',
    items: ['Mark attendance (if enabled)', 'View personal attendance report'],
  },
  {
    title: 'Salary',
    items: ['View self salary details', 'Download payslip', 'View salary history'],
  },
  {
    title: 'Settings',
    items: ['Update profile', 'Change password'],
  },
]

export const EmployeeDashboard = () => {
  return (
    <div className="min-h-screen bg-slate-100 p-6 md:p-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase text-blue-600">Employee Panel</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">Welcome to your self-service dashboard</h1>
          <p className="mt-2 text-sm text-slate-600">
            Access is restricted to your own records only (attendance, leaves, salary, and profile settings).
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {employeeModules.map((module) => (
            <article key={module.title} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-800">{module.title}</h2>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-600">
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
