import {
    FETCH_ADDRESSES_REQUEST,
    FETCH_ADDRESSES_SUCCESS,
    FETCH_ADDRESSES_FAILURE,
    ADD_ADDRESS_REQUEST,
    ADD_ADDRESS_SUCCESS,
    ADD_ADDRESS_FAILURE,
    UPDATE_ADDRESS_REQUEST,
    UPDATE_ADDRESS_SUCCESS,
    UPDATE_ADDRESS_FAILURE,
    DELETE_ADDRESS_REQUEST,
    DELETE_ADDRESS_SUCCESS,
    DELETE_ADDRESS_FAILURE,
} from './actionTypes'

// Fetch addresses action creators
export const fetchAddressesRequest = (customerId) => ({
    type: FETCH_ADDRESSES_REQUEST,
    payload: customerId
})

export const fetchAddressesSuccess = (addresses) => ({
    type: FETCH_ADDRESSES_SUCCESS,
    payload: addresses,
})

export const fetchAddressesFailure = (error) => ({
    type: FETCH_ADDRESSES_FAILURE,
    payload: error,
})

// Add address action creators
export const addAddressRequest = (address, navigate) => ({
    type: ADD_ADDRESS_REQUEST,
    payload: { address, navigate },
})

export const addAddressSuccess = (address) => ({
    type: ADD_ADDRESS_SUCCESS,
    payload: address,
})

export const addAddressFailure = (error) => ({
    type: ADD_ADDRESS_FAILURE,
    payload: error,
})

// Update address action creators
export const updateAddressRequest = (address, navigate) => ({
    type: UPDATE_ADDRESS_REQUEST,
    payload: { address, navigate },
})

export const updateAddressSuccess = (address) => ({
    type: UPDATE_ADDRESS_SUCCESS,
    payload: address,
})

export const updateAddressFailure = (error) => ({
    type: UPDATE_ADDRESS_FAILURE,
    payload: error,
})

// Delete address action creators
export const deleteAddressRequest = (addressId) => ({
    type: DELETE_ADDRESS_REQUEST,
    payload: addressId,
})

export const deleteAddressSuccess = (addressId) => ({
    type: DELETE_ADDRESS_SUCCESS,
    payload: addressId,
})

export const deleteAddressFailure = (error) => ({
    type: DELETE_ADDRESS_FAILURE,
    payload: error,
})
