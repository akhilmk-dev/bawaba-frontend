import React, { Fragment, useState, useRef, useEffect } from "react";
import { Row, Table, Button, Col } from "reactstrap";
import { useReactTable, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, flexRender } from "@tanstack/react-table";
import { CSVLink } from "react-csv";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable"; // Importing the jspdf-autotable plugin
import { useReactToPrint } from "react-to-print"; // Importing the hook
import { Link } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader"; // Importing ClipLoader from react-spinners
import { FadeLoader } from "react-spinners";
import { formatDateTimeToAmPm, convertToDateOnly } from "helpers/dateFormat_helper";
import { convertToAMPM } from "helpers/format_helper";
// import { AiOutlineFileExcel } from "react-icons/ai";
import Select from "react-select";
import { getPublications } from "store/actions";
import { useDispatch } from "react-redux";
import { DebouncedInput } from "helpers/common_helper";
import Pagination from "components/Common/Pagination";


// Global Filter (Debounced Input)

const PublicationDataTable = ({
    columns,
    data,
    tableClass,
    isPagination,
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
    classifications,
    selectedClassification,
    setSelectedClassification,
    selectedType,
    setSelectedType,
    selectedFromDate,
    setSelectedFromDate,
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
    const dispatch = useDispatch();

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
        enableColumnFilter: false,
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

    // const currentPage = getState().pagination.pageIndex;
    // const startIndex = currentPage * 10 + 1;
    // const endIndex = Math.min((currentPage + 1) * 10, data.length);

    // const totalFilteredRows = table.getFilteredRowModel().rows.length;
    // const pageSize = table.getState().pagination.pageSize;
    // const currentPageIndex = table.getState().pagination.pageIndex;
    const windowSize = 3;
    const totalPages = Math.ceil(totalrows / pageSize);
    const startPage = Math.floor(pageIndex / windowSize) * windowSize;
    const endPage = Math.min(startPage + windowSize, totalPages);
    const sortOptions = [
        { label: "Title(en)(a-z)", value: "title_en", direction: "asc" },
        { label: "Title(en)(z-a)", value: "title_en", direction: "desc" },
    ]
    const hasMounted = useRef(false);
    useEffect(() => {
        if (!hasMounted.current) {
            hasMounted.current = true;
            return;
        }
        if (!loading && pageIndex != 0) {
            dispatch(getPublications({
                "pagesize": pageSize,
                "currentpage": pageIndex + 1,
                "sortorder": selectedSortData?.value && selectedSortData?.direction
                    ? {
                        field: selectedSortData.value,
                        direction: selectedSortData.direction,
                    }
                    : {},
                "searchstring": searchString,
                "filter": {
                    "type": selectedType?.value,
                    "classification_id": selectedClassification?.value,
                }
            }))
        }

    }, [selectedSortData, pageIndex])

    useEffect(() => {
        localStorage.setItem('pageIndex', pageIndex);
        localStorage.setItem('searchString', searchString);
        localStorage.setItem('selectedSortData', JSON.stringify(selectedSortData))
        localStorage.setItem('selectedFromDate', selectedFromDate);
        localStorage.setItem('selectedClassification', JSON.stringify(selectedClassification));
        localStorage.setItem('selectedType', JSON.stringify(selectedType));
        if (!hasMounted.current) {
            hasMounted.current = true;
            return;
        }
        if (!loading && pageIndex == 0) {
            dispatch(getPublications({
                "pagesize": pageSize,
                "currentpage": pageIndex + 1,
                "sortorder": selectedSortData?.value && selectedSortData?.direction
                    ? {
                        field: selectedSortData.value,
                        direction: selectedSortData.direction,
                    }
                    : {},
                "searchstring": searchString,
                "filter": {
                    "type": selectedType?.value,
                    "classification_id": selectedClassification?.value,
                }
            }))
        }
    }, [selectedSortData, selectedClassification, searchString, pageIndex, selectedType]);

    useEffect(() => {
        setPageIndex(0)
    }, [selectedClassification, searchString, selectedType]);

    const handlePageChange = (newPageIndex) => {
        setPageIndex(newPageIndex);
    };

    return (
        <Fragment>
            <Row className="mb-2">
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
                <div className="d-flex justify-content-between gap-2 align-items-center">
                    <div className="" style={{ minWidth: "200px" }}>
                        <label className=" fs-8">
                            Classifications
                        </label>
                        <Select
                            options={classifications}
                            value={classifications?.find(
                                (option) => option.value === selectedClassification?.value
                            ) || null}
                            onChange={(selectedOption) =>
                                setSelectedClassification(selectedOption)
                            }
                            classNamePrefix="select"
                            isClearable={true}

                        />
                    </div>
                    <div className="" style={{ minWidth: "200px" }}>
                        <label className=" fs-8">
                            Type
                        </label>
                        <Select
                            options={[{ label: "Book", value: "book" }, { label: "Url", value: "url" }]}
                            value={[{ label: "Book", value: "book" }, { label: "Url", value: "url" }]?.find(
                                (option) => option.value === selectedType?.value
                            ) || null}
                            onChange={(selectedOption) =>
                                setSelectedType(selectedOption)
                            }
                            classNamePrefix="select"
                            isClearable={true}

                        />
                    </div>
                </div>
                <div className="d-flex justify-content-between align-items-end">
                    <DebouncedInput
                        value={searchString ?? ""}
                        onChange={(value) => { setSearchString(String(value)) }}
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
                    <tbody >
                        {loading ? (
                            <tr>
                                <td colSpan={columns.length + 1} className="text-center border-none">
                                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '500px' }}>
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
                <>
            
                <Pagination
                    currentPage={pageIndex + 1}
                    totalPages={totalPages}
                    totalItems={totalrows}
                    pageSize={pageSize}
                    onPageChange={handlePageChange}
                    showInfo={true}     
                />
                </>
            )}

        </Fragment>
    );
};

export default PublicationDataTable;
