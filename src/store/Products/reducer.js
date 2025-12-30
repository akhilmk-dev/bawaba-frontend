import {
  FETCH_PRODUCTS_REQUEST,
  FETCH_PRODUCTS_SUCCESS,
  FETCH_PRODUCTS_FAILURE,
  DELETE_PRODUCT_REQUEST,
  DELETE_PRODUCT_SUCCESS,
  DELETE_PRODUCT_FAILURE,
} from './actionTypes';

const initialState = {
  products: {
    data: [],
    nextPageInfo: null,
    prevPageInfo: null,
    total: 0,
  },
  loading: false,
  error: null,
};

const productReducer = (state = initialState, action) => {
  switch (action.type) {

    // FETCH PRODUCTS
    case FETCH_PRODUCTS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case FETCH_PRODUCTS_SUCCESS:
      return {
        ...state,
        loading: false,
        products: {
          data: action.payload.data || [],
          nextPageInfo: action.payload.nextPageInfo || null,
          prevPageInfo: action.payload.prevPageInfo || null,
          total: action.payload.total || 0,
        },
      };

    case FETCH_PRODUCTS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // DELETE PRODUCT
    case DELETE_PRODUCT_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case DELETE_PRODUCT_SUCCESS:
      return {
        ...state,
        loading: false,
        products: {
          ...state.products,
          data: state.products.data?.filter(
            product => product.shopifyId !== action.payload?.product
          ),
        },
      };

    case DELETE_PRODUCT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default productReducer;
