import "./ProfileComponent.css"
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import createUser, { getUser } from "../../js/utils";

const ProfileComponent = () => {
    const { user, isAuthenticated, isLoading, logout } = useAuth0();

    useEffect(() => {
        const isAuthenticated = localStorage.getItem("isAuthenticated")
        if(isAuthenticated && user) {
            createUser(user?.name, user?.email, user?.picture)
        }
    }, [])

    function handleGetUser() {
        user?.email && getUser(user.email)
    }

    return (
        <div>
            <button onClick={logout}>
                LogOut
            </button>
            <hr />
            <button onClick={handleGetUser}>
                Get User
            </button>
        </div>
    )
}

export default ProfileComponent
