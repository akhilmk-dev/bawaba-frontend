// reducer.js

import {
  GET_PERMISSIONS,
  GET_PERMISSIONS_SUCCESS,
  GET_PERMISSIONS_FAIL,
  ADD_PERMISSION,
  ADD_PERMISSION_SUCCESS,
  ADD_PERMISSION_FAIL,
  UPDATE_PERMISSION,
  UPDATE_PERMISSION_SUCCESS,
  UPDATE_PERMISSION_FAIL,
  DELETE_PERMISSION,
  DELETE_PERMISSION_SUCCESS,
  DELETE_PERMISSION_FAIL,
  SET_PERMISSION_FIELD_ERRORS,
} from './actionTypes'

const initialState = {
  permissions: [],
  loading: false,
  error: null,
  status: null,
  fieldErrors: {}, // Store field-specific errors
}

const permissionReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_PERMISSIONS:
      return { ...state, loading: true }
    case GET_PERMISSIONS_SUCCESS:
      return { ...state, loading: false, permissions: action.payload }
    case GET_PERMISSIONS_FAIL:
      return { ...state, loading: false, error: action.payload }

    case ADD_PERMISSION:
      return { ...state, loading: true }
    case ADD_PERMISSION_SUCCESS:
      return { ...state, loading: false, status: 'success', fieldErrors: {} }
    case ADD_PERMISSION_FAIL:
      return { ...state, loading: false, error: action.payload }

    case UPDATE_PERMISSION:
      return { ...state, loading: true }
    case UPDATE_PERMISSION_SUCCESS:
      return { ...state, loading: false, fieldErrors: {} }
    case UPDATE_PERMISSION_FAIL:
      return { ...state, loading: false, error: action.payload }

    case DELETE_PERMISSION:
      return { ...state, loading: true }
    case DELETE_PERMISSION_SUCCESS:
      return { ...state, loading: false }
    case DELETE_PERMISSION_FAIL:
      return { ...state, loading: false, error: action.payload }

    case SET_PERMISSION_FIELD_ERRORS:
      return { ...state, fieldErrors: action.payload }

    default:
      return state
  }
}

export default permissionReducer
