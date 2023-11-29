import axios from "../config/axios";
import { useEffect } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import ImageSlide from "../component/ImageSlide";
import { useState } from "react";
import { handleErr } from "../handleErr/HandleErr";
import { DEFAULT_AVATAR } from "../env";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment, faHeart, faUsers, faPaperPlane, faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { useContext } from "react";
import { authContext } from "../contexts/AuthContextProvider";
import { useRef } from "react";
import { RotatingLines } from "react-loader-spinner";
import Comment from "../component/comment";
import TagModal from "../modals/TagModal";
import LikeModal from "../modals/LikeModal";
import { loadingContext } from "../contexts/LoadingContextProvider";
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
TimeAgo.addLocale(en);
const timeAgo = new TimeAgo('en-US');

export default function PostPage() {
    const { id:postId } = useParams();
    const location = useLocation();
    const { me } = useContext(authContext);
    const [post, setPost] = useState();
    const [isLiked, setIsLiked] = useState(false);
    const [images, setImages] = useState();
    const [title, setTitle] = useState([]);
    
    const commentInput = useRef();
    const [newComment, setNewComment] = useState();
    const [index, setIndex] = useState();
    const [tagQuery, setTagQuery] = useState();
    const [tag, setTag] = useState([]);

    const [autoCompleteTag, setAutoCompleteTag] = useState();
    const [autoCompleteTagLoading, setAutoCompleteTagLoading] = useState(false);

    const [createLoading, setCreateLoading] = useState(false);

    const [tagModalOpen, setTagModalOpen] = useState(false);
    const [likeModalOpen, setLikeModalOpen] = useState(false);
    const [showOption, setShowOption] = useState(false);

    const { setIsLoading } = useContext(loadingContext);


    const getPost = async () => {
        await axios.get(`/post/${postId}`)
        .then(res => {
            setPost({...res.data.post});
            setIsLiked(res.data.isLiked);
            if(res.data.post.media[0]) {
                let imgArr = [];
                for(let e of res.data.post.media) {
                    imgArr.push(e.url);
                }
                setImages([...imgArr]);
            }
        })
        .catch(err => {
            handleErr(err);
        })
    }

    const handleLike = async () => {
        if(isLiked) {
            setIsLiked(false);
            await axios.delete(`/post/unlike/${post.id}`)
            .then(() => {
                setPost({...post, likes:[...post.likes.filter(e => e.user.id !== me.id)]});
            })
            .catch(err => {
                handleErr(err);
            })
        } else {
            setIsLiked(true);
            await axios.post(`/post/like/${post.id}`)
            .then(() => {
                setPost({...post, likes:[...post.likes, {id: 'new', user:{...me}}]});
            })
            .catch(err => {
                handleErr(err);
            })
        }
    }

    const handleTagClick = (e) => {
        if(!tag.find(el => el.id === e.id)) {
            setTag([...tag, e]);
        }

        setNewComment(newComment.substring(0, index) + e.profileName + newComment.substring(commentInput.current.selectionStart));
        setTagQuery();
        setAutoCompleteTag();
        setIndex();    
    }

    const createComment = async () => {
        if(newComment && !!(newComment.replaceAll(' ',''))) {
            setCreateLoading(true);
            await axios.post(`/comment/create`, {
                title: newComment,
                postId: postId,
                tag: tag[0]? JSON.stringify(tag) : null
            })
            .then(res => {
                setPost({...post, comments: [...post.comments, {...res.data}]});
                setNewComment('');
            })
            .catch(err => {
                handleErr(err);
            })
            .finally(() => {
                setCreateLoading(false);
            })
        }
    }

    const deletePost = async () => {
        setIsLoading(true);
        await axios.delete(`/post/delete/${postId}`)
        .then(() => {
            location.pathname = `/${me.profileName}` ;
        })
        .catch(err => {
            handleErr(err);
        })
        .finally(() => {
            setIsLoading(false);
        })
    }


    useEffect(() => {
        getPost();
    }, []);

    useEffect(() => {
        if(post && post.title) {
            let transfromedTitle = post.title;
            for(let tag of post.tags) {
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
        } 

    }, [post]);

    useEffect(() => {
        if(newComment) {
            if((newComment[commentInput.current.selectionStart - 1]) === '@') {
                setIndex(commentInput.current.selectionStart);
            }
        }
    }, [newComment]);

    useEffect(() => {
        if(index && newComment[index-1] === '@') {
            setTagQuery(newComment.slice(index, commentInput.current.selectionStart));
        } else if(index) {
            setTagQuery();
            setAutoCompleteTag();
            setIndex();
        }
    }, [index, newComment]);

    useEffect(() => {
        const getTagAutoComplete = async () => {
            setAutoCompleteTag();
            setAutoCompleteTagLoading(true);
            await axios.get(`/user/getuserautocomplete/${tagQuery}`)
            .then(res => {
                setAutoCompleteTag(res.data)
            })
            .catch(err => {
                handleErr(err);
            })
            .finally(() => {
                setAutoCompleteTagLoading(false);
            })
        }
        if(tagQuery && !tagQuery.includes(' ')) {
            getTagAutoComplete();
        } else if(tagQuery) {
            setTagQuery();
            setAutoCompleteTag();
            setIndex();
        }
    }, [tagQuery]);

    useEffect(() => {
        if(tag[0] && newComment) {
            let newTag = [];
            tag.forEach(e => {
                if(newComment.includes(`@${e.profileName}`)) {
                    newTag.push(e);
                }
            })
            setTag([...newTag]);
        } else if(tag[0]) {
            setTag([]);
        }   
    }, [newComment]);

    return <>
        {tagModalOpen && <TagModal data={post?.tags} setTagModalOpen = {setTagModalOpen} />}

        {likeModalOpen && <LikeModal data = {post?.likes} setLikeModalOpen = {setLikeModalOpen}/>}

        <div className="w-100 h-full bg-white">
            <div className="w-fit h-full lg:h-fit pt-2 pb-40 lg:pb-0 lg:pt-0 overflow-y-auto no-scrollbar absolute right-1/2 translate-x-1/2 bottom-1/2 translate-y-1/2 lg:flex lg:justify-center border border-gray-200 lg:rounded-3xl">
                
                <div className="w-[370px] h-[470px] lg:w-[500px] lg:h-[600px] bg-black rounded-3xl lg:rounded-r-none shadow-xl relative">
                    {
                    !images &&
                    <div className="h-full w-full bg-black rounded-3xl rounded-r-none flex justify-center content-center z-30">
                        <RotatingLines
                        strokeColor="grey"
                        strokeWidth="5"
                        animationDuration="0.75"
                        width="35"
                        visible={true}
                        />
                    </div>  
                    }    
                    
                    {images && images[0] && <ImageSlide images = {images} id = {'postPage'}/>}

                    {post?.tags?.length > 0 && <div className="absolute left-3 top-3 w-8 h-8 rounded-full bg-gray-100/80 hover:bg-gray-100/100 hover:cursor-pointer flex justify-center content-center" onClick={() => setTagModalOpen(true)}><FontAwesomeIcon icon={faUsers} className="text-black mx-auto my-auto"/></div>}
                </div>
                
                <div className="w-[370px] h-max lg:h-[600px] lg:rounded-3xl rounded-l-none lg:shadow-xl relative">
                    <div className="flex justify-start content-center h-16 px-2 shadow-sm shadow-gray-200 rounded-3xl">
                        <Link to={`/${post?.user?.profileName}`} className="my-auto mx-1"><img src={post?.user?.profileImage || DEFAULT_AVATAR} className="rounded-full h-10 w-10"/></Link>
                        <Link to={`/${post?.user?.profileName}`} className="my-auto mx-1 text-black text-xl hover:text-gray-400">{post?.user?.profileName}</Link>
                    </div>

                    {me?.id === post?.user.id && <FontAwesomeIcon role="button" icon={faEllipsis} className='text-gray-400 text-3xl absolute right-4 top-4 hover:text-gray-500' onClick={() => setShowOption(true)}/>}
                    {showOption && <div role="button" className="absolute text-red-300 text-md p-1 right-4 top-10 h-max rounded-xl bg-white border border-gray-200 shadow-md hover:text-red-500" onMouseLeave={() => setShowOption(false)} onClick = {deletePost}>Delete Post</div>}
                    
                    <div className="w-100 h-max lg:h-[420px] overflow-y-auto no-scrollbar lg:shadow-sm lg:shadow-gray-200">
                        <div className="text-black p-5 h-max text-gray-800 shadow-sm shadow-gray-200">
                            {title?.map(e => <span key={Math.random() + new Date().getTime()}>{e}</span>)}
                            {post && <div className="text-gray-500 text-[14px]">{timeAgo.format(new Date(post?.createdAt))}</div>}
                        </div>
                        {post?.comments?.map(e => <div key={e.id}><Comment data = {e} me = {me} post = {post} setPost = {setPost}/></div>)}
                    </div>

                    <div className="w-100 h-12 hidden lg:block relative">
                        <div className="h-full w-max flex justify-start content-center px-2">
                            {post?.likes?.slice(0, 3).map(e => <Link key={e.id} to={`/${e.user.profileName}`} className="rounded-full border border-gray-300 my-auto mr-[-12px] p-0"><img role="button" src={e?.user?.profileImage || DEFAULT_AVATAR} className="rounded-full w-8 h-8"/></Link>)}
                        </div>
                        {post?.likes?.length > 1 && <div role="button" className="text-gray-500 text-sm absolute top-[44px] left-3 hover:text-gray-800" onClick={() => setLikeModalOpen(true)}>ถูกใจโดย {post?.likes[0].user.profileName} และคนอื่นๆอีก {post?.likes?.length-1} คน</div>}
                        {post?.likes?.length === 1 && <div role="button" className="text-gray-500 text-sm absolute top-[44px] left-3 hover:text-gray-800">ถูกใจโดย {post?.likes[0].user.profileName}</div>}
                        <FontAwesomeIcon icon={faHeart} role="button" className={`${isLiked? 'text-blue-400' : 'text-gray-300'} text-3xl absolute bottom-1/2 translate-y-1/2 right-20`} onClick={handleLike}/>
                        <FontAwesomeIcon icon={faComment} role="button" className="text-gray-300 hover:text-gray-400 text-3xl absolute bottom-1/2 translate-y-1/2 right-5" onClick={() => commentInput.current.focus()}/>
                    </div>
                   
                    <div className="w-[90%] h-max hidden lg:block absolute right-1/2 translate-x-1/2 bottom-2 bg-gray-200 rounded-full px-5 flex justify-between">
                        <input ref={commentInput} placeholder='เพิ่มความคิดเห็น' className="w-[90%] h-9 shrink-0 bg-gray-200 outline-none text-black" value={newComment || ''} onChange={e => setNewComment(e.target.value)}/>
                        {!createLoading && <FontAwesomeIcon icon={faPaperPlane} role="button" className="my-auto text-gray-400 hover:text-blue-400" onClick={createComment}/>}
                        {createLoading &&  
                            <RotatingLines className="my-auto"
                               strokeColor="grey"
                               strokeWidth="5"
                               animationDuration="0.75"
                               width="20"
                               visible={true}
                            />
                        }
                    </div>

                    {autoCompleteTagLoading &&
                        <div className="hidden lg:block h-36 w-[370px] overflow-auto flex justify-center content-center absolute bg-white bottom-12 shadow-md">
                            <RotatingLines
                               strokeColor="grey"
                               strokeWidth="5"
                               animationDuration="0.75"
                               width="35"
                               visible={true}
                            />
                        </div>
                    }

                    {autoCompleteTag && autoCompleteTag[0] &&
                        <div className="hidden lg:block h-36 w-[370px] overflow-auto absolute bg-white bottom-12 shadow-md">
                            {autoCompleteTag?.map(e => 
                            <div key={e.id} className="flex justify-start content-center my-2 p-1 px-2 rounded-md w-full text-gray-500 hover:cursor-pointer hover:bg-gray-100 hover:text-gray-800" onClick={() => handleTagClick(e)}>
                                <img src={e.profileImage || DEFAULT_AVATAR} className="w-8 h-8 rounded-full shadow-md my-auto mx-1 object-cover"/>
                                <div className="text-md my-auto mx-1">{e.profileName}</div>
                            </div>
                            )}
                        </div>
                    }

                </div>
            </div>

            {autoCompleteTagLoading &&
                <div className="lg:hidden h-36 w-[370px] overflow-auto flex justify-center content-center fixed right-1/2 translate-x-1/2 bg-white bottom-12 shadow-md">
                    <RotatingLines
                        strokeColor="grey"
                        strokeWidth="5"
                        animationDuration="0.75"
                        width="35"
                        visible={true}
                    />
                </div>
            }

            {autoCompleteTag && autoCompleteTag[0] &&
                <div className="lg:hidden h-40 w-[370px] overflow-auto fixed right-1/2 translate-x-1/2 bg-white bottom-[132px] bg-red-100 shadow-md">
                    {autoCompleteTag?.map(e => 
                    <div key={e.id} className="flex justify-start content-center my-2 p-1 px-2 rounded-md w-full text-gray-500 hover:cursor-pointer hover:bg-gray-100 hover:text-gray-800" onClick={() => handleTagClick(e)}>
                        <img src={e.profileImage || DEFAULT_AVATAR} className="w-8 h-8 rounded-full shadow-md my-auto mx-1 object-cover"/>
                        <div className="text-md my-auto mx-1">{e.profileName}</div>
                    </div>
                    )}
                </div>
            }

            <div className="w-[370px] h-max fixed right-1/2 translate-x-1/2 bottom-12 bg-white mx-auto pb-2 lg:hidden">
                <div className="h-full w-max flex justify-start content-center px-2 mt-2">
                    {post?.likes?.slice(0, 3).map(e => <Link key={e.id} to={`/${e.user.profileName}`} className="rounded-full border border-gray-300 my-auto mr-[-12px] p-0"><img role="button" src={e?.user?.profileImage || DEFAULT_AVATAR} className="rounded-full w-8 h-8"/></Link>)}
                </div>
                {post?.likes?.length > 1 && <div role="button" className="text-gray-500 text-sm absolute top-[50px] left-3 hover:text-gray-800" onClick={() => setLikeModalOpen(true)}>ถูกใจโดย {post?.likes[0].user.profileName} และคนอื่นๆอีก {post?.likes?.length-1} คน</div>}
                {post?.likes?.length === 1 && <div role="button" className="text-gray-500 text-sm absolute top-[50px] left-3 hover:text-gray-800">ถูกใจโดย {post?.likes[0].user.profileName}</div>}
                <FontAwesomeIcon icon={faHeart} role="button" className={`${isLiked? 'text-blue-400' : 'text-gray-300'} text-3xl absolute top-2 right-20`} onClick={handleLike}/>
                <FontAwesomeIcon icon={faComment} role="button" className="text-gray-300 hover:text-gray-400 text-3xl absolute top-2 right-5" onClick={() => commentInput.current.focus()}/>

                <div className="w-[360px] h-max bg-gray-200 rounded-full px-5 mt-8 mx-auto flex justify-between">
                    <input ref={commentInput} placeholder='เพิ่มความคิดเห็น' className="w-[90%] h-9 shrink-0 bg-gray-200 outline-none text-black" value={newComment || ''} onChange={e => setNewComment(e.target.value)}/>
                    {!createLoading && <FontAwesomeIcon icon={faPaperPlane} role="button" className="my-auto text-gray-400 hover:text-blue-400" onClick={createComment}/>}
                    {createLoading &&  
                        <RotatingLines className="my-auto"
                            strokeColor="grey"
                            strokeWidth="5"
                            animationDuration="0.75"
                            width="20"
                            visible={true}
                        />
                    }
                </div>
            </div>


        </div>
    </>
}