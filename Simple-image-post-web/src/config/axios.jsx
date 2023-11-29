import axios from 'axios';
import { getToken } from '../tokenCheck/localStorage';
import { API_URL } from '../env';

axios.defaults.baseURL = API_URL ;

axios.interceptors.request.use(
    config => {
        const token = getToken() ;

        if(token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config ;
    },
    error => {
        return Promise.reject(error);
    }
);

export default axios ;