import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button } from 'reactstrap';
import { getRoles } from 'store/actions'; 
import Breadcrumb from 'components/Common/Breadcrumb2';
import { useTranslation } from 'react-i18next';
import RoleTable from './RoleTable';
import Cookies from 'js-cookie';
import { getEncryptedLocal } from 'pages/Utility/cookieUtils';


const RoleList = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {t} = useTranslation();
    const roles = useSelector((state) => state.Role.roles);
    const loading = useSelector((state) => state.Role.loading);
    const error = useSelector((state) => state.Role.error);
   const permissions2 = getEncryptedLocal("permissions");
    const hasListRolePermission = permissions2?.map(item => item?.permission_name)?.includes("List Role");
    const hasEditPermission = permissions2?.map(item=>item?.permission_name)?.includes("Edit Role");
    const hasDeletePermission = permissions2?.map(item=>item?.permission_name)?.includes("Delete Role");
    const hasAddPermission = permissions2?.map(item=>item?.permission_name)?.includes("Add Role");
    if (!hasListRolePermission && !hasAddPermission && !hasDeletePermission && !hasEditPermission) {
        navigate('/page-403');
    }
    // Dispatch action to fetch roles when component mounts
    useEffect(() => {
        if(loading)return;
        dispatch(getRoles());
    }, [dispatch]);

    return (
        <>
            <div className="page-content container-fluid mt-4">
                <div className="d-flex justify-content-between align-items-center mx-3">
                    <Breadcrumb title="Roles" breadcrumbItems={[{ title: "Dashboard", link: `/dashboard` }, { title: "Roles", link: '#' }]} />
                    {hasAddPermission && <Button 
                        className="text-white bg-primary d-flex justify-content-center gap-1 align-items-center" 
                        onClick={() => navigate('/createRole')} 
                        
                    >
                        <i className="ti-plus"></i> {t('Add New')}
                    </Button>}
                </div>
                
                {/* Display loading state, error message, or the list of roles */}
                <RoleTable loading={loading} List={roles?.data} />  
            </div>
        </>
    );
};

export default RoleList;
