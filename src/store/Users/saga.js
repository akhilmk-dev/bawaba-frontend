// saga.js
import { call, put, takeLatest } from 'redux-saga/effects'

import {
  FETCH_USERS_REQUEST,
  ADD_USER_REQUEST,
  UPDATE_USER_REQUEST,
  DELETE_USER_REQUEST,
} from './actionTypes'
import {
  fetchUsersSuccess,
  fetchUsersFailure,
  addUserSuccess,
  addUserFailure,
  updateUserSuccess,
  updateUserFailure,
  deleteUserSuccess,
  deleteUserFailure,
} from './actions'
import axiosInstance from 'pages/Utility/axiosInstance'
import toast from 'react-hot-toast'
import { showSuccess } from 'helpers/notification_helper'

// API calls
const fetchUsersApi = async () => {
  return await axiosInstance.get('V1/users')
}

const addUserApi = async (user) => {
  return await axiosInstance.post('V1/users', user)
}

const updateUserApi = async ({id,user}) => {
  return await axiosInstance.put(`V1/users/${id}`, user)
}

const deleteUserApi = async (userId) => {
  return await axiosInstance.delete(`V1/users/${userId}`)
}

// Fetch users
function* fetchUsersSaga(action) {
  try {
    const response = yield call(fetchUsersApi,action.payload)
    yield put(fetchUsersSuccess(response.data))
  } catch (error) {
    yield put(fetchUsersFailure(error.message))
  }
}

// Add user
function* addUserSaga(action) {
  try {
    const response = yield call(addUserApi, action.payload.user);
    action.payload.onClose();
    yield put(addUserSuccess(response.data))
    showSuccess('User added successfully!')
  } catch (error) {
    yield put(addUserFailure(error?.response?.data?.errors))
  }
}

// Update user
function* updateUserSaga(action) {
  try {
    const response = yield call(updateUserApi, action.payload)
    showSuccess(response?.data?.message)
    action.payload.onClose();
    yield put(updateUserSuccess(response?.data))
  } catch (error) {
    yield put(updateUserFailure(error?.response?.data?.errors))
  }
}

// Delete user
function* deleteUserSaga(action) {
  try {
    const {data} = yield call(deleteUserApi, action.payload)
    yield put(deleteUserSuccess(data))
    showSuccess('User Deleted successfully!')
  } catch (error) {
    yield put(deleteUserFailure(error.message))
  }
}

// Watcher saga
export default function* userSaga() {
  yield takeLatest(FETCH_USERS_REQUEST, fetchUsersSaga)
  yield takeLatest(ADD_USER_REQUEST, addUserSaga)
  yield takeLatest(UPDATE_USER_REQUEST, updateUserSaga)
  yield takeLatest(DELETE_USER_REQUEST, deleteUserSaga)
}
