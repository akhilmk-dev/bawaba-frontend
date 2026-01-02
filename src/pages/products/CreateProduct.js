
import React, { useState, useEffect } from "react";
import { FaPlus, FaRegTrashAlt, } from "react-icons/fa";
import { BsPlusSquareDotted, BsPlusCircle } from "react-icons/bs";
import { useFormik, Field, FieldArray, FormikProvider } from "formik";
import * as Yup from "yup";
import {
  Form,
  Label,
  Input,
  Button,
  Row,
  Col,
  FormText
} from "reactstrap";
import axios from "axios";
import Breadcrumb from "components/Common/Breadcrumb2";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { BASE_URL } from "constants/config";
import axiosInstance from "pages/Utility/axiosInstance";
import { useLocation, useNavigate } from "react-router-dom";
import Select from "react-select"
import { useTranslation } from "react-i18next";
import { IoMdClose } from "react-icons/io";
import { showSuccess } from "helpers/notification_helper";
import { fileToBase64, generateVariants } from "helpers/common_helper";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsersRequest } from "store/actions";
import { useUserRole } from "hooks/useUserRole";


const ProductForm = ({ onCreated }) => {
  const { role, vendorName, isAdmin, isVendor } = useUserRole();
  const dispatch = useDispatch();
  const allUsers = useSelector((state) => state.User.users?.data || []);
  const vendors = allUsers.filter(
    (user) => user?.role?.role_name?.toLowerCase() === "vendor"
  );
  const [allImages, setAllImages] = useState([]);
  const [variants, setVariants] = useState([]);
  const [collections, setCollections] = useState([]);
  const { search } = useLocation();
  const query = new URLSearchParams(search)
  const id = query.get("id");
  const [productDetails, setProductDetails] = useState([])
  const { t } = useTranslation()
  const navigate = useNavigate()

  const [marketInventory, setMarketInventory] = useState({});



  useEffect(() => {
    dispatch(fetchUsersRequest());
  }, []);

  const fetchProductDetails = async () => {
    try {
      const response = await axiosInstance.get(`V1/products/${id}`);
      setProductDetails(response.data.data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchProductDetails()
  }, [id])

  useEffect(() => {
    // Fetch collections from backend
    const fetchCollections = async () => {
      try {
        const res = await axiosInstance.get("V1/collections");
        setCollections(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch collections:", err.response?.data || err.message);
      }
    };
    fetchCollections();
  }, []);

  useEffect(() => {
    if (productDetails?.data) {
      const p = productDetails?.data;
      setAllImages(
        p?.images?.map((img) => ({
          id: img.id,
          src: img.src,
          isNew: false,
        })) || []
      );

      setVariants(
        p?.variants?.map((v) => ({
          option1: v.option1,
          option2: v.option2,
          option3: v.option3,
          price: v.price,
          inventory_quantity: v.inventory_quantity,
          sku: v.sku,
        }))
      );

      formik.setValues({
        title: p.title,
        body_html: p.body_html,
        vendor: p.vendor,
        product_type: p.product_type,
        tags: p.tags,
        price: p.variants?.[0]?.price || "",
        options: p.options,
        images: [],
        collectionIds: productDetails?.collectionIds,
        metafields: { vendor_name: "", vendor_id: "" }
      });
    }
  }, [productDetails]);

  useEffect(() => {
    if (isVendor) {
      formik.setFieldValue("vendor", vendorName || "");
    }
  }, [isVendor, vendorName]);






  const formik = useFormik({
    initialValues: {
      title: "",
      body_html: "",
      vendor: "",
      product_type: "",
      tags: "",
      price: "",
      markets: [],
      options: [
        { name: "Color", values: [""] },
        { name: "Size", values: [""] },
        { name: "Material", values: [""] },
      ],
      images: [],
      collectionIds: [],
      metafields: { vendor_name: "", vendor_id: "" },
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Required"),
      price: Yup.number().required("Product price is required").typeError("Must be a number"),
       markets: Yup.array().min(1, "Select at least one market"),
    },

  ),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        // Convert images to base64
        const newImagesBase64 = await Promise.all(
          allImages
            .filter((img) => img.isNew)
            .map((img) => fileToBase64(img.file))
        );

        const payload = {
          product: {
            title: values.title,
            body_html: values.body_html,
            vendor: values.vendor,
            price: values.price,
            product_type: values.product_type,
            tags: values.tags.split(",").map((t) => t.trim()),
            options: values.options.map((opt) => ({
              name: opt.name,
              values: opt.values.filter((v) => v !== ""),
            })),
            variants,
            images: [...newImagesBase64.map((b64) => ({ attachment: b64 })), ...allImages?.filter(item => !item?.isNew)?.map(item => ({ id: item?.id, src: item?.src }))],
          },
          // imagesToKeep: allImages
          //   .filter(img => !img.isNew)
          //   .map(img => Number(img.id)),
          collectionIds: values.collectionIds, // Add collectionIds to payload
        };

        if (id) {
          const res = await axiosInstance.put(`V1/products/update/${id}`, payload);
          resetForm();
          showSuccess("Product updated successfully")
          navigate('/products')
          setPreviewImages([]);
          setVariants([]);
        } else {
          const res = await axiosInstance.post(`V1/products`, payload);
          onCreated && onCreated(res.data);
          resetForm();
          showSuccess("Product added successfully")
          navigate('/products')
          setPreviewImages([]);
          setVariants([]);
        }

      } catch (err) {
        console.error("Failed to create product:", err.response?.data || err.message);
      } finally {
        setSubmitting(false);
      }
    },
  });



  useEffect(() => {
    const newVariants = generateVariants(formik.values.options, formik.values.price || 0);
    const mergedVariants = newVariants.map((v) => {
      const existing = variants.find(
        (ex) =>
          ex.option1 === v.option1 &&
          ex.option2 === v.option2 &&
          ex.option3 === v.option3
      );
      return existing ? { ...v, price: existing.price, inventory_quantity: existing.inventory_quantity } : v;
    });
    setVariants(mergedVariants);
  }, [formik.values.options, formik.values.price]);

  useEffect(() => {
  const inventory = {};

  variants.forEach((_, idx) => {
    inventory[idx] = inventory[idx] || {};
    formik.values.markets.forEach((market) => {
      inventory[idx][market] =
        inventory[idx][market] ?? 0;
    });
  });

  setMarketInventory(inventory);
}, [formik.values.markets, variants]);




  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    const newImgs = files.map((file) => ({
      file,
      src: URL.createObjectURL(file),
      isNew: true
    }));

    setAllImages((prev) => [...prev, ...newImgs]);
  };

  const handleImageRemove = (index) => {
    setAllImages((prev) => prev.filter((_, i) => i !== index));
  };

  const cardStyle = {
    background: "white",
    border: "1px solid #dfe3e8",
    borderRadius: "8px",
    padding: "20px",
    marginBottom: "20px",
  };

  const cardTitle = {
    fontWeight: "600",
    fontSize: "1rem",
    marginBottom: "15px",
  };

  const labelStyle = { fontWeight: 500 };

  const MARKET_OPTIONS = [
  { label: "UAE", value: "uae" },
  { label: "India", value: "india" },
  { label: "Qatar", value: "qatar" },
];


  return (
    <div className="page-content">
      <div className="d-flex justify-content-between align-items-center mx-3">
        <Breadcrumb
          title={id ? "Update product" : "Create product"}
          breadcrumbItems={[
            { title: "Dashboard", link: "/dashboard" },
            { title: id ? "Update Product" : "Create Product", link: "#" },
          ]}
        />
        <Button className="text-white bg-primary" onClick={() => navigate('/products')}>
          ← {t('Back')}
        </Button>
      </div>

      <FormikProvider value={formik}>
        <Form onSubmit={formik.handleSubmit} className="mx-3">

          <Row>
            {/* ================= LEFT COLUMN ================= */}
            <Col md={8}>

              {/* ---------- COMBINED BOX: TITLE + DESCRIPTION + MEDIA ---------- */}
              <div style={cardStyle}>
                {/* Title */}
                <Label style={labelStyle}>Title*</Label>
                <Input
                  id="title"
                  name="title"
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  invalid={!!formik.errors.title && formik.touched.title}
                />
                {formik.errors.title && (
                  <FormText color="danger">{formik.errors.title}</FormText>
                )}

                {/* Description */}
                <Label className="mt-3" style={labelStyle}>Description</Label>
                <ReactQuill
                  theme="snow"
                  value={formik.values.body_html}
                  onChange={(value) => formik.setFieldValue("body_html", value)}
                  placeholder="Write product description…"
                  style={{
                    background: "white",
                    borderRadius: "8px"
                  }}
                />

                <style>
                  {`
    .ql-editor {
      min-height: 200px;
    }
  `}
                </style>


                {/* Media */}
                <Label className="mt-3" style={labelStyle}>Media</Label>
                <Input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <div className="d-flex gap-2 mt-2 flex-wrap">
                  {allImages.map((img, i) => (
                    <div key={i} style={{ position: "relative" }}>
                      <img
                        src={img.src}
                        alt=""
                        style={{
                          width: 100,
                          height: 100,
                          objectFit: "cover",
                          borderRadius: 6,
                          border: "1px solid #e5e5e5",
                        }}
                      />
                      <Button
                        color="danger"
                        size="sm"
                        onClick={() => handleImageRemove(i)}
                        style={{
                          position: "absolute",
                          top: 4,
                          right: 4,
                          padding: "2px 5px",
                          borderRadius: "50%",
                        }}
                      >
                        <IoMdClose size={12} color="white" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* ---------- PRICING ---------- */}
              <div style={cardStyle}>
                <div style={cardTitle}>Pricing</div>
                <Label style={labelStyle}>Price*</Label>
                <Input
                  type="number"
                  id="price"
                  name="price"
                  value={formik.values.price}
                  onChange={formik.handleChange}
                  placeholder="Product price"
                />
                {formik.errors.price && (
                  <FormText color="danger">{formik.errors.price}</FormText>
                )}
              </div>

              {/* ---------- MARKETS ---------- */}
<div style={cardStyle}>
  <div style={cardTitle}>Markets*</div>

  <Select
    isMulti
    options={MARKET_OPTIONS}
    value={MARKET_OPTIONS.filter(m =>
      formik.values.markets.includes(m.value)
    )}
onChange={(selected) => {
  const values = selected.map(s => s.value);
  formik.setFieldValue("markets", values);
}}

  />

  {formik.errors.markets && (
    <FormText color="danger">{formik.errors.markets}</FormText>
  )}
</div>


           {/* ---------- OPTIONS SECTION ---------- */}
<div style={cardStyle}>
  <div style={cardTitle}>Options</div>

  <FieldArray name="options">
    {({ push, remove }) => (
      <div className="d-flex flex-column gap-3">
        {formik.values.options.map((option, idx) => (
          <div key={idx} className="p-3 border rounded">
            <Row>
              <Col md={10}>
                <Field
                  name={`options.${idx}.name`}
                  as={Input}
                  placeholder="Option name"
                />
              </Col>
              <Col md={2} className="text-end">
                <FaRegTrashAlt
                  style={{ cursor: "pointer" }}
                  onClick={() => remove(idx)}
                />
              </Col>
            </Row>

            {option.values.map((v, vIdx) => (
              <div
                key={vIdx}
                className="d-flex gap-2 mt-2 align-items-center"
              >
                <Field
                  name={`options.${idx}.values.${vIdx}`}
                  as={Input}
                  placeholder="Value"
                />

                <FaRegTrashAlt
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    const updated = [...option.values];
                    updated.splice(vIdx, 1);
                    formik.setFieldValue(
                      `options.${idx}.values`,
                      updated
                    );
                  }}
                />

                {vIdx === option.values.length - 1 && (
                  <BsPlusSquareDotted
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      formik.setFieldValue(
                        `options.${idx}.values`,
                        [...option.values, ""]
                      )
                    }
                  />
                )}
              </div>
            ))}
          </div>
        ))}

        <Button
          size="sm"
          onClick={() => push({ name: "", values: [""] })}
        >
          Add option
        </Button>
      </div>
    )}
  </FieldArray>
