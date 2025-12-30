import PropTypes from 'prop-types';
import React, { useEffect, useState } from "react";
import { RiShoppingCart2Line } from "react-icons/ri";
import { FiShoppingCart, FiDollarSign, FiPackage, FiUsers } from "react-icons/fi";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';



import {
  Container,
  Row,
  Col,
  Button,
  Card,
  CardBody,
  Input,
  Dropdown,
  DropdownToggle,
  DropdownItem,
  DropdownMenu,
  CardTitle
} from "reactstrap";
import { Link, useNavigate } from "react-router-dom";

// Custom Scrollbar
import SimpleBar from "simplebar-react";

// import images

import { CiCalendar } from "react-icons/ci";
import { TbAdjustmentsHorizontal } from "react-icons/tb";
import { TbFileExport } from "react-icons/tb";
import { HiOutlineUsers } from "react-icons/hi2";
import { GoGraph } from "react-icons/go";
import { LuClipboardList } from "react-icons/lu";
import { LuMessageSquareWarning } from "react-icons/lu";
import { PiNetworkLight } from "react-icons/pi";


//i18n
import { withTranslation } from "react-i18next";
import axiosInstance from 'pages/Utility/axiosInstance';
import { useDispatch, useSelector } from 'react-redux';
import { getWorkOrders } from 'store/actions';
import { FadeLoader } from 'react-spinners';
import { formatDateTimeToAmPm } from 'helpers/dateFormat_helper';
import Cookies from 'js-cookie';
import BarChart from 'pages/AllCharts/chartjs/barchart';
import { set } from 'store';
import CountCard from 'components/cards/CountCard';
import DashboardTable from './dashboardTable';
import ChartComponent from './ChartComponent';
import Breadcrumb from 'components/Common/Breadcrumb2';
import { getEncryptedCookie } from 'pages/Utility/cookieUtils';




const Dashboard = props => {
  const [menu, setMenu] = useState(false);
  const [dashboardDetails, setDashboardDetails] = useState();
  const [dashboard, setDashboard] = useState()
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [data, setData] = useState()

  // const id = JSON.parse(Cookies.get('authUser'))?.userId
  const permissions = [];

  // Selectors to access Redux state
  const workOrders = [];

  const toggle = () => {
    setMenu(!menu);
  };

  // const fetchDashboardDetails = async () => {
  //   try {
  //     const response = await axiosInstance('V1/dashboard/summary');
  //     setDashboardDetails(response?.data?.data);
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

  // useEffect(() => {
  //   fetchDashboardDetails()
  // }, [])

  function formatDateToCustom(dateString) {
    const date = new Date(dateString);

    const day = date.getDate().toString().padStart(2, '0');
    const month = date
      .toLocaleString('en-US', { month: 'long' });
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
  }


  useEffect(() => {
    if (dashboard?.result2?.[0]?.MonthlyWiseTotalCount) {
      setData({
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        datasets: [
          {
            label: "Work Orders",
            backgroundColor: "#02a499",
            borderColor: "#02a499",
            borderWidth: 1,
            hoverBackgroundColor: "#02a499",
            hoverBorderColor: "#02a499",
            data: [],
          },
        ],
      })
    }
  }, [dashboard]);

  const dashCard = {
  background: "#fff",
  borderRadius: "16px",
  padding: "36px",
  boxShadow: "0 3px 15px rgba(0,0,0,0.06)",
  transition: "0.2s ease",
  height:"130px"
};

const dashCardHover = {
  boxShadow: "0 6px 20px rgba(0,0,0,0.10)",
};

const dashIcon = {
  width: "42px",
  height: "42px",
  borderRadius: "50%",
  background: "rgba(255,0,0,0.12)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  color: "red",
  marginBottom: "10px",
  fontSize: "20px",
};

const dashTitle = {
  fontSize: "14px",
  color: "#6f6f6f",
  marginBottom: "4px",
  fontWeight: 500,
};

const dashValue = {
  fontSize: "20px",
  fontWeight: 700,
  color: "#000",
};

const styles = {
  card: {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
  },
  chartContainer: {
    width: "100%",
    height: "275px",
  }
};


//columns for product table
const columns = [
  // { header: "No.", field: "serial" },
  { header: "Title", field: "title" },
  {header:"Price", field: "price"},
  { header: "Vendor", field: "vendor" },
  // { header: "Status", field: "status" }
];

//columns for order table
const orderColumns = [
  // { header: "No.", field: "serial" },
  { header: "Order", field: "order" },
  { header: "Total", field: "total" },
  { header: "Customer", field: "customer" },
  
  { header: "Payment Status", field: "paymentStatus" }
];







 const [stats, setStats] = useState({
    totalOrders: 0,
    totalEarnings: 0,
    totalProducts: 0,
    totalCustomers: 0
  });
  const [productData, setProductData] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [pieChartData, setPieChartData] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axiosInstance.get(`V1/products/dashboard/stats`);
      const counts = res.data.data.counts;
      const recentProducts = res.data.data.recentProducts;
      
     const productTableData = recentProducts.map((item, index) => {
  const price =
    item.price && item.price !== ""
      ? item.price
      : item.variants?.length > 0
        ? item.variants[0].price
        : "0"; 

  return {
    title: item.title,
    vendor: item.vendor,
    status: item.status,
    price: price
  };
});
    const recentOrders= res.data.data.recentOrders
 
        const recentOrdersData = recentOrders.map((order, index) => ({
      serial: index + 1,
      order: order.name,
      customer: `${order.customer.first_name} ${order.customer.last_name}`,
      total: `${order.currency} ${order.total_price.toFixed(2)}`,
      paymentStatus: order.financial_status
    }));
    
   const orderStatusDistribution=res.data.data.orderStatusDistribution;
   const statusLabels = Object.keys(orderStatusDistribution);
   const statusValues = Object.values(orderStatusDistribution);
   const colors = ["#8a7fff", "#ff7f7f", "#63c5ff", "#ffb266"];
    
    setStats({
      totalOrders: counts.totalOrders,
      totalEarnings: counts.totalEarnings,
      totalProducts: counts.totalProducts,
      totalCustomers: counts.totalCustomers
    });
    setProductData(productTableData);
    setRecentOrders(recentOrdersData);
    setPieChartData({
  labels: statusLabels,
  datasets: [
    {
      data: statusValues,
      backgroundColor: colors,
      borderWidth: 1,
    }
  ]
});

  } catch (error) {
    console.log("Dashboard Stats Error:", error);
  }
     finally {
    setLoading(false);
  }
};

