import { call, put, takeLatest } from 'redux-saga/effects'

import {
    FETCH_ADDRESSES_REQUEST,
    ADD_ADDRESS_REQUEST,
    UPDATE_ADDRESS_REQUEST,
    DELETE_ADDRESS_REQUEST,
} from './actionTypes'
import {
    fetchAddressesSuccess,
    fetchAddressesFailure,
    addAddressSuccess,
    addAddressFailure,
    updateAddressSuccess,
    updateAddressFailure,
    deleteAddressSuccess,
    deleteAddressFailure,
    fetchAddressesRequest,
} from './actions'
import axiosInstance from 'pages/Utility/axiosInstance'
import toast from 'react-hot-toast'

// API calls
const fetchAddressesApi = async (customerId) => {
    const response = await axiosInstance.get('', {
        params: { sp: 'usp_GetCustomerAddressByIdByCustomer', customerId: customerId }
    })
    return response
}

const addAddressApi = async (address) => {
    return await axiosInstance.post('', address)
}

const updateAddressApi = async (address) => {
    return await axiosInstance.post('', address)
}

const deleteAddressApi = async (addressId) => {
    return await axiosInstance.post('', {
        sp: 'usp_DeleteCustomerAddress',
        customerAddressId: addressId,
    })
}

// Fetch addresses
function* fetchAddressesSaga(action) {
    try {
        const response = yield call(fetchAddressesApi, action.payload)
        yield put(fetchAddressesSuccess(response.data))
    } catch (error) {
        yield put(fetchAddressesFailure(error.message))
    }
}

// Add address
function* addAddressSaga(action) {
    try {
        const response = yield call(addAddressApi, action.payload?.address)
        yield put(addAddressSuccess(response.data))
        action.payload.navigate(`/customerProfile/${action.payload.address?.customerId}`)
        toast.success('Address Created Successfully!')
        yield put(fetchAddressesRequest(action.payload?.address?.customerId))
    } catch (error) {
        yield put(addAddressFailure(error.message))
    }
}

// Update address
function* updateAddressSaga(action) {
    try {
        const response = yield call(updateAddressApi, action.payload?.address)
        yield put(updateAddressSuccess(response.data))
        action.payload.navigate(`/customerProfile/${action.payload.address?.customerId}`)
        toast.success('Address Updated Successfully!')
        yield put(fetchAddressesRequest(action.payload?.address?.customerId))
    } catch (error) {
        yield put(updateAddressFailure(error.message))
    }
}

// Delete address
function* deleteAddressSaga(action) {
    try {
        yield call(deleteAddressApi, action.payload)
        yield put(deleteAddressSuccess(action.payload))
        toast.success('Address Deleted Successfully!')
        yield put({ type: FETCH_ADDRESSES_REQUEST, payload: action.payload })
    } catch (error) {
        yield put(deleteAddressFailure(error.message))
    }
}

// Watcher saga
export default function* addressSaga() {
    yield takeLatest(FETCH_ADDRESSES_REQUEST, fetchAddressesSaga)
    yield takeLatest(ADD_ADDRESS_REQUEST, addAddressSaga)
    yield takeLatest(UPDATE_ADDRESS_REQUEST, updateAddressSaga)
    yield takeLatest(DELETE_ADDRESS_REQUEST, deleteAddressSaga)
}
