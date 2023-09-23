import { v4 as uuidv4, v5 as uuidv5 } from 'uuid';
import { toast } from "react-toastify";

export function generateUuid(arg) {
    const namespace = uuidv4();
    const generatedUuid = uuidv5(arg, namespace);

    return generatedUuid
}

export default async function createUser(name, email, image) {
    const generatedUuid = generateUuid(email);

    try {
        await fetch(`https://wasteful-brown.cmd.outerbase.io/createUser`, {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({
                user_id: generatedUuid,
                name: name,
                email: email,
                image: image,
            }),
        });
        localStorage.removeItem("isAuthenticated")
        toast.error("Logged In successfully!", {
            position: toast.POSITION.TOP_RIGHT
        })
    } catch (error) {
        toast.error("There was an error while logging in!", {
            position: toast.POSITION.TOP_RIGHT
        })
    }
}

export async function getUser(paramVal, byEmail=true) {
    const param = byEmail? "email" : "user_id"
    const endpoint = byEmail? "getUser" : "getUserById"
    try {
        const response = await fetch(`https://wasteful-brown.cmd.outerbase.io/${endpoint}?${param}=${paramVal}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP Error! Status: ${response.status}`);
        }

        const userData = await response.json(); // Parse the response body as JSON
        return userData; // Return the parsed data
    } catch (error) {
        toast.error("There was an error while getting user!", {
            position: toast.POSITION.TOP_RIGHT
        })
        throw error; // Rethrow the error to handle it elsewhere if needed
    }
}

