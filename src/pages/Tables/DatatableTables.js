import React, { useMemo } from "react";

//import components
import Breadcrumbs from '../../components/Common/Breadcrumb';
import TableContainer from '../../components/Common/DataTableContainer';
import { Button } from "reactstrap";

const DatatableTables = ({List}) => {

  const columns = useMemo(
    () => [
      {
        header: 'Catalogue Name',
        accessorKey: 'itemName',
        enableColumnFilter: false,
        enableSorting: true,
      },
      {
        header: 'Category',
        accessorKey: 'contactId',
        enableColumnFilter: false,
        enableSorting: true,
      },
      {
        header: 'Department',
        accessorKey: 'ticketNumber',
        enableColumnFilter: false,
        enableSorting: true,
      },
      {
        header: 'Estimated Installation Time (mins)',
        accessorKey: 'assignedTeam',
        enableColumnFilter: false,
        enableSorting: true,
      },
      {
        header: 'Status',
        accessorKey: 'appointmentTime',
        enableColumnFilter: false,
        enableSorting: true,
      },
      // {
      //   header: 'Status',
      //   accessorKey: 'status',
      //   enableColumnFilter: false,
      //   enableSorting: true,
      //   cell: ({ getValue }) => {
      //     const status = getValue();
      //     let backgroundColor = 'gray'; // Default color
      //     if (status === 'In Progress') {
      //       backgroundColor = '#00a895'; // Color for Delivered status
      //     } else if (status === 'Pending') {
      //       backgroundColor = '#F09400'; // Color for Pending status
      //     }else if(status ==="Cancelled"){
      //       backgroundColor = '#F00000'
      //     }else if(status ==='Completed'){
      //       backgroundColor = '#00DF4A'
      //     }
      //     return (
      //       <span
      //         style={{
      //           backgroundColor,
      //           display: 'inline-block',
      //           textAlign:"center",
      //           width:"110px",
      //           borderRadius: '4px',
      //           color: 'white',
      //         }}
      //       >
      //         {status}
      //       </span>
      //     );
      //   },
      // },
      {
        header: 'Actions',
        id: 'actions', // Unique id for this column
        cell: ({ row }) => {
          const handleEdit = () => {
            const rowData = row.original;
            // You can handle the edit functionality here
            console.log('Edit clicked for row:', rowData);
          };
  
          return (
            <Button color="primary" onClick={handleEdit}>
              Edit
            </Button>
          );
        },
      },
    ],
    []
  );

  return (
    <div className="">
      <div className="container-fluid">
        {/* <Breadcrumbs title="Tables" breadcrumbItem="Data Tables" /> */}

        <TableContainer
          columns={columns}
          data={List || []}
          isGlobalFilter={true}
          isPagination={true}
          SearchPlaceholder="Search..."
          pagination="pagination"
          paginationWrapper='dataTables_paginate paging_simple_numbers'
          tableClass="table-bordered table-nowrap dt-responsive nowrap w-100 dataTable no-footer dtr-inline"
        />
      </div>
    </div>
  );
}


export default DatatableTables;