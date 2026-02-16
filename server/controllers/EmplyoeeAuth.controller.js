import bcrypt from 'bcrypt'
import crypto from 'crypto'
import { prisma } from '../lib/prisma.js'
import { GenerateVerificationToken } from '../utils/generateverificationtoken.js'
import { SendVerificationEmail, SendWelcomeEmail, SendForgotPasswordEmail, SendResetPasswordConfimation } from '../mailtrap/emails.js'
import { GenerateJwtTokenAndSetCookiesEmployee } from '../utils/generatejwttokenandsetcookies.js'

const generateEmployeeCode = () => `EMP-${Date.now().toString().slice(-8)}-${Math.floor(Math.random() * 900 + 100)}`

export const HandleEmplyoeeSignup = async (req, res) => {
  const { firstname, lastname, email, password, contactnumber } = req.body
  try {
    if (!firstname || !lastname || !email || !password || !contactnumber) {
      throw new Error('All Fields are required')
    }

    const organization = await prisma.organization.findUnique({ where: { id: req.ORGID } })

    if (!organization) {
      return res.status(404).json({ success: false, message: 'Organization or Company not found' })
    }

    const existingEmployee = await prisma.employeeProfile.findFirst({
      where: {
        organizationID: req.ORGID,
        email,
      },
    })

    if (existingEmployee) {
      return res.status(400).json({ success: false, message: 'Employee already exists, please go to the login page or create new employee' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const verificationcode = GenerateVerificationToken(6)

    const newEmployee = await prisma.employeeProfile.create({
      data: {
        employeeCode: generateEmployeeCode(),
        firstname,
        lastname,
        email,
        password: hashedPassword,
        contactnumber,
        role: 'EMPLOYEE',
        verificationtoken: verificationcode,
        verificationtokenexpires: new Date(Date.now() + 5 * 60 * 1000),
        organizationID: req.ORGID,
      },
    })

    return res.status(201).json({ success: true, message: 'Employee Registered Successfully', newEmployee: newEmployee.email, type: 'EmployeeCreate' })
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message || 'Oops! Something went wrong', error: error.message })
  }
}

export const HandleEmplyoeeVerifyEmail = async (req, res) => {
  const { verificationcode } = req.body

  try {
    const validateEmployee = await prisma.employeeProfile.findFirst({
      where: {
        verificationtoken: verificationcode,
        verificationtokenexpires: { gt: new Date() },
        organizationID: req.ORGID,
      },
    })

    if (!validateEmployee) {
      return res.status(404).json({ success: false, message: 'Invalid or Expired Verifiation Code' })
    }

    const updatedEmployee = await prisma.employeeProfile.update({
      where: { id: validateEmployee.id },
      data: {
        isverified: true,
        verificationtoken: null,
        verificationtokenexpires: null,
      },
    })

    const sendWelcomeEmailStatus = await SendWelcomeEmail(updatedEmployee.email, updatedEmployee.firstname, updatedEmployee.lastname)

    return res.status(200).json({ success: true, message: 'Employee Email verified successfully', validatedEmployee: updatedEmployee, SendWelcomeEmailStatus: sendWelcomeEmailStatus })
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message })
  }
}

export const HandleResetEmplyoeeVerifyEmail = async (req, res) => {
  const { email } = req.body

  try {
    const employee = await prisma.employeeProfile.findFirst({
      where: {
        email,
        organizationID: req.ORGID,
      },
    })

    if (!employee?.email) {
      return res.status(404).json({ success: false, message: 'Employee Email Does Not Exist, Please Enter Valid Email Address' })
    }

    if (employee.isverified) {
      return res.status(404).json({ success: false, message: 'Employee Email Already verified' })
    }

    const verificationcode = GenerateVerificationToken(6)
    await prisma.employeeProfile.update({
      where: { id: employee.id },
      data: {
        verificationtoken: verificationcode,
        verificationtokenexpires: new Date(Date.now() + 5 * 60 * 1000),
      },
    })

    const sendVerificationEmailStatus = await SendVerificationEmail(email, verificationcode)
    return res.status(200).json({ success: true, message: 'Verification email sent successfully', SendVerificationEmailStatus: sendVerificationEmailStatus })
  } catch (error) {
    return res.status(500).json({ success: false, message: 'internal error', error: error.message })
  }
}

