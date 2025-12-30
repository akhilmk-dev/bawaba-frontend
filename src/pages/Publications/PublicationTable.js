import ConfirmationModal from "components/Modals/ConfirmationModal";
import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { Button } from "reactstrap";

import CreatePublication from "./CreatePublication";
// import TableContainer from "components/Common/DataTableContainer";
import { deletePublication, updatePublication } from "store/actions";

import { MdDeleteOutline } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import PublicationDataTable from "components/TableContainers/PublicationDataTable";
import { FaFilePdf } from "react-icons/fa6";
import { useTranslation } from "react-i18next";

const PublicationTable = ({ list, loading, classifications, fieldErrors, totalrows }) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [selectedSortData, setSelectedSortData] = useState({ value: "created_at", direction: "desc" });
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [searchString, setSearchString] = useState("");
    const [selectedClassification, setSelectedClassification] = useState();
    const [selectedFromDate, setSelectedFromDate] = useState();
    const [selectedType, setSelectedType] = useState();
    const [isOpen, setIsOpen] = useState(false);
    const [editData, setEditData] = useState(null);
    const [deleteId, setDeleteId] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [confirmAction, setConfirmAction] = useState(false);

    const permissions = [];
    // const hasEditPermission = permissions.some(item => item?.permissionName === "Edit Publications");
    // const hasDeletePermission = permissions.some(item => item?.permissionName === "Delete Publications");

    const handleDelete = (id) => {
        dispatch(deletePublication(id));
        setDeleteId(null);
        setPageIndex(0);
        setOpenModal(false);
        setConfirmAction(false);
    };

    useEffect(() => {
        if (deleteId && confirmAction) {
            handleDelete(deleteId);
        }
    }, [deleteId, confirmAction]);

    const columns = useMemo(() => [
        {
            header: "Title",
            accessorKey: "title_en",
            cell: ({ getValue }) => (
                <div style={{ whiteSpace: 'normal', wordWrap: 'break-word', width: '220px' }}>
                    {getValue()}
                </div>
            ),
        },
        {
            header: 'Created At',
            accessorKey: 'created_at',
            cell: ({ row }) => new Date(row.original.created_at).toLocaleString("en-GB"),
        },
        {
            header: "Cover Image",
            accessorKey: "cover_image_url",
            cell: ({ row }) => (
                row.original.cover_image_url ? (
                    <img
                        src={row.original.cover_image_url}
                        alt={row.original.title_en}
                        style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 4 }}
                    />
                ) : 'No Image'
            ),
            showFilter: false
        },
        {
            header: "Views",
            accessorKey: "views",
            cell: ({ row }) => (
                row.original.views
            ),
            showFilter: true
        },

        {
            header: "Rating",
            accessorKey: "avg_rating",
            cell: ({ row }) => (
                row.original.avg_rating
            ),
            showFilter: true
        },
        {
            header: "Classification",
            accessorKey: "classification_title",
            showFilter: false
        },
        {
            header: "PDF",
            accessorKey: "pdf_file_url",
            cell: ({ row }) => (
                row.original.pdf_file_url ? (
                    <div className="text-center">
                        <a href={row.original.pdf_file_url} target="_blank" className="text-center" rel="noopener noreferrer">
                            <FaFilePdf size={28} />
                        </a>
                    </div>
                ) :'No PDF'
            ),
            showFilter: false
        },

        ...([{
            header: "Actions",
            id: "actions",
            cell: ({ row }) => {
                const handleEdit = () => {
                    setEditData(row.original);
                    setIsOpen(true);
                };

                return (
                    <div className="d-flex gap-2">
                        {(
                            <Button color="primary" onClick={handleEdit}>
                                <FaRegEdit size={18} />
                            </Button>
                        )}
                        {(
                            <Button
                                color="danger"
                                onClick={() => {
                                    setDeleteId(row.original.id);
                                    setOpenModal(true);
                                }}
                            >
                                <MdDeleteOutline size={18} />
                            </Button>
                        )}
                    </div>
                );
            },
        }]),
    ], []);

    const handleSubmit = (formData, id, resetForm, handleClose) => {
        dispatch(updatePublication(formData, id, resetForm, handleClose));
    };

    const handleClose = () => {
        setIsOpen(false);
        setEditData(null);
    };

    return (
        <>
            <ConfirmationModal
                okText={"Confirm"}
                onCancel={() => {
                    setDeleteId(null);
                    setOpenModal(false);
                }}
                onOk={() => setConfirmAction(true)}
                isVisible={openModal}
                title={t("Delete Publication")}
                content={t("Are you sure you want to delete this publication?")}
            />

            <CreatePublication
                loading={loading}
                fieldErrors={fieldErrors}
                classifications={classifications}
                visible={isOpen}
                initialData={editData}
                onSubmit={handleSubmit}
                handleClose={handleClose}
            />

            <div className="container-fluid">
                <PublicationDataTable
                    selectedFromDate={selectedFromDate}
                    setSelectedFromDate={setSelectedFromDate}
                    selectedSortData={selectedSortData}
                    setSelectedSortData={setSelectedSortData}
                    pageIndex={pageIndex}
                    setPageIndex={setPageIndex}
                    pageSize={pageSize}
                    setPageSize={setPageSize}
                    searchString={searchString}
                    setSearchString={setSearchString}
                    classifications={classifications}
                    selectedClassification={selectedClassification}
                    setSelectedClassification={setSelectedClassification}
                    selectedType={selectedType}
                    setSelectedType={setSelectedType}
                    loading={loading}
                    columns={columns}
                    data={list || []}
                    isGlobalFilter={true}
                    isPagination={true}
                    totalrows={totalrows}
                    SearchPlaceholder={t("Search publications")}
                    pagination="pagination"
                    docName="Publications"
                    paginationWrapper="dataTables_paginate paging_simple_numbers"
                    tableClass="table-bordered table-nowrap dt-responsive nowrap w-100 dataTable no-footer dtr-inline"
                />
            </div>
        </>
    );
};

export default PublicationTable;