const [vendorName, setVendorName] = useState("");

useEffect(() => {
  const name = getEncryptedCookie("vendor_name"); 
  if (name) setVendorName(name);
}, []);


  const dashCardData = [
    { dashTitle: "Total Orders", dashValue: stats.totalOrders, icon: FiShoppingCart,path:"/orders" },
    { dashTitle: "Total Earnings", dashValue: stats.totalEarnings, icon: FiDollarSign,path:null },
    { dashTitle: "Total Products", dashValue: stats.totalProducts, icon: FiPackage,path:"/products" },
    { dashTitle: "Total Customers", dashValue: stats.totalCustomers, icon: FiUsers,path:"/customers" }  
  ];

  document.title = "Dashboard | Menahub-mvec";
  return (
    <React.Fragment>
      <div className="page-content d-flex justify-content-center align-items-center" style={{minHeight:"100vh"}}>
   
 <Container fluid className='py-4'>
<h4 className='mb-2'>Hey, {vendorName}</h4>
<p className='text-muted'>Welcome Back</p>
<Row className="g-4 py-2">
  {dashCardData.map((item, index) => (
    <Col lg="3" md="6" key={index}>
      <Link to={item.path} style={{ textDecoration: "none" }}>
      <div
        style={dashCard}
        onMouseEnter={e => (e.currentTarget.style.boxShadow = dashCardHover.boxShadow)}
        onMouseLeave={e => (e.currentTarget.style.boxShadow = dashCard.boxShadow)}
      >
        <div className="d-flex align-items-center">

          <div style={dashIcon}>
            <item.icon size={24} />
          </div>

          <div className="ms-3">
            <div style={dashTitle}>{item.dashTitle}</div>

            <div style={dashValue}>
              {item.dashTitle === "Total Earnings"
                ? ` ${item.dashValue}`
                : item.dashValue}
            </div>
          </div>

        </div>
      </div>
      </Link>
    </Col>
  ))}
</Row>





 <Row className='py-4'>
    {/* LEFT: Recent Products */}
    <Col lg="6">
      <div className="dash-card">
        <h3 className="fs-5">Recent Products</h3>
        {loading ? (
    <Skeleton count={5} height={40} style={{ marginBottom: 8 }} />
  ) : productData.length > 0 ? (
    <DashboardTable columns={columns} data={productData} />
  ) : (
    <p>No products found</p>
  )}
      </div>
    </Col>

    {/* RIGHT: Category Wise Sale Report */}
<Col lg="6" className='py-3 py-lg-0'>
  <h3 className="fs-5">Category Wise Sale Report</h3>
  <div style={styles.card}>
    <div style={styles.chartContainer}>
          {loading ? (
      <Skeleton height={250} />
    ) : pieChartData ? (
      <ChartComponent type="pie" data={pieChartData} />
    ) : (
      <p>No data found</p>
    )}
    </div>
  </div>
</Col>

  </Row>

        <div className="dash-card">
        <h3 className="fs-5">Recent Orders</h3>
       {loading ? (
    <Skeleton count={5} height={40} style={{ marginBottom: 8 }} />
  ) : recentOrders.length > 0 ? (
    <DashboardTable columns={orderColumns} data={recentOrders} />
  ) : (
    <p>No orders found</p>
  )}
      </div>

    </Container>


      </div>
    </React.Fragment>
  );
};

Dashboard.propTypes = {
  t: PropTypes.any
};

// export default withTranslation()(Dashboard);
export default Dashboard;
