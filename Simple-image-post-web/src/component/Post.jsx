import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClone } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import PostCover from "./PostCover";

export default function Post({data}) {
    const [hover, setHover] = useState(false);


    return <>
        <div className="bg-gray-200  w-[calc(33vw-0.2vw)] h-[calc(33vw-0.2vw)] sm:w-[calc(20vw)] sm:h-[calc(20vw)] m-[calc(0.2vw)] relative">
            <img src={data.media[0].url} className="w-full h-full object-cover" onMouseOver={() => setHover(true)}/>
            {data?.media?.length > 1 && <div className="absolute right-1 top-1 w-6 h-6 md:right-3 md:top-3 md:w-10 md:h-10 rounded-full bg-gray-800/30 flex justify-center content-center"><FontAwesomeIcon icon={faClone} className="text-sm md:text-xl m-auto"/></div>}
            
            {
            hover && 
            <PostCover data = {data} setHover = {setHover}/>
            }
        </div>
    </>
}