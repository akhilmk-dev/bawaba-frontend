import React, { useState, useMemo, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Button } from "reactstrap";
import ConfirmationModal from "components/Modals/ConfirmationModal";
import { MdDelete, MdDeleteOutline } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import ProductDataTable from "components/TableContainers/ProductDataTable";  // Custom Product DataTable
import { useNavigate } from "react-router-dom";
// Replace with actual action creators
import { deleteProductRequest, updateProductRequest } from "store/actions";
import EditablePriceQuantityCell from "components/EditablePriceQuantityCell";

const ProductTable = ({ products, loading, totalrows }) => {
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
      header: "Product Name",
      accessorKey: "title",
      cell: ({ row }) => (
        <span
        title={row.original.title} 
               style={{
        fontWeight: "bolder",
        display: "inline-block",
        maxWidth: "180px",         // Set max width
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",  // Truncate text
      }}
        >
          {row.original.title}
        </span>
      ),
    },
    {
      header: "Edit Price / Quantity",
      accessorKey: "edit",
      cell: ({ row }) => <EditablePriceQuantityCell product={row.original} />,
    },
    {
      header: "Vendor",
      accessorKey: "vendor",
      cell: ({ row }) => row.original.vendor || "N/A",
    },
    {
      header: "Actions",
      accessorKey: "actions",
      cell: ({ row }) => (
        <div className="actions">
          <Button
            color="primary"
            style={{ marginRight: "5px" }}
            onClick={() => navigate(`/CreateProduct?id=${row.original?.legacyResourceId}`)}
          >
            <FaRegEdit size={18} />
          </Button>
          <Button
            color="danger"
            onClick={() => handleDelete(row.original?.legacyResourceId)}
          >
            <MdDelete size={18} />
          </Button>
        </div>
      ),
    },
], []);


  // Handle delete confirmation
  const handleDelete = (productId) => {
    setDeleteId(productId);
    setOpenModal(true);
  };

  const handleConfirmDelete = () => {
    dispatch(deleteProductRequest(deleteId));
    setOpenModal(false);
  };

  return (
    <>
      <ConfirmationModal
        okText="Confirm"
        onCancel={() => setOpenModal(false)}
        onOk={handleConfirmDelete}
        isVisible={openModal}
        title="Delete Product"
        content="Are you sure you want to delete this product?"
      />

      <div className="container-fluid">
        <ProductDataTable
          columns={columns}
          loading={loading}
          data={products || []}
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
          SearchPlaceholder="Search products..."
          pagination="pagination"
          docName="Products"
          totalrows={totalrows}
          paginationWrapper="dataTables_paginate paging_simple_numbers"
          tableClass="table-bordered table-nowrap dt-responsive nowrap w-100 dataTable no-footer dtr-inline"
        />
      </div>
    </>
  );
};

export default ProductTable;
