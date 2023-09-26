import "./BlogComponent.css"
import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getBlog, getCloudinaryImgUrl, getUser } from '../../js/utils'
import { logo, B_logo, user as userImg, default_cover_img } from "../../assets"
import { FaRegCommentDots } from "react-icons/fa6";
import { IoSend } from "react-icons/io5";

const BlogComponent = () => {
    const [blog, setBlog] = useBlog()
    const navigate = useNavigate()
    const content = blog?.content?.split('\n');
    const blogImgSrc = getCloudinaryImgUrl(blog?.image_id)

    const user_id = blog?.user_id
    const [user, setUser] = useUser(user_id)
    const [suggestions, setSuggestions] = useSuggestions(user_id)
    console.log(user)

    const suggestionsArr = suggestions.map((suggestion) => {
        const cover_img = getCloudinaryImgUrl(suggestion?.image_id)
        return (
            <div
                className="bps_container"
                onClick={() => navigate(`/blog/${suggestion.post_id}`)}
                key={suggestion.post_id}
            >
                <div className="bps_header_container">
                    <div className="bpsh_image">
                        <img
                            src={user?.image ? user.image : userImg}
                            alt={user?.name}
                            className="bp_img"
                        />
                    </div>
                    <p className="bpsh_name">{user?.name}</p>
                </div>
                <div className="bps_content_container">
                    <div className="bpsc_cover_image">
                        <img
                            src={cover_img.length > 1 ? cover_img : default_cover_img}
                            alt=""
                            className="bp_img"
                        />
                    </div>
                    <div className="bpsc_text_container">
                        <h2 className="bpsc_title">
                            {suggestion.title}
                        </h2>
                        <p className="bpsc_content">
                            {suggestion.content.substr(0, 100)}
                            <span style={{ fontSize: "32px", lineHeight: 0 }}>...</span>
                        </p>
                    </div>
                </div>
            </div>
        )
    })

    return (
        <div className="blog_page_main_container">
            <div className="blog_page_blog_container">
                <div className="bp_image_container">
                    <img src={blogImgSrc} alt="" className="bp_image" />
                </div>
                <div className="bp_text_container">
                    <h1 className="bp_title">
                        {blog?.title}
                    </h1>
                    <div>
                        {content?.map((line, index) => {
                            return line === "" ? (
                                <br key={index} />
                            ) : (
                                <p key={index} className="bp_content">
                                    {line}
                                </p>
                            )
                        })}
                    </div>
                </div>
            </div>

            <div className="extras_container">
                <div className="extras_icon extras_like_icon">
                    Like (11)
                </div>
                <div className="extras_icon extras_bookmark_icon">
                    Bookmark
                </div>
            </div>

            <div className="comments_main_container">
                <div className="comments_header">
                    <FaRegCommentDots className="comment_heading_icon" />
                    <h2>Comments</h2>
                </div>
                <div>
                    <div className="comment_input_container">
                        <input type="text" placeholder="Add a comment" className="comment_input" />
                        <IoSend className="comment_send_icon" />
                    </div>
                    {/* <div className="no_comments">
                        <p>No comments yet...</p>
                    </div> */}
                    <div className="comments_sub_container">
                        <div className="comment">
                            <div className="comment_header">
                                <div className="comment_doer_image">
                                    <img src={userImg} alt="" className="bp_img" />
                                </div>
                                <h3 className="comment_doer_name">
                                    Name Name
                                </h3>
                            </div>
                            <p className="commment_doer_text">
                                This article is really amazing and easy to understand.
                                Thanks a lot for sharing.
                            </p>
                        </div>
                        <div className="comment last_comment_border">
                            <div className="comment_header">
                                <div className="comment_doer_image">
                                    <img src={userImg} alt="" className="bp_img" />
                                </div>
                                <h3 className="comment_doer_name">
                                    Name Name
                                </h3>
                            </div>
                            <p className="commment_doer_text">
                                This article is really amazing and easy to understand.
                                Thanks a lot for sharing.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bp_author_container">
                <div onClick={() => navigate(`/user/${user_id}`)}>
                    <img
                        src={user?.image ? user.image : userImg}
                        alt={user?.name}
                        className="bpa_image"
                    />
                </div>
                <div>
                    <h4 className="bpa_heading">WRITTEN BY</h4>
                    <p
                        className="bpa_name"
                        onClick={() => navigate(`/user/${user_id}`)}
                    >
                        {user?.name}
                    </p>
                </div>
            </div>
            <div className="bp_suggestions_container">
                <h3 className="bps_heading">
                    More Articles
                </h3>
                <div className="bps_main_container">
                    {suggestionsArr}
                </div>
            </div>
        </div>
    )
}

export default BlogComponent


function useBlog() {
    const { post_id } = useParams()
    const [blog, setBlog] = useState({})

    useEffect(() => {
        async function getBlogData() {
            const blogData = await getBlog(post_id, true)
            setBlog(blogData?.response?.items[0])
            // window.scrollTo(0, 0)
        }
        getBlogData()
    }, [post_id])

    return [blog, setBlog]
}


function useUser(user_id) {
    const [user, setUser] = useState({})
    useEffect(() => {
        async function getUserData() {
            const userData = await getUser(user_id, false)
            setUser(userData?.response?.items[0])
        }
        getUserData()
    }, [user_id])

    return [user, setUser]
}

function useSuggestions(user_id) {
    const [suggestions, setSuggestions] = useState([])

    useEffect(() => {
        async function getBlogData() {
            const blogData = await getBlog(user_id, false)
            setSuggestions(blogData?.response?.items)
        }
        getBlogData()
    }, [user_id])

    return [suggestions, setSuggestions]
}