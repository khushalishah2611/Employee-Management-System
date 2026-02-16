import { prisma } from '../lib/prisma.js'

const employeeSelection = {
  id: true,
  firstname: true,
  lastname: true,
  email: true,
  contactnumber: true,
  isverified: true,
  departmentID: true,
  department: {
    select: {
      id: true,
      name: true,
    },
  },
}

export const HandleAllEmployees = async (req, res) => {
  try {
    const employees = await prisma.employeeProfile.findMany({
      where: { organizationID: req.ORGID },
      select: employeeSelection,
      orderBy: { createdAt: 'desc' },
    })

    return res.status(200).json({ success: true, data: employees, type: 'AllEmployees' })
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message, message: 'internal server error' })
  }
}

export const HandleAllEmployeesIDS = async (req, res) => {
  try {
    const employees = await prisma.employeeProfile.findMany({
      where: { organizationID: req.ORGID },
      select: {
        id: true,
        firstname: true,
        lastname: true,
        departmentID: true,
        department: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    return res.status(200).json({ success: true, data: employees, type: 'AllEmployeesIDS' })
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message, message: 'internal server error' })
  }
}

export const HandleEmployeeByHR = async (req, res) => {
  try {
    const { employeeId } = req.params
    const employee = await prisma.employeeProfile.findFirst({
      where: { id: employeeId, organizationID: req.ORGID },
      select: employeeSelection,
    })

    if (!employee) {
      return res.status(404).json({ success: false, message: 'employee not found' })
    }

    return res.status(200).json({ success: true, data: employee, type: 'GetEmployee' })
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message, message: 'employee not found' })
  }
}

export const HandleEmployeeByEmployee = async (req, res) => {
  try {
    const employee = await prisma.employeeProfile.findFirst({
      where: { id: req.EMid, organizationID: req.ORGID },
      select: employeeSelection,
    })

    if (!employee) {
      return res.status(404).json({ success: false, message: 'employee not found' })
    }

    return res.json({ success: true, message: 'Employee Data Fetched Successfully', data: employee })
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message })
  }
}

export const HandleEmployeeUpdate = async (req, res) => {
  try {
    const { employeeId, updatedEmployee } = req.body

    const checkEmployee = await prisma.employeeProfile.findFirst({
      where: {
        id: employeeId,
        organizationID: req.ORGID,
      },
    })

    if (!checkEmployee) {
      return res.status(404).json({ success: false, message: 'employee not found' })
    }

    const employee = await prisma.employeeProfile.update({
      where: { id: employeeId },
      data: {
        firstname: updatedEmployee?.firstname,
        lastname: updatedEmployee?.lastname,
        email: updatedEmployee?.email,
        contactnumber: updatedEmployee?.contactnumber,
        departmentID: updatedEmployee?.department || updatedEmployee?.departmentID || undefined,
      },
      select: {
        id: true,
        firstname: true,
        lastname: true,
        email: true,
        contactnumber: true,
        departmentID: true,
      },
    })

    return res.status(200).json({ success: true, data: employee })
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message, message: 'internal server error' })
  }
}

export const HandleEmployeeDelete = async (req, res) => {
  try {
    const { employeeId } = req.params
    const employee = await prisma.employeeProfile.findFirst({
      where: {
        id: employeeId,
        organizationID: req.ORGID,
      },
    })

    if (!employee) {
      return res.status(404).json({ success: false, message: 'employee not found' })
    }

    await prisma.employeeProfile.delete({ where: { id: employeeId } })

    return res.status(200).json({ success: true, message: 'Employee deleted successfully', type: 'EmployeeDelete' })
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message, message: 'internal server error' })
  }
}
