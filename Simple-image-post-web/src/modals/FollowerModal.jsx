import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { DEFAULT_AVATAR } from "../env";
import { Link } from "react-router-dom";

export default function FollowerModal({ data, setFollowerOpen }) {


    return <>
        <div className="fixed w-screen h-screen bg-gray-300/50 z-50" onClick={() => setFollowerOpen(false)}>
            <div className="absolute right-1/2 translate-x-1/2 bottom-1/2 translate-y-1/2 w-64 h-80 rounded-xl bg-white text-black shadow-md z-30" onClick={e => e.stopPropagation()}>
                <div className="text-lg font-semibold text-gray-800 shadow-sm text-center h-10 pt-1.5">ผู้ติดตาม</div>
                <FontAwesomeIcon icon={faXmark} className="absolute top-2 right-2 text-gray-300 hover:cursor-pointer hover:text-gray-600" onClick={() => setFollowerOpen(false)}/>
                <div className="w-100 h-64 overflow-x-hidden overflow-y-scroll py-0 px-2">
                    {data?.map((e, index) => <div key={index}>
                        <Link to={`/${e.Requester?.profileName}`} className="flex justify-start content-center my-2 p-1 rounded-md w-full text-gray-500 hover:cursor-pointer hover:bg-gray-100 hover:text-gray-800" onClick={() => setFollowerOpen(false)}>
                            <img src={e?.Requester?.profileImage || DEFAULT_AVATAR} className="w-8 h-8 rounded-full shadow-md my-auto mx-1 object-cover"/>
                            <div className="text-md my-auto mx-1">{e?.Requester?.profileName}</div>
                        </Link>
                    </div>)}
                </div>
            </div>
        </div>
    </>
}