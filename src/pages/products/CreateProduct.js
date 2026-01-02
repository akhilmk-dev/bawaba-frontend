
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
    }),
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

              {/* ---------- OPTIONS SECTION ---------- */}
              <div style={cardStyle}>
                <div style={cardTitle}>Options</div>

                <FieldArray name="options">
                  {({ push, remove }) => (
                    <div className="d-flex flex-column gap-3">

                      {formik.values.options?.map((option, idx) => (
                        <div
                          key={idx}
                          style={{
                            border: "1px solid #dfe3e8",
                            padding: "16px",
                            borderRadius: "10px",
                            background: "#fafbfc",
                          }}
                        >
                          <Row className="align-items-center mb-3">
                            <Col md={10}>
                              <Label style={labelStyle}>Option Name</Label>
                              <Field
                                name={`options.${idx}.name`}
                                as={Input}
                                placeholder="Option Name"
                              />
                            </Col>

                            {/* 🗑 TRASH ICON FOR REMOVE OPTION */}
                            <Col md={2} className="text-end">
                              <span
                                onClick={() => remove(idx)}
                                style={{ cursor: "pointer" }}
                              >
                                <FaRegTrashAlt size={16} color="red" />
                              </span>

                            </Col>
                          </Row>

                          <Label style={labelStyle}>Values</Label>

                          <div className="d-flex flex-column gap-2">

                            {option.values?.map((value, vIdx) => (
                              <div
                                key={vIdx}
                                style={{
                                  display: "flex",
                                  gap: "10px",
                                  alignItems: "center",
                                }}
                              >
                                <Field
                                  name={`options.${idx}.values.${vIdx}`}
                                  as={Input}
                                  placeholder="Value"
                                />

                                {/* 🗑 TRASH ICON FOR REMOVE VALUE */}
                                <span
                                  onClick={() => {
                                    const updated = [...option.values];
                                    updated.splice(vIdx, 1);
                                    formik.setFieldValue(`options.${idx}.values`, updated);
                                  }}
                                  style={{ cursor: "pointer" }}
                                >
                                  <FaRegTrashAlt size={16} color="red" />
                                </span>


                                {/* ➕ ADD VALUE ICON — ONLY ON LAST VALUE */}
                                {vIdx === option.values.length - 1 && (
                                  <span
                                    onClick={() =>
                                      formik.setFieldValue(
                                        `options.${idx}.values`,
                                        [...option.values, ""]
                                      )
                                    }
                                    style={{ cursor: "pointer", marginLeft: "4px" }}
                                  >
                                    <BsPlusSquareDotted size={18} color="" />
                                  </span>
                                )}

                              </div>
                            ))}

                          </div>
                        </div>
                      ))}

                      {/* ➕ ADD OPTION BUTTON */}
                      <span
                        onClick={() =>
                          push({
                            name: `Option ${formik.values.options?.length + 1}`,
                            values: [""],
                          })
                        }
                        style={{
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          color: "black", // primary blue
                          fontWeight: 500,
                          marginTop: "8px"
                        }}
                      >
                        <BsPlusCircle size={18} />
                        Add another option
                      </span>
                      <div style={{ marginTop: "16px", textAlign: "left" }}>
                        <Button
                          color="primary"
                          type="submit"
                          disabled={formik.isSubmitting}
                          style={{ width: "auto", minWidth: "100px" }}
                        >
                          {id ? "Update Product" : "Create Product"}
                        </Button>
                      </div>


                    </div>


                  )}
                </FieldArray>
              </div>



              {/* ---------- VARIANTS SECTION ---------- */}
              {variants?.length > 0 && variants?.some(v => v.option1 || v.option2 || v.option3) && (
                <div style={cardStyle}>
                  <div style={cardTitle}>Variants</div>
                  <Row className="fw-bold mb-2" style={{ padding: "10px 0", borderBottom: "1px solid #dfe3e8" }}>
                    <Col md={4}>Variant</Col>
                    <Col md={4}>Price</Col>
                    <Col md={4}>inventory_quantity</Col>
                  </Row>
                  {variants?.map((variant, idx) => (
                    <Row key={idx} className="align-items-center mb-2" style={{ padding: "8px 0", borderBottom: "1px solid #f0f0f0" }}>
                      <Col md={4}>
                        <span style={{ fontSize: "15px", fontWeight: 500 }}>
                          {[variant.option1, variant.option2, variant.option3].filter(Boolean).join(" - ")}
                        </span>
                      </Col>
                      <Col md={4}>
                        <Input
                          type="number"
                          value={variant.price}
                          placeholder="Price"
                          onChange={(e) => {
                            const updated = [...variants];
                            updated[idx].price = e.target.value;
                            setVariants(updated);
                          }}
                        />
                      </Col>
                      <Col md={4}>
                        <Input
                          type="number"
                          value={variant.inventory_quantity}
                          placeholder="Qty"
                          onChange={(e) => {
                            const updated = [...variants];
                            updated[idx].inventory_quantity = Number(e.target.value);
                            setVariants(updated);
                          }}
                        />
                      </Col>
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