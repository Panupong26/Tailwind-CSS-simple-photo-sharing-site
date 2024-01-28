import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFaceSmile, faFaceLaughSquint } from "@fortawesome/free-regular-svg-icons";
import { useEffect } from "react";
import axios from "../config/axios";
import { useContext } from "react";
import { loadingContext } from "../contexts/LoadingContextProvider";
import { handleErr } from "../handleErr/HandleErr";
import { toast } from "react-toastify";
import { setToken } from "../tokenCheck/localStorage";
import { FONTEND_URL } from "../env";
import Keycloak from 'keycloak-js';

const initialInput = {
    username: '',
    password: '',
    confirmPassword: ''
}

export default function LoginPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [input, setInput] = useState(initialInput);
    const { setIsLoading } = useContext(loadingContext);
    const [errMsg, setErrMsg] = useState();

    const handleChangeInput = e => {
        setInput({...input, [e.target.name]: e.target.value});
    }

    const createUser = async (e) => {
        e.preventDefault();

        const errMsg = {};

        if(!(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(input.username))) {
            errMsg.username = 'รูปแบบของชื่อผู้ใช้ไม่ถูกต้อง'
        } 

        if(!(/^[a-zA-Z0-9]{6,30}$/.test(input.password))) {
            errMsg.password = 'รูปแบบของรหัสผ่านไม่ถูกต้อง'
        } 

        if(input.password !== input.confirmPassword) {
            errMsg.confirmPassword = 'รหัสผ่านไม่ตรงกัน'
        }

        if(Object.keys(errMsg).length > 0) {
            setErrMsg({...errMsg});
            
            return;
        } else {
            setErrMsg();
        }
        
        setIsLoading(true);
        await axios.post('/user/createuser', {input})
        .then(() => {
            toast('สมัครสมาชิกสำเร็จ!', {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                });

            setIsLogin(true);
        })
        .catch(err => {
            handleErr(err);
        })
        .finally(() => {
            setIsLoading(false);
        })
    } 

    const login = async (e) => {
        e.preventDefault();

        const errMsg = {};

        if(!input.username) {
            errMsg.username = 'กรุณาใส่ชื่อผู้ใช้'
        } 

        if(!input.password) {
            errMsg.password = 'กรุณาใส่รหัสผ่าน'
        } 

        if(Object.keys(errMsg).length > 0) {
            setErrMsg({...errMsg});
            
            return;
        } else {
            setErrMsg();
        }
        
        setIsLoading(true);
        await axios.post('/user/login', {input})
        .then(res => {

            setToken(res.data);
            window.location.replace(`${FONTEND_URL}/explorer`);
        })
        .catch(err => {
            handleErr(err);
        })
        .finally(() => {
            setIsLoading(false);
        })
    } 

   const keycloakLogin = async () => {
        console.log("hi")
        const keycloakConfig = {
            url: 'https://localhost:8080',
            realm: 'master',
            clientId: 'account',
            checkLoginIframe: false,
            cookieSameSite: 'None',
          };
          
        const keycloak = new Keycloak(keycloakConfig);

        keycloak.init({ onLoad: 'login-required' }).then((authenticated) => {
            if (authenticated) {
              console.log('User is authenticated');
            } else {
              console.log('User not authenticated');
            }
          });
    }

    useEffect(() => {
        setInput({...initialInput});
        setErrMsg();
    }, [isLogin])

    return <>
        <div className="w-screen h-screen bg-white">
            <div className="bg-gray-100 shadow-md w-[340px] h-80 rounded-xl absolute right-1/2 translate-x-1/2 bottom-1/2 translate-y-1/2 p-1">
                <div className="absolute w-full h-full rounded-xl flex justify-between content-center">
                    
                    <div className="my-auto w-max h-max pl-2 text-gray-400 text-center">
                         <FontAwesomeIcon icon={faFaceLaughSquint} className="text-6xl"/>
                        <div className="text-sm text-gray-500 font-semibold mx-auto my-1 w-20">"Hi"</div>
                        <button onClick={() => setIsLogin(true)} className="rounded-full px-1 mt-5 text-sm hover:text-gray-500 hover:underline">Sign in</button>
                    </div>
                    <div className="my-auto w-max h-max pr-6 text-gray-400 text-center">
                        <FontAwesomeIcon icon={faFaceSmile} className="text-6xl"/>
                        <div className="text-lg text-gray-500 font-semibold mx-auto my-1">"Hi"</div>
                        <button onClick={() => setIsLogin(false)} className="rounded-full px-1 mt-5 text-sm hover:text-gray-500 hover:underline">Sign up</button>
                    </div>

                </div>
                <div className={`h-full w-[70%] rounded-xl relative left-0 ${isLogin? 'ml-0' : 'ml-[30%]'} transition-all delay-200 shadow-md`}>
                    <div className={`${isLogin? 'w-full' : 'w-0'} transition-all delay-200 h-full bg-white rounded-xl absolute overflow-hidden flex justify-center content-center`}>
                        
                        <form onSubmit={e => login(e)}  className="m-auto text-center">

                            {errMsg && Object.values(errMsg).map(msg => <div key={Math.random()} className="w-max h-fit mx-auto my-2 text-red-400 font-semibold text-sm">{msg}</div>) }
                            
                            <input name='username' placeholder="Email" value={input.username} onChange={e => handleChangeInput(e)} className={`bg-white rounded-full w-[90%] outline-none border-2 ${errMsg?.username? 'border-red-200' : 'border-gray-300'} text-black p-2 my-2`}/>
                            <input name='password' type='password' placeholder="Password" value={input.password} onChange={e => handleChangeInput(e)} className={`bg-white rounded-full w-[90%] outline-none border-2 ${errMsg?.password? 'border-red-200' : 'border-gray-300'} text-black p-2 my-2`}/>
                            <button className="rounded-full w-[90%] outline-none  bg-gray-400 text-white p-2 mt-2 hover:bg-gray-500">Sign in</button>
                        </form>
                        <button onClick={keycloakLogin}  className="rounded-full w-[90%] outline-none  bg-gray-400 text-white p-2 mt-2 hover:bg-gray-500">Sign in by Keycloak</button>
                    </div>


                    <div className={`${isLogin? 'w-0' : 'w-full'} transition-all delay-200 h-full bg-white rounded-xl absolute overflow-hidden flex justify-center content-center`}>
                        
                        <form className="m-auto text-center"  onSubmit={e => createUser(e)} >
                            {errMsg && Object.values(errMsg).map(msg => <div key={Math.random()} className="w-max h-fit mx-auto text-red-400 font-semibold text-sm">{msg}</div>) }

                            <input  name='username' placeholder="Email" value={input.username} onChange={e => handleChangeInput(e)} className={`bg-white rounded-full w-[90%] outline-none border-2 ${errMsg?.username? 'border-red-200' : 'border-gray-300'} text-black p-2 my-2`}/>
                            <input  name='password' type='password' placeholder="Password" value={input.password} onChange={e => handleChangeInput(e)} className={`bg-white rounded-full w-[90%] outline-none border-2 ${errMsg?.password? 'border-red-200' : 'border-gray-300'} text-black p-2 my-2`}/>
                            <input  name='confirmPassword' type='password' placeholder="Confirm Password" value={input.confirmPassword} onChange={e => handleChangeInput(e)} className={`bg-white rounded-full w-[90%] outline-none border-2 ${errMsg?.confirmPassword? 'border-red-200' : 'border-gray-300'} text-black p-2 my-2`}/>
                
                            <button className="rounded-full w-[90%] outline-none  bg-gray-400 text-white p-2 mt-2 hover:bg-gray-500">Sign up</button>
                        </form>
                    </div>
                </div>
                    

            </div>
        </div>
    </>
}