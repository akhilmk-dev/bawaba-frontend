// userSchemaWithVendorFields.js
import * as Yup from 'yup';
export const userSchemaWithoutVendorFields = (initialData) =>
    Yup.object({
      name: Yup.string().required('Name is required'),
      email: Yup.string().email('Invalid email address').required('Email is required'),
      password: initialData
        ? Yup.string()
        : Yup.string().required('Password is required').min(6, 'Minimum 6 characters'),
  
      role: Yup.object({
        value: Yup.string().required(),
        label: Yup.string().required(),
      }).nullable().required('Role is required'),
    });
    
export const userSchemaWithVendorFields = (initialData) =>
  Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: initialData
      ? Yup.string()
      : Yup.string().required('Password is required').min(6, 'Minimum 6 characters'),

    role: Yup.object({
      value: Yup.string().required(),
      label: Yup.string().required(),
    }).nullable().required('Role is required'),

    // Vendor fields required
    store_name: Yup.string().required('Store name is required'),
    business_name: Yup.string().required('Business name is required'),
    id_proof_number: Yup.string().required('ID proof number is required'),
    id_proof_file: Yup.string().required('ID proof file is required'),
    tl_number: Yup.string().required('TL number is required'),
    vat_number: Yup.string().required('VAT number is required'),
    corporate_address: Yup.string().required('Corporate address is required'),
    bank_name: Yup.string().required('Bank name is required'),
    bank_branch: Yup.string().required('Bank branch is required'),
    account_name: Yup.string().required('Account name is required'),
    account_number: Yup.string().required('Account number is required'),
    iban: Yup.string().required('IBAN is required'),
  });
