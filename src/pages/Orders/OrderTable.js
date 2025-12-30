import React, { useState, useMemo, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Button } from "reactstrap";
import ConfirmationModal from "components/Modals/ConfirmationModal";
import { MdDeleteOutline } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import UserDataTable from "components/TableContainers/UserDataTable";
import { useNavigate } from "react-router-dom";
// Replace with actual action creators
import { deleteOrderRequest, updateOrderRequest } from "store/actions";
import OrderDataTable from "components/TableContainers/OrderDataTable";
import { formatISOToDDMMYYYY } from "helpers/dateFormat_helper";
import { FaRegSquare } from "react-icons/fa";
import { FaSquare } from "react-icons/fa";

const OrderTable = ({ orders, loading, totalrows }) => {
  const dispatch = useDispatch();
  const [deleteId, setDeleteId] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(false);
  const [selectedSortData, setSelectedSortData] = useState({ value: "created_at", direction: "desc" });
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchString, setSearchString] = useState("");
  const navigate = useNavigate();
  

  // Columns for the table
  const columns = useMemo(() => [
    {
        header: "Order",
        accessorKey: "name",
        cell: ({ row }) => (
            <span style={{cursor:"pointer", textDecoration: row?.original?.cancelled_at ?'line-through' :"none",fontWeight:"bolder"}} onClick={()=>navigate(`/orderDetails/${row.original?._id}`)}>{row.original.name}</span>
          ),
        showFilter:false
    },
    {
      header: "Date",
      accessorKey: "created_at",
      cell: ({ row }) => (
        <span style={{ textDecoration: row?.original?.cancelled_at ?'line-through' :"none"}}>{formatISOToDDMMYYYY(row.original?.created_at)}</span>
      ),
    },
    {
      header: "Customer",
      accessorKey: "customer",
      cell: ({ row }) => (
        row.original?.customer?.first_name ?
        (<span style={{ textDecoration: row?.original?.cancelled_at ?'line-through' :"none"}}>
            {row.original?.customer?.first_name + " "+ row.original?.customer?.last_name}
        </span>):(
            <span>N/A</span>
        )
      ),
    },
    {
        header: "Items",
        accessorKey: "items",
        cell: ({ row }) => <span style={{ textDecoration: row?.original?.cancelled_at ?'line-through' :"none"}}>{ row?.original?.cancelled_at  ? '0 items' : row.original.line_items?.reduce((total,item)=> total+item?.quantity,0) ? row.original.line_items?.reduce((total,item)=> total+item?.quantity,0) == 1 ? "1 item": row.original.line_items?.reduce((total,item)=> total+item?.quantity,0)+' items':'0 items'}</span>,
    },
    {
      header: "Total",
      accessorKey: "total_price",
      cell: ({ row }) => <span style={{ textDecoration: row?.original?.cancelled_at ?'line-through' :"none"}} >{row.original?.total_price?.toFixed(2)}</span>,
    },
    {
      header: "Payment Status",
      accessorKey: "payment_status",
      cell: ({ row }) => (
        <span className={`badge px-3 py-1`} style={{ backgroundColor: `${row.original.financial_status  == "paid" ? "#0000000f": "#ffd6a4"}`,fontSize:"13px",borderRadius:"10px",color:"#5b626b"}}>
          {row.original.financial_status  == "paid" ? <FaSquare size={11}/>:<FaRegSquare  size={11}/>} { row.original.financial_status}
        </span>
      ),
      showFilter:false
    },
    {
      header: "Fulfilment Status",
      accessorKey: "fulfilment_status",
      cell: ({ row }) => (
        <span className={`badge p-1 px-3 `} style={{backgroundColor:`${row.original.fulfillment_status?.toLowerCase() === "fulfilled" ? "#0000000f" : "#FFD700"}`,fontSize:"13px",borderRadius:"10px",color:"#5b626b"}} >
          {row.original.fulfillment_status?.toLowerCase() === "fulfilled" ? <FaSquare size={10} className="" /> : <FaRegSquare  size={11}/>} { row.original.fulfillment_status || "unfulfilled"}
        </span>
      ),
      showFilter:false
    }

  ], []);

  return (
    <>
      <ConfirmationModal
        okText="Confirm"
        onCancel={() => setOpenModal(false)}
        onOk={() => setConfirmAction(true)}
        isVisible={openModal}
        title="Delete Order"
        content="Are you sure you want to delete this order?"
      />

      <div className="container-fluid">
        <OrderDataTable
          columns={columns}
          loading={loading}
          data={orders || []}
          isGlobalFilter
          isPagination
          selectedSortData={selectedSortData}
          setSelectedSortData={setSelectedSortData}
          pageIndex={pageIndex}
          setPageIndex={setPageIndex}
          setPageSize={setPageSize}
          pageSize={pageSize}
          setSearchString={setSearchString}
          searchString={searchString}
          SearchPlaceholder="Search orders..."
          pagination="pagination"
          docName="Orders"
          totalrows={totalrows}
          paginationWrapper="dataTables_paginate paging_simple_numbers"
          tableClass="table-bordered table-nowrap dt-responsive nowrap w-100 dataTable no-footer dtr-inline"
        />
      </div>
    </>
  );
};

export default OrderTable;
