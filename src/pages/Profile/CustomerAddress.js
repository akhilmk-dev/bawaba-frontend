import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import axios from 'axios';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import * as Yup from 'yup'; // Import Yup for validation
import { LoadScript, Autocomplete, GoogleMap, Marker } from '@react-google-maps/api';
import {
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Card,
  CardBody,
} from 'reactstrap';
import axiosInstance from 'pages/Utility/axiosInstance';
import { useDispatch } from 'react-redux';
import { addAddressRequest, updateAddressRequest } from 'store/actions';
import Breadcrumb from 'components/Common/Breadcrumb2';


// Validation schema using Yup
const validationSchema = Yup.object({
  addressLine: Yup.string()
    .required("Address Line is required")
    .min(3, "Address Line must be at least 3 characters"),
  area: Yup.string().required("Area is required"),
  areaDescription: Yup.string().required("This field is required"),
  blockNumber: Yup.string().required("This field is required"),
  streetNumber: Yup.string().required("This field is required"),
  houseNumber: Yup.string().required("This field is required"),
  indoorOutdoor: Yup.string().required("Indoor/Outdoor is required"),
  landmark: Yup.string().required("This field is required"),
  location: Yup.string().required("Location is required"),
});

const CustomerAddress = () => {
  const { id } = useParams();
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [address, setAddress] = useState("");
  const autocompleteRef = useRef(null);
  const location = useLocation();
  const [profileData, setProfileData] = useState();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const previousLocation = location.state?.from || '/';

  const customerAddressId = new URLSearchParams(location.search).get('customerAddressId');

  const fetchCustomer = async (id) => {
    const response = await axiosInstance.get('', { params: { sp: 'usp_GetCustomerById', customerId: id } });
    setProfileData(response?.data?.Data?.[0]);
  };

  useEffect(() => {
    if (id) {
      fetchCustomer(id)
    }
  }, [id])

  const center = {
    lat: 10.850516,
    lng: 76.27108,
  };

  const onLoad = useCallback(function callback(map) {
    setMap(map);
  }, []);

  const addressFormik = useFormik({
    initialValues: {
      customerId: id,
      addressLine: "",
      area: "",
      areaDescription: "",
      blockNumber: "",
      streetNumber: "",
      houseNumber: "",
      indoorOutdoor: "",
      landmark: "",
      location: "",
    },
    validationSchema, // Add validation schema here
    onSubmit: (values) => {
      if (customerAddressId) {
        dispatch(updateAddressRequest({
          "sp": "usp_UpdateCustomerAddress",
          "customerId": id,
          "customerAddressId": customerAddressId,
          "addressLine": values?.addressLine,
          "area": values?.area,
          "areaDescription": values?.areaDescription,
          "blockNumber": values?.blockNumber,
          "streetNumber": values?.streetNumber,
          "houseNumber": values?.houseNumber,
          "indoorOutdoor": values?.indoorOutdoor == 0 ? false : true,
          "latitude": values?.latitude,
          "longitude": values?.longitude,
          "landmark": values?.landmark
        }, navigate))
      } else {
        dispatch(addAddressRequest({
          "sp": "usp_InsertCustomerAddress",
          "customerId": id,
          "addressLine": values?.addressLine,
          "area": values?.area,
          "areaDescription": values?.areaDescription,
          "blockNumber": values?.blockNumber,
          "streetNumber": values?.streetNumber,
          "houseNumber": values?.houseNumber,
          "indoorOutdoor": values?.indoorOutdoor == 0 ? false : true,
          "latitude": values?.latitude,
          "longitude": values?.longitude,
          "landmark": values?.landmark
        }, navigate))

      }
    },
  });

  const onPlaceChanged = () => {
    const place = autocompleteRef.current.getPlace();
    if (place.geometry) {
      const newCenter = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };
      setMarker(newCenter);
      addressFormik.setFieldValue("location", place.formatted_address);
      addressFormik.setFieldValue("latitude", newCenter.lat);
      addressFormik.setFieldValue("longitude", newCenter.lng);
      setAddress(place.formatted_address);
      map.panTo(newCenter);
    }
  };

  const onMapClick = (event) => {
    const latLng = event.latLng;
    const newCenter = {
      lat: latLng.lat(),
      lng: latLng.lng(),
    };
    setMarker(newCenter);
    map.panTo(newCenter);

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: newCenter }, (results, status) => {
      if (status === "OK" && results[0]) {
        setAddress(results[0].formatted_address);
        addressFormik.setFieldValue("location", results[0].formatted_address);
        addressFormik.setFieldValue("latitude", newCenter.lat);  // Set latitude in Formik
        addressFormik.setFieldValue("longitude", newCenter.lng); // Set longitude in Formik
      } else {
        console.error("Geocoder failed due to: " + status);
      }
    });
  };

  const onMarkerDragEnd = (e) => {
    const newPosition = {
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
    };
    setMarker(newPosition);
    addressFormik.setFieldValue("location", addressFormik.values.location);
    addressFormik.setFieldValue("latitude", newPosition.lat);
    addressFormik.setFieldValue("longitude", newPosition.lng);
  };

  const getAddressFromCoordinates = async (lat, lng) => {
    const apiKey = 'AIzaSyBdXV_BF1ffeOkXvwS6iZ6SnwMb8DOAyt4'; // Replace with your API key
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;

    try {
      const response = await axios.get(url);
      const results = response.data.results;
      if (results.length > 0) {
        const address = results[0].formatted_address;
        return address;
      } else {
        console.log('No address found for the given coordinates.');
      }
    } catch (error) {
      console.error('Error retrieving address:', error);
    }
  };

  const mapContainerStyle = {
    height: "200px",
    width: "100%",
  };

  useEffect(() => {
    if (customerAddressId) {
      axiosInstance.get(``, { params: { sp: "usp_GetCustomerAddressById", customerAddressId: customerAddressId } }).then((response) => {
        const data = response.data?.Data?.[0];
        if (data) {
          addressFormik.setValues({
            customerId: data.customerId,
            customerAddressId: data.customerAddressId,
            addressLine: data.addressLine,
            area: data.area,
            areaDescription: data.areaDescription,
            blockNumber: data.blockNumber,
            streetNumber: data.streetNumber,
            houseNumber: data.houseNumber,
            indoorOutdoor: data.indoorOutdoor ? "1" : "0",
            landmark: data.landmark,
            latitude: data.latitude,
            longitude: data.longitude
          });
          getAddressFromCoordinates(Number(data?.latitude), Number(data?.longitude)).then((response) => {
            addressFormik.setFieldValue('location', response)
            setAddress(response);
          })
          // setAddress(data.location);
          setMarker({ lat: Number(data.latitude), lng: Number(data.longitude) });
        }
      });
    }
  }, [customerAddressId]);

  return (
    <Row className='page-content justify-content-center w-100'>
      <div className='text-end d-flex justify-content-between align-items-center'>
        <Breadcrumb title={customerAddressId ? 'Edit Address' : 'Add Address'} breadcrumbItems={[{ title: "Dashboard", link: `/dashboard` }, { title: "Customer Profile", link: `/customerProfile/${id}` }]} />
        <Button color='primary' type='button' onClick={() => navigate(`/customerProfile/${id}`)}>Back</Button>
      </div>
      <Col md={12}>
        <Card>
          <CardBody>
            <Form onSubmit={addressFormik.handleSubmit}>
              <Row form>
                <Col md={6}>
                  <FormGroup>
                    <Label for="customerId">Customer</Label> <span className='text-danger'>*</span>
                    <Input
                      id="customerId"
                      name="customerId"
                      type="text"
                      value={profileData?.customerNameEng}
                      readOnly
                      style={{ backgroundColor: "lightgray" }}
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label for="addressLine">Address Line</Label> <span className='text-danger'>*</span>
                    <Input
                      id="addressLine"
                      name="addressLine"
                      type="text"
                      value={addressFormik.values.addressLine}
                      onChange={addressFormik.handleChange}
                      onBlur={addressFormik.handleBlur}
                      invalid={addressFormik.touched.addressLine && addressFormik.errors.addressLine}
                      placeholder='Enter the address'
                    />
                    {addressFormik.touched.addressLine && addressFormik.errors.addressLine && (
                      <div className="invalid-feedback">{addressFormik.errors.addressLine}</div>
                    )}
                  </FormGroup>

                  <FormGroup>
                    <Label for="area">Area</Label> <span className='text-danger'>*</span>
                    <Input
                      id="area"
                      name="area"
                      type="text"
                      value={addressFormik.values.area}
                      onChange={addressFormik.handleChange}
                      onBlur={addressFormik.handleBlur}
                      invalid={addressFormik.touched.area && addressFormik.errors.area}
                      placeholder='Enter the area'
                    />
                    {addressFormik.touched.area && addressFormik.errors.area && (
                      <div className="invalid-feedback">{addressFormik.errors.area}</div>
                    )}
                  </FormGroup>

                  <FormGroup>
                    <Label for="areaDescription">Area Description</Label> <span className='text-danger'>*</span>
                    <Input
                      id="areaDescription"
                      name="areaDescription"
                      type="text"
                      value={addressFormik.values.areaDescription}
                      onChange={addressFormik.handleChange}
                      onBlur={addressFormik.handleBlur}
                      invalid={addressFormik.touched.areaDescription && addressFormik.errors.areaDescription}
                      placeholder='Enter area description'
                    />
                    {addressFormik.touched.areaDescription && addressFormik.errors.areaDescription && (
                      <div className="invalid-feedback">{addressFormik.errors.areaDescription}</div>
                    )}
                  </FormGroup>

                  <FormGroup>
                    <Label for="blockNumber">Block Number</Label> <span className='text-danger'>*</span>
                    <Input
                      id="blockNumber"
                      name="blockNumber"
                      type="text"
                      value={addressFormik.values.blockNumber}
                      onChange={addressFormik.handleChange}
                      onBlur={addressFormik.handleBlur}
                      invalid={addressFormik.touched.blockNumber && addressFormik.errors.blockNumber}
                      placeholder='Enter block number'
                    />
                    {addressFormik.touched.blockNumber && addressFormik.errors.blockNumber && (
                      <div className="invalid-feedback">{addressFormik.errors.blockNumber}</div>
                    )}
                  </FormGroup>

                  <FormGroup>
                    <Label for="houseNumber">House Number</Label> <span className='text-danger'>*</span>
                    <Input
                      id="houseNumber"
                      name="houseNumber"
                      type="text"
                      value={addressFormik.values.houseNumber}
                      onChange={addressFormik.handleChange}
                      onBlur={addressFormik.handleBlur}
                      invalid={addressFormik.touched.houseNumber && addressFormik.errors.houseNumber}
                      placeholder='Enter house number'
                    />
                    {addressFormik.touched.houseNumber && addressFormik.errors.houseNumber && (
                      <div className="invalid-feedback">{addressFormik.errors.houseNumber}</div>
                    )}
                  </FormGroup>
                </Col>

                <Col md={6}>
                  <FormGroup>
                    <Label for="streetNumber">Street Number</Label> <span className='text-danger'>*</span>
                    <Input
                      id="streetNumber"
                      name="streetNumber"
                      type="text"
                      value={addressFormik.values.streetNumber}
                      onChange={addressFormik.handleChange}
                      onBlur={addressFormik.handleBlur}
                      invalid={addressFormik.touched.streetNumber && addressFormik.errors.streetNumber}
                      placeholder='Enter street number'
                    />
                    {addressFormik.touched.streetNumber && addressFormik.errors.streetNumber && (
                      <div className="invalid-feedback">{addressFormik.errors.streetNumber}</div>
                    )}
                  </FormGroup>

                  <FormGroup>
                    <Label for="indoorOutdoor">Indoor/Outdoor</Label> <span className='text-danger'>*</span>
                    <Input
                      id="indoorOutdoor"
                      name="indoorOutdoor"
                      type="select"
                      value={addressFormik.values.indoorOutdoor}
                      onChange={addressFormik.handleChange}
                      invalid={addressFormik.touched.indoorOutdoor && addressFormik.errors.indoorOutdoor}
                    >
                      <option value="">Select an option</option>
                      <option value="0">Indoor</option>
                      <option value="1">Outdoor</option>
                    </Input>
                    {addressFormik.touched.indoorOutdoor && addressFormik.errors.indoorOutdoor && (
                      <div className="invalid-feedback">{addressFormik.errors.indoorOutdoor}</div>
                    )}
                  </FormGroup>

                  <FormGroup>
                    <Label for="landmark">Landmark</Label> <span className='text-danger'>*</span>
                    <Input
                      id="landmark"
                      name="landmark"
                      type="text"
                      value={addressFormik.values.landmark}
                      onChange={addressFormik.handleChange}
                      onBlur={addressFormik.handleBlur}
                      invalid={addressFormik.touched.landmark && addressFormik.errors.landmark}
                      placeholder='Enter landmark'
                    />
                    {addressFormik.touched.landmark && addressFormik.errors.landmark && (
                      <div className="invalid-feedback">{addressFormik.errors.landmark}</div>
                    )}
                  </FormGroup>

                  <FormGroup>
                    <Label for="location">Location</Label> <span className='text-danger'>*</span>
                    <LoadScript
                      googleMapsApiKey="AIzaSyBdXV_BF1ffeOkXvwS6iZ6SnwMb8DOAyt4"
                      libraries={["places"]}
                    >
                      <Autocomplete
                        onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
                        onPlaceChanged={onPlaceChanged}
                      >
                        <Input
                          id="location"
                          name="location"
                          type="text"
                          value={addressFormik.values.location}
                          onChange={addressFormik.handleChange}
                          placeholder="Enter office location"
                          invalid={addressFormik.touched.location && addressFormik.errors.location}
                        />
                      </Autocomplete>
                      {addressFormik.touched.location && addressFormik.errors.location && (
                        <div className="invalid-feedback">{addressFormik.errors.location}</div>
                      )}
                      <GoogleMap
                        id="map"
                        mapContainerStyle={mapContainerStyle}
                        zoom={15}
                        center={marker || center}
                        onLoad={onLoad}
                        onClick={onMapClick}
                      >
                        {marker && (
                          <Marker
                            position={marker}
                            draggable={true}
                            onDragEnd={onMarkerDragEnd}
                          />
                        )}
                      </GoogleMap>
                      <Input
                        type="text"
                        value={address}
                        readOnly
                        placeholder="Selected location..."
                        className="mt-2"
                      />
                    </LoadScript>
                  </FormGroup>
                </Col>
              </Row>

              <Button color="primary" type="submit">
                {customerAddressId ? "Update Address" : "Save Address"}
              </Button>
            </Form>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default CustomerAddress;
