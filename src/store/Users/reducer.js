// reducer.js
import {
  FETCH_USERS_REQUEST,
  FETCH_USERS_SUCCESS,
  FETCH_USERS_FAILURE,
  ADD_USER_REQUEST,
  ADD_USER_SUCCESS,
  ADD_USER_FAILURE,
  UPDATE_USER_REQUEST,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_FAILURE,
  DELETE_USER_REQUEST,
  DELETE_USER_SUCCESS,
  DELETE_USER_FAILURE,
} from './actionTypes'

const initialState = {
  users: [],
  loading: false,
  error: null,
}

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_USERS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      }
    case FETCH_USERS_SUCCESS:
      return {
        ...state,
        loading: false,
        users: action.payload,
      }
    case FETCH_USERS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      }
    case ADD_USER_REQUEST:
    case UPDATE_USER_REQUEST:
    case DELETE_USER_REQUEST:
      return {
        ...state,
        loading: true,
      }
    case ADD_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        users:{...state?.users, data:[...state.users.data,action.payload?.data]}
      }
    case ADD_USER_FAILURE:
    case UPDATE_USER_FAILURE:
    case DELETE_USER_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      }
    case UPDATE_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        users:{...state?.users,data:state.users.data?.map(item=>item?._id == action.payload?.data?._id ? action.payload.data :item)}
      }
    case DELETE_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        users:{...state?.users,data:state.users.data?.filter(item=>item?._id != action.payload?.data?._id)}
      }
    default:
      return state
  }
}

export default userReducer
