import React, { Fragment, useState, useRef, useEffect } from "react";
import { Row, Table, Button, Col } from "reactstrap";
import { useReactTable, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, flexRender } from "@tanstack/react-table";
import { CSVLink } from "react-csv";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useReactToPrint } from "react-to-print";
import { Link } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import { FadeLoader } from "react-spinners";
import { formatDateTimeToAmPm, convertToDateOnly } from "helpers/dateFormat_helper";
import { convertToAMPM } from "helpers/format_helper";
// import { AiOutlineFileExcel } from "react-icons/ai";
import { PiMicrosoftExcelLogoFill } from "react-icons/pi";
import { BsFileEarmarkPdf } from "react-icons/bs";
import { AiOutlineFilePdf } from "react-icons/ai";
import { PiFileArrowDown } from "react-icons/pi";
import { AiOutlinePrinter } from "react-icons/ai";
import { IoIosSearch } from "react-icons/io";
import Select from "react-select";
import { fetchUsersRequest, getClassifications, getEvents } from "store/actions";
import { useDispatch, useSelector } from "react-redux";
import { DebouncedInput } from "helpers/common_helper";
import Pagination from "components/Common/Pagination";
import { fetchOrdersRequest } from "store/Orders/actions";
import { getEncryptedLocal } from "pages/Utility/cookieUtils";


