import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input, Row, Col } from 'reactstrap';
import { FaSave } from 'react-icons/fa'; // Save Icon
import { GoogleMap, LoadScript, Marker, Autocomplete } from '@react-google-maps/api';
import axios from 'axios';
import { deleteAddressRequest } from 'store/actions';

const AddressModal = ({ isOpen, toggle, address, onSave }) => {
    const [formData, setFormData] = useState({
        customerId: 1,
        addressLine: '',
        area: '',
        areaDescription: '',
        blockNumber: '',
        streetNumber: '',
        houseNumber: '',
        indoorOutdoor: 1,
        latitude: '',
        longitude: '',
        landmark: '',
    });

    const [center, setCenter] = useState({ lat: 40.712776, lng: -74.005974 }); // Default location (NYC)
    const [markerPosition, setMarkerPosition] = useState({ lat: 40.712776, lng: -74.005974 });
    const autocompleteRef = useRef(null);
    const [map, setMap] = useState(null);
    const [addressValue, setAddressValue] = useState('');
     
    const onLoad = useCallback(function callback(map) {
        setMap(map);
    }, []);

    useEffect(() => {
        if (address) {
            setFormData({
                customerId: address.customerId,
                addressLine: address.addressLine || '',
                area: address.area || '',
                areaDescription: address.areaDescription || '',
                blockNumber: address.blockNumber || '',
                streetNumber: address.streetNumber || '',
                houseNumber: address.houseNumber || '',
                indoorOutdoor: address.indoorOutdoor || 1,
                latitude: address.latitude || '',
                longitude: address.longitude || '',
                landmark: address.landmark || '',
            });
            setCenter({ lat: parseFloat(address.latitude), lng: parseFloat(address.longitude) });
            setMarkerPosition({ lat: parseFloat(address.latitude), lng: parseFloat(address.longitude) });
            // getAddressFromCoordinates(Number(address?.latitude), Number(address?.longitude)).then((response) => {
            //     addressFormik.setFieldValue('location', response)
            //     setAddress(response);
            // })
            setAddressValue(address.addressLine || '');
        }
    }, [address, isOpen]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSave = () => {
        onSave(formData); // Save the address data
        toggle(); // Close the modal
    };

    const onPlaceChanged = () => {
        const place = autocompleteRef.current.getPlace();
        if (!place.geometry) {
            console.error("Returned place contains no geometry");
            return;
        } else {
            setAddressValue(place.formatted_address || '');
            setFormData({
                ...formData,
                latitude: place.geometry.location.lat(),
                longitude: place.geometry.location.lng(),
                addressLine: place.formatted_address || '',
            });
            const newCenter = {
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng(),
            };
            setMarkerPosition(newCenter);
            setCenter(newCenter);
            map.panTo(newCenter);
        }
    };

    const onMapClick = (event) => {
        const latLng = event.latLng;
        const newCenter = {
            lat: latLng.lat(),
            lng: latLng.lng(),
        };
        setMarkerPosition(newCenter);
        map.panTo(newCenter);

        // Reverse geocoding to get the address
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location: newCenter }, (results, status) => {
            if (status === "OK" && results[0]) {
                setAddressValue(results[0].formatted_address);
                setFormData({
                    ...formData,
                    latitude: newCenter.lat,
                    longitude: newCenter.lng,
                    addressLine: results[0].formatted_address,
                });
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
        setMarkerPosition(newPosition);
        setFormData({
            ...formData,
            latitude: newPosition.lat,
            longitude: newPosition.lng,
        });
    };

    const getAddressFromCoordinates = async (lat, lng) => {
        const apiKey = 'AIzaSyD_M5QYY_seLbsWsWtVtZRSpCFYUxjRoeI'; // Replace with your API key
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
        height: "300px", // Adjust the height to fit the modal's layout
        width: "100%",
    };

    return (
        <Modal isOpen={isOpen} toggle={toggle}>
            <ModalHeader toggle={toggle}>{address ? 'Edit Address' : 'Add Address'}</ModalHeader>
            <ModalBody>
                <Row>
                    <Col md={6}>
                        <FormGroup>
                            <Label for="addressLine">Address Line</Label>
                            <Input
                                type="text"
                                name="addressLine"
                                value={formData.addressLine}
                                onChange={handleInputChange}
                                placeholder="Enter Address Line"
                            />
                        </FormGroup>
                    </Col>
                    <Col md={6}>
                        <FormGroup>
                            <Label for="area">Area</Label>
                            <Input
                                type="text"
                                name="area"
                                value={formData.area}
                                onChange={handleInputChange}
                                placeholder="Enter Area"
                            />
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col md={6}>
                        <FormGroup>
                            <Label for="areaDescription">Area Description</Label>
                            <Input
                                type="text"
                                name="areaDescription"
                                value={formData.areaDescription}
                                onChange={handleInputChange}
                                placeholder="Enter Area Description"
                            />
                        </FormGroup>
                    </Col>
                    <Col md={6}>
                        <FormGroup>
                            <Label for="blockNumber">Block Number</Label>
                            <Input
                                type="text"
                                name="blockNumber"
                                value={formData.blockNumber}
                                onChange={handleInputChange}
                                placeholder="Enter Block Number"
                            />
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col md={6}>
                        <FormGroup>
                            <Label for="streetNumber">Street Number</Label>
                            <Input
                                type="text"
                                name="streetNumber"
                                value={formData.streetNumber}
                                onChange={handleInputChange}
                                placeholder="Enter Street Number"
                            />
                        </FormGroup>
                    </Col>
                    <Col md={6}>
                        <FormGroup>
                            <Label for="houseNumber">House Number</Label>
                            <Input
                                type="text"
                                name="houseNumber"
                                value={formData.houseNumber}
                                onChange={handleInputChange}
                                placeholder="Enter House Number"
                            />
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col md={6}>
                        <FormGroup>
                            <Label for="indoorOutdoor">Indoor/Outdoor</Label>
                            <Input
                                type="text"
                                name="indoorOutdoor"
                                value={formData.indoorOutdoor}
                                onChange={handleInputChange}
                                placeholder="Enter Indoor/Outdoor"
                            />
                        </FormGroup>
                    </Col>
                    <Col md={6}>
                        <FormGroup>
                            <Label for="landmark">Landmark</Label>
                            <Input
                                type="text"
                                name="landmark"
                                value={formData.landmark}
                                onChange={handleInputChange}
                                placeholder="Enter Landmark"
                            />
                        </FormGroup>
                    </Col>
                </Row>

                {/* Google Map and Autocomplete Input */}
                <Row>
                    <Col md={12}>
                        <FormGroup>
                            <Label for="map">Search Location</Label>
                            <LoadScript googleMapsApiKey="AIzaSyBdXV_BF1ffeOkXvwS6iZ6SnwMb8DOAyt4" libraries={['places']}>
                                <div>
                                    <Autocomplete
                                        onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
                                        onPlaceChanged={onPlaceChanged}
                                    >
                                        <div className="position-relative">
                                            <Input type="text" placeholder="Search for a location" />
                                        </div>
                                    </Autocomplete>
                                    <div className="position-relative">
                                        <GoogleMap
                                            mapContainerStyle={mapContainerStyle}
                                            center={center}
                                            zoom={12}
                                            onClick={onMapClick}
                                            onLoad={onLoad}
                                        >
                                            <Marker
                                                position={markerPosition}
                                                draggable
                                                onDragEnd={onMarkerDragEnd}
                                            />
                                        </GoogleMap>
                                    </div>
                                </div>
                            </LoadScript>
                        </FormGroup>
                    </Col>
                </Row>
            </ModalBody>
            <ModalFooter>
                <Button color="primary" onClick={handleSave}>
                    <FaSave /> Save
                </Button>
                <Button color="secondary" onClick={toggle}>
                    Cancel
                </Button>
            </ModalFooter>
        </Modal>
    );
};

export default AddressModal;
