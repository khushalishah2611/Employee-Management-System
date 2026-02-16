export const superAdminModules = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    route: '/HR/dashboard/dashboard-data',
    summary: 'Employees, Departments, Salary Summary, Attendance, Leave Requests',
    permissions: ['All organizational KPIs', 'Cross-module analytics'],
  },
  {
    key: 'employees',
    label: 'Employee Management',
    route: '/HR/dashboard/employees',
    summary: 'Add/Edit/Delete, assign department & role, salary, activate/deactivate',
    permissions: ['Create and update employee profiles', 'Manage activation and department mapping'],
  },
  {
    key: 'departments',
    label: 'Department Management',
    route: '/HR/dashboard/departments',
    summary: 'CRUD, employee assignment, reports',
    permissions: ['Create department structures', 'Generate department-level reports'],
  },
  {
    key: 'salaries',
    label: 'Salary Management',
    route: '/HR/dashboard/salaries',
    summary: 'Components, monthly salary, payslip, history',
    permissions: ['All employee payroll access', 'Payslip lifecycle management'],
  },
  {
    key: 'leaves',
    label: 'Leave Management',
    route: '/HR/dashboard/leaves',
    summary: 'Leave types, approve/reject, balance',
    permissions: ['Approve or reject leave requests', 'Maintain policy and balances'],
  },
  {
    key: 'attendances',
    label: 'Attendance Management',
    route: '/HR/dashboard/attendances',
    summary: 'View records, manual correction, attendance rules',
    permissions: ['Organization-wide attendance visibility', 'Manual corrections with rules'],
  },
  {
    key: 'settings',
    label: 'System Settings',
    route: '/HR/dashboard/settings',
    summary: 'Company profile, working hours, leave & salary rules',
    permissions: ['System-wide policy configuration', 'Controls employee marking options'],
  },
]

export const employeeModules = [
  {
    key: 'dashboard',
    title: 'Dashboard (Own Data)',
    access: 'Own Data',
    items: ['Own attendance summary', 'Leave balance', 'Salary overview', 'Notifications'],
  },
  {
    key: 'leave',
    title: 'Leave',
    access: 'Apply/View',
    items: ['Apply for leave', 'Track request status', 'View leave history'],
  },
  {
    key: 'attendance',
    title: 'Attendance',
    access: 'Own',
    items: ['Mark attendance (if allowed)', 'View personal attendance report'],
  },
  {
    key: 'salary',
    title: 'Salary',
    access: 'Self Only',
    items: ['View salary details', 'Download payslip', 'View salary history'],
  },
  {
    key: 'settings',
    title: 'Profile Settings',
    access: 'Profile Only',
    items: ['Update profile details', 'Change password securely'],
  },
]

export const accessControlRows = [
  { module: 'Dashboard', superAdmin: 'All Data', employee: 'Own Data' },
  { module: 'Employee Management', superAdmin: 'Full Access', employee: 'No Access' },
  { module: 'Department', superAdmin: 'Yes', employee: 'No' },
  { module: 'Salary', superAdmin: 'All Employees', employee: 'Self Only' },
  { module: 'Leave', superAdmin: 'Approve/Reject', employee: 'Apply/View' },
  { module: 'Attendance', superAdmin: 'All', employee: 'Own' },
  { module: 'Settings', superAdmin: 'System Level', employee: 'Profile Only' },
]
