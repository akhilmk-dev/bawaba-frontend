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
import { formatDateTimeToAmPm ,convertToDateOnly } from "helpers/dateFormat_helper";
import { convertToAMPM } from "helpers/format_helper";
// import { AiOutlineFileExcel } from "react-icons/ai";
import { PiMicrosoftExcelLogoFill } from "react-icons/pi";
import { BsFileEarmarkPdf } from "react-icons/bs";
import { AiOutlineFilePdf } from "react-icons/ai";
import { PiFileArrowDown } from "react-icons/pi";
import { AiOutlinePrinter } from "react-icons/ai";
import { IoIosSearch } from "react-icons/io";


// Global Filter (Debounced Input)
const DebouncedInput = ({ value: initialValue, onChange, debounce = 500, ...props }) => {
  const [value, setValue] = useState(initialValue);


  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [debounce, onChange, value]);

  return (
    <React.Fragment>
      <Col sm={4}>
        <div style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
          <input
            {...props}
            value={value}
            type="search"
            onChange={(e) => setValue(e.target.value)}
            style={{
              paddingLeft: '30px',
              width: '100%',
              boxSizing: 'border-box',
            }}
          />
          <IoIosSearch
            style={{
              position: 'absolute',
              left: '10px',
              top: '40%',
              transform: 'translateY(-50%)',
              color: 'gray',
              cursor: 'pointer',
            }}
            size={16}
          />
        </div>
      </Col>
    </React.Fragment>
  );
};

