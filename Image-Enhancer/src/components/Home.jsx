import React from 'react'
import ImageUpload from './ImageUpload'
import ImagePreview from './ImagePreview'
import { useState } from 'react'
import { enhancedImageAPI } from '../utils/enhancedImageAPI'
const Home = () => {
  const [uploadImage, setUploadImage] = useState(null)
  const [enhancedImage, setEnhancedImage] = useState(null)
  const [loading, setLoading] = useState(false)

  const uploadImageHandler = async (file) => {
    setUploadImage(URL.createObjectURL(file));
    setLoading(true);

    try {
      // call the API to enhance the image
      const enhancedURL = await enhancedImageAPI(file);
      
      // 🔴 OLD ERROR: setEnhancedImage(enhancedURL.imageq);
      
      // 🟢 FIX: enhancedURL is already the string link, just use it directly!
      setEnhancedImage(enhancedURL); 
      
      setLoading(false);

    } catch(error) {
      console.log(error);
      alert("Error while enhancing the image. Please try again later.");
      setLoading(false); // Good practice to turn off loading on error too
    }
  }
  return (
    <>
      <ImageUpload  uploadImageHandler = {uploadImageHandler}/>
      <ImagePreview 
      loading={loading} 
      uploaded ={uploadImage} 
      enhanced = {enhancedImage}/>
    </>
  )
}

export default Home
