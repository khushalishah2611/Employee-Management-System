import { prisma } from '../lib/prisma.js'

export const HandleSystemOverview = async (req, res) => {
  try {
    const organizationID = req.ORGID

    if (!organizationID) {
      return res.status(400).json({ success: false, message: 'Organization context is required' })
    }

    const [employees, departments, leaveRequests, attendance, salaries, leaveTypes, settings] = await Promise.all([
      prisma.employeeProfile.count({ where: { organizationID } }),
      prisma.department.count({ where: { organizationID } }),
      prisma.leaveRequest.count({ where: { organizationID } }),
      prisma.attendanceRecord.count({ where: { organizationID } }),
      prisma.salaryRecord.count({ where: { organizationID } }),
      prisma.leaveType.count({ where: { organizationID } }),
      prisma.companySetting.findUnique({ where: { organizationID } }),
    ])

    return res.status(200).json({
      success: true,
      message: 'Module-wise system overview fetched successfully',
      data: {
        summary: {
          employees,
          departments,
          leaveRequests,
          attendance,
          salaries,
          leaveTypes,
          hasSettings: Boolean(settings),
        },
        accessControl: {
          superAdmin: {
            dashboard: 'All Data',
            employeeManagement: 'Full Access',
            departmentManagement: 'Full Access',
            salaryManagement: 'All Employees',
            leaveManagement: 'Approve/Reject + Rules',
            attendanceManagement: 'All + Manual Correction',
            settings: 'System Level',
          },
          employee: {
            dashboard: 'Own Data',
            employeeManagement: 'No Access',
            departmentManagement: 'No Access',
            salaryManagement: 'Self Only',
            leaveManagement: 'Apply + View',
            attendanceManagement: 'Own',
            settings: 'Profile Only',
          },
        },
      },
    })
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal server error', error: error.message })
  }
}
