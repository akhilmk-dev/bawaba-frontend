
import { CSVLink } from "react-csv";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import { useReactToPrint } from "react-to-print"; // Importing the hook
import React, { useState, useEffect } from 'react';
import { Col } from "reactstrap";
import { IoIosSearch } from 'react-icons/io';


export const addMinutesToTime = (timeString, minutesToAdd) => {
    // Split the time string into hours and minutes
    const [hours, minutes] = timeString?.split(':')?.map(Number);

    // Create a Date object based on the current date but with the selected time
    const date = new Date();
    date.setHours(hours, minutes); // Set the time

    // Add the estimated time (in minutes) to the Date object
    date.setMinutes(date.getMinutes() + minutesToAdd);

    // Format the result back to HH:mm format
    const endTime = date.toTimeString().slice(0, 5);
    return endTime;
};

export const exportToExcel = (data, columns) => {
    const fullData = data?.map((row) => {
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
export const exportToPDF = (data, columns, docName) => {
    const doc = new jsPDF();
    const columnHeaders = columns
        .filter((col) => col.header !== "Actions" && col.header !== "Catalogue Image")
        .map((col) => col.header);

    const tableData = data?.map((row) =>
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
        body: data,
    });
    doc.save(`${docName}.pdf`);
};

// Printing Table
export const handlePrint = (data, columns, docName) => {

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
          ${data
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

export const exportToCsv = (data, columns, docName) => {
    const fullData = data?.map((row) => {
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
}

export const DebouncedInput = ({ value: initialValue, onChange, debounce = 500, ...props }) => {
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
        <div style={{ position: 'relative', display: 'inline-block', maxWidth:"300px", minWidth: '200px' }}>
            <input
                {...props}
                value={value}
                type="search"
                onChange={(e) => setValue(e.target.value)}
                style={{
                    paddingLeft: '30px',
                    width: '100%',
                    boxSizing: 'border-box',
                    height: '38px',
                }}
            />
            <IoIosSearch
                style={{
                    position: 'absolute',
                    left: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'gray',
                    cursor: 'pointer',
                }}
                size={16}
            />
        </div>
    );
};


export function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = reject;
        reader.onload = () => {
            const base64String = reader.result.split(",")[1]; // extract only base64
            resolve(base64String);
        };
        reader.readAsDataURL(file);
    });
}

export function generateVariants(options, defaultPrice) {
    const result = [];
    function helper(idx, current) {
        if (idx === options?.length) {
            result.push({
                option1: current[0] || null,
                option2: current[1] || null,
                option3: current[2] || null,
                price: defaultPrice,
                inventory_quantity: 0,
                sku: current.join("-").toUpperCase() || "SKU",
            });
            return;
        }
        options?.[idx]?.values?.forEach((val) => {
            helper(idx + 1, [...current, val]);
        });
    }
    helper(0, []);
    return result;
}