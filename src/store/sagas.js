import { all, fork } from "redux-saga/effects"

//public
import AccountSaga from "./auth/register/saga"
import AuthSaga from "./auth/login/saga"
import ForgetSaga from "./auth/forgetpwd/saga"
import ProfileSaga from "./auth/profile/saga"
import LayoutSaga from "./layout/saga"
import UserSaga from "./Users/saga"
import PermissionSaga from "./Permissions/saga"
import Roles from "./Roles/saga"
import PublicationSaga from "./Publications/saga"
import OrderSaga from "./Orders/saga"
import productSaga  from "./Products/saga"

export default function* rootSaga() {
  yield all([
    //public
    AccountSaga(),
    fork(AuthSaga),
    ProfileSaga(),
    ForgetSaga(),
    LayoutSaga(),
    UserSaga(),
    PermissionSaga(),
    Roles(),
    PublicationSaga(),
    OrderSaga(),
    productSaga()
  ])
}
