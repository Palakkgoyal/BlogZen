import "./HomeComponent.css"
import { user, logo } from "../../assets"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { getUser } from "../../js/utils"

const HomeComponent = () => {
    const [blogs, setBlogs] = useBlogs()

    console.log(blogs)

    let mappedBlogs = blogs.map((blog) => {
        const cover_img_url = `https://res.cloudinary.com/dxzo4ug5i/image/upload/${blog.image_id}`
        return (
            <div className="hb_container">
                <div className="hb_user_details">
                    <img src={blog?.user?.picture ? blog.user.picture : user}
                        alt={blog?.user?.name}
                        className="hb_user_image"
                    />
                    <div>
                        <h3 className="hb_user_name">{blog.user.name}</h3>
                        <p className="hb_post_date">Sep 20, 2023</p>
                    </div>
                </div>
                <div className="hb_blog_details">
                    {blog.image_id !== "%!s(<nil>)" && (
                        <img src={cover_img_url} alt={blog.title} className="hb_cover_image" />
                    )}
                    <div>
                        <h2 className="hb_title">
                            {blog.title}
                        </h2>
                        <p className="hb_content">
                            {blog.content.substring(0,250)}...
                        </p>
                    </div>
                </div>
            </div>
        )
    })

    return (
        <div className="home_main_container">
            <div className="home_blog_main_container">
                {mappedBlogs}
                {/* <div className="hb_container">
                    <div className="hb_user_details">
                        <img src={user} alt="" className="hb_user_image" />
                        <div>
                            <h3 className="hb_user_name">Palak Goyal</h3>
                            <p className="hb_post_date">Sep 20, 2023</p>
                        </div>
                    </div>
                    <div className="hb_blog_details">
                        <img src={logo} alt="" className="hb_cover_image" />
                        <div>
                            <h2 className="hb_title">
                                Full Title of the blog
                            </h2>
                            <p className="hb_content">
                                Initial lines of blog...
                                Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium distinctio nulla in eos sed. Voluptatibus iusto eaque itaque voluptatum nulla accusamus, quasi, ex quo veniam consequuntur consequatur aliquam, provident odit.
                            </p>
                        </div>
                    </div>
                </div> */}
            </div>


            <div className="home_user_container">
                skdfksjkfd
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