import "./ProfileComponent.css"
import { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import createUser, { getUser, getBlog, getCloudinaryImgUrl } from "../../js/utils";
import Loader from "../Loader/Loader"
import { default_cover_img } from "../../assets";
import { useNavigate } from "react-router-dom";

const ProfileComponent = () => {
    const { user, isLoading, logout } = useAuth0();
    const [blogs, setBlogs] = useGetUser();
    const navigate = useNavigate()


    async function createNewUser() {
        await createUser(user?.name, user?.email, user?.picture)
    }

    useEffect(() => {
        const isAuthenticated = localStorage.getItem("isAuthenticated")
        if (isAuthenticated && user) {
            createNewUser()
        }
    }, [])


    if (isLoading) {
        return <Loader />
    }

    const suggestionsArr = blogs.map((suggestion) => {
        const cover_img = getCloudinaryImgUrl(suggestion?.image_id)
        return (
            <div
                className="bps_container profile_blog_box"
                onClick={() => navigate(`/blog/${suggestion.post_id}`)}
                key={suggestion.post_id}
            >
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
        <div className="profile_page_container">
            <div className="user_profile_container">
                <div className="user_image_container">
                    <img
                        src={user?.picture}
                        alt={user?.name}
                        className="user_profile_image"
                    />
                </div>
                <div>
                    <h2 className="profile_user_name">
                        {user?.name}
                    </h2>
                    <p className="profile_user_email">
                        {user?.email}
                    </p>
                    <button
                        className="logout_btn login_btn"
                        onClick={logout}
                    >
                        LogOut
                    </button>
                </div>
            </div>

            <div className="profile_blogs_container">
                <div>
                    <h2 className="profile_blogs_heading">
                        Your Published Blogs
                    </h2>
                    <div className="profile_blogs_sub_container">
                        {suggestionsArr.length > 0 ? suggestionsArr : (
                            <p
                            
                            >
                                You haven't published anything yet...
                            </p>
                        )}
                    </div>
                </div>
                <div>

                </div>
            </div>
        </div>
    )
}

export default ProfileComponent


function useGetUser() {
    const [blogs, setBlogs] = useState([])
    const { user } = useAuth0();

    useEffect(() => {
        async function handleGetUser() {
            const res = await getUser(user?.email)
            const user_id = res?.response?.items[0]?.user_id;
            const blogData = await getBlog(user_id, false, "getAllBlogsOfUser")
            setBlogs(blogData.response.items)
        }

        handleGetUser()

    }, [user])

    return [blogs, setBlogs]
}
