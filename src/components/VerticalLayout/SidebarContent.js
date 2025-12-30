import React, { useState, useEffect, useCallback, useRef } from "react";
import PropTypes from "prop-types";
import SimpleBar from "simplebar-react";
import MetisMenu from "metismenujs";
import withRouter from "components/Common/withRouter";
import { LiaUserEditSolid } from "react-icons/lia";
import { FiShoppingCart } from "react-icons/fi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { withTranslation } from "react-i18next";
import { IoListOutline, IoHomeOutline } from "react-icons/io5";
import { PiNetworkLight } from "react-icons/pi";
import { TfiLayoutSliderAlt } from "react-icons/tfi";
import { FaLeanpub } from "react-icons/fa6";
import { TbChartBarPopular } from "react-icons/tb";
import { GrIndicator } from "react-icons/gr";
import { RiSurveyLine } from "react-icons/ri";
import { MdOutlineFeedback } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { CiUser } from "react-icons/ci";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";
import { IoIosAddCircleOutline } from "react-icons/io";
import { getEncryptedLocal } from "pages/Utility/cookieUtils";
import { Button } from "reactstrap";
import { IoIosLogOut } from "react-icons/io";

const SidebarContent = ({ t }) => {
  const location = useLocation();
  const ref = useRef();
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);
  const user = useSelector((state) => state?.Login.user);
  const path = location.pathname;
  const permissions = getEncryptedLocal("permissions");
  const navigate = useNavigate()

  console.log("permissions:", permissions);

  const activateParentDropdown = useCallback((item) => {
    item.classList.add("active");
    const parent = item.parentElement;
    const parent2El = parent.childNodes[1];

    if (parent2El && parent2El.id !== "side-menu") {
      parent2El.classList.add("mm-show");
    }

    if (parent) {
      parent.classList.add("mm-active");
      const parent2 = parent.parentElement;

      if (parent2) {
        parent2.classList.add("mm-show"); // ul tag

        const parent3 = parent2.parentElement; // li tag
        if (parent3) {
          parent3.classList.add("mm-active"); // li
          parent3.childNodes[0].classList.add("mm-active"); //a
          const parent4 = parent3.parentElement; // ul
          if (parent4) {
            parent4.classList.add("mm-show"); // ul
            const parent5 = parent4.parentElement;
            if (parent5) {
              parent5.classList.add("mm-show"); // li
              parent5.childNodes[0].classList.add("mm-active"); // a tag
            }
          }
        }
      }
      scrollElement(item);
      return false;
    }
    scrollElement(item);
    return false;
  }, []);

  const removeActivation = (items) => {
    for (var i = 0; i < items.length; ++i) {
      var item = items[i];
      const parent = items[i].parentElement;

      if (item && item.classList.contains("active")) {
        item.classList.remove("active");
      }
      if (parent) {
        const parent2El =
          parent.childNodes && parent.childNodes.length && parent.childNodes[1]
            ? parent.childNodes[1]
            : null;
        if (parent2El && parent2El.id !== "side-menu") {
          parent2El.classList.remove("mm-show");
        }

        parent.classList.remove("mm-active");
        const parent2 = parent.parentElement;

        if (parent2) {
          parent2.classList.remove("mm-show");

          const parent3 = parent2.parentElement;
          if (parent3) {
            parent3.classList.remove("mm-active"); // li
            parent3.childNodes[0].classList.remove("mm-active");

            const parent4 = parent3.parentElement; // ul
            if (parent4) {
              parent4.classList.remove("mm-show"); // ul
              const parent5 = parent4.parentElement;
              if (parent5) {
                parent5.classList.remove("mm-show"); // li
                parent5.childNodes[0].classList.remove("mm-active"); // a tag
              }
            }
          }
        }
      }
    }
  };

  function tToggle2() {
    var body = document.body;
    if (window.screen.width <= 992) {
      body.classList.toggle("sidebar-enable");
    }
  }

  const activeMenu = useCallback(() => {
    const pathName = location.pathname;
    const fullPath = pathName;
    let matchingMenuItem = null;
    const ul = document.getElementById("side-menu");
    const items = ul.getElementsByTagName("a");
    removeActivation(items);

    for (let i = 0; i < items.length; ++i) {
      if (fullPath === items[i].pathname) {
        matchingMenuItem = items[i];
        break;
      }
    }
    if (matchingMenuItem) {
      activateParentDropdown(matchingMenuItem);
    }
  }, [path, activateParentDropdown]);

  useEffect(() => {
    ref.current.recalculate();
  }, []);

  useEffect(() => {
    new MetisMenu("#side-menu");
    activeMenu();
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    activeMenu();
  }, [activeMenu]);

  function scrollElement(item) {
    if (item) {
      const currentPosition = item.offsetTop;
      if (currentPosition > window.innerHeight) {
        ref.current.getScrollElement().scrollTop = currentPosition - 300;
      }
    }
  }

  // Get available paths from permissions
  const availablePaths = permissions?.map((permission) => permission.page_url);
  console.log("availablePaths:", availablePaths);
  const hasAddRolePermission = permissions
    ?.map((item) => item?.permission_name)
    ?.includes("Add Role");
  const hasAddProductPermission = permissions
    ?.map((item) => item?.permission_name)
    ?.includes("Product Add");
  const hasAddUserPermission = permissions
    ?.map((item) => item?.permission_name)
    ?.includes("User Add");

  // Handle menu item click
  const handleMenuItemClick = (itemPath) => {
    setSelectedMenuItem(itemPath); // Set the active menu item
  };

  const getActiveItemStyle = (itemPath) => {
    return selectedMenuItem === itemPath ? { backgroundColor: "#f0f0f0" } : {};
  };

    const handleLogout = ()=>{
      const allCookies = Cookies.get();
  
        // Loop through each cookie and remove it
        for (const cookieName in allCookies) {
          Cookies.remove(cookieName); // Removes the cookie
        }
        localStorage.clear()
        navigate('/login')
    }

  return (
    <React.Fragment>
      <SimpleBar style={{maxHeight: "100%" }} ref={ref}>
        <div id="sidebar-menu"  style={{minHeight:"90vh", maxHeight: "100%",position:"relative" }} >
          <ul className="metismenu list-unstyled" id="side-menu">
            {availablePaths?.includes("/dashboard") && (
              <li>
                <Link
                  to="/dashboard"
                  className="waves-effect"
                  onClick={() => {
                    handleMenuItemClick("/dashboard");
                    tToggle2();
                  }}
                >
                  <IoHomeOutline size={20} className="me-2 mb-1" />
                  <span className="">{t("Dashboard")}</span>
                </Link>
              </li>
            )}

            {availablePaths?.includes("/orders") && (
              <li>
                <Link
                  to="/orders"
                  className="waves-effect"
                  onClick={() => {
                    handleMenuItemClick("/orders");
                    tToggle2();
                  }}
                >
                  <FiShoppingCart size={20} className="me-2 mb-1" />
                  <span className="">{t("Orders")}</span>
                </Link>
              </li>
            )}

            {availablePaths?.includes("/products") && (
              <li>
                <Link
                  to="/products"
                  className="waves-effect"
                  onClick={() => {
                    handleMenuItemClick("/products");
                    tToggle2();
                  }}
                >
                  <LiaUserEditSolid size={22} className="me-2" />
                  <span>{t("Products")}</span>
                </Link>
              </li>
            )}

            {availablePaths?.includes("/users") && (
              <li>
                <Link
                  to="/users"
                  className="waves-effect"
                  onClick={() => {
                    handleMenuItemClick("/users");
                    tToggle2();
                  }}
                >
                  <CiUser size={22} className="me-2" />
                  <span>{t("Users")}</span>
                </Link>
              </li>
            )}
            {availablePaths?.includes("/roles") && (
              <li>
                <Link
                  to="/roles"
                  className="waves-effect"
                  onClick={() => {
                    handleMenuItemClick("/roles");
                    tToggle2();
                  }}
                >
                  <LiaUserEditSolid size={22} className="me-2" />
                  <span>{t("Roles")}</span>
                </Link>
              </li>
            )}
            {/* {availablePaths?.includes("/roles") && ( */}
            <li>
              <Link
                to="/customers"
                className="waves-effect"
                onClick={() => {
                  handleMenuItemClick("/customers");
                  tToggle2();
                }}
              >
                <LiaUserEditSolid size={22} className="me-2" />
                <span>{t("Customers")}</span>
              </Link>
            </li>
            {/* )} */}
            {/* Divider Line */}
            <li>
              <div className="border-top my-3"></div>
            </li>

            {/* New Product */}
            {hasAddProductPermission && (
              <li>
                <Link
                  to="/createProduct"
                  className="waves-effect"
                  onClick={() => {
                    handleMenuItemClick("/createProduct");
                    tToggle2();
                  }}
                >
                  <IoIosAddCircleOutline size={20} className="me-2 mb-1" />
                  <span>{t("New Product")}</span>
                </Link>
              </li>
            )}

            {/* New Role */}
            {hasAddRolePermission && (
              <li>
                <Link
                  to="/createRole"
                  className="waves-effect"
                  onClick={() => {
                    handleMenuItemClick("/createRole");
                    tToggle2();
                  }}
                >
                  <IoIosAddCircleOutline size={20} className="me-2 mb-1" />
                  <span>{t("New Role")}</span>
                </Link>
              </li>
            )}

            {/* New User */}

            {hasAddUserPermission && (
              <li>
                <Link
                  to="/createUser"
                  className="waves-effect"
                  onClick={() => {
                    handleMenuItemClick("/createUser");
                    tToggle2();
                  }}
                >
                  <IoIosAddCircleOutline size={20} className="me-2 mb-1" />
                  <span>{t("New User")}</span>
                </Link>
              </li>
            )}
          </ul>
         
            <div 
             style={{
            position: "absolute",
            bottom:0,
            left:"20px",
            right:0,
           padding:"10px 0",
           color:"#f28c28",
           cursor:"pointer"
            }}
               onClick={handleLogout}
            >
            
               <IoIosLogOut size={20} className="me-2 mb-1" />
                <span>{t("Signout")}</span>
              
            </div>
        
        </div>
        
      </SimpleBar>
    </React.Fragment>
  );
};

SidebarContent.propTypes = {
  location: PropTypes.object,
  permissions: PropTypes.array,
  t: PropTypes.any,
};

export default withRouter(withTranslation()(SidebarContent));
