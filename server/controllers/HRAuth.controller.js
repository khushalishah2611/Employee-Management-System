import bcrypt from 'bcrypt'
import crypto from 'crypto'
import { prisma } from '../lib/prisma.js'
import { GenerateJwtTokenAndSetCookiesHR } from '../utils/generatejwttokenandsetcookies.js'
import { SendVerificationEmail, SendWelcomeEmail, SendForgotPasswordEmail, SendResetPasswordConfimation } from '../mailtrap/emails.js'
import { GenerateVerificationToken } from '../utils/generateverificationtoken.js'

export const HandleHRSignup = async (req, res) => {
  try {
    const { firstname, lastname, email, password, contactnumber, name, description, OrganizationURL, OrganizationMail } = req.body

    if (!name || !description || !OrganizationURL || !OrganizationMail) {
      return res.status(400).json({ success: false, message: 'All organization fields are required', type: 'signup' })
    }

    if (!firstname || !lastname || !email || !password || !contactnumber) {
      return res.status(400).json({ success: false, message: 'All HR fields are required', type: 'signup' })
    }

    const [organization, existingHR] = await Promise.all([
      prisma.organization.findFirst({
        where: {
          OR: [{ name }, { OrganizationURL }, { OrganizationMail }],
        },
      }),
      prisma.humanResources.findUnique({ where: { email } }),
    ])

    if (existingHR) {
      return res.status(400).json({ success: false, message: 'HR already exists, please go to the login page or create new HR', type: 'signup' })
    }

    const hashedpassword = await bcrypt.hash(password, 10)
    const verificationcode = GenerateVerificationToken(6)
    const verificationExpiry = new Date(Date.now() + 5 * 60 * 1000)

    if (organization) {
      const newHR = await prisma.humanResources.create({
        data: {
          firstname,
          lastname,
          email,
          password: hashedpassword,
          contactnumber,
          role: 'Super Admin',
          organizationID: organization.id,
          verificationtoken: verificationcode,
          verificationtokenexpires: verificationExpiry,
        },
      })

      GenerateJwtTokenAndSetCookiesHR(res, newHR.id, newHR.role, organization.id)
      const VerificationEmailStatus = await SendVerificationEmail(email, verificationcode)

      return res.status(201).json({
        success: true,
        message: 'HR Registered Successfully',
        type: 'signup',
        VerificationEmailStatus,
        HRid: newHR.id,
      })
    }

    const created = await prisma.$transaction(async (tx) => {
      const newOrganization = await tx.organization.create({
        data: {
          name,
          description,
          OrganizationURL,
          OrganizationMail,
        },
      })

      const newHR = await tx.humanResources.create({
        data: {
          firstname,
          lastname,
          email,
          password: hashedpassword,
          contactnumber,
          role: 'Super Admin',
          organizationID: newOrganization.id,
          verificationtoken: verificationcode,
          verificationtokenexpires: verificationExpiry,
        },
      })

      return { newOrganization, newHR }
    })

    GenerateJwtTokenAndSetCookiesHR(res, created.newHR.id, created.newHR.role, created.newOrganization.id)
    const VerificationEmailStatus = await SendVerificationEmail(email, verificationcode)

    return res.status(201).json({
      success: true,
      message: 'Organization Created Successfully & HR Registered Successfully',
      VerificationEmailStatus,
      type: 'signup',
      HRid: created.newHR.id,
    })
  } catch (error) {
    if (error?.code === 'P2002') {
      return res.status(400).json({ success: false, message: 'Organization or HR already exists with these details', type: 'signup' })
    }

    return res.status(500).json({ success: false, message: error.message, type: 'signup' })
  }
}

export const HandleHRVerifyEmail = async (req, res) => {
  const { verificationcode } = req.body
  try {
    const HR = await prisma.humanResources.findFirst({
      where: {
        verificationtoken: verificationcode,
        organizationID: req.ORGID,
        verificationtokenexpires: { gt: new Date() },
      },
    })

    if (!HR) {
      return res.status(401).json({ success: false, message: 'Invalid or Expired Verifiation Code', type: 'HRverifyemail' })
    }

    await prisma.humanResources.update({
      where: { id: HR.id },
      data: {
        isverified: true,
        verificationtoken: null,
        verificationtokenexpires: null,
      },
    })

    const SendWelcomeEmailStatus = await SendWelcomeEmail(HR.email, HR.firstname, HR.lastname, HR.role)
    return res.status(200).json({ success: true, message: 'Email Verified successfully', SendWelcomeEmailStatus, type: 'HRverifyemail' })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message, type: 'HRverifyemail' })
  }
}

export const HandleHRLogin = async (req, res) => {
  const { email, password } = req.body
  try {
    const HR = await prisma.humanResources.findUnique({ where: { email } })

    if (!HR) {
      return res.status(400).json({ success: false, message: 'Invaild Credentials, Please Add Correct One', type: 'HRLogin' })
    }

    const isMatch = await bcrypt.compare(password, HR.password)

    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invaild Credentials, Please Add Correct One', type: 'HRLogin' })
    }

    GenerateJwtTokenAndSetCookiesHR(res, HR.id, HR.role, HR.organizationID)
    await prisma.humanResources.update({ where: { id: HR.id }, data: { lastlogin: new Date() } })

    return res.status(200).json({ success: true, message: 'HR Login Successfull', type: 'HRLogin' })
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal Server Error', error, type: 'HRLogin' })
  }
}

