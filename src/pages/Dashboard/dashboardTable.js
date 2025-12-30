import React from "react";

const tableWrapper = {
  width: "100%",
  overflowX: "hidden",
  overflowY: "hidden",
};

const tableContainer = {
  background: "#fff",
  borderRadius: "8px",
  padding: "20px",
  border: "1px solid #f1f1f1",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  tableLayout: "fixed",
};

const thStyle = {
  padding: "12px",
  fontWeight: "600",
  color: "#333",
  borderBottom: "1px solid #f1f1f1",
  background: "#fafafa",
  whiteSpace: "nowrap",
};

const tdStyle = {
  padding: "12px",
  borderBottom: "1px solid #f1f1f1",
  color: "#000",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
  overflow: "hidden",
};

const statusStyles = {
  paid: {
    background: "#d4edda",
    color: "#155724",
    padding: "4px 10px",
    borderRadius: "6px",
    display: "inline-block",
    fontWeight: "600",
    fontSize: "12px",
    textTransform: "capitalize",
  },
  unpaid: {
    background: "#f8d7da",
    color: "#721c24",
    padding: "4px 10px",
    borderRadius: "6px",
    display: "inline-block",
    fontWeight: "600",
    fontSize: "12px",
    textTransform: "capitalize",
  },
  pending: {
    background: "#fff3cd",
    color: "#856404",
    padding: "4px 10px",
    borderRadius: "6px",
    display: "inline-block",
    fontWeight: "600",
    fontSize: "12px",
    textTransform: "capitalize",
  },
  refunded: {
    background: "#d1ecf1",
    color: "#0c5460",
    padding: "4px 10px",
    borderRadius: "6px",
    display: "inline-block",
    fontWeight: "600",
    fontSize: "12px",
    textTransform: "capitalize",
  },
};



const DashboardTable = ({ title, columns, data }) => {
  return (
    <div style={tableContainer}>
      <div style={tableWrapper}>
        <table style={tableStyle}>
          <thead>
            <tr>
              {columns.map((col, index) => (
                <th key={index} style={thStyle}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  style={{ padding: "20px", textAlign: "center" }}
                >
                  No Data Found
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {columns.map((col, colIndex) => {
                    const value = row[col.field];

                    // 🎨 Payment Status with color badges
                    if (col.field === "paymentStatus") {
                      const key = value?.toLowerCase(); // normalize

                      return (
                        <td key={colIndex} style={tdStyle}>
                          <span style={statusStyles[key] || {}}>
                            {value}
                          </span>
                        </td>
                      );
                    }

                    return (
                      <td
                        key={colIndex}
                        style={{
                          ...tdStyle,
                          maxWidth:
                            col.field === "title" ? "150px" : "auto",
                        }}
                        title={
                          col.field === "title" ? row[col.field] : undefined
                        }
                      >
                        {value}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};


export default DashboardTable;
