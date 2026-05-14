import { toast } from 'react-toastify'
import Swal from 'sweetalert2'

// Success notification
export const showSuccess = (message) => {
  toast.success(message, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  })
}

// Error notification
export const showError = (message) => {
  toast.error(message, {
    position: "top-right",
    autoClose: 4000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  })
}

// Info notification
export const showInfo = (message) => {
  toast.info(message, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  })
}

// Warning notification
export const showWarning = (message) => {
  toast.warning(message, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  })
}

// Confirmation modal - returns Promise
export const showConfirm = (title, message, confirmText = "Yes", cancelText = "Cancel") => {
  return Swal.fire({
    title: title,
    text: message,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ab3500',
    cancelButtonColor: '#6c757d',
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
  })
}

// Info modal
export const showModal = (title, message, icon = 'info') => {
  return Swal.fire({
    title: title,
    text: message,
    icon: icon,
    confirmButtonColor: '#ab3500',
    confirmButtonText: 'OK',
  })
}

// Success modal
export const showSuccessModal = (title, message) => {
  return Swal.fire({
    title: title,
    text: message,
    icon: 'success',
    confirmButtonColor: '#ab3500',
    confirmButtonText: 'OK',
  })
}

// Error modal
export const showErrorModal = (title, message) => {
  return Swal.fire({
    title: title,
    text: message,
    icon: 'error',
    confirmButtonColor: '#ab3500',
    confirmButtonText: 'OK',
  })
}
