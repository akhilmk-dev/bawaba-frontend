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
  } from './actionTypes'
  
  // Get Publications
  export const getPublications = (publications) => ({ type: GET_PUBLICATIONS,  payload:publications })
  export const getPublicationsSuccess = (publications) => ({ type: GET_PUBLICATIONS_SUCCESS, payload:publications})
  export const getPublicationsFail = (error) => ({ type: GET_PUBLICATIONS_FAIL, payload: error })
  
  // Add Publication
  export const addPublication = (publication,resetForm,handleClose) => ({ type: ADD_PUBLICATION, payload: {publication,resetForm,handleClose} })
  export const addPublicationSuccess = (publication) => ({ type: ADD_PUBLICATION_SUCCESS, payload: publication })
  export const addPublicationFail = (error) => ({ type: ADD_PUBLICATION_FAIL, payload: error })
  
  // Update Publication
  export const updatePublication = (publication,id,resetForm,handleClose) => ({ type: UPDATE_PUBLICATION, payload: {publication,id,resetForm,handleClose}})
  export const updatePublicationSuccess = (publication) => ({ type: UPDATE_PUBLICATION_SUCCESS, payload: publication })
  export const updatePublicationFail = (error) => ({ type: UPDATE_PUBLICATION_FAIL, payload: error })
  
  // Delete Publication
  export const deletePublication = (id) => ({ type: DELETE_PUBLICATION, payload: id })
  export const deletePublicationSuccess = (id) => ({ type: DELETE_PUBLICATION_SUCCESS, payload: id })
  export const deletePublicationFail = (error) => ({ type: DELETE_PUBLICATION_FAIL, payload: error })
  
  // Set Field Errors
  export const setPublicationFieldErrors = (errors) => ({ type: SET_PUBLICATION_FIELD_ERRORS, payload: errors })
  