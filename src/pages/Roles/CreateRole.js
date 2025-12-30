import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { addRole, getPermissions, updateRole } from 'store/actions';
import { Checkbox } from 'antd';
import axiosInstance from 'pages/Utility/axiosInstance';
import Breadcrumb from 'components/Common/Breadcrumb2';
import { Button } from 'reactstrap';
import { showError } from 'helpers/notification_helper';
import { ClipLoader } from 'react-spinners';
import { useTranslation } from 'react-i18next';
import Cookies from 'js-cookie';
import { getEncryptedLocal } from 'pages/Utility/cookieUtils';

const CreateRole = ({ initialData, onSubmit }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { search } = location;
  const roleId = new URLSearchParams(search).get('id');

  const [roleData, setRoleData] = useState(null);
  const [groups, setGroups] = useState([]);
  const role_nameRef = useRef(null);

  const loading = useSelector((state) => state.Role.loading);
  const fieldErrors = useSelector((state) => state.Role.fieldErrors);
  const permissions = useSelector((state) => state.Permission.permissions);

const cookiesPermissions = getEncryptedLocal("permissions") || [];
  const hasAccess = cookiesPermissions.some(p =>
    [ "Edit Role", "Add Role"].includes(p?.permission_name)
  );
  useEffect(() => {
    if (!hasAccess) navigate('/page-403');
  }, [hasAccess, navigate]);

  // Fetch Role (Edit Mode)
  const fetchRoleData = async () => {
    if (roleId) {
      const response = await axiosInstance.get(`V1/roles/${roleId}`);
      const data = response?.data?.data;
      setRoleData(data);
    }
  };

  // Fetch Permissions
  const fetchPermissions = () => {
    dispatch(getPermissions());
  };

  useEffect(() => {
    fetchPermissions();
    fetchRoleData();
  }, [dispatch, roleId]);

  // Group permissions by `group` field
  useEffect(() => {
    if (permissions?.data?.length) {
      const groupedPermissions = permissions.data.reduce((acc, perm) => {
        if (!acc[perm.group]) acc[perm.group] = [];
        acc[perm.group].push(perm);
        return acc;
      }, {});
      setGroups(groupedPermissions);
    }
  }, [permissions]);

  // Set form error from API
  useEffect(() => {
    if (fieldErrors['Application.role_name']?.length > 0) {
      formik.setFieldError('role_name', fieldErrors['Application.role_name'][0]);
    }
  }, [fieldErrors]);

  // Initialize Formik
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      role_name: roleData?.role_name || '',
      permissions: roleData?.permissions?.map(p => p._id) || [],
    },
    validationSchema: Yup.object({
      role_name: Yup.string().trim().required("Role Name is required"),
    }),
    onSubmit: (values) => {
      if (!values.permissions || values.permissions.length === 0) {
        showError("Please select at least one permission");
        return;
      }

      const payload = {
        role_name: values.role_name,
        permissions: values.permissions,
      };

      if (roleId) {
        dispatch(updateRole(roleId, payload, navigate));
      } else {
        dispatch(addRole(payload, navigate));
      }
    },
  });

  const handlePermissionChange = (checkedValues) => {
    formik.setFieldValue('permissions', checkedValues);
  };

  const handleSubmit = () => {
    if (!formik.values.role_name.trim()) {
      role_nameRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="container page-content mt-4">
      <div className="d-flex justify-content-between align-items-center ms-2 mb-3">
        <Breadcrumb
          title={roleId ? t('Edit Role') : t('Create New Role')}
          breadcrumbItems={[
            { title: 'Dashboard', link: '/dashboard' },
            { title: 'Roles', link: '/roles' }
          ]}
        />
        <Button className="text-white bg-primary" onClick={() => navigate('/roles')}>
        ← {t('Back')}
        </Button>
      </div>

      <form onSubmit={formik.handleSubmit} className="bg-white p-3" style={{ borderRadius: '8px' }}>
        {/* Role Name */}
        <div className="form-group">
          <label htmlFor="role_name">{t('Role Name')}</label> <span className="text-danger">*</span>
          <input
            ref={role_nameRef}
            type="text"
            id="role_name"
            name="role_name"
            className="form-control"
            placeholder={t("Enter role name")}
            value={formik.values.role_name}
            onChange={formik.handleChange}
          />
          {formik.touched.role_name && formik.errors.role_name && (
            <div style={{ color: 'red' }}>{formik.errors.role_name}</div>
          )}
        </div>

        {/* Permissions */}
        <div className="form-group mt-3">
          <div className="mb-3">
            <h5 className="text-black">{t('Permissions')}</h5>
          </div>
          <Checkbox.Group
            name="permissions"
            value={formik.values.permissions}
            onChange={handlePermissionChange}
            className="d-flex flex-column gap-2"
          >
            {Object.keys(groups).map((group) => (
              <div key={group} className="mb-3">
                <h6>{group}</h6>
                <div>
                  {groups[group].map((permission) => (
                    <Checkbox key={permission._id} value={permission._id}>
                      <span title={permission.page_url} style={{ whiteSpace: 'nowrap', color: 'gray' }}>
                        {permission.permission_name}
                      </span>
                    </Checkbox>
                  ))}
                </div>
              </div>
            ))}
          </Checkbox.Group>
        </div>

        {/* Submit */}
        <div className="form-group mt-3">
          <button
            type="submit"
            onClick={handleSubmit}
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? (
              <ClipLoader size={18} color="white" />
            ) : roleId ? t('Update') : t('Create')}
          </button>
        </div>
      </form>
    </div>
  );
};

CreateRole.propTypes = {
  initialData: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
};

export default CreateRole;
