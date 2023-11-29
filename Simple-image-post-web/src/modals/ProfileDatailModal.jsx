import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";


export default function ProfileDetailModal({ setTextOpen, user }) {

    return <>
        <div className="fixed w-screen h-screen bg-gray-300/50 z-50" onClick={() => setTextOpen(false)}>
            <div className="absolute right-1/2 translate-x-1/2 bottom-1/2 translate-y-1/2 w-64 h-60 rounded-xl bg-white text-black shadow-md z-30" onClick={() => setTextOpen(false)}>
                <div className="text-lg font-semibold text-gray-800 shadow-sm text-center h-10 pt-1.5">แนะนำตัว</div>
                <FontAwesomeIcon icon={faXmark} className="absolute top-2 right-2 text-gray-300 hover:cursor-pointer hover:text-gray-600" onClick={() => setTextOpen(false)}/>
                <textarea disabled={true} value={user?.detail || ''} className="p-5 pt-0 overflow-hidden overflow-y-auto resize-none h-[70%] text-md w-full text-black rounded-xl my-auto mt-2 bg-white outline-none"/>
            </div>
        </div>
    </>

}