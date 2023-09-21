import { v4 as uuidv4, v5 as uuidv5 } from 'uuid';

export function generateUuid(arg) {
    const namespace = uuidv4();
    const generatedUuid = uuidv5(arg, namespace);

    return generatedUuid
}

export default async function createUser(name, email) {
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
            }),
        });
        localStorage.removeItem("isAuthenticated")
    } catch (error) {
        console.error(error, "err")
    }
}

export async function getUser(email) {
    try {
        const response = await fetch(`https://wasteful-brown.cmd.outerbase.io/getUser?email=${email}`, {
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
        console.error("Error fetching user:", error);
        throw error; // Rethrow the error to handle it elsewhere if needed
    }
}

