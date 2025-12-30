import React, { useEffect, useState } from 'react';
import { Button, Col, Row, Card, CardBody, CardFooter } from 'reactstrap';
import { FaEdit, FaTrashAlt } from 'react-icons/fa'; // For Edit and Delete icons
import AddressModal from './AddressModal'; // Assuming you save the modal in the same directory
import { useDispatch, useSelector } from 'react-redux';
import axiosInstance from 'pages/Utility/axiosInstance';
import { deleteAddressRequest, fetchAddressesRequest } from 'store/actions';
import { useNavigate, useParams } from 'react-router-dom';
import Breadcrumb from 'components/Common/Breadcrumb2';
import DUMMY_USER_IMG from '../../assets/images/dummyUser.jpg'
import { FaUserCircle } from "react-icons/fa";
import { FaPhoneAlt } from "react-icons/fa";
import { FaFileContract } from "react-icons/fa6";
import { RiContractLine } from "react-icons/ri";
import { FaHashtag } from "react-icons/fa";
import ConfirmationModal from 'components/Modals/ConfirmationModal';
import { showError } from 'helpers/notification_helper';

const CustomerProfile = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const permissions2 = []
      

    // const queryParams = new URLSearchParams(location.search);
    const addresses = useSelector(state => state.Address.addresses)
    const { id } = useParams();
    const [profileData, setProfileData] = useState();
     const [openModal, setOpenModal] = useState(false);
          const [deleteId, setDeleteId] = useState(false);
          const [confirmAction, setConfirmAction] = useState(false);
          const handleDelete = (customerAddressId) => {
            dispatch(deleteAddressRequest(customerAddressId))
            setDeleteId('');
            setOpenModal(false);
            setConfirmAction(false);
            fetchAddressesRequest(id)
            navigate(`/customerProfile/${id}`)
          };
        
          useEffect(() => {
            if (deleteId && confirmAction) {
              handleDelete(deleteId);
            }
          }, [deleteId, confirmAction]);
    

    const fetchCustomer = async (id) => {
        const response = await axiosInstance.get('', { params: { sp: 'usp_GetCustomerById', customerId: id } });
        setProfileData(response?.data?.Data?.[0]);
    };

    useEffect(() => {
        if (id) {
            fetchCustomer(id)
        }
    }, [id])

    useEffect(() => {
       if(id){
        dispatch(fetchAddressesRequest(id))
       }
    }, [id])

    const handleWorkOrder = ()=>{
        if(addresses?.Data?.length <=0){
            showError("Please add atleast one address")
        }else{
            navigate(`/createWorkOrder/?id=${id}`)
        }
    }

    const handleSiteSurvey = ()=>{
        if(addresses?.Data?.length <=0){
            showError("Please add atleast one address")
        }else{
            navigate(`/createSiteSurvey/?id=${id}`)
        }
    }

    return (
        <>
        <ConfirmationModal
        okText={"Confirm"}
        onCancel={() => { setDeleteId(''); setOpenModal(false); }}
        onOk={() => { setConfirmAction(true); }}
        isVisible={openModal}
        title="Delete Customer Address"
        content="Are you sure you want to delete this Address?"
      />
        <div className="container page-content mt-3">
            <div className='d-flex justify-content-between align-items-center'>
                <Breadcrumb title={"Customer Profile"} breadcrumbItems={[{ title: "Dashboard", link: `/dashboard` }, { title: "Customers", link: `/customers` },{title:"Customer Profile",link:"#"}]} />
                <Button color='primary' onClick={()=>navigate(`/customers`)}>Back</Button>
            </div>
            {/* Profile Section */}
            <Row className='mb-3 py-3 mx-3' style={{ border: "1px solid lightgray", borderRadius: "8px" }}>
                <Col md={4} className="text-center d-flex justify-content-center align-items-center">
                    {/* Dummy Profile Picture */}
                    <img
                        src={DUMMY_USER_IMG}
                        alt="Profile"
                        className="rounded-circle"
                        style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                    />
                </Col> 
                <Col md={8}>
                    <Row className=" d-flex align-items-center">
                        <Col xs={6}>
                            <div className='d-flex align-items-center gap-2' >
                                <div className='p-2' style={{backgroundColor:"lightgray",borderRadius:"50%"}}>
                                   <FaUserCircle size={25}/>
                                </div>
                                <div className='d-flex  justify-content-center align-items-center' >
                                   <div className='mt-3'>
                                    <h6 className='text-black' style={{ fontWeight: "bold" }}>Customer Name: </h6>
                                    <p className='ms-1'>{profileData?.customerNameEng}</p>
                                   </div>
                                </div>
                               
                            </div>
                        </Col>
                        <Col xs={6}>
                            <div className='d-flex align-items-center gap-2' >
                                <div className='p-2' style={{backgroundColor:"lightgray",borderRadius:"50%"}}>
                                   <RiContractLine size={23}/>
                                </div>
                                <div className='d-flex  justify-content-center align-items-center' >
                                   <div className='mt-3'>
                                    <h6 className='text-black' style={{ fontWeight: "bold" }}>Contract Number:  </h6>
                                    <p className='ms-1'>{profileData?.contractNumber}</p>
                                   </div>
                                </div>
                               
                            </div>
                        </Col>
                        <Col xs={6}>
                            <div className='d-flex align-items-center gap-2' >
                                <div className='p-2' style={{backgroundColor:"lightgray",borderRadius:"50%"}}>
                                   <FaFileContract size={23}/>
                                </div>
                                <div className='d-flex  justify-content-center align-items-center' >
                                   <div className='mt-3'>
                                    <h6 className='text-black' style={{ fontWeight: "bold" }}>ContractId:  </h6>
                                    <p className='ms-1'>{profileData?.contractId}</p>
                                   </div>
                                </div>
                               
                            </div>
                        </Col>
                        
                        
                        <Col xs={6}>
                            <div className='d-flex align-items-center gap-2' >
                                <div className='p-2' style={{backgroundColor:"lightgray",borderRadius:"50%"}}>
                                   <FaHashtag size={23}/>
                                </div>
                                <div className='d-flex  justify-content-center align-items-center' >
                                   <div className='mt-3'>
                                    <h6 className='text-black' style={{ fontWeight: "bold" }}>Suscriber Number:</h6>
                                    <p className='ms-1'>{profileData?.subscriberNumber}</p>
                                   </div>
                                </div>
                               
                            </div>
                        </Col>
                        <Col xs={6}>
                            <div className='d-flex align-items-center gap-2' >
                                <div className='p-2' style={{backgroundColor:"lightgray",borderRadius:"50%"}}>
                                   <FaPhoneAlt size={23}/>
                                </div>
                                <div className='d-flex  justify-content-center align-items-center' >
                                   <div className='mt-3'>
                                    <h6 className='text-black' style={{ fontWeight: "bold" }}>Contact Number 1: </h6>
                                    <p className='ms-1'>{profileData?.contactNumber1}</p>
                                   </div>
                                </div>
                               
                            </div>
                        </Col>
                        <Col xs={6}>
                            {profileData?.contactNumber2 && <div className='d-flex align-items-center gap-2' >
                                <div className='p-2' style={{backgroundColor:"lightgray",borderRadius:"50%"}}>
                                   <FaPhoneAlt size={23}/>
                                </div>
                                <div className='d-flex  justify-content-center align-items-center' >
                                   <div className='mt-3'>
                                    <h6 className='text-black' style={{ fontWeight: "bold" }}>Contract Number 2:  </h6>
                                    <p className='ms-1'>{profileData?.contactNumber2}</p>
                                   </div>
                                </div>
                               
                            </div>}
                        </Col>
                    </Row>
                    {/* Edit Button */}
                    <div className='text-end'>
                         {permissions2?.map(item => item?.permissionName)?.includes("Add SiteSurvey") && (
                        <Button color='primary me-2' onClick={handleSiteSurvey}>Create Site Survey</Button>)}
                         {permissions2?.map(item => item?.permissionName)?.includes("Add Work Orders") && (
                        <Button color='primary me-2' onClick={handleWorkOrder}>Create Work Order</Button>)}
                        <Button color="primary " onClick={()=>navigate(`/createCustomer?id=${id}`,{ state: { from: window.location.pathname } })}>
                            <FaEdit style={{marginBottom:'3px'}}/> Edit
                        </Button>
                    </div>
                </Col>
            </Row>

            <div className='p-3 mx-3 my-3' style={{ border: "1px solid lightgray", borderRadius: "8px" }}>
                {/* Address Section */}
                <Row>
                    <Col className="d-flex justify-content-end">
                        <Button color="primary" onClick={() => navigate(`/customerAddress/${id}`,{ state: { from: window.location.pathname } })}>
                            Add New Address
                        </Button>
                    </Col>
                </Row>

                {/* List of Addresses */}
                <Row className="mt-3">
                    {addresses?.Data?.length <=0 && <div className='d-flex justify-content-center'><h6 className='text-cener'>No Address Found</h6></div>}
                    { addresses?.Data?.length >0 && addresses?.Data?.map((address) => (
                        <Col md={4} key={address.customerAddressId} className="mb-3">
                            <Card>
                                <CardBody>
                                    <h5>Address #{address.customerAddressId}</h5>
                                    <p className='mb-0'>{address.addressLine},{address.area}</p>
                                    <p className='mb-0'>{address.areaDescription}</p>
                                    <p>{address.landmark}</p>

                                    <Button color="primary me-3" title='Edit' onClick={() => navigate(`/customerAddress/${id}/?customerAddressId=${address?.customerAddressId}`)}>
                                        <FaEdit  style={{marginBottom:'3px'}}/> Edit
                                    </Button>
                                    <Button color="danger" title='Delete' onClick={() => { setDeleteId(address?.customerAddressId); setOpenModal(true); }}>
                                        <FaTrashAlt  style={{marginBottom:'3px'}}/> Delete
                                    </Button>
                                </CardBody>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </div>

        </div>
      </>
    );
};

export default CustomerProfile;
