import {
    FETCH_ORDERS_REQUEST,
    FETCH_ORDERS_SUCCESS,
    FETCH_ORDERS_FAILURE,
    // ...other user action types
  } from './actionTypes'
  
  const initialState = {
    orders: [],
    loading: false,
    error: null,
  }
  
  const userReducer = (state = initialState, action) => {
    switch (action.type) {
  
      // FETCH ORDERS
      case FETCH_ORDERS_REQUEST:
        return {
          ...state,
          loading: true,
          error: null,
        }
      case FETCH_ORDERS_SUCCESS:
        return {
          ...state,
          loading: false,
          orders: action.payload,
        }
      case FETCH_ORDERS_FAILURE:
        return {
          ...state,
          loading: false,
          error: action.payload,
        }
  
      default:
        return state
    }
  }
  
  export default userReducer
  