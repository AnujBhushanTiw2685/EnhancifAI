import React from 'react'
import Loading from './Loading'

const ImagePreview = (props) => {
  return (
    <div className='mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl'>

      {/* --- LEFT SIDE: Original Image --- */}
      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        <h2 className="text-xl font-semibold text-center bg-gray-800 text-white py-2">Original Image</h2>
        
        {props.uploaded ? (
             <img src={props.uploaded} alt="Original" className="w-full h-full object-cover" />
        ) : (
             <div className="flex items-center justify-center h-80 bg-gray-200 text-gray-500">No Image Selected</div>
        )}
      </div>

      {/* --- RIGHT SIDE: Enhanced Image --- */}
      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        <h2 className="text-xl font-semibold text-center bg-blue-800 text-white py-2">Enhanced Image</h2>
        
        {/* LOGIC FIX:
           1. If Loading -> Show Spinner
           2. If Enhanced Image Exists -> Show Image
           3. If NEITHER -> Show "No Image Selected"
        */}
        
        {props.loading ? (
            <Loading />
        ) : props.enhanced ? (
            <img src={props.enhanced} alt="Enhanced Result" className='w-full h-full object-cover' />
        ) : (
            <div className="flex items-center justify-center h-80 bg-gray-200 text-gray-500">No Image Selected</div>
        )}

      </div>
      
    </div>
  )
}

export default ImagePreview