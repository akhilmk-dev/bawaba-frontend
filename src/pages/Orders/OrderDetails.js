import axios from "axios";
import { quantity } from "chartist";
import OrderTimeline from "components/Timelines/OrderTimeline";
import { formatISOToDDMMYYYY } from "helpers/dateFormat_helper";
import { showSuccess } from "helpers/notification_helper";
import axiosInstance from "pages/Utility/axiosInstance";
import React, { useEffect, useState } from "react";
import { FaRegSquare, FaSquare } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  Table,
  Button,
} from "reactstrap";

const OrderDetailsPage = () => {
  const { id } = useParams();
  const [orderDetails, setOrderDetails] = useState();
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const fetchRoleData = async () => {
    try {
      const response = await axiosInstance.get(`V1/orders/all/${id}`);
      setOrderDetails(response?.data?.data)
    } catch (error) {
      console.log(error);
    }
  }
  
  const fulfilOrder = async () => {
   try {
    const response = await axiosInstance.post('V1/orders/fulfilled',orderDetails);
     setOrderDetails(response?.data?.data);
     showSuccess("Fulfillment successfull");
   } catch (error) {
    console.log(error)
   }
  }
  
  const fulfillSingleItem = async(data)=>{
    try {
      const response = await axiosInstance.post('/V1/orders/fulfillSingleItem',data);
      setOrderDetails(response?.data?.data);
      showSuccess("Fulfillment successfull");
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (id) {
      fetchRoleData();
    }
  }, [id])


  return (
    <div className="page-content">
      <Container fluid className="py-4">
        <Row className="align-items-center mb-3">
          <Col><h3>Order Details</h3></Col>
          <Col className="text-end">
            <Button color="warning" onClick={() => navigate('/orders')}>
              ← Back
            </Button>
          </Col>
        </Row>

        {/* Fulfillment Order Info & Shipping Info */}
        <Row className="mb-4">
          <Col md={6}>
            <Card>
              <CardBody>
                <CardTitle tag="h5" className="py-2 px-2 d-flex justify-content-between" style={{ backgroundColor: "#F0F0F0" }}>
                  <span>Fulfillment Order Information</span>
                  <span className="py-1 px-3" style={{ backgroundColor: `${orderDetails?.fulfillment_status?.toLowerCase() === "fulfilled" ? "#0000000f" : "#FFD700"}`, borderRadius: "15px", fontSize: "14px" }}>{orderDetails?.fulfillment_status?.toLowerCase() === "fulfilled" ? <FaSquare className="mb-1 me-1" size={10}/> :<FaRegSquare size={10} className="mb-1 me-1" /> }{orderDetails?.fulfillment_status?.toLowerCase() ?  orderDetails?.fulfillment_status : " Unfulfilled"}</span>
                </CardTitle>
                <ul className="list-unstyled mb-0 px-2">
                  <li className="row lh-lg "><strong className="col-3 text-nowrap">Order ID :</strong> <span className="col-9">{orderDetails?.name}</span></li>
                  <li className="row lh-lg "><strong className="col-3 text-nowrap">Creation Date :</strong> <span className="col-9">{formatISOToDDMMYYYY(orderDetails?.created_at)}</span></li>
                  <li className="row lh-lg"><strong className="col-3 text-nowrap">Status :</strong> <span className="col-9">{orderDetails?.financial_status}</span></li>
                  <li className="row lh-lg"><strong className="col-3 text-nowrap">Remarks :</strong> <span className="col-9">{orderDetails?.remarks}</span></li>
                  <li className="row lh-lg"><strong className="col-3 text-nowrap">Due Date :</strong> <span className="col-9">{orderDetails?.dueDate}</span></li>
                </ul>
                {(orderDetails?.line_items?.filter(item=>!item?.fulfillment_status)?.length >0 && !orderDetails?.cancelled_at) && <div className="d-flex justify-content-end  text-white px-3"><button className="text-white px-3" onClick={()=>fulfilOrder()} style={{ backgroundColor: "#303030", borderRadius: "10px" }}>Fulfill items</button></div>}
              </CardBody>
            </Card>
          </Col>

          <Col md={6}>
            <Card>
              <CardBody>
                <CardTitle tag="h5" className="py-2 px-2" style={{ backgroundColor: "#F0F0F0" }}>Shipping Information</CardTitle>
                <ul className="list-unstyled mb-0 px-2">
                  <li className="row lh-lg"><strong className="col-3 text-nowrap">Customer Name :</strong> <span className="col-9">{orderDetails?.customer?.first_name + " " + orderDetails?.customer?.last_name}</span></li>
                  <li className="row lh-lg"><strong className="col-3 text-nowrap">Customer Phone :</strong> <span className="col-9">{orderDetails?.customer?.phone || "N/A"}</span></li>
                  <li className="row lh-lg"><strong className="col-3 text-nowrap">Customer Email :</strong> <span className="col-9">{orderDetails?.customer?.email || "N/A"}</span></li>
                  <li className="row lh-lg">
                    <strong className="col-3 text-nowrap">Delivery Note :</strong>{" "}
                    <a href={orderDetails?.deliveryNoteUrl} target="_blank" className="col-9" rel="noreferrer">Download</a>
                  </li>
                  <li className="row lh-lg"><strong className="col-3 text-nowrap">Shipping Address :</strong> <span className="col-9">{orderDetails?.shipping_address?.address1 + `${orderDetails?.shipping_address?.address2 ? ', ' + orderDetails?.shipping_address?.address2 : ""}${orderDetails?.shipping_address?.city ? ', ' + orderDetails?.shipping_address?.city : ''}${orderDetails?.shipping_address?.country ? ', ' + orderDetails?.shipping_address?.country : ''}`}</span></li>
                </ul>
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* Fulfillment Items */}
        {orderDetails?.line_items?.length > 0 && <Row className="mb-4">
          <Col>
            <Card>
              <CardBody>
                <CardTitle tag="h5" className="py-2 px-3" style={{ backgroundColor: "#F0F0F0" }}>{orderDetails?.cancelled_at ? `Removed (${orderDetails?.line_items?.reduce((total,item)=>total+item?.quantity,0)})`:"Fulfillment Order Items"}</CardTitle>
                <Table responsive bordered hover>
                  <thead className="table-light">
                    <tr>
                      <th>Item</th>
                      <th>Quantity</th>
                      <th>Price</th>
                      <th>Status</th>
                      {(!orderDetails?.cancelled_at || orderDetails?.line_items?.filter(item=>!item?.fulfillment_status)?.length >0 )&& <th>Action</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {orderDetails?.line_items?.map((item, idx) => (
                      <tr key={idx}>
                        <td className="d-flex align-items-center gap-2">
                          {/* <img
                          src={item?.image}
                          alt={item?.name}
                          width="40"
                          height="40"
                          style={{ objectFit: "cover", borderRadius: "4px" }}
                        /> */}
                        <span>{item?.name}</span>
                        </td>
                        <td>{item?.quantity}</td>
                        <td>{orderDetails?.currency} {item?.price}</td>
                        <td>{orderDetails?.financial_status}</td>
                         {(!item?.fulfillment_status && !orderDetails?.cancelled_at)&& <td><button className="text-white px-3" style={{ backgroundColor: "#303030", borderRadius: "10px" }}  onClick={()=>fulfillSingleItem({fulfillment_id:orderDetails?.fulfillment_id, fulfillment_item_id:item?.fulfillment_item_id, quantity:item?.quantity, order_id:orderDetails?.order_id,title:item?.name})}>Fulfill item</button></td>}
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>}

        {(orderDetails?.removed_line_items?.length > 0 && !orderDetails?.created_at)&& <Row className="mb-2">
          <Col>
            <Card>
              <CardBody>
                <CardTitle tag="h5" className="py-2 px-3" style={{ backgroundColor: "#F0F0F0" }}>Removed Items ({orderDetails?.removed_line_items?.length})</CardTitle>
                <Table responsive bordered hover>
                  <thead className="table-light">
                    <tr>
                      <th>Item</th>
                      <th>Quantity</th>
                      <th>Price</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderDetails?.removed_line_items?.map((item, idx) => (
                      <tr key={idx}>
                        <td className="d-flex align-items-center gap-2">
                          {/* <img
                          src={item?.image}
                          alt={item?.name}
                          width="40"
                          height="40"
                          style={{ objectFit: "cover", borderRadius: "4px" }}
                        /> */}
                          <span>{item?.name}</span>
                        </td>
                        <td>{item?.quantity}</td>
                        <td>{orderDetails?.currency} {item?.price}</td>
                        <td>{ }</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>}

        {/* Summary */}
        <Row className="justify-content-end">
          <Col md={6}>
            {orderDetails?.timeline?.length > 0 && <OrderTimeline timelineData={orderDetails?.timeline} />}
          </Col>
          <Col md={6}>
            <Card>
              <CardBody>
                <CardTitle tag="h5">Summary</CardTitle>
                <ul className="list-unstyled">
                  <li className="d-flex justify-content-between lh-lg">
                    <span>Subtotal:</span>
                    <strong>{orderDetails?.currency} {orderDetails?.subtotal_price?.toFixed(2)}</strong>
                  </li>
                  <li className="d-flex justify-content-between lh-lg">
                    <span>Total tax:</span>
                    <strong className="text-dark">{orderDetails?.currency} {orderDetails?.total_tax?.toFixed(2)}</strong>
                  </li>
                  <li className="d-flex justify-content-between lh-lg">
                    <span>Order Total:</span>
                    <strong>{orderDetails?.currency} {orderDetails?.total_price?.toFixed(2)}</strong>
                  </li>
                </ul>
              </CardBody>
            </Card>
          </Col>
        </Row>

      </Container>
    </div>
  );
};

export default OrderDetailsPage;
