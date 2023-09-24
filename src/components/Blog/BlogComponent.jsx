import "./BlogComponent.css"
import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getBlog, getCloudinaryImgUrl } from '../../js/utils'
import { logo } from "../../assets"

const BlogComponent = () => {
    const [blog, setBlog] = useBlog()
    const navigate = useNavigate()
    const content = blog?.content?.split('\n');
    const blogImgSrc = getCloudinaryImgUrl(blog?.image_id)

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
                            return line === ""? (<br />) : (<p key={index} className="bp_content">{line}</p>)
                        })}
                    </div>
                </div>
            </div>
            <div className="bp_author_container">
                <div onClick={() => navigate(`/user/`)}>
                    <img src={logo} alt="" className="bpa_image"/>
                </div>
                <div>
                    <h4 className="bpa_heading">WRITTEN BY</h4>
                    <p className="bpa_name" onClick={() => navigate(`/user/`)}>Palak Goyal</p>
                </div>
            </div>
            <div className="bp_suggestions_container">
                <h3 className="bps_heading">
                    More Articles
                </h3>
                <div className="bps_container">

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
            setBlog(blogData.response.items[0])
        }
        getBlogData()
    }, [post_id])

    return [blog, setBlog]
}