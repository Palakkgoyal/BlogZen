import "./HomeComponent.css"
import { user } from "../../assets"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { getUser } from "../../js/utils"

// React icons 
import { BsPencil, BsLinkedin, BsDiscord } from "react-icons/bs";
import { FaXTwitter, FaHashnode } from "react-icons/fa6";
import { BiBookmarkPlus } from "react-icons/bi";
import { PiChatsCircleLight } from "react-icons/pi";

const HomeComponent = () => {
    const [blogs, setBlogs] = useBlogs()
    const navigate = useNavigate()

    function formatTimestamp(time) {
        const timeArr = time.split("T")[0].split("-") // YY - MM - DD
        const monthArr = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"]
        const formattedStr = `${monthArr[+timeArr[1] - 1]} ${timeArr[2]}, ${timeArr[0]}`

        return formattedStr;
    }

    let mappedBlogs = blogs.map((blog) => {
        // 2023-09-22T11:42:51Z
        const cover_img_url = `https://res.cloudinary.com/dxzo4ug5i/image/upload/${blog.image_id}`
        const timestamp = formatTimestamp(blog.timestamp)
        return (
            <div className="hb_container" key={blog.post_id}> 
                <div className="hb_user_details">
                    <img src={blog?.user?.picture ? blog.user.picture : user}
                        alt={blog?.user?.name}
                        className="hb_user_image"
                    />
                    <div>
                        <h3 className="hb_user_name">{blog.user.name}</h3>
                        <p className="hb_post_date">{timestamp}</p>
                    </div>
                </div>
                <div className="hb_blog_details" onClick={() => navigate(`/blog/${blog.post_id}`)}>
                    {blog.image_id !== "%!s(<nil>)" && (
                        <div className="hb_cover_image_container">
                            <img src={cover_img_url} alt={blog.title} className="hb_cover_image" />
                        </div>
                    )}
                    <div>
                        <h2 className="hb_title">
                            {blog.title}
                        </h2>
                        <p className="hb_content">
                            {blog.content.substring(0, 250)}...
                        </p>
                    </div>
                </div>
                <div className="hb_footer">
                    <button className="hb_footer_btn">
                        <PiChatsCircleLight className="hb_footer_icon"/> Discuss
                    </button>
                    <button className="hb_footer_btn">
                        <BiBookmarkPlus className="hb_footer_icon" />
                    </button>
                </div>
            </div>
        )
    })

    return (
        <div className="home_main_container">
            <div className="home_blog_main_container">
                {mappedBlogs}
            </div>

            <div className="home_sidebar_container">
                <div className="home_section_container">
                    <div className="hd_header_container">
                        <h2 className="hd_title">
                            Drafts (1)
                        </h2>
                        <button className="hd_get_all_cta">
                            See All
                        </button>
                    </div>
                    <div>
                        <h3>
                            Title of the draft draft draft kjsdkf...
                        </h3>
                    </div>
                    <div className="hd_details">
                        <p>
                            Edited {" "}
                            <span className="hd_edited_time">
                                Just Now
                            </span>
                        </p>
                        <button className="hd_edit_cta">
                            Continue Editing <BsPencil />
                        </button>
                    </div>
                </div>
                <div className="home_section_container">
                    <h2 className="hd_title">
                        Trending Articles
                    </h2>
                    <div className="trending_articles_container">
                        <div>
                            <h3 style={{cursor: "pointer"}}>
                                Title of the draft draft draft kjsdk and
                                understanding its meaning
                            </h3>
                            <p className="hd_details" style={{marginTop: "10px", cursor: "pointer"}}>
                                Palak Goyal
                            </p>
                        </div>
                        <div>
                            <h3>
                                Title of the draft draft draft kjsdk and
                                understanding its meaning
                            </h3>
                            <p className="hd_details" style={{marginTop: "10px"}}>
                                Palak Goyal
                            </p>
                        </div>
                        <div>
                            <h3>
                                Title of the draft draft draft kjsdk and
                                understanding its meaning
                            </h3>
                            <p className="hd_details" style={{marginTop: "10px"}}>
                                Palak Goyal
                            </p>
                        </div>
                    </div>
                </div>
                <div className="home_section_container">
                    <h2 className="hd_title" style={{ fontSize: "20px" }}>
                        Connect With Us
                    </h2>
                    <div className="sidebar_footer_links">
                        <a href="https://twitter.com/palaktwts">
                            <FaXTwitter className="footer_link" />
                        </a>
                        <a href="https://hashnode.com/@Palakkgoyal">
                            <FaHashnode className="footer_link" />
                        </a>
                        <a href="https://www.linkedin.com/in/palak-goyal-037a02269/">
                            <BsLinkedin className="footer_link" />
                        </a>
                        <a href="">
                            <BsDiscord className="footer_link" />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HomeComponent


function useBlogs() {
    const [blogs, setBlogs] = useState([])

    useEffect(() => {
        async function getBlogs() {
            try {
                const response = await fetch("https://wasteful-brown.cmd.outerbase.io/getBlogs", {
                    'method': 'GET',
                    'headers': {
                        'content-type': 'application/json'
                    },
                })

                if (!response.ok) {
                    toast.error("There was an error getting blogs!", {
                        position: toast.POSITION.TOP_RIGHT
                    })
                    throw new Error(`HTTP Error! Status: ${response.status}`)
                }

                let data = await response.json();
                data = data.response.items
                data = await Promise.all(data.map(async (blog) => {
                    try {
                        const user = await getUser(blog.user_id, false);
                        return {
                            ...blog,
                            user: user.response.items[0],
                        };
                    } catch (error) {
                        toast.error("There was an error getting blogs!", {
                            position: toast.POSITION.TOP_RIGHT
                        })
                        return blog; // Return the original blog item without the user information.
                    }
                }))

                setBlogs(data)
            }

            catch (error) {
                toast.error("There was an error getting blogs!", {
                    position: toast.POSITION.TOP_RIGHT
                })
                throw error;
            }
        }

        getBlogs()
    }, [])

    return [blogs, setBlogs]
}