export const HandleHRLogout = async (req, res) => {
  try {
    res.clearCookie('HRtoken')
    return res.status(200).json({ success: true, message: 'HR Logged Out Successfully', type: 'HRLogout' })
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal server Error', error, type: 'HRLogout' })
  }
}

export const HandleHRCheck = async (req, res) => {
  try {
    const HR = await prisma.humanResources.findFirst({ where: { id: req.HRid, organizationID: req.ORGID } })
    if (!HR) {
      return res.status(404).json({ success: false, message: 'HR not found', type: 'checkHR' })
    }
    return res.status(200).json({ success: true, message: 'HR Already Logged In', type: 'checkHR', role: HR.role, panel: 'Super Admin' })
  } catch (error) {
    return res.status(500).json({ success: false, error, message: 'internal error', type: 'checkHR' })
  }
}

export const HandleHRForgotPassword = async (req, res) => {
  const { email } = req.body
  try {
    const HR = await prisma.humanResources.findFirst({ where: { email, organizationID: req.ORGID, id: req.HRid } })

    if (!HR) {
      return res.status(404).json({ success: false, message: 'HR Email Does Not Exist Please Enter Correct One', type: 'HRforgotpassword' })
    }

    const resetToken = crypto.randomBytes(25).toString('hex')
    const resetTokenExpires = new Date(Date.now() + 1000 * 60 * 60)

    await prisma.humanResources.update({
      where: { id: HR.id },
      data: {
        resetpasswordtoken: resetToken,
        resetpasswordexpires: resetTokenExpires,
      },
    })

    const URL = `${process.env.CLIENT_URL}/auth/HR/resetpassword/${resetToken}`
    const SendResetPasswordEmailStatus = await SendForgotPasswordEmail(email, URL)
    return res.status(200).json({ success: true, message: 'Reset Password Email Sent Successfully', SendResetPasswordEmailStatus, type: 'HRforgotpassword' })
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal Server Error', error, type: 'HRforgotpassword' })
  }
}

export const HandleHRResetPassword = async (req, res) => {
  const { token } = req.params
  const { password } = req.body

  try {
    if (req.cookies.HRtoken) {
      res.clearCookie('HRtoken')
    }

    const HR = await prisma.humanResources.findFirst({
      where: {
        resetpasswordtoken: token,
        resetpasswordexpires: { gt: new Date() },
      },
    })

    if (!HR) {
      return res.status(401).json({ success: false, message: 'Invalid or Expired Reset Password Token', resetpassword: false })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    await prisma.humanResources.update({
      where: { id: HR.id },
      data: {
        password: hashedPassword,
        resetpasswordtoken: null,
        resetpasswordexpires: null,
      },
    })

    const SendPasswordResetEmailStatus = await SendResetPasswordConfimation(HR.email)
    return res.status(200).json({ success: true, message: 'Password Reset Successfully', SendPasswordResetEmailStatus, resetpassword: true })
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal Server Error', error, resetpassword: false })
  }
}

export const HandleHRResetverifyEmail = async (req, res) => {
  const { email } = req.body
  try {
    const HR = await prisma.humanResources.findFirst({ where: { email, id: req.HRid, organizationID: req.ORGID } })

    if (!HR) {
      return res.status(404).json({ success: false, message: 'HR Email Does Not Exist, Please Enter Correct Email', type: 'HRResendVerifyEmail' })
    }

    if (HR.isverified) {
      return res.status(400).json({ success: false, message: 'HR Email is already Verified', type: 'HRResendVerifyEmail' })
    }

    const verificationcode = GenerateVerificationToken(6)
    await prisma.humanResources.update({
      where: { id: HR.id },
      data: {
        verificationtoken: verificationcode,
        verificationtokenexpires: new Date(Date.now() + 5 * 60 * 1000),
      },
    })

    const SendVerificationEmailStatus = await SendVerificationEmail(email, verificationcode)
    return res.status(200).json({ success: true, message: 'Verification Email Sent Successfully', SendVerificationEmailStatus, type: 'HRResendVerifyEmail' })
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal Server Error', error })
  }
}

export const HandleHRcheckVerifyEmail = async (req, res) => {
  try {
    const HR = await prisma.humanResources.findFirst({ where: { id: req.HRid, organizationID: req.ORGID } })

    if (!HR) {
      return res.status(404).json({ success: false, message: 'HR not found', type: 'HRcodeavailable' })
    }

    if (HR.isverified) {
      return res.status(200).json({ sucess: true, message: 'HR Already Verified', type: 'HRcodeavailable', alreadyverified: true })
    }

    if (HR.verificationtoken && HR.verificationtokenexpires && HR.verificationtokenexpires > new Date()) {
      return res.status(200).json({ success: true, message: 'Verification Code is Still Valid', type: 'HRcodeavailable' })
    }

    return res.status(404).json({ success: false, message: 'Invalid or Expired Verification Code', type: 'HRcodeavailable' })
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal Server Error', error, type: 'HRcodeavailable' })
  }
}
