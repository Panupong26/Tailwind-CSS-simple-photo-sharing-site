import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment, faHeart } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useEffect } from "react";

export default function PostCover({ data, setHover }) {

    useEffect(() => {
        const handleHover = e => {
            const cover = document.getElementById(`${data?.id}`)
            if(cover && !(cover.contains(e.target))) {
                setHover(false)
            }
        }

        document.addEventListener('mouseover',  handleHover);

        return  document.removeEventListener('onMouseOver',  handleHover);
    }, [])

    return <>
        <Link id={data?.id} to={`/post/${data.id}`} className="absolute left-0 top-0 w-full h-full bg-gray-600/50">
            <div className="absolute right-1/2 translate-x-1/2 bottom-1/2 translate-y-1/2 w-max flex justify-center content-center">
                <div className="text-xl mx-1 md:text-3xl text-white m-auto md:mx-2"><FontAwesomeIcon icon={faHeart}/> {data?.likes?.length.toLocaleString()}</div>
                <div className="text-xl mx-1 md:text-3xl text-white m-auto md:mx-2"><FontAwesomeIcon icon={faComment}/> {data?.comments?.length.toLocaleString()}</div>    
            </div>
        </Link>
    </>
}