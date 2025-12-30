import React, { useState } from "react";
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";
import { Dropdown, DropdownToggle, DropdownMenu, Row, Col } from "reactstrap";
import SimpleBar from "simplebar-react";

//i18n
import { withTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { MdNotificationsNone } from "react-icons/md";

const NotificationDropdown = ({ notifications }) => {
  // Declare a new state variable, which we'll call "menu"
  const [menu, setMenu] = useState(false);


  return (
    <React.Fragment>
      <Dropdown
        isOpen={menu}
        toggle={() => setMenu(!menu)}
        className="dropdown d-inline-block"
        tag="li"
      >
        <DropdownToggle
          className="btn header-item noti-icon waves-effect"
          tag="button"
          id="page-header-notifications-dropdown"
        >
          <i className="mdi mdi-bell-outline"></i>
         {notifications?.length > 0 && <span className="badge bg-danger rounded-pill d-flex justify-content-center align-items-center p-1">{notifications?.filter(item=>item?.isRead == false)?.length}</span>}
        </DropdownToggle>

        <DropdownMenu className="dropdown-menu dropdown-menu-lg dropdown-menu-end p-0">
          <div className="p-3">
            <Row className="align-items-center">
              <Col>
                <h6 className="m-0 font-size-16"> {`Notifications (${notifications?.filter(item=>item?.isRead == false)?.length})`}</h6>
              </Col>
            </Row>
          </div>

          <SimpleBar style={{ height: "230px" }}>
            {notifications?.map(notification => (
              <Link to="/notifications" onClick={()=>setMenu(false)} className="text-reset notification-item">
                <div className="d-flex">
                  <div className="avatar-xs me-3">
                    <span className="avatar-title bg-success rounded-circle font-size-16 p-2">
                      <MdNotificationsNone size={22}/>
                    </span>
                  </div>
                  <div className="flex-1">
                    <h6 className="mt-0 mb-1">{notification?.messageContent}</h6>
                    <div className="font-size-12 text-muted">
                      {/* <p className="mb-1">
                       {notification?.userName}
                      </p> */}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </SimpleBar>
          <div className="p-2 border-top d-grid">
            <Link
              className="btn btn-sm btn-link font-size-14 btn-block text-center"
              to="/notifications"
              onClick={()=>setMenu(false)}
            >
              <i className="mdi mdi-arrow-right-circle me-1"></i>
              {" "}
              {("View all")}{" "}
            </Link>
          </div>
        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  );
};

export default withTranslation()(NotificationDropdown);

NotificationDropdown.propTypes = {
  t: PropTypes.any
};