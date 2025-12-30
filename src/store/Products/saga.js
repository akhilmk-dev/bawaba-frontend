import { call, put, takeLatest } from 'redux-saga/effects';
import {
  FETCH_PRODUCTS_REQUEST,
  DELETE_PRODUCT_REQUEST,
} from './actionTypes';

import {
  fetchProductsSuccess,
  fetchProductsFailure,
  deleteProductSuccess,
  deleteProductFailure,
} from './actions';

import axiosInstance from 'pages/Utility/axiosInstance';
import { showSuccess } from 'helpers/notification_helper';

// Fetch products API call
const fetchProductsApi = async ({ role, params }) => {
  if (role?.name?.toLowerCase() === "vendor") {
    return await axiosInstance.get(`V1/products/${role?.id}`, { params });
  } else {
    return await axiosInstance.get('V1/products', { params });
  }
};

// Delete product API call
const deleteProductApi = async (productId) => {
  return await axiosInstance.delete(`V1/products/delete/${productId}`);
};

// Fetch products saga
function* fetchProductsSaga(action) {
  try {
    const response = yield call(fetchProductsApi, action.payload);
    yield put(fetchProductsSuccess(response.data));
  } catch (error) {
    yield put(fetchProductsFailure(error.message));
  }
}

// Delete product saga
function* deleteProductSaga(action) {
  try {
    const response =  yield call(deleteProductApi, action.payload);
    showSuccess("Product deleted Successfully");
    yield put(deleteProductSuccess(response?.data)); 
  } catch (error) {
    yield put(deleteProductFailure(error.message));
  }
}

// Watcher saga
export default function* productSaga() {
  yield takeLatest(FETCH_PRODUCTS_REQUEST, fetchProductsSaga);
  yield takeLatest(DELETE_PRODUCT_REQUEST, deleteProductSaga);
}
