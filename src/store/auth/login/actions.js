import {
  LOGIN,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  LOGOUT_SUCCESS,
  LOGOUT_FAIL,
  SET_LOGIN_FIELD_ERRORS,
} from './actionTypes'

// Login
export const login = (credentials, navigate) => ({
  type: LOGIN,
  payload: { credentials, navigate },
})

export const loginSuccess = (user) => ({
  type: LOGIN_SUCCESS,
  payload: user,
})

export const loginFail = (error) => ({
  type: LOGIN_FAIL,
  payload: error,
})

// Logout
export const logout = () => ({
  type: LOGOUT,
})

export const logoutSuccess = () => ({
  type: LOGOUT_SUCCESS,
})

export const logoutFail = (error) => ({
  type: LOGOUT_FAIL,
  payload: error,
})

// Set Login Field Errors
export const setLoginFieldErrors = (errors) => ({
  type: SET_LOGIN_FIELD_ERRORS,
  payload: errors,
})
