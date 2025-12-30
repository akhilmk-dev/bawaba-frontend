import { call, put, takeEvery } from 'redux-saga/effects'
import {
  LOGIN,
  LOGOUT,
} from './actionTypes'
import {
  loginSuccess,
  loginFail,
  logoutSuccess,
  logoutFail,
  setLoginFieldErrors,
} from './actions'
import axiosInstance from 'pages/Utility/axiosInstance'
import toast from 'react-hot-toast'
import Cookies from 'js-cookie'
import { showSuccess } from 'helpers/notification_helper'
import { setEncryptedCookie } from 'pages/Utility/cookieUtils'
import { setEncryptedLocal } from 'pages/Utility/cookieUtils'

// API calls
const loginApi = (credentials) => axiosInstance.post('V1/auth/login', credentials)
const logoutApi = () => axiosInstance.post('/logout')

// Sagas
function* loginSaga(action) {
  try {
    const { data } = yield call(loginApi, action.payload.credentials)
    console.log("data:",data);
    Cookies.set('access_token', data?.accessToken);
    Cookies.set('refresh_token',data?.refreshToken);
   setEncryptedLocal("permissions", data?.permissions);

  setEncryptedCookie("role", data?.user?.role?.role_name)
  setEncryptedCookie("vendor_name", data?.user?.name)      


  yield put(loginSuccess(data?.user))
    showSuccess(data?.message)
    action.payload.navigate(`/dashboard`);
  } catch (error) {
    if (error.response?.status === 400 && error.response?.data?.fieldErrors) {
      yield put(setLoginFieldErrors(error.response.data.fieldErrors))
    } else {
      yield put(loginFail(error.response?.data || error.message))
    }
  }
}

function* logoutSaga() {
  try {
    yield call(logoutApi)
    yield put(logoutSuccess())
    toast.dismiss();
    toast.success('Logout successful!')
  } catch (error) {
    yield put(logoutFail(error.response?.data || error.message))
  }
}

// Watcher saga
function* authSaga() {
  yield takeEvery(LOGIN, loginSaga)
  yield takeEvery(LOGOUT, logoutSaga)
}

export default authSaga
