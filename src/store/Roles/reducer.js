// reducer.js

import {
  GET_ROLES,
  GET_ROLES_SUCCESS,
  GET_ROLES_FAIL,
  ADD_ROLE,
  ADD_ROLE_SUCCESS,
  ADD_ROLE_FAIL,
  UPDATE_ROLE,
  UPDATE_ROLE_SUCCESS,
  UPDATE_ROLE_FAIL,
  DELETE_ROLE,
  DELETE_ROLE_SUCCESS,
  DELETE_ROLE_FAIL,
  SET_ROLE_FIELD_ERRORS,
} from './actionTypes'

const initialState = {
  roles: [],
  loading: false,
  error: null,
  status: null,
  fieldErrors: {}, // Store field-specific errors
}

const roleReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ROLES:
      return { ...state, loading: true }
    case GET_ROLES_SUCCESS:
      return { ...state, loading: false, roles: action.payload }
    case GET_ROLES_FAIL:
      return { ...state, loading: false, error: action.payload }

    case ADD_ROLE:
      return { ...state, loading: true }
    case ADD_ROLE_SUCCESS:
      return { ...state, loading: false, status: 'success', fieldErrors: {} }
    case ADD_ROLE_FAIL:
      return { ...state, loading: false, error: action.payload }

    case UPDATE_ROLE:
      return { ...state, loading: true }
    case UPDATE_ROLE_SUCCESS:
      return { ...state, loading: false, fieldErrors: {} }
    case UPDATE_ROLE_FAIL:
      return { ...state, loading: false, error: action.payload }

    case DELETE_ROLE:
      return { ...state, loading: true }
    case DELETE_ROLE_SUCCESS:
      return { ...state, loading: false,roles:{...state?.roles,data:state.roles?.data?.filter(item=>item?._id != action.payload._id)} }
    case DELETE_ROLE_FAIL:
      return { ...state, loading: false, error: action.payload }
    case SET_ROLE_FIELD_ERRORS:
      return { ...state, fieldErrors: action.payload }

    default:
      return state
  }
}

export default roleReducer
