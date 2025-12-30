import {
    GET_PUBLICATIONS,
    GET_PUBLICATIONS_SUCCESS,
    GET_PUBLICATIONS_FAIL,
    ADD_PUBLICATION,
    ADD_PUBLICATION_SUCCESS,
    ADD_PUBLICATION_FAIL,
    UPDATE_PUBLICATION,
    UPDATE_PUBLICATION_SUCCESS,
    UPDATE_PUBLICATION_FAIL,
    DELETE_PUBLICATION,
    DELETE_PUBLICATION_SUCCESS,
    DELETE_PUBLICATION_FAIL,
    SET_PUBLICATION_FIELD_ERRORS,
} from './actionTypes';

const initialState = {
    publications: [],
    loading: false,
    error: null,
    fieldErrors: {},
};

const publicationReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_PUBLICATIONS:
            return { ...state, loading: true };
        case GET_PUBLICATIONS_SUCCESS:
            return { ...state, loading: false, publications: action.payload };
        case GET_PUBLICATIONS_FAIL:
            return { ...state, loading: false, error: action.payload };

        case ADD_PUBLICATION:
            return { ...state, loading: true };
        case ADD_PUBLICATION_SUCCESS:
            return { ...state, loading: false, fieldErrors: {} };
        case ADD_PUBLICATION_FAIL:
            return { ...state, loading: false, error: action.payload };

        case UPDATE_PUBLICATION:
            return { ...state, loading: true };
        case UPDATE_PUBLICATION_SUCCESS:
            return { ...state, loading: false, fieldErrors: {} };
        case UPDATE_PUBLICATION_FAIL:
            return { ...state, loading: false, error: action.payload };

        case DELETE_PUBLICATION:
            return { ...state, loading: true };
        case DELETE_PUBLICATION_SUCCESS:
            return { ...state, loading: false };
        case DELETE_PUBLICATION_FAIL:
            return { ...state, loading: false, error: action.payload };

        case SET_PUBLICATION_FIELD_ERRORS:
            return { ...state, fieldErrors: action.payload,loading:false };

        default:
            return state;
    }
};

export default publicationReducer;
