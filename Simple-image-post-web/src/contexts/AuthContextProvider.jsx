import axios from "../config/axios";
import { useState, useEffect, createContext } from "react";
import { getStatus } from "../tokenCheck/localStorage";
import { handleErr } from "../handleErr/HandleErr";


export const authContext = createContext();

export default function AuthContextProvider({ children }) {
    const [status, setStatus] = useState(getStatus());
    const [me, setMe] = useState();

    useEffect(() => {
        const getMe = async () => {
            await axios.get('/user/getme')
            .then(res => {
                setMe({...res.data})
            })
            .catch(err => {
                handleErr(err);
            })
        }

        if(status === 'USER') {
            getMe();
        }
    }, [status])

    return <authContext.Provider value={{status, me, setMe}} >{children}</authContext.Provider>
} 