import "./DraftComponent.css"
import { useState, useRef, useEffect } from "react"
import { CiImageOn } from "react-icons/ci";
import { useAuth0, } from "@auth0/auth0-react";
import { getUser, generateUuid } from "../../js/utils";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Loader from "../Loader/Loader"

const DraftComponent = () => {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [coverImage, setCoverImage] = useState("")
  const [isPosting, setIsPosting] = useState(false)
  const titleRef = useRef(null)
  const contentRef = useRef(null)

  const navigate = useNavigate()
  useTextareaResize(titleRef)
  useTextareaResize(contentRef)

  const { user } = useAuth0();

  function handleImgChange(e) {
    setCoverImage(e.target.files[0]);
  }

  async function handlePublish(publish) {
    setIsPosting(true)
    if (title.length < 2) {
      toast.error("Please write a valid title!", {
        position: toast.POSITION.TOP_RIGHT
      })
      setIsPosting(false)
      return
    }

    if (content.length < 5) {
      toast.error("Please write a longer content!", {
        position: toast.POSITION.TOP_RIGHT
      })
      setIsPosting(false)
      return
    }

    const url = publish ? "https://wasteful-brown.cmd.outerbase.io/createBlog" : "https://wasteful-brown.cmd.outerbase.io/createDraft"

    const user_id = await getUser(user?.email)
      .then((res) => {
        return res.response.items[0].user_id
      })
      .catch((err) => {
        setIsPosting(false)
        console.error(err)
      })

    const image_id = await uploadImage()
      .then((res) => {
        return res.public_id
      })
      .catch((err) => {
        setIsPosting(false)
        console.error(err)
      })

    if (user_id) {
      const generatedUuid = generateUuid(coverImage?.name ? coverImage.name : "")

      async function publishBlog() {
        try {
          await fetch(url, {
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

          const publish_msg = publish ? "Blog published successfully!" : "Saved as draft successfully!"

          // RESET STATE 
          setTitle("")
          setContent("")
          setCoverImage("")

          toast.success(publish_msg, {
            position: toast.POSITION.TOP_RIGHT
          })

          navigate("/")
        } catch (error) {
          console.error(error)
          toast.error("An error occured, please try again later", {
            position: toast.POSITION.TOP_RIGHT
          })
        }

        finally {
          () => {
            setIsPosting(false)
          }
        }
      }

      await publishBlog()
    }

  }

  async function uploadImage() {
    if (!coverImage?.name) return { public_id: null }

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
        toast.error("There was an error while uploading image!", {
          position: toast.POSITION.TOP_RIGHT
        })
      });

    return imgData;
  }


  return (
    <div className="draft_container" style={{ position: "relative" }}>
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

      <div style={{ position: "relative" }}>
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
      {isPosting && <Loader />}
      <div className="blog_btn_container">
        <button
          className="save_draft_btn blog_btn"
          onClick={() => handlePublish(false)}
        >
          Save Draft
        </button>
        <button
          className="publish_blog_btn blog_btn"
          onClick={() => handlePublish(true)}
        >
          Publish
        </button>
      </div>
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