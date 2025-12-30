import {
  LOGIN,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  LOGOUT_SUCCESS,
  LOGOUT_FAIL,
  SET_LOGIN_FIELD_ERRORS,
} from './actionTypes'

const initialState = {
  user: null,
  loading: false,
  error: null,
  status: null,
  fieldErrors: {}, // Store field-specific errors
}

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN:
      return { ...state, loading: true }
    case LOGIN_SUCCESS:
      return { ...state, loading: false, user: action.payload, fieldErrors: {} } // Clear field errors on success
    case LOGIN_FAIL:
      return { ...state, loading: false, error: action.payload }

    case LOGOUT:
      return { ...state, loading: true }
    case LOGOUT_SUCCESS:
      return { ...state, loading: false, user: null }
    case LOGOUT_FAIL:
      return { ...state, loading: false, error: action.payload }

    case SET_LOGIN_FIELD_ERRORS:
      return { ...state, fieldErrors: action.payload }

    default:
      return state
  }
}

export default authReducer
