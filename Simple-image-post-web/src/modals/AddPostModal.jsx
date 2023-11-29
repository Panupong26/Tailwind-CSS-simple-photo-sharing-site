import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImages, faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import ImageSlide from "../component/ImageSlide";
import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import axios from "../config/axios";
import { RotatingLines } from "react-loader-spinner"
import { handleErr } from "../handleErr/HandleErr";
import { useContext } from "react";
import { loadingContext } from "../contexts/LoadingContextProvider";
import { data } from "autoprefixer";

const initialInput = {
    title: null,
}


export default function AddPostModal({ setAddOpen, posts, setPosts }) {
    const [images, setImages] = useState([]);
    const [files, setFiles] = useState([]);  
    const [openNext, setOpenNext] = useState(false);

    const { setIsLoading } = useContext(loadingContext);

    const titleInputRef = useRef();
    const [input, setInput] = useState(initialInput);
    const [index, setIndex] = useState();
    const [tagQuery, setTagQuery] = useState();
    const [autoCompleteTag, setAutoCompleteTag] = useState();
    const [autoCompleteTagLoading, setAutoCompleteTagLoading] = useState(false);

  
    const [tagInput, setTagInput] = useState();
    const [tagOptions, setTagOptions] = useState();
    const [tagOptionsLoading, setTagOptionsLoading] = useState(false);

    const [tag, setTag] = useState([]);


    const handleAddImageClick = () => {
        document.getElementById('addPostFileInput').click();
    }

    const handleChangeFile = e => {
        if(e.target.files[0]) {
            const imgArray = [...images];
            const newFilesArray = [...files];
            for(let file in e.target.files) {
                if(!isNaN(+file)) {
                    newFilesArray.push(e.target.files[file]);
                    imgArray.push(URL.createObjectURL(e.target.files[file]))
                }
            }
            setImages([...imgArray]);
            setFiles([...newFilesArray]);
            e.target.value = null;
        }
    }

    const handleTitleChange = async (e) => {
        setInput({...input, title: e.target.value});
    }

    const handleTagClick = (e) => {
        if(!tag.find(el => el.id === e.id)) {
            setTag([...tag, e]);
        }
        setInput({...input, title: input.title.substring(0,index) + e.profileName + input.title.substring(titleInputRef.current.selectionStart)});
        setIndex();
        setTagQuery();
        setAutoCompleteTag();
    }

    const deleteTag = (e) => {
        setTag([...tag.filter(el => el.id !== e.id)]);
    }

    const createPost = async () => {
        const form = new FormData();
        for(let file of files) {
            form.append('media', file);
        }

        if(!!(input.title?.replaceAll(' ',''))) {
            form.append('title', input.title);
        }

        if(!!tag[0]) {
            form.append('tag', JSON.stringify(tag));
        }

        setIsLoading(true);
        await axios.post('/post/create', form, {headers: {'Content-Type': 'multipart/form-data'}})
        .then(res => {
            setPosts([{...res.data}, ...posts]);
        })
        .catch(err => {
            handleErr(err)
        })
        .finally(() => {
            setIsLoading(false);
            setAddOpen(false);
        })
    }


    useEffect(() => {
        if(input.title) {
            if(input.title[titleInputRef.current.selectionStart - 1] === '@') {
                setIndex(titleInputRef.current.selectionStart);
            }
        }
    }, [input]);


    useEffect(() => {
        if(index) {
            if(input.title[index-1] !== '@') {
                setTagQuery();
                setIndex();
                setAutoCompleteTag();
            } else if(tagQuery && tagQuery.includes(' ')) {
                setTagQuery();
                setIndex();
                setAutoCompleteTag();
            } else {
                setTagQuery(input.title.slice(index, titleInputRef.current.selectionStart));
            }
        } 
    }, [index, input])

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
        if(tagQuery) {
            getTagAutoComplete();
        } 
    }, [tagQuery]);



    const handleTagInputChange = async (e) => {
       if(!e.target.value.includes(' ')) {
            setTagInput(e.target.value);
       } else {
        setTagInput();
       }
    }

    useEffect(() => {
        const getTagAutoComplete = async () => {
            setTagOptions();
            setTagOptionsLoading(true);
            await axios.get(`/user/getuserautocomplete/${tagInput}`)
            .then(res => {
                setTagOptions(res.data)
            })
            .catch(err => {
                handleErr(err);
            })
            .finally(() => {
                setTagOptionsLoading(false);
            })
        }
        
        if(tagInput) {
            getTagAutoComplete();
        } else {
            setTagOptions();
        }
    }, [tagInput]);

    const handleTagOptionsClick = (e) => {
        if(!tag.find(el => el.id === e.id)) {
            setTag([...tag, e]);
        }
        setTagInput('');
        setTagOptions();
    }


    return <>
        <div className="fixed w-screen h-screen bg-gray-300/50 z-50" onMouseDown={() => setAddOpen(false)}>
            <div className="absolute right-1/2 translate-x-1/2 bottom-1/2 translate-y-1/2 w-[370px] h-max h-60 rounded-xl bg-white text-black shadow-md z-30" onMouseDown={e => e.stopPropagation()}>
                <div className="text-lg font-semibold text-gray-800 shadow-sm text-center h-10 pt-1.5">สร้างโพสต์</div>
                
                <div className={`${openNext? 'hidden' : ''} w-max h-max`}>
                    <div className="w-[370px] h-[370px] mx-o bg-black relative">
                        {images.length === 0 && <div role="button" className="w-full h-full text-7xl text-gray-400 hover:text-gray-200" onClick={handleAddImageClick} ><FontAwesomeIcon icon={faImages} className="absolute right-1/2 translate-x-1/2 bottom-1/2 translate-y-1/2"/></div>}
                        {images.length !== 0 && <ImageSlide images = {images} id = {'createPost'} />}
                    </div>
                    <input id='addPostFileInput' type="file" accept="image/*" multiple={true} className="hidden" onChange={e => handleChangeFile(e)}/>
                    <div className="w-full mx-0 my-0 h-max py-2 text-center relative">
                        <button className="mx-auto rounded-full w-16 h-16 bg-white border-2 border-gray-300 text-xl text-gray-500 hover:bg-gray-100" onClick={handleAddImageClick}><FontAwesomeIcon icon={faPlus}/></button>
                        <button className="absolute right-8 bottom-1/2 translate-y-1/2 text-lg text-gray-400 hover:text-gray-500" onClick={() => setOpenNext(true)} disabled={images.length === 0} >ถัดไป</button>        
                    </div>
                </div>
                
                <div className={`${openNext? '' : 'hidden'} w-[370px] h-max relative`}>
                    
                    {autoCompleteTagLoading &&
                        <div className="h-36 overflow-auto flex justify-center content-center">
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
                        <div className="h-36 overflow-auto">
                            {autoCompleteTag?.map(e => 
                            <div key={e.id} className="flex justify-start content-center my-2 p-1 px-2 rounded-md w-full text-gray-500 hover:cursor-pointer hover:bg-gray-100 hover:text-gray-800" onClick={() => handleTagClick(e)}>
                                <img src={e.profileImage || DEFAULT_AVATAR} className="w-8 h-8 rounded-full shadow-md my-auto mx-1 object-cover"/>
                                <div className="text-md my-auto mx-1">{e.profileName}</div>
                            </div>
                            )}
                        </div>
                    }

                    <div className="w-100 h-max p-2 text-center pb-0">
                        <textarea ref={titleInputRef} className="w-[90%] bg-gray-100 outline-none resize-none rounded-md p-2 h-40" placeholder="เพิ่มคำอธิบาย" value={input.title || ''} onChange={e => handleTitleChange(e)}/>
                        <textarea className="w-[90%] bg-gray-100 outline-none resize-none rounded-md p-2 h-10 mb-0" placeholder="เพิ่มผู้คน" value={tagInput || ''} onChange={e => handleTagInputChange(e)}/>
                    </div>


                    {tagOptionsLoading &&
                        <div className="h-32 overflow-hidden overflow-y-auto my-2 pt-1 bg-white absolute w-full top-52 z-20 flex justify-center content-center">
                           <RotatingLines
                               strokeColor="grey"
                               strokeWidth="5"
                               animationDuration="0.75"
                               width="35"
                               visible={true}
                            />
                        </div>
                    }


                    {tagOptions && tagOptions[0] &&
                        <div className="h-32 overflow-hidden overflow-y-auto my-2 pt-1 bg-white absolute w-full top-52 z-20">
                            {tagOptions?.map(e => 
                            <div key={e.id} className="flex justify-start content-center my-2 px-2 rounded-md w-full text-gray-500 hover:cursor-pointer hover:bg-gray-100 hover:text-gray-800" onClick={() => handleTagOptionsClick(e)}>
                                <img src={e.profileImage || DEFAULT_AVATAR} className="w-8 h-8 rounded-full shadow-md my-auto mx-1 object-cover"/>
                                <div className="text-md my-auto mx-1">{e.profileName}</div>
                            </div>
                            )}
                        </div>
                    }


                    {tag && tag[0] &&
                        <div className="bg-white p-2 px-0 w-[86%] h-14 mx-auto rounded-md flex justify-start flex-wrap overflow-y-auto ">
                            {tag?.map(e => 
                            <div key={e.id} className="flex justify-center content-center m-1 p-1 px-2 w-max text-gray-500 border-2 border-gray-300 rounded-full" onClick={() => handleTagOptionsClick(e)}>
                                <div className="text-md my-auto mx-1 h-fit mt-0">{e.profileName}</div>
                                <FontAwesomeIcon icon={faXmark} className="my-auto text-gray-300 hover:cursor-pointer hover:text-gray-600" onClick={() => deleteTag(e)} />
                            </div>
                            )}
                        </div>
                    }


                    <div className="w-full mx-0 my-0 h-10 py-2 text-center relative">
                        <button className="absolute right-8 bottom-1/2 translate-y-1/2 text-lg text-gray-400 hover:text-gray-500" onClick={createPost} >สร้าง</button> 
                        <button className="absolute left-8 bottom-1/2 translate-y-1/2 text-lg text-gray-400 hover:text-gray-500" onClick={() => setOpenNext(false)}>ย้อนกลับ</button>        
                    </div>
                
                </div>
            </div>
        </div>
    </>

}