import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { useEffect } from "react";
import axios from "../config/axios";
import { handleErr } from "../handleErr/HandleErr";
import { RotatingLines } from "react-loader-spinner";
import Post from "../component/Post";
import { useSearchParams } from "react-router-dom";
import { useMemo } from "react";



export default function IndexPage() {
    const [maxPost, setMaxPost] = useState();
    const [posts, setPosts] = useState([]);
    const [offset, setOffset] = useState(0);
    const [postLoading, setPostLoading] = useState(false);
    const [loadmore, setLoadmore] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const [postQuery, setPostQuery] = useState(searchParams.get('query') || '');

    const getAllPost = async (offsetPost) => {
        setPostLoading(true);
        setTimeout(async () => {
            await axios.get(`/post/getallpost/${offsetPost}`)
            .then(res => {
                if(offsetPost === 0) {
                    setPosts([...res.data.rows]); 
                } else {
                    setPosts([...posts, ...res.data.rows]);
                }
                setMaxPost(res.data.count);
                setOffset(offsetPost + 24);
            })
            .catch(err => {
                handleErr(err);
            })
            .finally(() => {
                setLoadmore(false);
                setPostLoading(false);
            })
        }, [2000])
    }

    const getPostByQuery = async (offsetPost, query) => {
        setPostLoading(true);
        setTimeout(async () => {
            await axios.get(`/post/getbyquery/${offsetPost}/${query}`)
            .then(res => {
                if(offsetPost === 0) {
                    setPosts([...res.data.rows]); 
                } else {
                    setPosts([...posts, ...res.data.rows]);
                }
                setMaxPost(res.data.count);
                setOffset(offsetPost + 24);
            })
            .catch(err => {
                handleErr(err);
            })
            .finally(() => {
                setLoadmore(false);
                setPostLoading(false);
            })
        }, [2000])
    }

    const handleSearch = () => {
        if(postQuery) {
            setSearchParams({query: postQuery.replaceAll(' ', '')});
        } else {
            setSearchParams();
        }
    }

    const handleClearQuery = () => {
        setPostQuery();
        setSearchParams();
    }

    useEffect(() => {
        const page = document.getElementById('page');
    
        const scrollCheck = () => {
            if(page.scrollTop === page.scrollHeight-page.offsetHeight) {
                setLoadmore(true);
            }
        }

        page.addEventListener('scroll', function() {scrollCheck()}, false);

        return page.removeEventListener('scroll', function() {scrollCheck()});
    }, []);

    useEffect(() => {
        if(loadmore) {
            if(posts.length !== maxPost) {
                if(!searchParams.get('query')) {
                    getAllPost(offset);
                } else {
                    getPostByQuery(offset, searchParams.get('query'));
                }
            } else {
                setLoadmore(false);
            }
        }
    }, [loadmore])

    useEffect(() => {
        if(searchParams.get('query')) {
            setPosts([]);
            getPostByQuery(0, searchParams.get('query'));
        } else {
            setPosts([]);
            getAllPost(0);
        }
    }, [searchParams])

    return <>
        <div id='page' className="bg-white w-full h-screen pb-12 overflow-x-hidden overflow-y-auto sm:pl-16 sm:pb-1">
            <div className="w-100 h-10 sm:h-14 flex justify-center content-center my-0">
                <div className="m-auto w-max rounded-full p-1 px-2 bg-gray-100 sm:bg-white sm:border-2 border-gray-300 flex justify-between content-center">
                    <input className="mx-1 bg-gray-100 text-gray-600 outline-none sm:bg-white" placeholder="ค้นหา" value={postQuery || ''} onChange={e => setPostQuery(e.target.value)}/>
                    <div className="h-max w-max m-auto flex">
                        <FontAwesomeIcon role="button" icon={ faXmark } className="text-gray-300 hover:text-gray-500 mx-1" onClick={handleClearQuery}/>
                        <FontAwesomeIcon role="button" icon={ faMagnifyingGlass } className="text-gray-300 hover:text-gray-500 mx-1" onClick={handleSearch}/>
                    </div>
                </div>
            </div>
            <div className="w-100 h-fit">
                <div className="flex flex-wrap justify-start content-start mx-auto w-100vw sm:w-[calc(82vw)] p-0 pl-[calc(0.2vw)]">
                    {posts?.map(e => <div key={e.id}><Post data = {e}/></div>)}
                    {postLoading &&
                    <div className="flex h-32 justify-center content-center w-full">
                         <RotatingLines
                               strokeColor="grey"
                               strokeWidth="5"
                               animationDuration="0.75"
                               width="35"
                               visible={true}
                            />
                    </div>
                    }
                </div>       
            </div>
        </div>
    </>
}