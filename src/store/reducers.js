import { combineReducers } from "redux"

// Front
import Layout from "./layout/reducer"

// Authentication
import Login from "./auth/login/reducer"
import Account from "./auth/register/reducer"
import ForgetPassword from "./auth/forgetpwd/reducer"
import Profile from "./auth/profile/reducer"

// users
import User from "./Users/reducer"
// permissions
import Permission from "./Permissions/reducer"

// roles
import Role from "./Roles/reducer"

//Publications
import Publication from "./Publications/reducer"

// orders
import Order from  "./Orders/reducer"

// products
import Product from "./Products/reducer"


const rootReducer = combineReducers({
  Layout,
  Login,
  Account,
  ForgetPassword,
  Profile,
  User,
  Permission,
  Role,
  Publication,
  Order,
  Product
})

export default rootReducer