// Global Filter (Debounced Input)
const OrderDataTable = ({
    columns,
    data,
    tableClass,
    isPagination = true,
    isGlobalFilter,
    SearchPlaceholder,
    paginationWrapper,
    pagination,
    buttonClass,
    buttonName,
    handleUserClick,
    pageInx = 0,
    initialPageSize = 10,
    totalrows,
    loading,
    docName = "doc",
    selectedSortData,
    setSelectedSortData,
    pageIndex,
    setPageIndex,
    pageSize,
    setPageSize,
    searchString,
    setSearchString
}) => {
    const [globalFilter, setGlobalFilter] = useState("");
    const tableRef = useRef(); // Create a reference for the table content
    const [filteredData, setFilteredData] = useState(data || []);
    const [selectedFromDate, setSelectedFromDate] = useState();
    const [selectedVendor, setSelectedVendor] = useState(null);
    const [selectedFinancialStatus, setSelectedFinancialStatus] = useState(null);

const permissions = getEncryptedLocal("permissions");

    const hasVendorFilter = permissions?.some(
        (item) => item?.permission_name === 'Vendor Filter'
    );
    const vendors = useSelector(state => state.User.users)
    const dispatch = useDispatch();
    const role = {}

    // Update filteredData when search query changes
    useEffect(() => {
        if (!globalFilter) {
            setFilteredData(data);
        } else {
            const lowercasedQuery = globalFilter.toLowerCase();
            setFilteredData(
                data.filter((row) =>
                    Object.values(row).some(
                        (value) =>
                            value &&
                            value.toString().toLowerCase().includes(lowercasedQuery)
                    )
                )
            );
        }
    }, [globalFilter, data]);

    useEffect(() => {
        dispatch(fetchUsersRequest());
    }, [])

    const table = useReactTable({
        columns,
        data,
        state: {
            globalFilter,
        },
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    const serialNumberColumn = {
        header: "#",
        id: "serial",
        cell: ({ row }) => (pageIndex * pageSize) + row.index + 1,
        enableSorting: false,
        // enableColumnFilter: false,
    };

    // Finally, set the columns with serial number prepended
    table.setOptions((prev) => ({
        ...prev,
        columns: [serialNumberColumn, ...columns]
    }));


    const { getHeaderGroups, getRowModel, getCanPreviousPage, getCanNextPage, getPageOptions, getPageCount, nextPage, previousPage, getState } = table;

    const exportToExcel = () => {
        const fullData = filteredData?.map((row) => {
            return columns.reduce((acc, col) => {
                if (col.header !== "Actions" && col.header !== "Catalogue Image") {
                    let value = row[col.accessorKey];
                    // Format dates if the accessor key matches
                    if (col.accessorKey === "scheduledStartDateTime" || col.accessorKey === "scheduledEndDateTime") {
                        value = formatDateTimeToAmPm(value);
                    } else if (col.accessorKey === "status") {
                        value = value == true ? "Active" : "Inactive"
                    } else if (col.accessorKey === "isActive") {
                        value = value == true ? "Active" : "Inactive"
                    } else if (col.accessorKey === "requestedOn") {
                        value = formatDateTimeToAmPm(value);
                    } else if (col.accessorKey === "newEndDateTime" || col.accessorKey === "proposedEndDateTime") {
                        value = formatDateTimeToAmPm(value);
                    } else if (col.accessorKey === "createdAt") {
                        value = formatDateTimeToAmPm(value);
                    } else if (col.accessorKey === "date") {
                        value = convertToDateOnly(value);
                    } else if (col.accessorKey === "startTime" || col.accessorKey === "endTime") {
                        value = convertToAMPM(value);
                    }
                    acc[col.header] = value;
                }
                return acc;
            }, {});
        });

        const ws = XLSX.utils.json_to_sheet(fullData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
        XLSX.writeFile(wb, `${docName}.xlsx`);
    };

    // Export to PDF
    const exportToPDF = () => {
        const doc = new jsPDF();
        const columnHeaders = columns
            .filter((col) => col.header !== "Actions" && col.header !== "Catalogue Image")
            .map((col) => col.header);

        const tableData = filteredData?.map((row) =>
            columns
                .filter((col) => col.accessorKey !== "actions" && col.accessorKey !== "image")
                .map((col) => {
                    let value = row[col.accessorKey];
                    // Format dates if the accessor key matches
                    if (col.accessorKey === "scheduledStartDateTime" || col.accessorKey === "scheduledEndDateTime") {
                        value = formatDateTimeToAmPm(value);
                    } else if (col.accessorKey === "status") {
                        value = value == true ? "Active" : "Inactive"
                    } else if (col.accessorKey === "isActive") {
                        value = value == true ? "Active" : "Inactive"
                    } else if (col.accessorKey === "requestedOn") {
                        value = formatDateTimeToAmPm(value);
                    } else if (col.accessorKey === "newEndDateTime" || col.accessorKey === "proposedEndDateTime") {
                        value = formatDateTimeToAmPm(value);
                    } else if (col.accessorKey === "createdAt") {
                        value = formatDateTimeToAmPm(value);
                    } else if (col.accessorKey === "date") {
                        value = convertToDateOnly(value);
                    } else if (col.accessorKey === "startTime" || col.accessorKey === "endTime") {
                        value = convertToAMPM(value);
                    }
                    return value;
                })
        );

        doc.autoTable({
            head: [columnHeaders],
            body: tableData,
        });
        doc.save(`${docName}.pdf`);
    };

    // Printing Table
    const handlePrint = () => {

        // Clone the table to manipulate it without affecting the UI
        const tableClone = tableRef.current.cloneNode(true);
        const headerCells = tableClone.querySelectorAll("th");
        const actionIndex = Array.from(headerCells).findIndex((cell) => cell.textContent === "Actions");

        if (actionIndex !== -1) {
            // Remove the Action column from the header
            headerCells[actionIndex].remove();

            // Remove the Action column from each row in the table
            const rows = tableClone.querySelectorAll("tr");
            rows.forEach((row) => {
                const cells = row.querySelectorAll("td");
                if (cells.length > actionIndex) {
                    cells[actionIndex].remove();
                }
            });
        }

        // Prepare a new table for all data
        const fullTableHTML = `
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <thead>
          <tr>
            ${columns
                .filter((col) => col.header !== "Actions" && col.header !== "Catalogue Image")
                .map((col) => `<th style="padding: 8px; text-align: left; border: 1px solid #ddd;">${col.header}</th>`)
                .join("")}
          </tr>
        </thead>
        <tbody>
          ${filteredData
                .map(
                    (item) =>
                        `<tr>${columns
                            .filter((col) => col.header !== "Actions" && col.header !== "Catalogue Image")
                            .map((col) => {
                                let cellValue = item[col.accessorKey];
                                // Format the dates if the accessorKey is scheduledStartDate or scheduledEndDate
                                if (col.accessorKey === "scheduledStartDateTime" || col.accessorKey === "scheduledEndDateTime") {
                                    cellValue = formatDateTimeToAmPm(cellValue);
                                } else if (col.accessorKey === "status") {
                                    cellValue = cellValue == true ? "Active" : "Inactive"
                                } else if (col.accessorKey === "isActive") {
                                    cellValue = cellValue == true ? "Active" : "Inactive"
                                } else if (col.accessorKey === "requestedOn") {
                                    cellValue = formatDateTimeToAmPm(cellValue);
                                } else if (col.accessorKey === "newEndDateTime" || col.accessorKey === "proposedEndDateTime") {
                                    cellValue = formatDateTimeToAmPm(cellValue);
                                } else if (col.accessorKey === "createdAt") {
                                    cellValue = formatDateTimeToAmPm(cellValue);
                                } else if (col.accessorKey === "date") {
                                    cellValue = convertToDateOnly(cellValue);
                                } else if (col.accessorKey === "startTime" || col.accessorKey === "endTime") {
                                    cellValue = convertToAMPM(cellValue);
                                }
                                return `<td style="padding: 8px; text-align: left; border: 1px solid #ddd;">${cellValue}</td>`;
                            })
                            .join("")}</tr>`
                )
                .join("")}
        </tbody>
      </table>
    `;

        // Open a new window for printing
        const printWindow = window.open("", "_blank", "height=500,width=800");
        printWindow.document.write("<html><head><title>Print Table</title>");
        printWindow.document.write(`
      <style>
        body { font-family: Arial, sans-serif; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { padding: 8px; text-align: left; border: 1px solid #ddd; }
      </style>
    `);
        printWindow.document.write("</head><body>");
        printWindow.document.write(fullTableHTML);
        printWindow.document.write("</body></html>");
        printWindow.document.close();

        // Trigger print
        printWindow.print();
    };

    const windowSize = 3;
    const totalPages = Math.ceil(totalrows / pageSize);
    const startPage = Math.floor(pageIndex / windowSize) * windowSize;
    const endPage = Math.min(startPage + windowSize, totalPages);

    useEffect(() => {
        if (loading) return;
        const params = {
            page: pageIndex,
            limit: 10,
        };

        if (selectedSortData?.value && selectedSortData?.direction) {
            params.sortBy = `${selectedSortData.value}:${selectedSortData.direction}`;
        }
        if (searchString) {
            params.search = searchString;
        }
        if (selectedVendor?.value) {
            params.vendor_name = selectedVendor.value;
        }
        if (selectedFinancialStatus?.value) {
            params.financial_status = selectedFinancialStatus.value;
        }

        localStorage.setItem("pageIndex", pageIndex);
        localStorage.setItem("searchString", searchString);
        localStorage.setItem("selectedSortData", JSON.stringify(selectedSortData));

        dispatch(fetchOrdersRequest(role, params));
    }, [pageIndex, selectedSortData, searchString, selectedVendor, selectedFinancialStatus]);


    useEffect(() => {
        setPageIndex(0)
    }, [searchString])

    const handlePageChange = (newPageIndex) => {
        setPageIndex(newPageIndex);
    };

    return (
        <Fragment>
            <Row className="mb-3">
                {isGlobalFilter && (
                    <>
                        {/* Export Buttons */}
                        {/* <Col sm={12} className="text-end">
                            <Button className="btn btn-primary bg-primary text-white me-2" onClick={exportToExcel}>
                                <PiMicrosoftExcelLogoFill size={18} /> Excel
                            </Button>
                            <Button className="bwhite bg-primary text-white me-2" onClick={exportToPDF}>
                                <AiOutlineFilePdf size={18} style={{ marginBottom: "1px" }} /> PDF
                            </Button>
                            <Button
                                className="btn btn-primary bg-primary text-white me-2"
                                onClick={() => {
                                    const fullData = filteredData?.map((row) => {
                                        return columns.reduce((acc, col) => {
                                            if (col.accessorKey !== "actions" && col.accessorKey !== "image") {
                                                let value = row[col.accessorKey];
                                                // Format dates if the accessor key matches
                                                if (col.accessorKey === "scheduledStartDateTime" || col.accessorKey === "scheduledEndDateTime") {
                                                    value = formatDateTimeToAmPm(value);
                                                } else if (col.accessorKey === "status") {
                                                    value = value == true ? "Active" : "Inactive"
                                                } else if (col.accessorKey === "isActive") {
                                                    value = value == true ? "Active" : "Inactive"
                                                } else if (col.accessorKey === "requestedOn") {
                                                    value = formatDateTimeToAmPm(value);
                                                } else if (col.accessorKey === "newEndDateTime" || col.accessorKey === "proposedEndDateTime") {
                                                    value = formatDateTimeToAmPm(value);
                                                } else if (col.accessorKey === "createdAt") {
                                                    value = formatDateTimeToAmPm(value);
                                                } else if (col.accessorKey === "date") {
                                                    value = convertToDateOnly(value);
                                                } else if (col.accessorKey === "startTime" || col.accessorKey === "endTime") {
                                                    value = convertToAMPM(value);
                                                }
                                                acc[col.header] = value;
                                            }
                                            return acc;
                                        }, {});
                                    });

                                    const csvHeaders = columns
                                        .filter((col) => col.header !== "Actions" && col.header !== "Catalogue Image")
                                        .map((col) => col.header);

                                    const csvData = [csvHeaders, ...fullData.map((row) => Object.values(row))];
                                    const csvContent =
                                        "data:text/csv;charset=utf-8," +
                                        csvData.map((e) => e.join(",")).join("\n");

                                    const encodedUri = encodeURI(csvContent);
                                    const link = document.createElement("a");
                                    link.setAttribute("href", encodedUri);
                                    link.setAttribute("download", `${docName}.csv`);
                                    document.body.appendChild(link);

                                    link.click();
                                    document.body.removeChild(link);
                                }}
                            >
                                <PiFileArrowDown size={19} /> CSV
                            </Button>
                            <Button className="btn btn-primary bg-primary text-white" onClick={handlePrint}>
                                <AiOutlinePrinter size={18} /> Print
                            </Button>
                        </Col> */}
                    </>)}
            </Row>
            <div className="d-flex justify-content-between gap-2 mb-2">
                <div className="d-flex gap-2 align-items-center ">

                    {/* Vendor Select */}
                    {hasVendorFilter && <Select
                        options={vendors?.data?.filter(item => item?.role?.role_name?.toLowerCase() == "vendor")?.map(item => ({ label: item?.name, value: item?.name }))}
                        value={selectedVendor}
                        onChange={(selected) => {
                            setSelectedVendor(selected);
                            setPageIndex(0);
                        }}
                        placeholder="Select Vendor"
                        isClearable
                        className="react-select-container"
                        classNamePrefix="react-select"
                        styles={{ container: (base) => ({ ...base, minWidth: 200 }) }}
                    />}

                    {/* Financial Status Select */}
                    <Select
                        options={[
                            { value: "paid", label: "Paid" },
                            { value: "unpaid", label: "Unpaid" },
                            { value: "pending", label: "Pending" },
                            { value: "refunded", label: "Refunded" }
                        ]}
                        value={selectedFinancialStatus}
                        onChange={(selected) => {
                            setSelectedFinancialStatus(selected);
                            setPageIndex(0); // Reset pagination
                        }}
                        placeholder="Select Payment Status"
                        isClearable
                        className="react-select-container"
                        classNamePrefix="react-select"
                        styles={{ container: (base) => ({ ...base, minWidth: 200 }) }}
                    />
                </div>

                <div className="d-flex justify-content-between align-items-end">
                    <DebouncedInput
                        value={searchString ?? ""}
                        onChange={(value) => setSearchString(String(value))}
                        className="form-control search-box me-2  d-inline-block"
                        placeholder={SearchPlaceholder}
                    />
                </div>
            </div>

            <div className="table-responsive" id="table-to-print" ref={tableRef}>
                <Table hover className={tableClass} bordered>
                    <thead>
                        {getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) =>
                                    !header.isPlaceholder ? (
                                        <th
                                            key={header.id}
                                            style={{ width: "150px", verticalAlign: "middle" }}
                                        >
                                            <div className="d-flex align-items-center justify-content-between">
                                                {/* Header title */}
                                                <span>{flexRender(header.column.columnDef.header, header.getContext())}</span>

                                                {/* Sorting Icon */}
                                                {(header.column.columnDef.accessorKey && header.column.getCanFilter?.() && header.column.columnDef.showFilter !== false) && (
                                                    <span
                                                        className="ms-1"
                                                        style={{ cursor: "pointer" }}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            const field = header.column.columnDef.accessorKey;
                                                            if (!field) return;

                                                            if (!selectedSortData || selectedSortData.value !== field) {
                                                                setSelectedSortData({ value: field, direction: "asc" }); // default to asc
                                                            } else if (selectedSortData.direction === "asc") {
                                                                setSelectedSortData({ value: field, direction: "desc" });
                                                            } else {
                                                                setSelectedSortData({ value: field, direction: "asc" }); // reset to no sort
                                                            }
                                                        }}
                                                    >
                                                        {/* Icon Logic */}
                                                        {selectedSortData?.value === header.column.columnDef.accessorKey ? (
                                                            selectedSortData.direction === "asc" ? (
                                                                <i className="mdi mdi-arrow-up" style={{ fontSize: "20px" }}></i>
                                                            ) : (
                                                                <i className="mdi mdi-arrow-down" style={{ fontSize: "20px" }}></i>
                                                            )
                                                        ) : (
                                                            <i className="mdi mdi-swap-vertical" style={{ fontSize: "20px" }}></i>
                                                        )}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Optional: Render filter input here conditionally if needed */}
                                            {header.column.getCanFilter?.() && header.column.columnDef.showFilter !== false && (
                                                <div>{flexRender(header.column.columnDef.Filter, header.getContext())}</div>
                                            )}
                                        </th>) : null
                                )}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={columns.length + 1} className="text-center border-none">
                                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px' }}>
                                        <FadeLoader color="#f28c28" size={40} />
                                    </div>
                                </td>
                            </tr>
                        ) : (data?.length <= 0 || getRowModel()?.rows?.length === 0) ? (
                            <tr>
                                <td colSpan={columns.length + 1} className="text-center">
                                    No Data Found
                                </td>
                            </tr>
                        ) : (
                            getRowModel().rows.map((row) => (
                                <tr key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <td key={cell.id} className="" style={{ verticalAlign: "middle" }}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                                    ))}
                                </tr>
                            ))
                        )}

                    </tbody>
                </Table>
            </div>

            {(isPagination && totalrows > 0) && (
                <Pagination
                    currentPage={pageIndex + 1}
                    totalPages={totalPages}
                    totalItems={totalrows}
                    pageSize={pageSize}
                    onPageChange={handlePageChange}
                    showInfo={true}
                />
            )}

        </Fragment>
    );
};

export default OrderDataTable;
