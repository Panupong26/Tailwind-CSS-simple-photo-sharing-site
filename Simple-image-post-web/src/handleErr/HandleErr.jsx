import { toast } from "react-toastify";
import { FONTEND_URL } from "../env";
import { removeToken } from "../tokenCheck/localStorage";


export const handleErr = (err) => {
    
    if(err?.response) {
        if(err.response.status === 401) {
            removeToken();
            window.location.reload();

        } else if(err.response.status === 400) {
            toast.error(err.response.data.message, {
                position: 'top-center',
                autoClose: 2000,
            });
        } else if(err.response.status === 404) {
            window.location.href = '/';

        } /*else if(err.response.status === 500) {
            window.location.replace(`${FONTEND_URL}/error/500`);
        } else {
            window.location.replace(`${FONTEND_URL}/error/${err.response.status}/${err.response.data.message}`);
        }*/
    } else {
       // window.location.replace(FONTEND_URL);
    }
}