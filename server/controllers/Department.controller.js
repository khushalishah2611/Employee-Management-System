import { prisma } from '../lib/prisma.js'

export const HandleCreateDepartment = async (req, res) => {
  try {
    const { name, description } = req.body

    if (!name || !description) {
      return res.status(400).json({ success: false, message: 'All fields are required' })
    }

    const existingDepartment = await prisma.department.findFirst({
      where: {
        organizationID: req.ORGID,
        name,
      },
    })

    if (existingDepartment) {
      return res.status(400).json({ success: false, message: 'Department already exists' })
    }

    const newDepartment = await prisma.department.create({
      data: {
        name,
        description,
        organizationID: req.ORGID,
      },
    })

    return res.status(200).json({ success: true, message: 'Department created successfully', data: newDepartment, type: 'CreateDepartment' })
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal server error' })
  }
}

export const HandleAllDepartments = async (req, res) => {
  try {
    const departments = await prisma.department.findMany({
      where: { organizationID: req.ORGID },
      include: {
        employees: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            email: true,
            contactnumber: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return res.status(200).json({ success: true, message: 'All departments retrieved successfully', data: departments, type: 'AllDepartments' })
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal server error' })
  }
}

export const HandleDepartment = async (req, res) => {
  try {
    const { departmentID } = req.params

    const department = await prisma.department.findFirst({
      where: {
        id: departmentID,
        organizationID: req.ORGID,
      },
      include: {
        employees: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            email: true,
            contactnumber: true,
          },
        },
      },
    })

    if (!department) {
      return res.status(404).json({ success: false, message: 'Department not found' })
    }

    return res.status(200).json({ success: true, message: department.name, data: department, type: 'GetDepartment' })
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal server error' })
  }
}

export const HandleUpdateDepartment = async (req, res) => {
  try {
    const { departmentID, UpdatedDepartment, employeeIDArray } = req.body

    const selectedDepartment = await prisma.department.findFirst({
      where: {
        id: departmentID,
        organizationID: req.ORGID,
      },
      include: {
        employees: {
          select: { id: true },
        },
      },
    })

    if (!selectedDepartment) {
      return res.status(404).json({ success: false, message: 'Department not found' })
    }

    if (Array.isArray(employeeIDArray)) {
      const existingEmployeeIds = new Set(selectedDepartment.employees.map((employee) => employee.id))
      const selectedEmployees = employeeIDArray.filter((id) => !existingEmployeeIds.has(id))
      const rejectedEmployees = employeeIDArray.filter((id) => existingEmployeeIds.has(id))

      if (rejectedEmployees.length > 0) {
        return res.status(400).json({ success: false, message: `Some Employees Are Already Belongs To ${selectedDepartment.name} Department`, EmployeeList: rejectedEmployees })
      }

      await prisma.employeeProfile.updateMany({
        where: {
          id: { in: selectedEmployees },
          organizationID: req.ORGID,
        },
        data: {
          departmentID,
        },
      })

      const updatedDepartment = await prisma.department.findUnique({
        where: { id: departmentID },
        include: {
          employees: {
            select: {
              id: true,
              firstname: true,
              lastname: true,
              email: true,
              contactnumber: true,
            },
          },
        },
      })

      return res.status(200).json({ success: true, message: `Employees Added Successfully to ${selectedDepartment.name} Department`, data: updatedDepartment, type: 'DepartmentEMUpdate' })
    }

    const department = await prisma.department.update({
      where: { id: departmentID },
      data: {
        name: UpdatedDepartment?.name ?? selectedDepartment.name,
        description: UpdatedDepartment?.description ?? selectedDepartment.description,
      },
    })

    return res.status(200).json({ success: true, message: 'Department updated successfully', data: department, type: 'DepartmentDEUpdate' })
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal server error' })
  }
}

export const HandleDeleteDepartment = async (req, res) => {
  try {
    const { departmentID, employeeIDArray, action } = req.body

    if (action === 'delete-department') {
      const department = await prisma.department.findFirst({
        where: {
          id: departmentID,
          organizationID: req.ORGID,
        },
      })

      if (!department) {
        return res.status(404).json({ success: false, message: 'Department not found' })
      }

      await prisma.employeeProfile.updateMany({
        where: {
          departmentID,
          organizationID: req.ORGID,
        },
        data: {
          departmentID: null,
        },
      })

      await prisma.department.delete({ where: { id: departmentID } })

      return res.status(200).json({ success: true, message: 'Department deleted successfully', type: 'DepartmentDelete' })
    }

    if (action === 'delete-employee') {
      const department = await prisma.department.findFirst({
        where: {
          id: departmentID,
          organizationID: req.ORGID,
        },
      })

      if (!department) {
        return res.status(404).json({ success: false, message: 'Department not found' })
      }

      await prisma.employeeProfile.updateMany({
        where: {
          id: { in: employeeIDArray || [] },
          departmentID,
          organizationID: req.ORGID,
        },
        data: {
          departmentID: null,
        },
      })

      return res.status(200).json({ success: true, message: 'Employee deleted successfully', type: 'RemoveEmployeeDE' })
    }

    return res.status(400).json({ success: false, message: 'Invalid action' })
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal server error' })
  }
}
