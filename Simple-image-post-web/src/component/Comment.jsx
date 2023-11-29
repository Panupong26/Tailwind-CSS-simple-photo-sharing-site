import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { DEFAULT_AVATAR } from "../env";
import axios from "../config/axios";
import { handleErr } from "../handleErr/HandleErr";
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
TimeAgo.addDefaultLocale(en);
const timeAgo = new TimeAgo('en-US');

export default function Comment({ data, me, post, setPost }) {
    const [title, setTitle] = useState();

    const [showOption, setShowOption] = useState(false);

    const deleteComment = async () => {
        await axios.delete(`/comment/delete/${data.id}`)
        .then(() => {
            setPost({...post, comments:[...post.comments.filter(e => e.id !== data.id)]});
        })
        .catch(err => {
            handleErr(err);
        })
    }


    useEffect(() => {
        let transfromedTitle = data.title;
        for(let tag of data.tags) {
            transfromedTitle = transfromedTitle.replaceAll(`@${tag.user.profileName}`, `%&6%%&7%@${tag.user.profileName}%&6%`);
        }

        let stringArr =  transfromedTitle.split('%&6%');
        let preTitleArr = [];

        for(let e of stringArr) {
            if(e.startsWith('%&7%@')) {
                preTitleArr.push(<a href={`/${e.split('&7%@')[1]}`} className="text-black hover:text-gray-600">@{e.split('&7%@')[1]}</a>)
            } else {
                preTitleArr.push(e)
            }
        };
        setTitle(preTitleArr);  
    
    }, [data])


    return <>
        <div className="w-full h-max p-2 flex justify-start content-start relative">
            <Link to={`/${data?.user.profileName}`} className="h-8 w-8 rounded-full border border-gray-300 mx-1"><img src={data?.user?.profileImage || DEFAULT_AVATAR} className="h-8 w-8 rounded-full"/></Link>
            
            <div className="text-gray-800 pt-1.5 px-2 rounded-xl shadow-md mx-1 text-sm bg-gray-100">
                {title?.map(e => <span key={Math.random() + new Date().getTime()}>{e}</span>)}
                <div className="text-gray-500 text-[12px]">{timeAgo.format(new Date(data?.createdAt))}</div>
            </div>
            
            {data?.user?.id === me?.id && !showOption && <FontAwesomeIcon role="button" icon={faEllipsis} className="text-gray-400 hover:text-gray-500 mt-2 mx-1" onClick={() => setShowOption(true)}/>}
            {showOption && <div role="button" className="text-red-300 text-sm p-1 ml-4 h-max rounded-xl bg-white border border-gray-200 shadow-md hover:text-red-500" onMouseLeave={() => setShowOption(false)} onClick = {deleteComment}>Delete</div>}
        </div>
    </>
}