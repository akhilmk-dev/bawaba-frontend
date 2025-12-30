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

const initialState = {
    addresses: [],
    loading: false,
    error: null,
}

const addressReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_ADDRESSES_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            }
        case FETCH_ADDRESSES_SUCCESS:
            return {
                ...state,
                loading: false,
                addresses: action.payload,
            }
        case FETCH_ADDRESSES_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            }
        case ADD_ADDRESS_REQUEST:
        case UPDATE_ADDRESS_REQUEST:
        case DELETE_ADDRESS_REQUEST:
            return {
                ...state,
                loading: true,
            }
        case ADD_ADDRESS_SUCCESS:
            return {
                ...state,
                loading: false,
            }
        case ADD_ADDRESS_FAILURE:
        case UPDATE_ADDRESS_FAILURE:
        case DELETE_ADDRESS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            }
        case UPDATE_ADDRESS_SUCCESS:
            return {
                ...state,
                loading: false,
            }
        case DELETE_ADDRESS_SUCCESS:
            return {
                ...state,
                loading: false,
            }
        default:
            return state
    }
}

export default addressReducer
