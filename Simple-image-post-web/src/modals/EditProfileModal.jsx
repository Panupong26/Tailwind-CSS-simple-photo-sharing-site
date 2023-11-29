import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faPenToSquare, faPen, faCheck } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { useEffect } from "react";
import { DEFAULT_AVATAR } from "../env";
import axios from "../config/axios";
import { useContext } from "react";
import { authContext } from "../contexts/authContextProvider";
import { handleErr } from "../handleErr/HandleErr";
import { loadingContext } from "../contexts/LoadingContextProvider";
import { useLocation } from "react-router-dom";



export default function EditProfileModal({ setEditOpen, user }) {
    const location = useLocation();

    const { setMe } = useContext(authContext);
    const [uploadOpen, setUploadOpen] = useState(false);
    const [isNameEdit, setIsNameEdit] = useState(false);
    const [validateOk, setValidateOk] = useState(false);
    const { setIsLoading } = useContext(loadingContext);
    
    const [input, setInput] = useState({
        profileName: user?.profileName || null,
        detail: user?.detail || null
    });
    const [image, setImage] = useState(user?.profileImage || '');
    const [file, setFile] = useState();

    const handleChaneInput = e => {
        setInput({...input, [e.target.name]: e.target.value})
    }

    const handleChangeFile = e => {
        if(e.target.files[0]) {
            setFile(e.target.files[0]);
            setImage(URL.createObjectURL(e.target.files[0]));
            e.target.value = null;
        }
    }

    const submit = async () => {
        const form = new FormData()
        
        if(file) {
            form.append('profileImage', file);
        }
        
        form.append('input', JSON.stringify(input));

        setIsLoading(true);

        await axios.put('/user/editme', form, {headers: {'Content-Type': 'multipart/form-data'}})
        .then(() => {
            if(file) {
                setMe(prev => {
                    return {
                        ...prev, 
                        profileImage: URL.createObjectURL(file),
                        profileName: input.profileName,
                        detail: input.detail
                    }});
            } else {
                setMe(prev => {
                    return {
                        ...prev, 
                        profileName: input.profileName,
                        detail: input.detail
                    }});
            };

            location.pathname=`/${input.profileName}`
            setEditOpen(false);
        })
        .catch(err => {
            handleErr(err);
        })
        .finally(() => {
            setIsLoading(false);
        })
    }


    useEffect(() => {
        if( (input?.profileName === user?.profileName && input?.detail === user?.detail && !file) || 
            (!input?.profileName || input?.profileName?.includes(' ') || !input?.profileName?.replaceAll(' ','') || !isNaN(+input?.profileName))
        ) {
            setValidateOk(false);
        } else {
            setValidateOk(true);
        }
    }, [input, file])

    return <>
        <div className="fixed w-screen h-screen bg-gray-300/50 z-40" onClick={() => setEditOpen(false)}>
            <div className="absolute right-1/2 translate-x-1/2 bottom-1/2 translate-y-1/2 w-[95%] mx-auto sm:w-96 h-max rounded-xl bg-white text-black text-center shadow-md z-30" onClick={e => e.stopPropagation()}>
                <div className="text-lg font-semibold text-gray-800 shadow-sm text-center h-10 pt-1.5">แก้ไขโปรไฟล์</div>
                <FontAwesomeIcon icon={faXmark} className="absolute top-2 right-2 text-gray-300 hover:cursor-pointer hover:text-gray-600" onClick={() => setEditOpen(false)}/>
                <div className="relative w-full h-64 shadow-sm">
                    <img src={image || DEFAULT_AVATAR} onMouseOver={() => setUploadOpen(true)} className="w-56 h-56 rounded-full absolute right-1/2 translate-x-1/2 bottom-1/2 translate-y-1/2 object-cover"/>
                    {
                    uploadOpen && 
                    <div onMouseLeave={() => setUploadOpen(false)} onClick={() => document.getElementById('inputImage').click()} className="w-56 h-56 rounded-full absolute right-1/2 translate-x-1/2 bottom-1/2 translate-y-1/2 bg-gray-300 opacity-50 hover:cursor-pointer">
                        <FontAwesomeIcon icon={faPenToSquare} className="absolute right-1/2 translate-x-1/2 bottom-1/2 translate-y-1/2 text-xl text-gray-800"/>
                    </div>
                    }
                    <input id='inputImage' type="file" accept="image/*" className="hidden" onChange={e => handleChangeFile(e)}/>
                </div>
                <div className="flex justify-center content-center py-2 ">
                    <input name='profileName' value={input?.profileName || ''} className={`rounded-xl w-60 h-12 mx-5 my-auto ${isNameEdit? 'bg-gray-50' : 'bg-white pointer-events-none'} p-1 text-2xl text-center outline-none`} onChange={e => handleChaneInput(e)}/> 
                    {!isNameEdit && <div className="my-auto text-gray-400 hover:text-gray-500" role='button' onClick={() => setIsNameEdit(true)}><FontAwesomeIcon icon={faPen}/></div>}
                    {isNameEdit && <div className="my-auto text-gray-400 hover:text-gray-500" role='button' onClick={() => setIsNameEdit(false)}><FontAwesomeIcon icon={faCheck}/></div>}
                </div>
                <textarea name='detail' value={input?.detail || ''} placeholder='เกี่ยวกับคุณ...' className="rounded-xl w-60 h-[110px] mx-auto mb-5 bg-gray-50 p-2 resize-none outline-none " onChange={e => handleChaneInput(e)}/> 
                <div className="w-full mb-5">
                    <button className={`${validateOk? '' : 'pointer-events-none'} text-md font-semibold text-gray-400 bg-white border-2 border-gray-300 p-2 w-20 rounded-full mx-2 hover:border-gray-400 hover:text-gray-500`} onClick={submit}>เสร็จสิ้น</button>
                    <button className="text-md font-semibold text-gray-400 bg-white border-2 border-gray-300 p-2 w-20 rounded-full mx-2 hover:border-gray-400 hover:text-gray-500" onClick={() => setEditOpen(false)} > ยกเลิก</button>
                </div>    
            </div>
        </div>
    </>

}