import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Card, CardBody, Container, Row, Col, Form, FormFeedback, Label, Input } from 'reactstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { ClipLoader } from 'react-spinners';
import { showError, showSuccess } from 'helpers/notification_helper';
import { BASE_URL } from 'constants/config';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import logoSm from '../../assets/images/logo-sm.png';

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  // Get email and token from query params
  const searchParams = new URLSearchParams(location.search);
  const email = searchParams.get('email');
  const token = searchParams.get('token');

  useEffect(() => {
    if (!email || !token) {
      navigate('/pages-404', { replace: true });
    }
  }, [email, token, navigate]);

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      password: '',
      password_confirmation: '',
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .required(t('Password is required'))
        .min(6, t('Password must be at least 6 characters')),
      password_confirmation: Yup.string()
        .required(t('Confirm password is required'))
        .oneOf([Yup.ref('password'), null], t('Passwords must match')),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const response = await axios.post(`${REACT_APP_BASE_URL}V1/reset-password`, {
          email,
          token,
          password: values.password,
          password_confirmation: values.password_confirmation,
        });
        if (response.status === 200) {
          showSuccess(response.data.message || t('Password reset successfully.'));
          navigate('/login');
        }
      } catch (error) {
        if (error.response) {
          if (error.response.status === 400) {
            showError(error.response.data?.errors?.password?.[0] || error.response.data?.message || t('Invalid request.'));
          } else if (error.response.status === 404) {
            showError(t('Invalid or expired reset link.'));
            navigate('/pages-404');
          } else if (error.response.status === 500) {
            showError(t('Server error. Please try again later.'));
          } else {
            showError(error.response.data?.message || t('Something went wrong.'));
          }
        } else {
          showError(t('Network error. Please try again.'));
        }
      } finally {
        setLoading(false);
      }
    },
  });
  document.title = "Reset Password | Menahub-mvec";
  return (
    <React.Fragment>
      <div className="account-pages pt-sm-5" style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={4}>
              <Card className="overflow-hidden">
                <div className="bg-primary">
                  <div className="text-primary text-center p-4">
                    <h5 className="text-white font-size-20">{t('Reset Password')}</h5>
                    <p className="text-white-50">{t('Set your new password for Menahub-mvec')}</p>
                    <Link to="/" className="logo logo-admin">
                       <img src={logoSm} alt="logo" style={{ objectFit: 'contain' }} width="70px" />
                    </Link>
                  </div>
                </div>
                <CardBody className="p-4">
                  <div className="p-3">
                    <Form className="mt-4" onSubmit={e => { e.preventDefault(); validation.handleSubmit(); return false; }}>
                      <div className="mb-3">
                        <Label className="form-label" htmlFor="password">{t('New Password')}</Label> <span className='text-danger'>*</span>
                        <Input
                          name="password"
                          type="password"
                          className="form-control"
                          placeholder={t('Enter new password')}
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.password || ''}
                          invalid={validation.touched.password && validation.errors.password ? true : false}
                        />
                        {validation.touched.password && validation.errors.password ? (
                          <FormFeedback type="invalid">{validation.errors.password}</FormFeedback>
                        ) : null}
                      </div>
                      <div className="mb-3">
                        <Label className="form-label" htmlFor="password_confirmation">{t('Confirm Password')}</Label> <span className='text-danger'>*</span>
                        <Input
                          name="password_confirmation"
                          type="password"
                          className="form-control"
                          placeholder={t('Confirm new password')}
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.password_confirmation || ''}
                          invalid={validation.touched.password_confirmation && validation.errors.password_confirmation ? true : false}
                        />
                        {validation.touched.password_confirmation && validation.errors.password_confirmation ? (
                          <FormFeedback type="invalid">{validation.errors.password_confirmation}</FormFeedback>
                        ) : null}
                      </div>
                      <div className="mb-3 row">
                        <div className="col-12 text-center">
                          <button className="btn btn-primary w-md waves-effect waves-light" type="submit" disabled={loading}>
                            {loading ? <ClipLoader size={16} color='white' /> : t('Reset Password')}
                          </button>
                        </div>
                      </div>
                    </Form>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default ResetPassword; 