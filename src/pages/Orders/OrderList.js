import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'reactstrap';
import { fetchOrdersRequest } from 'store/actions';
import Breadcrumb from 'components/Common/Breadcrumb2';
import OrderTable from './OrderTable'; // custom table component
import { useNavigate } from 'react-router-dom';


const OrderList = () => {
    const dispatch = useDispatch();
    const orders = useSelector((state) => state.Order.orders); 
    console.log("orders:",orders)
    const loading = useSelector((state) => state.Order.loading);
    const error = useSelector((state) => state.Order.error);
    const navigate = useNavigate();
   const role = useSelector((state) => state.Login.user?.role);
console.log("ROLE:", role);


    return (
        <div className="page-content container-fluid mt-4">
            {/* Page header */}
            <div className="d-flex justify-content-between align-items-center mx-3">
                <Breadcrumb
                    title="Orders"
                    breadcrumbItems={[
                        { title: 'Dashboard', link: '/dashboard' },
                        { title: 'Orders', link: '#' }
                    ]}
                />
            </div>

            {/* Orders table */}
            <OrderTable
                orders={orders?.data || []}
                totalrows={orders?.total}
                loading={loading}
                error={error}
            />
        </div>
    );
};

export default OrderList;
