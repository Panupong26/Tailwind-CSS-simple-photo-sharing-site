import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faGear, faGrip, faPlus, faUsersLine } from "@fortawesome/free-solid-svg-icons";
import { useParams, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { authContext } from "../contexts/AuthContextProvider";
import { DEFAULT_AVATAR } from "../env";
import ProfileDetailModal from "../modals/ProfileDatailModal";
import EditProfileModal from "../modals/EditProfileModal";
import AddPostModal from "../modals/AddPostModal";
import axios from "../config/axios";
import { handleErr } from "../handleErr/HandleErr";
import FollowerModal from "../modals/FollowerModal";
import FollowingModal from "../modals/FollowingModal";
import Post from "../component/Post";
import { RotatingLines } from "react-loader-spinner"


export default function ProfilePage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [role, setRole] = useState();
    const { name } = useParams();
    const { me, setMe } = useContext(authContext);
    const [user, setUser] = useState();
    const [statusWithMe, setStatusWithMe] = useState();
    const [isFollower, setIsFollower] = useState();



    const [posts, setPosts] = useState([]);
    const [maxPost, setMaxPost] = useState();
    const [loadmore, setLoadmore] = useState(false);
    const [postLoading, setPostLoading] = useState(false);
    const [offset, setOffset] = useState(0);

    
    
    const [textOpen, setTextOpen] = useState(false);
    const [followerOpen, setFollowerOpen] = useState(false);
    const [followingOpen, setFollowingOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [addOpen, setAddOpen] = useState(false);

    const createFollow = async () => {
        await axios.post(`/follower/create/${user.id}`)
        .then(() => {
            setStatusWithMe('ACCEPTER');
            setUser({...user, Accepter:[...user.Accepter, {followerId: me.id, Requester: {...me}}]});
        })
        .catch(err => {
            handleErr(err);
        })
    }

    const cancleFollow = async () => {
        await axios.delete(`/follower/cancle/${user.id}`)
        .then(() => {
            setStatusWithMe(isFollower? 'FOLLOWER' : 'UNKNOW');
            const newAccepter = [...user.Accepter.filter(e => e.followerId !== me.id)];
            setUser({...user, Accepter:[...newAccepter]});
        })
        .catch(err => {
            handleErr(err);
        })
    }

    const getUserPost = async (id) => {
        setPostLoading(true);
        setTimeout(async () => {
            await axios.get(role === 'TAGPOST'? `/post/getusertagpost/${id}/${offset}` : `/post/getuserpost/${id}/${offset}`)
            .then(res => {
                if(offset === 0) {
                    setPosts([...res.data.rows]);
                } else {
                    setPosts([...posts, ...res.data.rows]);
                }
                setMaxPost(res.data.count);
                setOffset(offset + 24);
                setLoadmore(false);
                setPostLoading(false);
            })
            .catch(err => {
                handleErr(err);
            })
        }, [2000])   
    }


    useEffect(() => {
        const fetchProfile = async () => {
            await axios.get(`/user/getprofile/${name}`)
            .then(res => {
                setUser({...res.data.user});
                setStatusWithMe(res.data.isAccepter? 'ACCEPTER' : res.data.isFollower? 'FOLLOWER' : 'UNKNOW');
                setIsFollower(res.data.isFollower? true : false);
                getUserPost(res.data.user.id);
            })
            .catch(err => {
                handleErr(err);
            })
        };


        if(role) {
            if(name  && me && name === me.profileName) {   
                setUser({...me});
                setStatusWithMe('ME');
                getUserPost(me.id);
            } else {
                fetchProfile();
            }
        }
    }, [name, me, role])

    useEffect(() => {
        const page = document.getElementById('page');
        const checkScroll = () => {
            if(page.scrollTop === page.scrollHeight-page.offsetHeight) {
               setLoadmore(true);
            }
        }
        page.addEventListener('scroll', function() {checkScroll()}, false);

        return page.removeEventListener('scroll', function() {checkScroll()});     
    }, [])

    useEffect(() => {
        if(loadmore && posts.length !== maxPost) {
            getUserPost(user.id);
        } else {
            setLoadmore(false);
        }
    }, [loadmore])

    useEffect(() => {
        if(searchParams.get('role') === 'tag') {
            setOffset(0);
            setPosts([]);
            setRole('TAGPOST');
        } else {
            setOffset(0);
            setPosts([]);
            setRole('POST');
        }
    }, [searchParams])


    return <>
        {editOpen &&
            <EditProfileModal setEditOpen={setEditOpen} user={user}/>
        }

        {followingOpen && <FollowingModal data = {user?.Requester} setFollowingOpen = {setFollowingOpen}/>}

        {followerOpen &&  <FollowerModal data = {user?.Accepter} setFollowerOpen = {setFollowerOpen}/> }

        {textOpen &&
            <ProfileDetailModal setTextOpen = {setTextOpen} user = {user}/>
        }

        {addOpen &&
            <AddPostModal setAddOpen = {setAddOpen} posts = {posts} setPosts = {setPosts}/>
        }
        
        {statusWithMe === "ME" && <button className="absolute right-5 top-28 rounded-full w-16 h-16 bg-white shadow-xl border-2 border-gray-300 text-xl text-gray-500 hover:bg-gray-100 z-30" onClick={() => setAddOpen(true)}><FontAwesomeIcon icon={faPlus}/></button>}

        <div id='page' className="w-100 h-screen bg-white overflow-y-auto overflow-x-hidden pb-12 sm:pl-16 sm:pb-1">
           <div className="w-100 h-60 bg-white text-center shadow-sm shadow-gray-200">
                <div className="w-[calc(45%)] h-full bg-white mx-auto flex justify-center content-center">
                    <img src={user?.profileImage || DEFAULT_AVATAR} className="w-32 h-32 rounded-full my-auto shadow-xl sm:w-52 sm:h-52 object-cover shrink-0"/>
                    <div className="w-fit h-52 my-auto mx-5 bg-white text-center">
                        <div className="flex m-auto mb-5 w-fit justify-center content-center">
                            <div className="text-black m-auto mx-2 font-semibold sm:text-2xl">{user?.profileName}</div>
                            {statusWithMe === 'ME' && <button onClick={() => setEditOpen(true)} className="w-max h-8 mx-2 box-border rounded-full px-3 bg-white font-semibold border-2 border-gray-300 text-gray-500 hover:border-gray-400 hover:text-gray-600"><FontAwesomeIcon icon={faGear} /></button>}
                            {statusWithMe === 'ACCEPTER' && <button onClick={cancleFollow} className="w-max h-8 mx-2 pb-0.5 box-border rounded-full px-3 bg-white font-semibold border-2 border-gray-300 text-gray-500 hover:border-gray-400 hover:text-gray-600">เลิกติดตาม</button>}
                            {statusWithMe === 'FOLLOWER' && <button onClick={createFollow} className="w-max h-8 mx-2 pb-0.5 box-border rounded-full px-3 bg-white font-semibold border-2 border-gray-300 text-gray-500 hover:border-gray-400 hover:text-gray-600">ติดตามกลับ</button>}
                            {statusWithMe === 'UNKNOW' && <button onClick={createFollow} className="w-max h-8 mx-2 pb-0.5 box-border rounded-full px-3 bg-white font-semibold border-2 border-gray-300 text-gray-500 hover:border-gray-400 hover:text-gray-600">ติดตาม</button>}
                        </div>
                        <div className="flex justify-center text-black text-sm font-medium mb-2">
                            <div className="m-auto mx-2 shrink-0 w-fit ">
                                <div>โพสต์</div>
                                <div>{user?.posts?.length || 0}</div>
                            </div>
                            <div className="m-auto mx-2 hover:cursor-pointer shrink-0 w-fit" onClick={() => setFollowerOpen(true)}>
                                <div>ผู้ติดตาม</div>
                                <div>{user?.Accepter?.length}</div>
                            </div>
                            <div className="m-auto mx-2 hover:cursor-pointer shrink-0 w-fit" onClick={() => setFollowingOpen(true)}>
                                <div>กำลังติดตาม</div>
                                <div>{user?.Requester?.length}</div>
                            </div>
                        </div>
                        <div className="p-1 pl-0 bg-white h-fit rounded-md relative">
                            <FontAwesomeIcon icon={faChevronDown} className="absolute left-4 top-[85px] text-gray-300 hover:cursor-pointer hover:text-gray-600 " onClick={() => setTextOpen(true)}/>
                            <textarea disabled={true} value={user?.detail || ''} className="pl-4 pt-0.5 overflow-hidden resize-none h-20 text-sm w-44 text-black mb-0 bg-white outline-none"/>
                        </div>
                    </div>
                </div>
           </div>

           <div className="w-full h-16 md:h-20 flex justify-center content-center">
                <FontAwesomeIcon role="button" icon={faGrip} className={`${role === 'POST'? 'text-gray-500' : 'text-gray-300'}  text-4xl my-auto mx-16 hover:text-gray-500 md:text-5xl md:mx-20`} onClick={() => setSearchParams()}/>
                <FontAwesomeIcon role="button" icon={faUsersLine} className={`${role === 'TAGPOST'? 'text-gray-500' : 'text-gray-300'}  text-3xl my-auto mx-16 hover:text-gray-500 md:text-4xl md:mx-20`} onClick={() => setSearchParams({role: 'tag'})}/>

           </div>

           <div className="w-100 h-fit">
                <div className="flex flex-wrap justify-start content-start mx-auto w-100vw sm:w-[calc(82vw)] p-0 pl-[calc(0.2vw)]">
                    {posts?.map(e => <div key={e.id}><Post data = {e}/></div>)}
                    {(loadmore || postLoading) &&
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