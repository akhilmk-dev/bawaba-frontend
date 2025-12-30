import PropTypes from 'prop-types';
import React, { useState, useEffect } from "react";

import { Row, Col, CardBody, Card, Container, Label, Form, FormFeedback, Input, Alert } from "reactstrap";

// Redux
import { connect, useSelector, useDispatch } from "react-redux";
import { Link, useNavigate, useParams } from 'react-router-dom';
import withRouter from 'components/Common/withRouter';
import Cookies from 'js-cookie';

// Formik validation
import * as Yup from "yup";
import { useFormik } from "formik";

// actions
import { loginUser, apiError, login, userForgetPassword } from "../../store/actions";
import { ClipLoader } from 'react-spinners';

// import images
import logoSm from "../../assets/images/logo-sm.png";

// Importing eye icons for password visibility toggle
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useTranslation } from 'react-i18next';
// import { process.env.BASE_URL } from 'constants/config';
import axios from 'axios';
import { showError, showSuccess } from 'helpers/notification_helper';

const Login = props => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector(state => state?.Login);
  const { forgetSuccessMsg, forgetError } = useSelector(state => state?.ForgetPassword || {});
  const { t } = useTranslation();

  const [showPassword, setShowPassword] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);

  useEffect(() => {
    if (Cookies.get('access_token')) {
      navigate('/dashboard')
    }
  }, [])

  useEffect(() => {
    if (forgetSuccessMsg) {
      setShowForgot(false);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 4000);
    }
  }, [forgetSuccessMsg]);

  // Login formik
  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .required("Email is required")
        .matches(
          /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/,
          "Please enter a valid email address"
        ),
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: (values) => {
      dispatch(login({
        email: values?.email,
        password: values?.password
      }, navigate));
    }
  });

  // Forgot password formik
  const forgotValidation = useFormik({
    enableReinitialize: true,
    initialValues: {
      email: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .required("Email is required")
        .matches(
          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
          "Invalid email address"
        ),
    }),
    onSubmit: async (values, { resetForm }) => {
      setForgotLoading(true);
      try {
        const response = await axios.post(`${process.env.REACT_APP_BASE_URL}V1/forgot-password`, values);
        if (response.status === 200) {
          showSuccess(response.data.message);
          resetForm();
          setShowForgot(false)
        }
      } catch (error) {
        if (error.status == 400) {
          showError(error.response.data.errors.email[0])
        } else {
          showError("Something went wrong");
        }
      } finally {
        setForgotLoading(false);
      }
    }
  });

  document.title = "Login | Menahub-mvec";
  return (
    <React.Fragment>
      <div className="account-pages  pt-sm-5" style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={4}>
              <Card className="overflow-hidden">
                <div className="bg-primary">
                  <div className="text-primary text-center p-4">
                    <h5 className="text-white font-size-20">
                      {showForgot ? t('Forgot Password') : t('Welcome !')}
                    </h5>
                    <p className="text-white-50">
                      {!showForgot && t('Sign in to continue to Menahub-mvec')}
                    </p>
                    <Link to="/" className="logo logo-admin">
                      <img src={logoSm} alt="logo" style={{ objectFit: "contain" }} width="70px" />
                    </Link>
                  </div>
                </div>
                <CardBody className="p-4">
                  <div className="p-3">
                    {showNotification && (
                      <Alert color="success" className="text-center">
                        {forgetSuccessMsg}
                      </Alert>
                    )}
                    {forgetError && showForgot && (
                      <Alert color="danger" className="text-center">
                        {forgetError}
                      </Alert>
                    )}
                    {!showForgot ? (
                      <Form className="mt-4"
                        onSubmit={(e) => {
                          e.preventDefault();
                          validation.handleSubmit();
                          return false;
                        }}
                        action="#">
                        <div className="mb-3">
                          <Label className="form-label" htmlFor="username">{t('Email')}</Label> <span className='text-danger'>*</span>
                          <Input
                            name="email"
                            className="form-control"
                            placeholder={t("Enter your email")}
                            type="email"
                            id="username"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.email || ""}
                            invalid={
                              validation.touched.email && validation.errors.email ? true : false
                            }
                          />
                          {validation.touched.email && validation.errors.email ? (
                            <FormFeedback type="invalid">{validation.errors.email}</FormFeedback>
                          ) : null}
                        </div>
                        <div className="mb-3 " style={{ width: "100%" }}>
                          <Label style={{ fontSize: "13px" }} htmlFor="userpassword">{t('Password')}</Label>
                          <div className="input-group d-flex align-items-center gap-1" style={{ marginTop: "-6px" }}>
                            <div style={{ flex: 1 }}>
                              <Input
                                name="password"
                                value={validation.values.password || ""}
                                type={showPassword ? "text" : "password"}
                                className="form-control"
                                placeholder={t("Enter Password")}
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                invalid={
                                  validation.touched.password && validation.errors.password ? true : false
                                }
                                style={{ fontSize: '13px' }}
                              />
                              {validation.touched.password && validation.errors.password ? (
                                <FormFeedback type="invalid">{validation.errors.password}</FormFeedback>) : null}
                            </div>
                            <div className="input-group-append" style={{ marginBottom: `${validation.errors.password ? "20px" : "0px"}` }}>
                              <button
                                type="button"
                                className="input-group-text"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? <AiFillEye size={20} /> : <AiFillEyeInvisible size={20} />}
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="mb-3 row">
                          <div className="col-12 text-center">
                            <button className="btn btn-primary w-md waves-effect waves-light" type="submit">
                              {loading ? <ClipLoader size={16} color='white' /> : "Log In"}
                            </button>
                          </div>
                        </div>
                        <div className="mb-3 row">
                          <div className="col-12 text-center">
                            <button type="button" className="btn btn-link p-0" onClick={() => setShowForgot(true)}>
                              {t('Forgot Password?')}
                            </button>
                          </div>
                        </div>
                      </Form>
                    ) : (
                      <Form className="mt-4"
                        onSubmit={(e) => {
                          e.preventDefault();
                          forgotValidation.handleSubmit();
                          return false;
                        }}
                        action="#">
                        <div className="mb-3">
                          <Label className="form-label" htmlFor="forgot-email">{t('Email')}</Label> <span className='text-danger'>*</span>
                          <Input
                            name="email"
                            className="form-control"
                            placeholder={t("Enter your email")}
                            type="email"
                            id="forgot-email"
                            onChange={forgotValidation.handleChange}
                            onBlur={forgotValidation.handleBlur}
                            value={forgotValidation.values.email || ""}
                            invalid={
                              forgotValidation.touched.email && forgotValidation.errors.email ? true : false
                            }
                          />
                          {forgotValidation.touched.email && forgotValidation.errors.email ? (
                            <FormFeedback type="invalid">{forgotValidation.errors.email}</FormFeedback>
                          ) : null}
                        </div>
                        <div className="mb-3 row d-flex align-items-center justify-content-between">
                          <div className="col-6 text-start">
                            <button type="button" className="btn btn-link p-0" onClick={() => setShowForgot(false)}>
                              {t('Back to Login')}
                            </button>
                          </div>
                          <div className="col-6 text-end">
                            <button className="btn btn-primary w-md waves-effect waves-light" type="submit" disabled={forgotLoading}>
                              {forgotLoading ? <ClipLoader size={16} color='white' /> : t('Continue')}
                            </button>
                          </div>
                        </div>
                      </Form>
                    )}
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

const mapStateToProps = state => {
  const { error } = state.Login;
  return { error };
};

export default withRouter(
  connect(mapStateToProps, { login })(Login)
);

Login.propTypes = {
  error: PropTypes.any,
  history: PropTypes.object,
  loginUser: PropTypes.func,
};