const TableContainer = ({
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
  loading,
  docName = "doc"
}) => {
  const [globalFilter, setGlobalFilter] = useState("");
  const tableRef = useRef(); // Create a reference for the table content
  const [filteredData, setFilteredData] = useState(data || []);

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
    cell: ({ row, table }) => {
      return row.index + 1;
    },
    enableSorting: false,
    enableColumnFilter: false,
  };

  // Finally, set the columns with serial number prepended
  table.setOptions((prev) => ({
    ...prev,
    columns: [serialNumberColumn, ...columns]
  }));


  const { getHeaderGroups, getRowModel, getCanPreviousPage, getCanNextPage, getPageOptions, getPageCount, setPageIndex, nextPage, previousPage, getState } = table;

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
          }else if (col.accessorKey === "requestedOn") {
            value = formatDateTimeToAmPm(value);
          }else if (col.accessorKey === "newEndDateTime" || col.accessorKey === "proposedEndDateTime") {
            value = formatDateTimeToAmPm(value);
          }else if (col.accessorKey === "createdAt") {
            value = formatDateTimeToAmPm(value);
          }else if (col.accessorKey === "date") {
            value = convertToDateOnly(value);
          }else if (col.accessorKey === "startTime" || col.accessorKey === "endTime") {
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
          }else if (col.accessorKey === "newEndDateTime" || col.accessorKey === "proposedEndDateTime") {
            value = formatDateTimeToAmPm(value);
          }else if (col.accessorKey === "createdAt") {
            value = formatDateTimeToAmPm(value);
          }else if (col.accessorKey === "date") {
            value = convertToDateOnly(value);
          }else if (col.accessorKey === "startTime" || col.accessorKey === "endTime") {
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
                }else if (col.accessorKey === "requestedOn") {
                  cellValue = formatDateTimeToAmPm(cellValue);
                }else if (col.accessorKey === "newEndDateTime" || col.accessorKey === "proposedEndDateTime") {
                  cellValue = formatDateTimeToAmPm(cellValue);
                }else if (col.accessorKey === "createdAt") {
                  cellValue = formatDateTimeToAmPm(cellValue);
                }else if (col.accessorKey === "date") {
                  cellValue = convertToDateOnly(cellValue);
                }else if (col.accessorKey === "startTime" || col.accessorKey === "endTime") {
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

  const exportToCsv = () => {
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
          }else if (col.accessorKey === "requestedOn") {
            value = formatDateTimeToAmPm(value);
          }else if (col.accessorKey === "newEndDateTime" || col.accessorKey === "proposedEndDateTime") {
            value = formatDateTimeToAmPm(value);
          }else if (col.accessorKey === "createdAt") {
            value = formatDateTimeToAmPm(value);
          }else if (col.accessorKey === "date") {
            value = convertToDateOnly(value);
          }else if (col.accessorKey === "startTime" || col.accessorKey === "endTime") {
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
  }

  // const currentPage = getState().pagination.pageIndex;
  // const startIndex = currentPage * 10 + 1;
  // const endIndex = Math.min((currentPage + 1) * 10, data.length);

  const totalFilteredRows = table.getFilteredRowModel().rows.length;
  const pageSize = table.getState().pagination.pageSize;
  const currentPageIndex = table.getState().pagination.pageIndex;

  const pageStart = totalFilteredRows === 0 ? 0 : currentPageIndex * pageSize + 1;
  const pageEnd = Math.min((currentPageIndex + 1) * pageSize, totalFilteredRows);


  return (
    <Fragment>
      <Row className="mb-2">
        {isGlobalFilter && (
          <>
            <DebouncedInput
              value={globalFilter ?? ""}
              onChange={(value) => setGlobalFilter(String(value))}
              className="form-control search-box me-2 mb-2 d-inline-block"
              placeholder={SearchPlaceholder}
            />

            {/* Export Buttons */}
            {/* <Col sm={8} className="text-end">
              <Button className="btn btn-primary bg-primary text-white me-2" onClick={exportToExcel}>
                <PiMicrosoftExcelLogoFill size={18} /> Excel
              </Button>
              <Button className="bwhite bg-primary text-white me-2" onClick={exportToPDF}>
                <AiOutlineFilePdf size={18} style={{ marginBottom: "1px" }} /> PDF
              </Button>
              <Button
                className="btn btn-primary bg-primary text-white me-2"
                onClick={exportToCsv}
              >
                <PiFileArrowDown size={19} /> CSV
              </Button>

              <Button className="btn btn-primary bg-primary text-white" onClick={handlePrint}>
                <AiOutlinePrinter size={18} /> Print
              </Button>
            </Col> */}
          </>
        )}
      </Row>

      <div className="table-responsive" id="table-to-print" ref={tableRef}>
        <Table hover className={tableClass} bordered>
          <thead>
            {getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) =>
                  !header.isPlaceholder ? (
                    <th key={header.id}>{flexRender(header.column.columnDef.header, header.getContext())}</th>
                  ) : null
                )}
              </tr>
            ))}
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length+1} className="text-center border-none">
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px' }}>
                    <FadeLoader color="#f28c28" size={40} />
                  </div>
                </td>
              </tr>
            ) : (data?.length <= 0 || getRowModel()?.rows?.length === 0) ? (
              <tr>
                <td colSpan={columns.length} className="text-center">
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

      {(isPagination && getRowModel()?.rows?.length !== 0) && (
        <Row className="justify-content-md-end justify-content-center align-items-center mt-2">
          <Col>
            <div className="dataTables_info">
              {/* Showing {startIndex} to {endIndex} of {data.length} Results */}
              Showing {pageStart} to {pageEnd} of {totalFilteredRows} Results
            </div>
          </Col>
          <Col className="col-md-auto">
            <div className={paginationWrapper}>
              <ul className={pagination}>
                {/* Previous Button */}
                <li
                  className={`paginate_button page-item previous ${!getCanPreviousPage() ? "disabled" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={previousPage}
                    disabled={!getCanPreviousPage()}
                  >
                    <i className="mdi mdi-chevron-left"></i>
                  </button>
                </li>

                {/* Page Numbers Logic */}
                {(() => {
                  const pageCount = getPageCount();
                  const pageIndex = getState().pagination.pageIndex;
                  let startPage = Math.floor(pageIndex / 3) * 3; // Calculate starting page for the range
                  let endPage = startPage + 2; // Show up to 3 pages in the range

                  // Ensure we don't go beyond the page count
                  if (endPage >= pageCount) {
                    endPage = pageCount - 1;
                    startPage = Math.max(0, endPage - 2);
                  }

                  const pageNumbers = [];
                  for (let i = startPage; i <= endPage; i++) {
                    pageNumbers.push(i);
                  }

                  return pageNumbers.map((item) => (
                    <li
                      key={item}
                      className={`paginate_button page-item ${pageIndex === item ? "active" : ""}`}
                    >
                      <button
                        className="page-link"
                        onClick={() => setPageIndex(item)}
                      >
                        {item + 1}
                      </button>
                    </li>
                  ));
                })()}

                {/* Next Button */}
                <li
                  className={`paginate_button page-item next ${!getCanNextPage() ? "disabled" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={nextPage}
                    disabled={!getCanNextPage()}
                  >
                    <i className="mdi mdi-chevron-right"></i>
                  </button>
                </li>
              </ul>
            </div>
          </Col>
        </Row>
      )}

    </Fragment>
  );
};

export default TableContainer;
