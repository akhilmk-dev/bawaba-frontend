// actions.js

import {
  GET_ROLES,
  GET_ROLES_SUCCESS,
  GET_ROLES_FAIL,
  ADD_ROLE,
  ADD_ROLE_SUCCESS,
  ADD_ROLE_FAIL,
  UPDATE_ROLE,
  UPDATE_ROLE_SUCCESS,
  UPDATE_ROLE_FAIL,
  DELETE_ROLE,
  DELETE_ROLE_SUCCESS,
  DELETE_ROLE_FAIL,
  SET_ROLE_FIELD_ERRORS,
} from './actionTypes'

// Get Roles
export const getRoles = () => ({
  type: GET_ROLES,
})

export const getRolesSuccess = (roles) => ({
  type: GET_ROLES_SUCCESS,
  payload: roles,
})

export const getRolesFail = (error) => ({
  type: GET_ROLES_FAIL,
  payload: error,
})

// Add Role
export const addRole = (role, navigate) => ({
  type: ADD_ROLE,
  payload: { role, navigate },
})

export const addRoleSuccess = (role) => ({
  type: ADD_ROLE_SUCCESS,
  payload: role,
})

export const addRoleFail = (error) => ({
  type: ADD_ROLE_FAIL,
  payload: error,
})

// Update Role
export const updateRole = (id,role,navigate) => ({
  type: UPDATE_ROLE,
  payload: { id,role, navigate },
})

export const updateRoleSuccess = (role) => ({
  type: UPDATE_ROLE_SUCCESS,
  payload: role,
})

export const updateRoleFail = (error) => ({
  type: UPDATE_ROLE_FAIL,
  payload: error,
})

// Delete Role
export const deleteRole = (id) => ({
  type: DELETE_ROLE,
  payload: id,
})

export const deleteRoleSuccess = (id) => ({
  type: DELETE_ROLE_SUCCESS,
  payload: id,
})

export const deleteRoleFail = (error) => ({
  type: DELETE_ROLE_FAIL,
  payload: error,
})

// Set Field Errors
export const setRoleFieldErrors = (errors) => ({
  type: SET_ROLE_FIELD_ERRORS,
  payload: errors,
})
