import { call, put, takeEvery } from 'redux-saga/effects';
import {
    GET_PUBLICATIONS,
    ADD_PUBLICATION,
    UPDATE_PUBLICATION,
    DELETE_PUBLICATION,
} from './actionTypes';
import {
    getPublicationsSuccess,
    getPublicationsFail,
    addPublicationSuccess,
    addPublicationFail,
    updatePublicationSuccess,
    updatePublicationFail,
    deletePublicationSuccess,
    deletePublicationFail,
    setPublicationFieldErrors,
} from './actions';
import axiosInstance from 'pages/Utility/axiosInstance';
import toast from 'react-hot-toast';

// API calls
const fetchPublicationsApi = (publications) => axiosInstance.post('V1/publications/list', publications);
const addPublicationApi = ({publication}) => axiosInstance.post('V1/publications/create', publication);
const updatePublicationApi = ({publication,id}) => axiosInstance.put(`V1/publications/update/${id}`, publication);
const deletePublicationApi = (id) => axiosInstance.delete(`V1/publications/${id}`);

// Sagas
function* getPublicationsSaga(action) {
    try {
        const { data } = yield call(fetchPublicationsApi, action.payload);
        yield put(getPublicationsSuccess(data));
    } catch (error) {
        yield put(getPublicationsFail(error.response?.data || error.message));
    }
}

function* addPublicationSaga(action) {
    try {
        const { data } = yield call(addPublicationApi, action.payload);
        yield put(addPublicationSuccess(data));
        action.payload.resetForm();
        action.payload.handleClose()
        toast.success('Publication added successfully!');
        yield put({ type: GET_PUBLICATIONS,payload:{
            "pagesize": 10,
            "currentpage": Number(localStorage.getItem('pageIndex')) + 1,
            "sortorder": JSON.parse(localStorage.getItem('selectedSortData'))?.value && JSON.parse(localStorage.getItem('selectedSortData'))?.direction
                ? {
                    field: JSON.parse(localStorage.getItem('selectedSortData')).value,
                    direction: JSON.parse(localStorage.getItem('selectedSortData')).direction,
                }
                : {},
            "searchstring": localStorage.getItem('searchString'),
            "filter": (localStorage.getItem('selectedType') && localStorage.getItem('selectedType') !== "undefined" && localStorage.getItem('selectedType') !== "null")
           ? { type: JSON.parse(localStorage.getItem('selectedType'))?.value }
           : (localStorage.getItem('selectedClassification') && localStorage.getItem('selectedClassification') !== "undefined" && localStorage.getItem('selectedClassification') !== "null")
               ? { classification_id: JSON.parse(localStorage.getItem('selectedClassification'))?.value }
               : {}
        } });
    } catch (error) {
        if (error.response?.status === 400 && error.response?.data?.errors) {
            yield put(setPublicationFieldErrors(error.response.data.errors));
        } else {
            yield put(addPublicationFail(error.response?.data || error.message));
        }
    }
}

function* updatePublicationSaga(action) {
    try {
        const { data } = yield call(updatePublicationApi, action.payload);
        yield put(updatePublicationSuccess(data));
        action.payload.resetForm();
        action.payload.handleClose()
        toast.success('Publication updated successfully!');
        yield put({ type: GET_PUBLICATIONS,payload:{
            "pagesize": 10,
            "currentpage": Number(localStorage.getItem('pageIndex')) + 1,
            "sortorder": JSON.parse(localStorage.getItem('selectedSortData'))?.value && JSON.parse(localStorage.getItem('selectedSortData'))?.direction
                ? {
                    field: JSON.parse(localStorage.getItem('selectedSortData')).value,
                    direction: JSON.parse(localStorage.getItem('selectedSortData')).direction,
                }
                : {},
            "searchstring":localStorage.getItem('searchString'),
           "filter": (localStorage.getItem('selectedType') && localStorage.getItem('selectedType') !== "undefined" && localStorage.getItem('selectedType') !== "null")
           ? { type: JSON.parse(localStorage.getItem('selectedType'))?.value }
           : (localStorage.getItem('selectedClassification') && localStorage.getItem('selectedClassification') !== "undefined" && localStorage.getItem('selectedClassification') !== "null")
               ? { classification_id: JSON.parse(localStorage.getItem('selectedClassification'))?.value }
               : {}
        }  });
    } catch (error) {
        if (error.response?.status === 400 && error.response?.data?.errors) {
            yield put(setPublicationFieldErrors(error.response.data?.errors));
        } else {
            yield put(updatePublicationFail(error.response?.data || error.message));
        }
    }
}

function* deletePublicationSaga(action) {
    try {
        yield call(deletePublicationApi, action.payload);
        yield put(deletePublicationSuccess(action.payload));
        toast.success('Publication deleted successfully!');
        yield put({ type: GET_PUBLICATIONS,payload:{
            "pagesize": 10,
            "currentpage": Number(localStorage.getItem('pageIndex')) + 1,
            "sortorder": JSON.parse(localStorage.getItem('selectedSortData'))?.value && JSON.parse(localStorage.getItem('selectedSortData'))?.direction
                ? {
                    field: JSON.parse(localStorage.getItem('selectedSortData')).value,
                    direction: JSON.parse(localStorage.getItem('selectedSortData')).direction,
                }
                : {},
            "searchstring": localStorage.getItem('searchString'),
            "filter": (localStorage.getItem('selectedType') && localStorage.getItem('selectedType') !== "undefined" && localStorage.getItem('selectedType') !== "null")
           ? { type: JSON.parse(localStorage.getItem('selectedType'))?.value }
           : (localStorage.getItem('selectedClassification') && localStorage.getItem('selectedClassification') !== "undefined" && localStorage.getItem('selectedClassification') !== "null")
               ? { classification_id: JSON.parse(localStorage.getItem('selectedClassification'))?.value }
               : {}
        }  });
    } catch (error) {
        yield put(deletePublicationFail(error.response?.data || error.message));
    }
}

// Watcher saga
function* publicationSaga() {
    yield takeEvery(GET_PUBLICATIONS, getPublicationsSaga);
    yield takeEvery(ADD_PUBLICATION, addPublicationSaga);
    yield takeEvery(UPDATE_PUBLICATION, updatePublicationSaga);
    yield takeEvery(DELETE_PUBLICATION, deletePublicationSaga);
}

export default publicationSaga;
