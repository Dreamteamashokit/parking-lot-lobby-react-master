import { toast } from 'react-toastify';

export function successToast(message) {
    toast.success(message, {autoClose:3000})
}
export function errorToast(message) {
    toast.error(message, {autoClose:2000})
}