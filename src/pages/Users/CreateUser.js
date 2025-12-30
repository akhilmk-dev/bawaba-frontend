import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { addUserRequest, getRoles, updateUserRequest } from 'store/actions'; // Adjust if needed
import { useLocation, useNavigate } from 'react-router-dom';
import axiosInstance from 'pages/Utility/axiosInstance';
import Breadcrumb from 'components/Common/Breadcrumb2';
import { Button } from 'reactstrap';

const CreateUserPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const error = useSelector((state) => state.User.error);
    const { roles } = useSelector((state) => state.Role);
    const [initialData, setInitialData] = useState();
    const [fileUpdated, setFileUpdated] = useState(false);
    const [selectedRole, setSelectedRole] = useState();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    useEffect(() => {
        dispatch(getRoles());
    }, [dispatch]);

    const fetchData = async () => {
        try {
            const response = await axiosInstance.get(`V1/users/${queryParams?.get('id')}`)
            setInitialData(response?.data?.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (queryParams?.get('id')) {
            fetchData()
        }
    }, [queryParams?.get('id')]);

    const roleOptions = roles?.data?.map(role => ({
        value: role._id,
        label: role.role_name,
    })) || [];

    const isVendor = selectedRole?.label?.toLowerCase() === 'vendor';

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            name: initialData?.name || '',
            email: initialData?.email || '',
            mobile: initialData?.mobile || '',
            whatsapp_number: initialData?.whatsapp_number || "",
            password: '',
            role: initialData?.role|| '',
            store_name: initialData?.store_name || '',
            business_name: initialData?.business_name || '',
            id_proof_number: initialData?.id_proof_number || '',
            id_proof_file: initialData?.id_proof_file || '',
            tl_number: initialData?.tl_number || '',
            vat_number: initialData?.vat_number || '',
            corporate_address: initialData?.corporate_address || '',
            bank_name: initialData?.bank_name || '',
            bank_branch: initialData?.bank_branch || '',
            account_name: initialData?.account_name || '',
            account_number: initialData?.account_number || '',
            iban: initialData?.iban || ''
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Name is required'),
            email: Yup.string().email('Invalid email address').required('Email is required'),
            mobile: Yup.string().required("Mobile number is required"),
            whatsapp_number: Yup.string().required("WhatsApp number is required"),
            password: initialData
                ? Yup.string()
                : Yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
            role: Yup.string().required('Role is required'),
            ...(selectedRole?.label?.toLowerCase() === 'vendor' && {
                store_name: Yup.string().required('Store name is required'),
                business_name: Yup.string().required('Business name is required'),
                id_proof_number: Yup.string().required('ID proof number is required'),
                id_proof_file: Yup.string().required('ID proof file is required'),
                tl_number: Yup.string().required('Trade License number is required'),
                vat_number: Yup.string().required('VAT number is required'),
                corporate_address: Yup.string().required('Corporate address is required'),
                bank_name: Yup.string().required('Bank name is required'),
                bank_branch: Yup.string().required('Bank branch is required'),
                account_name: Yup.string().required('Account name is required'),
                account_number: Yup.string().required('Account number is required'),
                iban: Yup.string().required('IBAN is required'),
            })
        }),
        onSubmit: (values,{resetForm}) => {
            const payload = { ...values };
            const handleSubmit =()=>{
                resetForm();
                navigate('/users')
            }
        
            // If editing and file is NOT updated, send null for id_proof_file
            if (initialData && !fileUpdated) {
                payload.id_proof_file = null;
            }
        
            if (!initialData) {
                if (selectedRole?.label?.toLowerCase() === "vendor") {
                    dispatch(addUserRequest(payload, handleSubmit));
                } else {
                    dispatch(addUserRequest({
                        name: payload?.name,
                        email: payload?.email,
                        mobile: payload?.mobile,
                        whatsapp_number: payload?.whatsapp_number,
                        password: payload?.password,
                        role: payload?.role
                    }, handleSubmit));
                }
        
            } else {
                if (selectedRole?.label?.toLowerCase() === "vendor") {
                    dispatch(updateUserRequest(initialData._id, payload, handleSubmit));
                } else {
                    dispatch(updateUserRequest(initialData._id, {
                        name: payload?.name,
                        email: payload?.email,
                        mobile: payload?.mobile,
                        whatsapp_number: payload?.whatsapp_number,
                        role: payload?.role
                    }, handleSubmit));
                }
            }
        }
        ,
    });

    useEffect(() => {
        const foundRole = roleOptions.find(option => option.value === formik.values.role);
        setSelectedRole(foundRole || null);
    }, [formik.values.role,roles]);

    return (
        <div className="container page-content mt-4">
            <div className="d-flex justify-content-between align-items-center ms-2 mb-3">
                <Breadcrumb
                    title={initialData ? 'Edit User' : 'Create New User'}
                    breadcrumbItems={[
                        { title: 'Dashboard', link: '/dashboard' },
                        { title: 'Users', link: '/users' }
                    ]}
                />
                <Button className="text-white bg-primary" onClick={() => navigate('/users')}>
                ←  {'Back'}
                </Button>
            </div>
            <div className="bg-white p-4" style={{ minHeight: "600px" }}>
                <h4>{initialData ? 'Edit User' : 'Create New User'}</h4>
                <form onSubmit={formik.handleSubmit}>
                    <div className="row g-3 mt-2">

                        {/* Basic Fields */}
                        {[
                            ['name', 'Name'],
                            ['email', 'Email', 'email'],
                            ['mobile', 'Mobile number'],
                            ['whatsapp_number', 'Whatsapp number']
                        ].map(([field, label, type = 'text']) => (
                            <div className="col-md-6 col-12" key={field}>
                                <label className="form-label">{label} <span className="text-danger">*</span></label>
                                <input
                                    type={type}
                                    className="form-control"
                                    placeholder={`Enter ${label.toLowerCase()}`}
                                    name={field}
                                    value={formik.values[field]}
                                    onChange={formik.handleChange}
                                />
                                {formik.touched[field] && formik.errors[field] && (
                                    <span className="text-danger">{formik.errors[field]}</span>
                                )}
                                {error?.[field]?.[0] && <span className="text-danger">{error?.[field]?.[0]}</span>}
                            </div>
                        ))}

                        <div className="col-md-6 col-12">
                            <label className="form-label">Role <span className="text-danger">*</span></label>
                            <Select
                                options={roleOptions}
                                name="role"
                                value={roleOptions.find(option => option.value === formik.values?.role) || null}
                                onChange={option => {
                                    formik.setFieldValue('role', option?.value || '');
                                    setSelectedRole(option);
                                }}
                                onBlur={() => formik.setFieldTouched('role', true)}
                                classNamePrefix="react-select"
                                isClearable={true}
                            />
                            {formik.touched.role && formik.errors.role && (
                                <span className="text-danger">{formik.errors.role}</span>
                            )}
                        </div>

                        {!initialData && (
                            <div className="col-md-6 col-12 position-relative">
                                <label className="form-label">Password <span className="text-danger">*</span></label>
                                <div className="input-group">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        className="form-control"
                                        placeholder="Enter password"
                                        name="password"
                                        value={formik.values.password}
                                        onChange={formik.handleChange}
                                    />
                                    <span
                                        className="input-group-text"
                                        style={{ cursor: "pointer" }}
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                                    </span>
                                </div>
                                {formik.touched.password && formik.errors.password && (
                                    <span className="text-danger">{formik.errors.password}</span>
                                )}
                            </div>
                        )}

                        {/* Vendor Fields */}
                        {selectedRole?.label?.toLowerCase() === 'vendor' && (
                            <>
                                {[
                                    ['store_name', 'Store Name'],
                                    ['business_name', 'Business Name'],
                                    ['id_proof_number', 'ID Proof Number'],
                                    ['tl_number', 'Trade License Number'],
                                    ['vat_number', 'VAT Number'],
                                    ['corporate_address', 'Corporate Address'],
                                    ['bank_name', 'Bank Name'],
                                    ['bank_branch', 'Bank Branch'],
                                    ['account_name', 'Account Name'],
                                    ['account_number', 'Account Number'],
                                    ['iban', 'IBAN']
                                ].map(([field, label]) => (
                                    <div className="col-12 col-md-6" key={field}>
                                        <label className="form-label">{label} <span className="text-danger">*</span></label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name={field}
                                            value={formik.values[field]}
                                            onChange={formik.handleChange}
                                            placeholder={`Enter ${label.toLowerCase()}`}
                                        />
                                        {formik.touched[field] && formik.errors[field] && (
                                            <span className="text-danger">{formik.errors[field]}</span>
                                        )}
                                    </div>
                                ))}
                                <div className="col-12 col-md-6">
                                    <label className="form-label">ID Proof File <span className="text-danger">*</span> {initialData?.id_proof_file && <a  target="_blank" href={`http://localhost:3002${initialData?.id_proof_file}`}>( View existing file )</a>}</label>
                                    <input
                                        type="file"
                                        accept="image/*,.pdf"
                                        className="form-control"
                                        onChange={async (e) => {
                                            const file = e.currentTarget.files[0];
                                            if (file) {
                                                const reader = new FileReader();
                                                reader.onloadend = () => {
                                                    formik.setFieldValue("id_proof_file", reader.result);
                                                    setFileUpdated(true);
                                                };
                                                reader.readAsDataURL(file);
                                            }
                                        }}
                                    />
                                    {formik.touched.id_proof_file && formik.errors.id_proof_file && (
                                        <span className="text-danger">{formik.errors.id_proof_file}</span>
                                    )}
                                </div>

                            </>
                        )}
                    </div>

                    <div className="d-flex justify-content-end mt-4">
                        <button type="button" className="btn btn-light me-2" onClick={() => navigate(-1)}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                            {initialData ? 'Update' : 'Create'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

CreateUserPage.propTypes = {
    initialData: PropTypes.object,
    onSubmit: PropTypes.func.isRequired,
};

export default CreateUserPage;
