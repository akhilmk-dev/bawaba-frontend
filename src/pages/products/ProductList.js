import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'reactstrap';
import { fetchProductsRequest } from 'store/actions';  // Add action for fetching products
import Breadcrumb from 'components/Common/Breadcrumb2';
import { useNavigate } from 'react-router-dom';
import ProductTable from './ProductTable';
import { GoPlus } from "react-icons/go";


const ProductList = () => {
    const dispatch = useDispatch();
    const products = useSelector((state) => state.Product.products); 

    const loading = useSelector((state) => state.Product.loading); 
    const error = useSelector((state) => state.Product.error); 
    const navigate = useNavigate();


    return (
        <div className="page-content container-fluid mt-4">
            {/* Page header */}
            <div className="d-flex justify-content-between align-items-center mx-3">
                <Breadcrumb
                    title="Products"
                    breadcrumbItems={[
                        { title: 'Dashboard', link: '/dashboard' },
                        { title: 'Products', link: '#' }
                    ]}
                />
                {/* Optionally, add a button for adding a new product */}
                <Button color="primary" onClick={() => navigate('/CreateProduct')}>
                   <GoPlus size={18} color="white"/> Add Product
                </Button>
            </div>

            {/* Products table */}
            <ProductTable
                products={products?.data || []}
                totalrows={products?.total || 0}
                loading={loading}
                error={error}
            />
        </div>
    );
};

export default ProductList;
