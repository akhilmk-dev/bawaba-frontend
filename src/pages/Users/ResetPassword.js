import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';

const PasswordResetModal = ({ visible, handleClose, onSubmit }) => {
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const formik = useFormik({
        initialValues: {
            newPassword: '',
            confirmPassword: '',
        },
        validationSchema: Yup.object({
            newPassword: Yup.string()
                .required('New Password is required')
                .min(6, 'Password must be at least 6 characters long'),
            confirmPassword: Yup.string()
                .required('Confirm Password is required')
                .oneOf([Yup.ref('newPassword'), null], 'Passwords must match'),
        }),
        onSubmit: (values, { resetForm }) => {
            onSubmit(values?.newPassword);
            resetForm();
            handleClose();
        },
    });

    const toggleShowNewPassword = () => setShowNewPassword(!showNewPassword);
    const toggleShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

    return (
        <Modal
            title="Reset Password"
            visible={visible}
            onCancel={()=>{formik.resetForm();handleClose()}}
            footer={null}
            destroyOnClose
            centered
            width={400}
            className="custom-modal-header p-0"
            maskClosable={false}
        >
            <form onSubmit={formik.handleSubmit}>
                <div role="document">
                    <div className="row g-3">
                        {/* New Password Field */}
                        <div className="col-12 position-relative">
                            <label className="form-label ">New Password</label> <span className='text-danger'>*</span>
                            <div className="input-group">
                                <input
                                    type={showNewPassword ? 'text' : 'password'}
                                    className="form-control form-control-sm"
                                    style={{ height: '38px' }}
                                    placeholder="Enter new password"
                                    name="newPassword"
                                    value={formik.values.newPassword}
                                    onChange={formik.handleChange}
                                />
                                <span
                                    className="input-group-text cursor-pointer"
                                    onClick={toggleShowNewPassword}
                                >
                                    {showNewPassword ? <EyeOutlined />  :<EyeInvisibleOutlined />  }
                                </span>
                            </div>
                            {formik.touched.newPassword && formik.errors.newPassword && (
                                <span style={{ color: 'red' }} role="alert">
                                    {formik.errors.newPassword}
                                </span>
                            )}
                        </div>

                        {/* Confirm Password Field */}
                        <div className="col-12 position-relative">
                            <label className="form-label ">Confirm Password</label> <span className='text-danger'>*</span>
                            <div className="input-group">
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    className="form-control form-control-sm"
                                    style={{ height: '38px' }}
                                    placeholder="Confirm new password"
                                    name="confirmPassword"
                                    value={formik.values.confirmPassword}
                                    onChange={formik.handleChange}
                                />
                                <span
                                    className="input-group-text cursor-pointer"
                                    onClick={toggleShowConfirmPassword}
                                >
                                    {showConfirmPassword ? <EyeOutlined /> :<EyeInvisibleOutlined />  }
                                </span>
                            </div>
                            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                                <span style={{ color: 'red' }} role="alert">
                                    {formik.errors.confirmPassword}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="modal-footer mt-3">
                        <button type="button" className="btn btn-light btn-md" onClick={handleClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary btn-md ms-3">
                            Reset Password
                        </button>
                    </div>
                </div>
            </form>
        </Modal>
    );
};

PasswordResetModal.propTypes = {
    visible: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
};

export default PasswordResetModal;
