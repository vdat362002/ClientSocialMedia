import { LikeOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { useDidMount } from '../../../hooks';
import { likePost } from '../../../services/api';

const LikeButton = (props) => {
    const [isLiked, setIsLiked] = useState(props.isLiked);
    const [react, setReact]= useState(props?.kind_react?.[0])
    const [isLoading, setLoading] = useState(false);
    const [showReact, setShowReact]= useState(false)
    const didMount = useDidMount();

    useEffect(() => {
        setIsLiked(props.isLiked);
    }, [props.isLiked]);
    useEffect(()=> {
        if(props?.kind_react?.[0]) {
            setReact(props?.kind_react?.[0])
        }
    }, [props])
    const dispatchLike = async (react1) => {
        if (isLoading) return;

        try {
            setLoading(true);

            const { state, likesCount } = await likePost(props.postID, react1);
            if (didMount) {
                setLoading(false);
                setIsLiked(state);
            }

            props.likeCallback(props.postID, state, likesCount);
        } catch (e) {
            didMount && setLoading(false);
            console.log(e);
        }
    }

    return (
        <span
            style={{position: "relative"}}
            onMouseEnter={()=> {
                setTimeout(()=> {
                    setShowReact(true)
                }, 500)
            }}
            onMouseLeave={()=> {
                setTimeout(()=> {
                    setShowReact(false)
                }, 500)
            }}
            className={`px-1 py-2 rounded-md flex items-center justify-center hover:bg-gray-100 cursor-pointer text-l w-1/1  ${isLiked ? 'text-indigo-700 font-bold dark:text-indigo-400 dark:hover:bg-indigo-1100' : 'text-gray-700 dark:hover:bg-indigo-1100 dark:hover:text-white  dark:bg-indigo-1000 hover:text-gray-800 dark:text-gray-400'} ${isLoading && 'opacity-50'}`}
            
        >
            {
                !isLiked && showReact=== true && <figure style={{display: "flex", width: 300, position: "absolute", top: "-100%", left: 0, border: "1px solid #e7e7e7"}}>
                <img onClick={(e)=> {
                    e.stopPropagation()
                    setReact("Like")
                    setShowReact(false)
                    dispatchLike("Like")
                }} src="https://www.dropbox.com/s/rgfnea7od54xj4m/like.gif?raw=1"  alt="Like emoji" />
                <img onClick={(e)=> {
                    e.stopPropagation()
                    setReact("Heart")
                    setShowReact(false)
                    dispatchLike("Heart")
                }} src="https://www.dropbox.com/s/sykc43x39wqxlkz/love.gif?raw=1"  alt="Love emoji" />
                <img onClick={(e)=> {
                    e.stopPropagation()
                    setReact("Haha")
                    setShowReact(false)
                    dispatchLike("Haha")
                }} src="https://www.dropbox.com/s/vdg0a8i0kyd16zk/haha.gif?raw=1"  alt="Haha emoji" />
                <img onClick={(e)=> {
                    e.stopPropagation()
                    setReact("Wow")
                    setShowReact(false)
                    dispatchLike("Wow")
                }} src="https://www.dropbox.com/s/ydl0fm5kayxz0e5/wow.gif?raw=1"   alt="Wow emoji" />
                <img onClick={(e)=> {
                    e.stopPropagation()
                    setReact("Sad")
                    setShowReact(false)
                    dispatchLike("Sad")
                }} src="https://www.dropbox.com/s/52n5woibt3vrs76/sad.gif?raw=1"   alt="Sad emoji" />
                <img onClick={(e)=> {
                    e.stopPropagation()
                    setReact("Angry")
                    setShowReact(false)
                    dispatchLike("Angry")
                }} src="https://www.dropbox.com/s/kail2xnglbutusv/angry.gif?raw=1" alt="Angry emoji" />
            </figure>
            }
            <div onClick={()=> {
                dispatchLike(react)
            }}>

                {
                    isLiked=== true &&
                    <>
                    {
                    react=== "Heart" && <img onClick={(e)=> {
                        setReact("Like")
                }} src="https://www.dropbox.com/s/sykc43x39wqxlkz/love.gif?raw=1" style={{width: 32, height: 32}}  alt="Love emoji" />
                }
                {
                    react=== "Haha" && <img onClick={(e)=> {
                        setReact("Like")

                }} src="https://www.dropbox.com/s/vdg0a8i0kyd16zk/haha.gif?raw=1" style={{width: 32, height: 32}}  alt="Haha emoji" />
                }
                {
                    react=== "Wow" && <img onClick={(e)=> {
                        setReact("Like")

                }} src="https://www.dropbox.com/s/ydl0fm5kayxz0e5/wow.gif?raw=1" style={{width: 32, height: 32}}  alt="Wow emoji" />
                }
                {
                    react=== "Sad" && <img onClick={(e)=> {
                        setReact("Like")

                }} src="https://www.dropbox.com/s/52n5woibt3vrs76/sad.gif?raw=1" style={{width: 32, height: 32}}  alt="Sad emoji" />
                }
                {
                    react=== "Angry" && <img onClick={(e)=> {
                        setReact("Like")

                }} src="https://www.dropbox.com/s/kail2xnglbutusv/angry.gif?raw=1" style={{width: 32, height: 32}}  alt="Angry emoji" />
                }
                    </>
                }
                {
                    isLiked=== true && react=== "Like" &&
                    <LikeOutlined onClick={()=> {
                        setReact("Like")
                    }} />
                }
                {
                    isLiked=== false && react!== "Like" &&
                    <LikeOutlined onClick={()=> {
                        setReact("Like")
                        setShowReact(false)
                        dispatchLike("Like")
                    }} />
                }
            </div>
            &nbsp;
            {isLiked ? 'Unlike' : 'Like'}
        </span>
    );
};

export default LikeButton;
