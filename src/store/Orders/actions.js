import { FETCH_ORDERS_FAILURE, FETCH_ORDERS_REQUEST, FETCH_ORDERS_SUCCESS } from "./actionTypes"

// Fetch orders action creators
export const fetchOrdersRequest = (role,params) => ({
    type: FETCH_ORDERS_REQUEST,
    payload: {role,params},
  })
  
  export const fetchOrdersSuccess = (orders) => ({
    type: FETCH_ORDERS_SUCCESS,
    payload: orders,
  })
  
  export const fetchOrdersFailure = (error) => ({
    type: FETCH_ORDERS_FAILURE,
    payload: error,
  })
  