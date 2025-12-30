import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Row, Button } from 'reactstrap';
import { addUserRequest, fetchUsersRequest, getRoles } from 'store/actions';
import CreateUser from './CreateUser';
import Breadcrumb from 'components/Common/Breadcrumb2';
import UserTable from './UserTable';
import { Navigate, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { getEncryptedLocal } from 'pages/Utility/cookieUtils';

const UserList = () => {
    const [isOpen, setIsOpen] = useState(false); 
    const dispatch = useDispatch();
    const users = useSelector((state) => state.User.users);
    const loading = useSelector((state) => state.User.loading);
    const error = useSelector((state) => state.User.error);
    const permissions = getEncryptedLocal("permissions")

    
    const hasAddPermission = permissions?.some(
        (item) => item?.permission_name === 'User Add'
    );
    const hasListPermission=permissions?.some(
        (item)=> item?.permission_name ==="User List"
    )
     const navigate = useNavigate()
    if(!hasListPermission && hasAddPermission){
        navigate('/page-403');
    }
   

    // useEffect(() => {
    //     dispatch(getRoles());
    // }, [dispatch]);

    return (
        <>
            <div className="page-content container-fluid mt-4">
                {/* Page header */}
                <div className="d-flex justify-content-between align-items-center mx-3">
                    <Breadcrumb
                        title="Users"
                        breadcrumbItems={[
                            { title: 'Dashboard', link: '/dashboard' },
                            { title: 'Users', link: '#' }
                        ]}
                    />

                    {hasAddPermission&&<Button
                        className="bg-primary text-white d-flex justify-content-center gap-1 align-items-center"
                        onClick={() => navigate('/createUser')}
                    >
                        <i className="ti-plus"></i> Add New
                    </Button>}
                </div>

                {/* User list table */}
                <UserTable users={users?.data || []} totalrows={users.total} loading={loading} error={error} />
            </div>
        </>
    );
};

export default UserList;
