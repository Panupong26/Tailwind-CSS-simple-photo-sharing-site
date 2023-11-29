import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { useEffect } from "react";

export default function Loading() {
    const [position, setPosition] = useState(1);


    useEffect(() => {
        const loop = () => {
            if(position !== 8) {
                setPosition(position+1);
            }else {
                setPosition(1);
            }
        }

        setTimeout(loop, 100);
    }, [position])




    return <>
        <div className="w-screen h-screen z-[1000] bg-gray-400/50 absolute">
            <div className="w-24 h-24 absolute right-1/2 translate-x-1/2 bottom-1/2 translate-y-1/2">
                <FontAwesomeIcon icon={faCircle} className={`absolute transition-all right-1/2 translate-x-1/2 ${position === 1? 'text-gray-600' : ''} ${position === 2? 'text-gray-500' : ''} ${position === 3? 'text-gray-400' : ''}  ${position === 4? 'text-gray-300' : ''} ${position === 5? 'opacity-0' : ''} ${position === 6? 'opacity-0' : ''} ${position === 7? 'opacity-0' : ''} ${position === 8? 'opacity-0' : ''}`}/>
                <FontAwesomeIcon icon={faCircle} className={`absolute transition-all right-[72%] bottom-[71%] ${position === 2? 'text-gray-600' : ''} ${position === 3? 'text-gray-500' : ''} ${position === 4? 'text-gray-400' : ''} ${position === 5? 'text-gray-300' : ''} ${position === 6? 'opacity-0' : ''} ${position === 7? 'opacity-0' : ''} ${position === 8? 'opacity-0' : ''} ${position === 1? 'opacity-0' : ''}`}/> 
                <FontAwesomeIcon icon={faCircle} className={`absolute transition-all left-0 bottom-1/2 translate-y-1/2 ${position === 3? 'text-gray-600' : ''} ${position === 4? 'text-gray-500' : ''} ${position === 5? 'text-gray-400' : ''} ${position === 6? 'text-gray-300' : ''} ${position === 7? 'opacity-0' : ''} ${position === 8? 'opacity-0' : ''} ${position === 1? 'opacity-0' : ''} ${position === 2? 'opacity-0' : ''}`}/>
                <FontAwesomeIcon icon={faCircle} className={`absolute transition-all right-[72%] bottom-[13%] ${position === 4? 'text-gray-600' : ''} ${position === 5? 'text-gray-500' : ''} ${position === 6? 'text-gray-400' : ''} ${position === 7? 'text-gray-300' : ''} ${position === 8? 'opacity-0' : ''} ${position === 1? 'opacity-0' : ''} ${position === 2? 'opacity-0' : ''} ${position === 3? 'opacity-0' : ''}`} /> 
                <FontAwesomeIcon icon={faCircle} className={`absolute transition-all right-1/2 translate-x-1/2 bottom-0 ${position === 5? 'text-gray-600' : ''} ${position === 6? 'text-gray-500' : ''} ${position === 7? 'text-gray-400' : ''} ${position === 8? 'text-gray-300' : ''} ${position === 1? 'opacity-0' : ''} ${position === 2? 'opacity-0' : ''} ${position === 3? 'opacity-0' : ''} ${position === 4? 'opacity-0' : ''}`}/>
                <FontAwesomeIcon icon={faCircle} className={`absolute transition-all right-[12%] bottom-[12%] ${position === 6? 'text-gray-600' : ''} ${position === 7? 'text-gray-500' : ''} ${position === 8? 'text-gray-400' : ''} ${position === 1? 'text-gray-300' : ''} ${position === 2? 'opacity-0' : ''} ${position === 3? 'opacity-0' : ''} ${position === 4? 'opacity-0' : ''} ${position === 5? 'opacity-0' : ''}`}/> 
                <FontAwesomeIcon icon={faCircle} className={`absolute transition-all right-0 bottom-1/2 translate-y-1/2 ${position === 7? 'text-gray-600' : ''} ${position === 1? 'text-gray-500' : ''} ${position === 8? 'text-gray-400' : ''} ${position === 2? 'text-gray-300' : ''} ${position === 3? 'opacity-0' : ''} ${position === 4? 'opacity-0' : ''} ${position === 5? 'opacity-0' : ''} ${position === 6? 'opacity-0' : ''}`}/>
                <FontAwesomeIcon icon={faCircle} className={`absolute transition-all right-[12%] bottom-[72%] ${position === 8? 'text-gray-600' : ''} ${position === 1? 'text-gray-500' : ''} ${position === 2? 'text-gray-400' : ''} ${position === 3? 'text-gray-300' : ''} ${position === 4? 'opacity-0' : ''} ${position === 5? 'opacity-0' : ''} ${position === 6? 'opacity-0' : ''} ${position === 7? 'opacity-0' : ''}`}/>
            </div>
        </div>
    </>
}