export const HandleEmplyoeeLogin = async (req, res) => {
  const { email, password } = req.body
  try {
    const employee = await prisma.employeeProfile.findFirst({
      where: {
        email,
      },
    })

    if (!employee) {
      return res.status(404).json({ success: false, message: 'Invalid Credentials, Please Enter Correct One' })
    }

    const isMatch = await bcrypt.compare(password, employee.password)

    if (!isMatch) {
      return res.status(404).json({ success: false, message: 'Invalid Credentials, Please Enter Correct One' })
    }

    GenerateJwtTokenAndSetCookiesEmployee(res, employee.id, employee.role, employee.organizationID)

    await prisma.employeeProfile.update({
      where: { id: employee.id },
      data: {
        lastlogin: new Date(),
      },
    })

    return res.status(200).json({ success: true, message: 'Emplyoee Login Successfull' })
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message })
  }
}

export const HandleEmployeeCheck = async (req, res) => {
  try {
    const employee = await prisma.employeeProfile.findFirst({ where: { id: req.EMid, organizationID: req.ORGID } })
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' })
    }
    return res.status(200).json({ success: true, message: 'Employee Already Logged In', role: employee.role, panel: 'Employee' })
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message, message: 'internal error' })
  }
}

export const HandleEmplyoeeLogout = async (req, res) => {
  try {
    res.clearCookie('EMtoken')
    return res.status(200).json({ success: true, message: 'Logged out successfully' })
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal server Error' })
  }
}

export const HandleEmplyoeeForgotPassword = async (req, res) => {
  const { email } = req.body
  try {
    const employee = await prisma.employeeProfile.findFirst({
      where: { email, organizationID: req.ORGID },
    })

    if (!employee) {
      return res.status(401).json({ success: false, message: 'Employee Email Does Not Exist, Please Enter Correct One' })
    }

    const resetToken = crypto.randomBytes(25).toString('hex')
    const resetTokenExpires = new Date(Date.now() + 1000 * 60 * 60)

    await prisma.employeeProfile.update({
      where: { id: employee.id },
      data: {
        resetpasswordtoken: resetToken,
        resetpasswordexpires: resetTokenExpires,
      },
    })

    const URL = `${process.env.CLIENT_URL}/auth/employee/resetpassword/${resetToken}`
    const sendForgotPasswordEmailStatus = await SendForgotPasswordEmail(email, URL)
    return res.status(200).json({ success: true, message: 'Reset Password Email Sent Successfully', SendForgotPasswordEmailStatus: sendForgotPasswordEmailStatus })
  } catch (error) {
    return res.status(500).json({ success: false, message: 'internal server error', error: error.message })
  }
}

export const HandleEmplyoeeSetPassword = async (req, res) => {
  const { token } = req.params
  const { password } = req.body
  try {
    if (req.cookies.EMtoken) {
      res.clearCookie('EMtoken')
    }

    const employee = await prisma.employeeProfile.findFirst({
      where: {
        resetpasswordtoken: token,
        resetpasswordexpires: { gt: new Date() },
      },
    })

    if (!employee) {
      return res.status(404).json({ success: false, message: 'Invalid or Expired Reset Password Token', resetpassword: false })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    await prisma.employeeProfile.update({
      where: { id: employee.id },
      data: {
        password: hashedPassword,
        resetpasswordtoken: null,
        resetpasswordexpires: null,
      },
    })

    const sendResetPasswordConfimationStatus = await SendResetPasswordConfimation(employee.email)
    return res.status(200).json({ success: true, message: 'Password Reset Successful', SendResetPasswordConfimationStatus: sendResetPasswordConfimationStatus, resetpassword: true })
  } catch (error) {
    return res.status(500).json({ success: false, message: 'internal server error', error: error.message })
  }
}

export const HandleEmployeeCheckVerifyEmail = async (req, res) => {
  try {
    const employee = await prisma.employeeProfile.findFirst({ where: { id: req.EMid, organizationID: req.ORGID } })

    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found', type: 'Employeecodeavailable' })
    }

    if (employee.isverified) {
      return res.status(200).json({ success: false, message: 'Employee Already Verified', type: 'Employeecodeavailable' })
    }

    if (employee.verificationtoken && employee.verificationtokenexpires && employee.verificationtokenexpires > new Date()) {
      return res.status(200).json({ success: true, message: 'Verification Code is Still Valid', type: 'Employeecodeavailable' })
    }

    return res.status(200).json({ success: false, message: 'Invalid or Expired Verification Code', type: 'Employeecodeavailable' })
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message })
  }
}
