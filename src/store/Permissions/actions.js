// actions.js

import {
  GET_PERMISSIONS,
  GET_PERMISSIONS_SUCCESS,
  GET_PERMISSIONS_FAIL,
  ADD_PERMISSION,
  ADD_PERMISSION_SUCCESS,
  ADD_PERMISSION_FAIL,
  UPDATE_PERMISSION,
  UPDATE_PERMISSION_SUCCESS,
  UPDATE_PERMISSION_FAIL,
  DELETE_PERMISSION,
  DELETE_PERMISSION_SUCCESS,
  DELETE_PERMISSION_FAIL,
  SET_PERMISSION_FIELD_ERRORS,
} from './actionTypes'

// Get Permissions
export const getPermissions = () => ({
  type: GET_PERMISSIONS,
})

export const getPermissionsSuccess = (permissions) => ({
  type: GET_PERMISSIONS_SUCCESS,
  payload: permissions,
})

export const getPermissionsFail = (error) => ({
  type: GET_PERMISSIONS_FAIL,
  payload: error,
})

// Add Permission
export const addPermission = (permission) => ({
  type: ADD_PERMISSION,
  payload: permission,
})

export const addPermissionSuccess = (permission) => ({
  type: ADD_PERMISSION_SUCCESS,
  payload: permission,
})

export const addPermissionFail = (error) => ({
  type: ADD_PERMISSION_FAIL,
  payload: error,
})

// Update Permission
export const updatePermission = ({id,permission}) => ({
  type: UPDATE_PERMISSION,
  payload: {id,permission},
})

export const updatePermissionSuccess = (permission) => ({
  type: UPDATE_PERMISSION_SUCCESS,
  payload: permission,
})

export const updatePermissionFail = (error) => ({
  type: UPDATE_PERMISSION_FAIL,
  payload: error,
})

// Delete Permission
export const deletePermission = (id) => ({
  type: DELETE_PERMISSION,
  payload: id,
})

export const deletePermissionSuccess = (id) => ({
  type: DELETE_PERMISSION_SUCCESS,
  payload: id,
})

export const deletePermissionFail = (error) => ({
  type: DELETE_PERMISSION_FAIL,
  payload: error,
})

// Set Field Errors
export const setPermissionFieldErrors = (errors) => ({
  type: SET_PERMISSION_FIELD_ERRORS,
  payload: errors,
})
