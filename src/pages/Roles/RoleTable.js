import React, { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { Button } from "reactstrap";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import ConfirmationModal from "components/Modals/ConfirmationModal";
import { deleteRole} from "store/actions"; // Action to delete role
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useTranslation } from "react-i18next";
import TableContainer from "components/Common/DataTableContainer";
import Cookies from "js-cookie";
import { getEncryptedLocal } from "pages/Utility/cookieUtils";

const RoleTable = ({ List,loading }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [openModal, setOpenModal] = useState(false);
  const [deleteId, setDeleteId] = useState(false);
  const {t} = useTranslation();
  const [confirmAction, setConfirmAction] = useState(false);
 const permissions2 = getEncryptedLocal("permissions");
  const hasEditPermission = permissions2?.map(item=>item?.permission_name)?.includes("Edit Role");
  const hasDeletePermission = permissions2?.map(item=>item?.permission_name)?.includes("Delete Role");

  // Handle delete role
  const handleDelete = (roleId) => {
    dispatch(deleteRole(roleId)); // Dispatch delete action for role
    setDeleteId('');
    setOpenModal(false);
    setConfirmAction(false);
  };

  useEffect(() => {
    if (deleteId && confirmAction) {
      handleDelete(deleteId);
    }
  }, [deleteId, confirmAction]);

  const columns = useMemo(
    () => [
      {
        header: "Role Name",
        accessorKey: "role_name",
        enableColumnFilter: false,
        enableSorting: true,
      },
      ...((hasEditPermission || hasDeletePermission)?[{
        header: "Actions",
        id: "actions", 
        cell: ({ row }) => {
          const handleEdit = () => {
            const rowData = row.original;
            navigate(`/createRole/?id=${rowData?._id}`);
          };

          return (
            <div className="d-flex gap-2 ">
              {hasEditPermission &&  <Button color="primary" onClick={handleEdit} className="mr-2" title="Edit">
                <FaRegEdit color="white" size={18}/>
              </Button>}
              {hasDeletePermission && <Button
                color="danger"
                onClick={() => {
                  setDeleteId(row?.original?._id);
                  setOpenModal(true);
                }}
                className="mr-2"
                title="Delete"
              >
               <MdDelete color="white" size={18}/>
              </Button>}
            </div>
          );
        },
      },
    ]:[]),
    ],
    [hasEditPermission,hasDeletePermission]
  );

  //meta title
  document.title = "Role Data | Your Admin Dashboard";

  return (
    <>
      <ConfirmationModal
        okText={"Confirm"}
        onCancel={() => {
          setDeleteId("");
          setOpenModal(false);
        }}
        onOk={() => {
          setConfirmAction(true);
        }}
        isVisible={openModal}
        title="Delete Role"
        content="Are you sure you want to delete this role?"
      />
      <div className="">
        <div className="container-fluid">
          <TableContainer
            loading={loading}
            columns={columns}
            data={List || []}
            isGlobalFilter={true}
            isPagination={true}
            isDowload={true}
            SearchPlaceholder={t("Search")}
            pagination="pagination"
            docName="Roles"
            paginationWrapper="dataTables_paginate paging_simple_numbers"
            tableClass="table-bordered table-nowrap dt-responsive nowrap w-100 dataTable no-footer dtr-inline"
          />
        </div>
      </div>
    </>
  );
};

export default RoleTable;
