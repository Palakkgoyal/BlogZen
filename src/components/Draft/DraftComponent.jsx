import "./DraftComponent.css"
import { useState, useRef, useEffect } from "react"
import { CiImageOn } from "react-icons/ci";
import { useAuth0, } from "@auth0/auth0-react";
import { getUser, generateUuid } from "../../js/utils";

const DraftComponent = () => {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [coverImage, setCoverImage] = useState("")
  const titleRef = useRef(null)
  const contentRef = useRef(null)
  useTextareaResize(titleRef)
  useTextareaResize(contentRef)

  const { user } = useAuth0();

  function handleImgChange(e) {
    setCoverImage(e.target.files[0]);
  }

  async function handlePublish() {
    const user_id = await getUser(user?.email)
      .then((res) => {
        console.log( res.response.items[0].user_id, "user_id got it")
        return res.response.items[0].user_id
      })

    const image_id = await uploadImage()
      .then((res) => {
        console.log(res.public_id, "image_id got it")
        return res.public_id
      })

    if (user_id) {
      if (coverImage.name.length > 1 && image_id) {
        console.log("uploading...")
        const generatedUuid = generateUuid(coverImage.name)

        async function publishBlog() {
          try {
            await fetch(`https://wasteful-brown.cmd.outerbase.io/createBlog`, {
              method: "POST",
              headers: {
                "content-type": "application/json",
              },
              body: JSON.stringify({
                post_id: generatedUuid,
                user_id: user_id,
                title: title,
                content: content,
                image_id: image_id
              }),
            });

            console.log("done")
          } catch (error) {
            console.error(error, "err")
          }
        }

        await publishBlog()
      }

    }
  }

  async function uploadImage() {
    if (coverImage.name.length < 2) return { public_id: null }

    // Create a FormData object to hold the image data and other parameters
    const formData = new FormData();
    formData.append("file", coverImage);
    formData.append("upload_preset", "zbisdwoj");

    let imgData = "";

    // Define the Cloudinary API URL
    const url = "https://api.cloudinary.com/v1_1/dxzo4ug5i/image/upload";

    await fetch(url, {
      method: "POST",
      body: formData,
    })
      .then(function (response) {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then(function (data) {
        imgData = data;
      })
      .catch(function (error) {
        console.error("There was a problem with the fetch operation:", error);
      });

    return imgData;
  }


  return (
    <div className="draft_container">
      <div className="draft_cover_image_container">
        <label htmlFor="cover_image" className="draft_add_cover_btn">
          <CiImageOn />
          <span>
            Add cover
          </span>
        </label>
        <input
          type="file"
          name="cover_image"
          id="cover_image"
          style={{ display: "none" }}
          accept="image/*"
          onChange={handleImgChange}
        />
        {coverImage.name && (
          <img src={URL.createObjectURL(coverImage)} alt="" className="cover_image" />
        )}
      </div>

      {/* <img src="https://res.cloudinary.com/dxzo4ug5i/image/upload/uv00s0abnrtdoaln3g9b" alt="" /> */}
      <div>
        <textarea
          name="title"
          id=""
          cols="30"
          rows="1"
          value={title}
          ref={titleRef}
          onChange={(e) => setTitle(e.target.value)}
          className="draft_title draft_textarea"
          placeholder="Blog Title..."
          maxLength={160}
        ></textarea>
        <textarea
          name="title"
          id=""
          cols="30"
          rows="1"
          value={content}
          ref={contentRef}
          onChange={(e) => setContent(e.target.value)}
          className="draft_textarea draft_content"
          placeholder="Breate. | Write. | Reflect..."
        ></textarea>
      </div>

      <button onClick={handlePublish}>
        Publish
      </button>
    </div>
  )
}

export default DraftComponent


function useTextareaResize(textareaRef) {
  useEffect(() => {
    textareaRef.current.addEventListener("input", autoResize, false);
    function autoResize() {
      this.style.height = 'auto';
      this.style.height = this.scrollHeight + 4 + 'px';
    }
    return () => textareaRef.current && textareaRef.current.removeEventListener("input", autoResize, false);
  }, [])

}