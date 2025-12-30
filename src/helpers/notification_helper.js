import toast from "react-hot-toast"

export const showError = (msg)=>{
    toast.dismiss();
    toast.error(msg)
}

export const showSuccess = (msg)=>{
    toast.dismiss();
    toast.success(msg)
}