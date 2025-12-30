import React, { Fragment, useState, useRef, useEffect } from "react";
import { Row, Table, Col } from "reactstrap";
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    flexRender,
} from "@tanstack/react-table";
import Select from "react-select";
import { FadeLoader } from "react-spinners";
import { formatDateTimeToAmPm, convertToDateOnly } from "helpers/dateFormat_helper";
import { convertToAMPM } from "helpers/format_helper";
import { DebouncedInput } from "helpers/common_helper";
import { getEncryptedLocal } from "pages/Utility/cookieUtils";
import axiosInstance from "pages/Utility/axiosInstance";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

const ProductDataTable = ({
    columns,
    tableClass,
    isGlobalFilter,
    SearchPlaceholder,
    docName = "doc",
    pageSize = 10,
}) => {
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pageIndex, setPageIndex] = useState(0);
    const [totalRows, setTotalRows] = useState(0);
    const [searchString, setSearchString] = useState("");
    const [selectedVendor, setSelectedVendor] = useState(null);
    const [cursorMap, setCursorMap] = useState({ 0: null });
    const [nextCursor, setNextCursor] = useState(null);
    const [totalData,setTotalData] = useState(0)
    const tableRef = useRef();
    const permissions = getEncryptedLocal("permissions");
    const hasVendorFilter = permissions?.some(
        (item) => item?.permission_name === "Vendor Filter"
    );
    const [vendors, setVendors] = useState([]);
    const start = pageIndex * pageSize + 1;
    const end = Math.min(start+(totalRows-1));

    
    // Fetch vendor list
    useEffect(() => {
        const fetchVendors = async () => {
            try {
                const res = await axiosInstance.get("V1/users");
                setVendors(res.data.data || []);
            } catch (err) {
                console.error(err);
            }
        };
        fetchVendors();
    }, []);

    // Fetch products from backend
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);

                const params = {
                    limit: pageSize,
                    page_info: cursorMap[pageIndex] || undefined,
                };
                if (selectedVendor?.value) params.vendor_name = selectedVendor.value;
                if (searchString) params.search = searchString;

                const res = await axiosInstance.get("V1/products", { params });
                const { data, nextPageInfo, total,totalPages } = res.data;

                setFilteredData(data || []);
                setTotalRows(total || 0); // filtered count from backend
                setNextCursor(nextPageInfo || null);
                setTotalData(totalPages)
                if (nextPageInfo) {
                    setCursorMap((prev) => ({ ...prev, [pageIndex + 1]: nextPageInfo }));
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [pageIndex, selectedVendor, searchString]);

    // Reset page when filters/search change
    useEffect(() => {
        setPageIndex(0);
        setCursorMap({ 0: null });
    }, [selectedVendor, searchString]);

    const table = useReactTable({
        columns,
        data: filteredData,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    const serialNumberColumn = {
        header: "#",
        id: "serial",
        cell: ({ row }) => pageIndex * pageSize + row.index + 1,
        enableSorting: false,
    };

    table.setOptions((prev) => ({
        ...prev,
        columns: [serialNumberColumn, ...columns],
    }));

    const exportToExcel = () => {
        const fullData = filteredData?.map((row) =>
            columns.reduce((acc, col) => {
                if (col.header !== "Actions" && col.header !== "Catalogue Image") {
                    let value = row[col.accessorKey];
                    if (col.accessorKey === "scheduledStartDateTime" || col.accessorKey === "scheduledEndDateTime") {
                        value = formatDateTimeToAmPm(value);
                    } else if (col.accessorKey === "status" || col.accessorKey === "isActive") {
                        value = value ? "Active" : "Inactive";
                    } else if (col.accessorKey === "date") {
                        value = convertToDateOnly(value);
                    } else if (col.accessorKey === "startTime" || col.accessorKey === "endTime") {
                        value = convertToAMPM(value);
                    }
                    acc[col.header] = value;
                }
                return acc;
            }, {})
        );

        const ws = XLSX.utils.json_to_sheet(fullData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
        XLSX.writeFile(wb, `${docName}.xlsx`);
    };

    const exportToPDF = () => {
        const doc = new jsPDF();
        const columnHeaders = columns
            .filter((col) => col.header !== "Actions" && col.header !== "Catalogue Image")
            .map((col) => col.header);

        const tableData = filteredData.map((row) =>
            columns
                .filter((col) => col.accessorKey !== "actions" && col.accessorKey !== "image")
                .map((col) => row[col.accessorKey])
        );

        doc.autoTable({
            head: [columnHeaders],
            body: tableData,
        });
        doc.save(`${docName}.pdf`);
    };

    return (
        <Fragment >
            <div className="mb-3">
                <Row className="mb-3">
                    {isGlobalFilter && (
                        <Col sm={12} style={{ display: "flex", justifyContent: "space-between", gap: "40px" }}>
                            {hasVendorFilter && (
                                <Select
                                    options={vendors
                                        ?.filter((v) => v.role?.role_name?.toLowerCase() === "vendor")
                                        ?.map((v) => ({ label: v.name, value: v.name }))}
                                    value={selectedVendor}
                                    onChange={setSelectedVendor}
                                    placeholder="Select Vendor"
                                    isClearable
                                    styles={{ container: (base) => ({ ...base, minWidth: 200 }) }}
                                />
                            )}
                            <DebouncedInput
                                value={searchString}
                                onChange={setSearchString}
                                className="form-control search-box"
                                placeholder={SearchPlaceholder}
                            />
                        </Col>

                    )}
                </Row>

                <div className="table-responsive" ref={tableRef}>
                    <Table hover className={tableClass} bordered>
                        <thead>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map((header) =>
                                        !header.isPlaceholder ? (
                                            <th
                                                key={header.id}
                                                style={{ width: "150px", verticalAlign: "middle" }}
                                            >
                                                {flexRender(header.column.columnDef.header, header.getContext())}
                                            </th>
                                        ) : null
                                    )}
                                </tr>
                            ))}
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={columns.length + 1} style={{ height: "500px", textAlign: "center", verticalAlign: "middle" }}>
                                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                                            <FadeLoader color="#f28c28" size={40} />
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredData.length === 0 ? (
                                <tr>
                                    <td colSpan={columns.length + 1} className="text-center" style={{ height: "100px", verticalAlign: "middle" }}>
                                        No Data Found
                                    </td>
                                </tr>
                            ) : (
                                table.getRowModel().rows.map((row) => (
                                    <tr key={row.id}>
                                        {row.getVisibleCells().map((cell) => (
                                            <td key={cell.id}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            )}
                        </tbody>

                    </Table>
                </div>

                {totalRows > 0 && (
                    <div className="d-flex justify-content-between align-items-center mt-1 mb-3">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <p className="m-0 text-muted">
                                Showing {start} – {end} of {totalData}
                            </p>
                        </div>
                        <div>
                            <button
                                className="btn btn-secondary me-2"
                                onClick={() => setPageIndex((prev) => Math.max(prev - 1, 0))}
                                disabled={pageIndex === 0}
                                style={{
                                    backgroundColor: pageIndex === 0 ? "#d3d3d3" : "#F28C28",
                                    borderColor: pageIndex === 0 ? "" : "#F28C28",
                                    color: pageIndex === 0 ? "" : "#fff",
                                }}
                            >
                                Previous
                            </button>

                            <button
                                className="btn btn-secondary"
                                onClick={() => setPageIndex((prev) => (nextCursor ? prev + 1 : prev))}
                                disabled={!nextCursor}
                                style={{
                                    backgroundColor: nextCursor ? "#F28C28" : "#d3d3d3",
                                    borderColor: nextCursor ? "#F28C28" : "",
                                    color: nextCursor ? "#fff" : "",
                                }}
                            >
                                Next
                            </button>

                        </div>
                       
                    </div>
                )}
                {/* 
            <div className="mt-2 d-flex gap-2">
                <button className="btn btn-primary" onClick={exportToExcel}>
                    Export Excel
                </button>
                <button className="btn btn-primary" onClick={exportToPDF}>
                    Export PDF
                </button>
            </div> */}
            </div>
        </Fragment>
    );
};

export default ProductDataTable;
