import { getEncryptedCookie } from "pages/Utility/cookieUtils";


export const useUserRole = () => {
  const role = getEncryptedCookie("role");
  const vendorName = getEncryptedCookie("vendor_name");

  return {
    role,
    vendorName,
    isAdmin: role === "Admin",
    isVendor: role === "Vendor",
  };
};
