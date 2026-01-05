import React, { useRef, useState } from 'react'
import { nanoid } from 'nanoid'
import { uploadImages } from "../../store/features/imageSlice"
import { toast, ToastContainer } from "react-toastify"
import { Link } from 'react-router-dom'
import { BsPlus, BsDash } from "react-icons/bs"
import { useDispatch } from 'react-redux'

function ImageUploader({productId}) {
  const dispatch = useDispatch();

  const [images, setImages] = useState([])
  const [imageInputs, setimageInputs] = useState([{ id: nanoid() }])
  const fileInputRefs=useRef([])

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    const newImages = files.map((file) => ({
      id: nanoid(),
      name: file.name,
      file,
    }))
    setImages((prevImages) => [...prevImages, ...newImages])
  }
  const handleImageUpload = async (e) => {
    e.preventDefault()
    if (!productId) {
      return
    }
    if (Array.isArray(images) && images.length > 0) {
      try {
        // console.log("the productid from component", productId)
        // console.log("the images from component", images)
        const result = await dispatch(
          uploadImages(
            {productId,
            files:images.map((image) => image.file)}
          )
        ).unwrap()
        clearFileInputs()
        toast.success(result.message);
        setImages([]);
      } catch (error) {
        toast.error(error.message);
      }
    }
  }


  const handleAddImageInput = () => {
    setimageInputs((prevInputs) => [...prevInputs, { id: nanoid() }])
    // console.log("added",imageInputs)
  }

  const handleRemoveImageInput = (id) => {
    setimageInputs(imageInputs.filter((input) => input.id !== id))
    // console.log("removed",imageInputs)
  }

  const clearFileInputs=()=>{
    fileInputRefs.current.forEach((input)=>{
      if(input) input.value=null
    })
  }
  return (
    <form onSubmit={handleImageUpload}>
      <div className='mt-4'>
        <h5>Upload Product Image(s)</h5>

        <Link onClick={() => handleAddImageInput()} to={"#"}><BsPlus className='icon'></BsPlus>Add more Images</Link>
        <div className='mb-2 mt-2'>
          {imageInputs.map((input,index) => {
            return (
              <div key={input.id} className='d-flex align-items-center mb-2 input-group'>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleImageChange(e)}
                  className='me-2 form-control'
                  ref={(element)=>fileInputRefs.current[index]=element}
                />

                <button className='btn btn-danger' onClick={() => handleRemoveImageInput(input.id)}><BsDash></BsDash></button>

              </div>
            )
          })}

        </div>

        {imageInputs.length > 0 && (
          <button type="submit" className="btn btn-primary btn-sm">
            Upload Images
          </button>
        )}
      </div>
    </form>
  );
}

export default ImageUploader
