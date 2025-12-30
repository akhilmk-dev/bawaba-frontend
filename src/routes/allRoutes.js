import React from "react";


//Email

// Authentication related pages
import Login from "../pages/Authentication/Login";
import Logout from "../pages/Authentication/Logout";
// import Register from "../pages/Authentication/Register";
import ForgetPwd from "../pages/Authentication/ForgetPassword";
import ResetPassword from '../pages/Authentication/ResetPassword';

//  // Inner Authentication

// Dashboard
import Dashboard from "../pages/Dashboard/index";
// Charts
import ChartApex from "../pages/Charts/Apexcharts";
import ChartjsChart from "../pages/Charts/ChartjsChart";
import EChart from "../pages/Charts/EChart";
import SparklineChart from "../pages/Charts/SparklineChart";


//Ui

//Pages
import Pages404 from "../pages/Utility/pages-404";
import Pages500 from "../pages/Utility/pages-500";
import UserList from "pages/Users/UserList";
import UserProfile from "pages/UserProfile/UserProfile";
import ChangePassword from "pages/UserProfile/ChangePassword";
import { Navigate } from "react-router-dom";

import Otp from "pages/Authentication/Otp";
import Pages403 from "pages/Utility/pages-403";
import RoleList from "pages/Roles/RoleList";
import CreateRole from "pages/Roles/CreateRole";
import CreateUserPage from "pages/Users/CreateUser";
import OrderList from "pages/Orders/OrderList";
import OrderDetailsPage from "pages/Orders/OrderDetails";
import ProductForm from "pages/products/CreateProduct";
import ProductList from "pages/products/ProductList";
import Customers from "pages/Customers";


const userRoutes = [
  // { path: "/", component: <Navigate to="/dashboard" /> },
  { path: "/dashboard", component: <Dashboard /> },

  // //profile
  { path: "/profile", component: <UserProfile /> },
  { path: "/change-password", component: <ChangePassword /> },

  //Charts
  { path: "/apex-charts", component: <ChartApex /> },
  { path: "/chartjs-charts", component: <ChartjsChart /> },
  { path: "/e-charts", component: <EChart /> },
  { path: "/sparkline-charts", component: <SparklineChart /> },

  // this route should be at the end of all other routes
   {path:"/users", component :<UserList />},
   {path:"/createUser",component:<CreateUserPage />},
   {path:"/roles", component :<RoleList />},
   {path:"/orders",component:<OrderList />},
   {path:"/orderDetails/:id",component:<OrderDetailsPage />},
   {path:"/createRole",component:<CreateRole />},
   {path:"/profile",component:<UserProfile />},
   {path:"/CreateProduct",component:<ProductForm />},
   {path:"/products",component:<ProductList />},
   {path:"/customers",component:<Customers/>}
  //  {path:"/changePassword", component:<ChangePassword />},
];

const authRoutes = [
  { path: "/logout", component: <Logout /> },
  { path: "/login", component: <Login /> },
  {path:"/otp/:id", component:<Otp />},
  { path: "/forgot-password", component: <ForgetPwd /> },
  { path: "/reset-password", component: <ResetPassword /> },
  // { path: "/register", component: <Register /> },
  // { path: "/pages-maintenance", component: <PagesMaintenance /> },
  // { path: "/pages-comingsoon", component: <PagesComingsoon /> },
  { path: "/pages-404", component: <Pages404 /> },
  {path:"/pages-403", component:<Pages403 />},
  { path: "/pages-500", component: <Pages500 /> },

  //Authentication Inner

];

export { userRoutes, authRoutes };