</div>






          
{/* ---------- VARIANTS + MARKET INVENTORY ---------- */}
{variants.length > 0 && formik.values.markets.length > 0 && (
  <div style={cardStyle}>
    <div style={cardTitle}>Variants Inventory</div>

    <Row className="fw-bold mb-2">
      <Col md={3}>Variant</Col>
      <Col md={3}>Price</Col>

      {formik.values.markets.map((market) => (
        <Col key={market} md={2}>
          {market.toUpperCase()}
        </Col>
      ))}
    </Row>

    {variants.map((variant, idx) => (
      <Row key={idx} className="align-items-center mb-2">
        <Col md={3}>
          {[variant.option1, variant.option2, variant.option3]
            .filter(Boolean)
            .join(" - ")}
        </Col>

        <Col md={3}>
          <Input
            type="number"
            value={variant.price}
            onChange={(e) => {
              const updated = [...variants];
              updated[idx].price = e.target.value;
              setVariants(updated);
            }}
          />
        </Col>

        {formik.values.markets.map((market) => (
          <Col key={market} md={2}>
            <Input
              type="number"
              placeholder="Qty"
              value={marketInventory[idx]?.[market] || ""}
              onChange={(e) => {
                setMarketInventory((prev) => ({
                  ...prev,
                  [idx]: {
                    ...prev[idx],
                    [market]: Number(e.target.value),
                  },
                }));
              }}
            />
          </Col>
        ))}
      </Row>
    ))}
  </div>
)}



            </Col>

            {/* ================= RIGHT COLUMN ================= */}
            <Col md={4}>
              <div style={cardStyle}>
                <div style={cardTitle}>Product Organization</div>

                {/* Vendor */}
                <Label style={labelStyle}>Vendor</Label>
                {isAdmin ? (
                  <Select
                    options={vendors.map((v) => ({ label: v.name, value: v.name }))}
                    value={
                      vendors
                        .map((v) => ({ label: v.name, value: v.name }))
                        .find((opt) => opt.value === formik.values.vendor) || null
                    }
                    onChange={(selected) => {
                      formik.setFieldValue("vendor", selected.value);
                    }}
                    placeholder="Select Vendor"
                  />
                ) : (
                  <Input id="vendor" name="vendor" value={vendorName} readOnly disabled />
                )}

                {/* Product Type */}
                <Label className="mt-3" style={labelStyle}>Product Type</Label>
                <Input
                  id="product_type"
                  name="product_type"
                  value={formik.values.product_type}
                  onChange={formik.handleChange}
                />



                {/* Collections */}
                <Label className="mt-3" style={labelStyle}>Collections</Label>
                <Select
                  isMulti
                  name="collectionIds"
                  closeMenuOnSelect={true}
                  hideSelectedOptions={false}
                  components={{
                    MultiValue: () => null
                  }}
                  options={collections?.map((item) => ({
                    label: item?.title,
                    value: String(item?.id),
                  }))}
                  onChange={(selected) => {
                    const ids = selected ? selected.map((item) => String(item.value)) : [];
                    formik.setFieldValue("collectionIds", ids);
                  }}
                />
                <div className="d-flex flex-wrap gap-2 mt-2">
                  {formik.values.collectionIds.map((id) => {
                    const item = collections.find((col) => String(col.id) === id);

                    return (
                      <div
                        key={id}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          background: "#e9ecef",
                          padding: "4px 10px",
                          borderRadius: "20px",
                          fontSize: "14px",
                        }}
                      >
                        {item?.title}

                        <span
                          onClick={() =>
                            formik.setFieldValue(
                              "collectionIds",
                              formik.values.collectionIds.filter((c) => c !== id)
                            )
                          }
                          style={{
                            marginLeft: "8px",
                            cursor: "pointer",
                            fontWeight: "bold",
                          }}
                        >
                          ×
                        </span>
                      </div>
                    );
                  })}
                </div>


                {/* Tags */}
                <Label className="mt-3" style={labelStyle}>Tags</Label>
                <Input
                  id="tags"
                  name="tags"
                  value={formik.values.tags}
                  onChange={formik.handleChange}
                />



              </div>
            </Col>
          </Row>

          {/* <Button
    color="primary"
    type="submit"
    disabled={formik.isSubmitting}
    className="mt-3 mb-3"
  >
    {id ? "Update Product" : "Create Product"}
    
  </Button> */}

        </Form>

      </FormikProvider>
    </div>
  );
};

export default ProductForm;