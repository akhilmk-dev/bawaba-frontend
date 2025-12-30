import React from 'react';
import { Row, Col } from 'reactstrap';

const Pagination = ({
    currentPage,
    totalPages,
    totalItems,
    pageSize,
    onPageChange,
    showInfo = true,
    className = "pagination justify-content-center mb-0"
}) => {
    const getVisiblePages = () => {
        const delta = 1; // Show only 1 page on each side (total 3 pages)
        const range = [];
        const rangeWithDots = [];

        // Calculate the range of pages to show
        const start = Math.max(1, currentPage - delta);
        const end = Math.min(totalPages, currentPage + delta);

        // Add pages in the range
        for (let i = start; i <= end; i++) {
            range.push(i);
        }

        // Handle first page - only show if it's not in the current range
        if (start > 1) {
            rangeWithDots.push(1);
            if (start > 2) {
                rangeWithDots.push('...');
            }
        }

        // Add the main range
        rangeWithDots.push(...range);

        // Handle last page - only show if it's not in the current range
        if (end < totalPages) {
            if (end < totalPages - 1) {
                rangeWithDots.push('...');
            }
            rangeWithDots.push(totalPages);
        }

        return rangeWithDots;
    };

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages && page !== currentPage) {
            onPageChange(page - 1); // Convert to 0-based index
        }
    };

    const startItem = (currentPage - 1) * pageSize + 1;
    const endItem = Math.min(currentPage * pageSize, totalItems);

    return (
        <Row className="justify-content-md-end justify-content-center align-items-center my-2">
            {showInfo && (
                <Col>
                    <div className="dataTables_info">
                        Showing {startItem} to {endItem} of {totalItems} Results
                    </div>
                </Col>
            )}
            <Col className="col-md-auto">
                <div className="dataTables_paginate paging_simple_numbers">
                    <ul className={className} style={{ listStyle: 'none', display: 'flex', margin: 0, padding: 0 }}>

                        {/* Back Button */}
                        <li style={{ margin: '0 2px' }}>
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                style={{ 
                                    color: "#0C3451",
                                    border: '1px solid #dee2e6',
                                    borderRadius: '0px',
                                    padding: '8px 12px',
                                    backgroundColor: currentPage === 1 ? '#e9ecef' : '#fff',
                                    minWidth: '40px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
                                }}
                                title="Previous"
                            >
                                <i className="mdi mdi-chevron-left"></i>
                            </button>
                        </li>

                        {/* Page Numbers */}
                        {getVisiblePages().map((page, index) => (
                            <li key={index} style={{ margin: '0 2px' }}>
                                {page === '...' ? (
                                    <span style={{ 
                                        color: "#0C3451",
                                        border: '1px solid #dee2e6',
                                        borderRadius: '0px',
                                        padding: '8px 12px',
                                        backgroundColor: '#fff',
                                        minWidth: '40px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        ...
                                    </span>
                                ) : (
                                    <button
                                        onClick={() => handlePageChange(page)}
                                        style={{ 
                                            color: page === currentPage ? "white" : "#0C3451",
                                            backgroundColor: page === currentPage ? "#0C3451" : "#fff",
                                            border: '1px solid #dee2e6',
                                            borderRadius: '0px',
                                            padding: '8px 12px',
                                            minWidth: '40px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontWeight: page === currentPage ? 'bold' : 'normal',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {page}
                                    </button>
                                )}
                            </li>
                        ))}

                        {/* Next Button */}
                        <li style={{ margin: '0 2px' }}>
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                style={{ 
                                    color: "#0C3451",
                                    border: '1px solid #dee2e6',
                                    borderRadius: '0px',
                                    padding: '8px 12px',
                                    backgroundColor: currentPage === totalPages ? '#e9ecef' : '#fff',
                                    minWidth: '40px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
                                }}
                                title="Next"
                            >
                                <i className="mdi mdi-chevron-right"></i>
                            </button>
                        </li>

                    </ul>
                </div>
            </Col>
        </Row>
    );
};

export default Pagination; 