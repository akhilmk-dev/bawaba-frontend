import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Container,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Spinner,
  Alert,
} from "reactstrap";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import axiosInstance from "pages/Utility/axiosInstance";
import { useDispatch } from "react-redux";
import { updateUserRequest } from "store/actions";
import Breadcrumb from "components/Common/Breadcrumb2";
import Cookies from "js-cookie";

const UserProfile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get(`V1/profile`);
        setUser(response.data?.data);
      } catch (err) {
        setError("Failed to fetch user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Validation Schema
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("name is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    mobile:Yup.string().required("Mobile is required"),
    whatsapp_number:Yup.string().required("whatsapp number is required")
  });

  const handleSubmit = async (values) => {
    try {
        dispatch(updateUserRequest(user?._id,{
            "name": values?.name,
            "email": values?.email,
            "mobile": values?.mobile,
            "whatsapp_number": values?.whatsapp_number,
            "role": user?.role?._id
        }))
    } catch (err) {
      setError("Failed to update user data.");
    }
  };

  if (loading) {
    return (
      <div className="page-content text-center mt-5 d-flex justify-content-center align-items-center" style={{minHeight:"100vh"}} >
        <Spinner color="primary" />
      </div>
    );
  }

  return (
    <div className="page-content mt-4">
    <div className="d-flex justify-content-between align-items-center mx-2">
        <Breadcrumb title="User Profile" breadcrumbItems={[{ title: "Dashboard", link: `/dashboard` }, { title: "Profile", link: '#' }]} />
        <Button className='bg-primary text-white d-flex justify-content-center gap-1 align-items-center' onClick={() => navigate('/dashboard')}>
            Back
        </Button>
    </div>
      {successMessage && <Alert color="success">{successMessage}</Alert>}
      <Formik
        initialValues={{
          name: user.name,
          email: user.email,
          mobile: user?.mobile,
          whatsapp_number: user?.whatsapp_number,
          role: user.role.role_name,
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ handleSubmit, isSubmitting }) => (
          <Form onSubmit={handleSubmit} className="bg-white p-3 rounded-3">
            <FormGroup>
              <Label for="name">Name</Label> <span className="text-danger">*</span>
              <Field
                name="name"
                as={Input}
                id="name"
                placeholder="Enter name"
              />
              <ErrorMessage
                name="name"
                component="div"
                className="text-danger"
              />
            </FormGroup>

            <FormGroup>
              <Label for="email">Email</Label> <span className="text-danger">*</span>
              <Field
                name="email"
                type="email"
                as={Input}
                id="email"
                placeholder="Enter email"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-danger"
              />
            </FormGroup>

            <FormGroup>
              <Label for="mobile">Mobile Number</Label> <span className="text-danger">*</span>
              <Field
                name="mobile"
                as={Input}
                id="mobile"
                placeholder="Enter phone number"
              />
              <ErrorMessage
                name="mobile"
                component="div"
                className="text-danger"
              />
            </FormGroup>

            <FormGroup>
              <Label for="whatsapp_number">Whatsapp Number</Label> <span className="text-danger">*</span>
              <Field
                name="whatsapp_number"
                as={Input}
                id="whatsapp_number"
                placeholder="Enter whatsapp number"
              />
              <ErrorMessage
                name="whatsapp_number"
                component="div"
                className="text-danger"
              />
            </FormGroup>

            <FormGroup>
              <Label for="role">Role</Label>
              <Field
                name="role"
                className="bg-secondary"
                as={Input}
                id="role"
                disabled
                readOnly
              />
            </FormGroup>

            <Button color="primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? <ClipLoader size="sm" /> : "Update"}
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default UserProfile;
