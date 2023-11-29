import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faMagnifyingGlass, faUser, faXmark, faBars, faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { removeToken } from "../tokenCheck/localStorage";
import axios from "../config/axios";
import { handleErr } from "../handleErr/HandleErr";
import { useContext } from "react";
import { loadingContext } from "../contexts/LoadingContextProvider";
import { authContext } from "../contexts/authContextProvider";
import { DEFAULT_AVATAR } from "../env";
import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { RotatingLines } from "react-loader-spinner";


export default function Navbar() {
    const { me } = useContext(authContext); 

    const location = useLocation();

    const [open, setOpen] = useState(false);
    const [panel, setPanel] = useState(false);
    const [query, setQuery] = useState('');

    const { setIsLoading } = useContext(loadingContext);

    const [userOptions, setUserOptions] = useState();
    const [userOptionsLoading, setUserOptionsLoading] = useState(false);
    

    const handleMouseLeave = () => {
        setOpen(false);
        setQuery('');
    }

    const handlePanelMouseLeave = () => {
        setPanel(false);
    }

    const logout = () => {
        removeToken();
        window.location.reload();
    }

    const deleteUser = async () => {
        setIsLoading(true);

        await axios.delete('/user/deleteme')
        .then(() => {
            removeToken();
            window.location.reload();
        })
        .catch(err => {
            handleErr(err)
        })
        .finally(() => {
            setIsLoading(false);
        })
    }

    useEffect(() => {
        const getUserAutoComplete = async () => {
            setUserOptions();
            setUserOptionsLoading(true);
            await axios.get(`/user/getuserautocomplete/${query}`)
            .then(res => {
                setUserOptions(res.data)
            })
            .catch(err => {
                handleErr(err);
            })
            .finally(() => {
                setUserOptionsLoading(false);
            })
        }
        
        if(query) {
            getUserAutoComplete();
        } else {
            setUserOptions();
        }
    }, [query])



    return <>
        <div className="h-screen w-16 bg-white shadow-md grid grid-rows-4 fixed z-30 hidden lg:grid">
            <Link to="/explorer" className={`row-span-1 ${location.pathname.includes('explorer')? 'text-gray-500' : 'text-gray-300'} text-2xl flex flex-wrap justify-center content-center hover:cursor-pointer hover:text-gray-500 hover:bg-gray-100`}><FontAwesomeIcon icon={faHouse}/></Link>
            <div role="button" onClick={() => window.location.href = `/${me?.profileName}`} className={`row-span-1 ${location.pathname.includes(me?.profileName)? 'text-gray-500' : 'text-gray-300'} text-2xl flex flex-wrap justify-center content-center hover:cursor-pointer hover:text-gray-500 hover:bg-gray-100`}><FontAwesomeIcon icon={faUser}/></div>
            
            <div 
                className={`row-span-1 text-2xl ${open? 'text-gray-500 bg-gray-100' : 'text-gray-300'} flex flex-wrap justify-center content-center hover:cursor-pointer hover:text-gray-500 hover:bg-gray-100`}
                onClick={() => {setOpen(!open); setPanel(false)}}
            >
                <FontAwesomeIcon icon={faMagnifyingGlass}/>
            </div>
            <div 
                className={`row-span-1 text-2xl ${panel? 'text-gray-500 bg-gray-100' : 'text-gray-300'} flex flex-wrap justify-center content-center hover:cursor-pointer hover:text-gray-500 hover:bg-gray-100`}
                onClick={() => {setPanel(!panel); setOpen(false);}}
            >
                <FontAwesomeIcon icon={faBars}/>
            </div>
        </div>


        <div className={`h-screen w-16 bg-white shadow-md fixed z-20 ${open? 'ml-16 w-60': ''} transition-all overflow-hidden text-center hidden lg:block`} onMouseLeave={handleMouseLeave}>
            <div className="bg-gray-100 min-w-max w-44 mx-auto mt-5 mb-2 py-1 px-2 rounded-full flex content-center overflow-hidden ">
                <FontAwesomeIcon icon={faMagnifyingGlass} className="my-auto text-gray-500"/>
                <input className="mx-1 w-40 bg-gray-100 text-gray-700 outline-none" placeholder="ค้นหาผู้คน" value={query} onChange={e => setQuery(e.target.value)}/>
                <FontAwesomeIcon icon={faXmark} role="button" className="my-auto text-gray-300 hover:text-gray-500" onClick={() => setQuery('')}/>
            </div>

            {userOptionsLoading &&
                <div className="h-32 overflow-hidden overflow-y-auto my-2 pt-1 bg-white absolute w-full z-20 flex justify-center content-center">
                    <RotatingLines
                        strokeColor="grey"
                        strokeWidth="5"
                        animationDuration="0.75"
                        width="35"
                        visible={true}
                    />
                </div>
            }


            {userOptions && userOptions[0] &&
                <div className="h-full overflow-hidden overflow-y-auto my-2 pt-1 bg-white w-full z-20">
                    {userOptions?.map(e => 
                    <div role="button" onClick={() => window.location.href = `/${e.profileName}`} key={e.id} className="flex justify-start content-center my-2 px-2 rounded-md w-full text-gray-500 hover:cursor-pointer hover:bg-gray-100 hover:text-gray-800">
                        <img src={e.profileImage || DEFAULT_AVATAR} className="w-8 h-8 rounded-full shadow-md my-auto mx-1 object-cover"/>
                        <div className="text-md my-auto mx-1">{e.profileName}</div>
                    </div>
                    )}
                </div>
            }
        </div>

        <div className={`h-screen w-16 bg-white shadow-md fixed z-20 ${panel? 'ml-16 w-60': ''} transition-all overflow-hidden text-center hidden lg:block`} onMouseLeave={handlePanelMouseLeave}>
            <img src={me?.profileImage || DEFAULT_AVATAR} className="w-44 h-44 rounded-full m-auto mt-10 mb-5 shadow-sm hover:cursor-pointer object-cover" onClick={() => window.location.href = "/profile/boong"}/>
            <div onClick={logout} className="text-black text-gray-400 text-xl font-semibold hover:cursor-pointer hover:text-gray-600"><FontAwesomeIcon icon={faArrowRightFromBracket} /> Logout</div>
            <div onClick={deleteUser} className="text-black absolute bottom-10 right-1/2 translate-x-1/2 text-xs text-gray-400 font-semibold hover:cursor-pointer hover:text-red-500">Delete account</div>
        </div>



        <div className="fixed w-full h-12 bottom-0 text-black text-2xl bg-white grid grid-cols-4 z-30 lg:hidden">
            <a href="/" className={`col-span-1 ${window.location.pathname.includes('explorer')? 'text-gray-500'  : 'text-gray-300' } text-2xl flex flex-wrap justify-center content-center hover:cursor-pointer hover:text-gray-500 hover:bg-gray-100`}><FontAwesomeIcon icon={faHouse}/></a>
            <a href={`/${me?.profileName}`} className={`col-span-1 ${window.location.pathname.includes('boong')? 'text-gray-500' : 'text-gray-300'} text-2xl flex flex-wrap justify-center content-center hover:cursor-pointer hover:text-gray-500 hover:bg-gray-100`}><FontAwesomeIcon icon={faUser}/></a>
            
            <div 
                className={`col-span-1 text-2xl ${open? 'text-gray-500 bg-gray-100' : 'text-gray-300'} flex flex-wrap justify-center content-center hover:cursor-pointer hover:text-gray-500 hover:bg-gray-100`}
                onClick={() => {setOpen(!open); setPanel(false)}}
            >
                <FontAwesomeIcon icon={faMagnifyingGlass}/>
            </div>
            <div 
                className={`col-span-1 text-2xl ${panel? 'text-gray-500 bg-gray-100' : 'text-gray-300'} flex flex-wrap justify-center content-center hover:cursor-pointer hover:text-gray-500 hover:bg-gray-100`}
                onClick={() => {setPanel(!panel); setOpen(false);}}
            >
                <FontAwesomeIcon icon={faBars}/>
            </div>
        </div>


        <div className={`fixed bottom-0 h-12 w-64 rounded-md right-1/2 translate-x-1/2 bg-white shadow-xl fixed z-20 ${open? 'bottom-1/2 h-96 translate-y-1/2': ''} transition-all overflow-hidden text-center lg:hidden`} onMouseLeave={handleMouseLeave}>
            <div className="bg-gray-100 min-w-max w-44 mx-auto mt-5 mb-2 py-1 px-2 rounded-full flex content-center overflow-hidden ">
                <FontAwesomeIcon icon={faMagnifyingGlass} className="my-auto text-gray-500"/>
                <input className="mx-1 w-40 bg-gray-100 text-gray-700 outline-none" placeholder="ค้นหาผู้คน" value={query} onChange={e => setQuery(e.target.value)}/>
                <FontAwesomeIcon icon={faXmark} role="button" className="my-auto text-gray-300 hover:text-gray-500" onClick={() => setQuery('')}/>
            </div>

            {userOptionsLoading &&
                <div className="h-32 overflow-hidden overflow-y-auto my-2 pt-1 bg-white absolute w-full z-20 flex justify-center content-center">
                    <RotatingLines
                        strokeColor="grey"
                        strokeWidth="5"
                        animationDuration="0.75"
                        width="35"
                        visible={true}
                    />
                </div>
            }


            {userOptions && userOptions[0] &&
                <div className="h-full overflow-hidden overflow-y-auto my-2 pt-1 bg-white w-full z-20">
                    {userOptions?.map(e => 
                    <div role="button" onClick={() => window.location.href = `/${e.profileName}`} key={e.id} className="flex justify-start content-center my-2 px-2 rounded-md w-full text-gray-500 hover:cursor-pointer hover:bg-gray-100 hover:text-gray-800">
                        <img src={e.profileImage || DEFAULT_AVATAR} className="w-8 h-8 rounded-full shadow-md my-auto mx-1 object-cover"/>
                        <div className="text-md my-auto mx-1">{e.profileName}</div>
                    </div>
                    )}
                </div>
            }
        </div>

        <div className={`fixed bottom-0 h-12 w-64 rounded-md right-1/2 translate-x-1/2 bg-white shadow-xl fixed z-20 ${panel? 'bottom-1/2 h-96 translate-y-1/2': ''} transition-all overflow-hidden text-center lg:hidden`} onMouseLeave={handlePanelMouseLeave}>
            <img src={me?.profileImage || DEFAULT_AVATAR} className="w-44 h-44 rounded-full m-auto mt-10 mb-5 shadow-sm hover:cursor-pointer object-cover" onClick={() => window.location.href = "/profile/boong"}/>
            <div onClick={logout} className="text-black text-gray-400 text-xl font-semibold hover:cursor-pointer hover:text-gray-600"><FontAwesomeIcon icon={faArrowRightFromBracket} /> Logout</div>
            <div onClick={deleteUser} className="text-black absolute bottom-10 right-1/2 translate-x-1/2 text-xs text-gray-400 font-semibold hover:cursor-pointer hover:text-red-500">Delete account</div>
        </div>
    </>
}