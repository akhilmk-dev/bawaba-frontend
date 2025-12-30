// productActions.js

import { 
    FETCH_PRODUCTS_REQUEST,
    FETCH_PRODUCTS_SUCCESS,
    FETCH_PRODUCTS_FAILURE,
    DELETE_PRODUCT_REQUEST,
    DELETE_PRODUCT_SUCCESS,
    DELETE_PRODUCT_FAILURE,
  } from './actionTypes';
  
  // Fetch products action creators
  export const fetchProductsRequest = (role, params) => ({
    type: FETCH_PRODUCTS_REQUEST,
    payload: { role, params },
  });
  
  export const fetchProductsSuccess = (products) => ({
    type: FETCH_PRODUCTS_SUCCESS,
    payload: products,
  });
  
  export const fetchProductsFailure = (error) => ({
    type: FETCH_PRODUCTS_FAILURE,
    payload: error,
  });
  
  // Delete product action creators
  export const deleteProductRequest = (productId) => ({
    type: DELETE_PRODUCT_REQUEST,
    payload: productId,
  });
  
  export const deleteProductSuccess = (productId) => ({
    type: DELETE_PRODUCT_SUCCESS,
    payload: productId,
  });
  
  export const deleteProductFailure = (error) => ({
    type: DELETE_PRODUCT_FAILURE,
    payload: error,
  });
  