import { Navigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { HandleGetEmployees } from '../redux/Thunks/EmployeeThunk'

export const ProtectedRoutes = ({ children }) => {
  const { isAuthenticated, data } = useSelector((state) => state.employeereducer)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(HandleGetEmployees({ apiroute: 'CHECKELOGIN' }))
  }, [dispatch, isAuthenticated])

  const isEmployeeRole = data?.panel === 'Employee' || data?.role === 'EMPLOYEE'

  return isAuthenticated && isEmployeeRole ? children : <Navigate to='/' />
}
