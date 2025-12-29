import React from 'react'
import Loading from './Loading'

const ImagePreview = (props) => {

  // Function to handle force download
  const handleDownload = async () => {
    if (!props.enhanced) return;

    try {
      // 1. Fetch the image as a "Blob" (file data)
      const response = await fetch(props.enhanced);
      const blob = await response.blob();
      
      // 2. Create a temporary link to download it
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = "Enhanced_Image.jpg"; // The name of the downloaded file
      document.body.appendChild(link);
      link.click();
      
      // 3. Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      // Fallback: Just open in new tab if strict browser security blocks blob
      window.open(props.enhanced, '_blank');
    }
  };

  return (
    <div className='mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl'>

      {/* --- LEFT SIDE: Original Image --- */}
      <div className="bg-white shadow-lg rounded-xl overflow-hidden flex flex-col h-full">
        <h2 className="text-xl font-semibold text-center bg-gray-800 text-white py-2">Original Image</h2>
        
        <div className="flex-grow relative min-h-[320px]">
            {props.uploaded ? (
                <img src={props.uploaded} alt="Original" className="w-full h-full object-contain bg-gray-100" />
            ) : (
                <div className="flex items-center justify-center h-full bg-gray-200 text-gray-500">No Image Selected</div>
            )}
        </div>
      </div>

      {/* --- RIGHT SIDE: Enhanced Image --- */}
      <div className="bg-white shadow-lg rounded-xl overflow-hidden flex flex-col h-full">
        <h2 className="text-xl font-semibold text-center bg-blue-800 text-white py-2">Enhanced Image</h2>
        
        <div className="flex-grow relative min-h-[320px]">
            {props.loading ? (
                <Loading />
            ) : props.enhanced ? (
                <div className="relative w-full h-full group">
                    <img src={props.enhanced} alt="Enhanced Result" className='w-full h-full object-contain bg-gray-100' />
                    
                    {/* DOWNLOAD BUTTON (Overlays on hover, or appears below) */}
                    <button 
                        onClick={handleDownload}
                        className="absolute bottom-4 right-4 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full shadow-lg transition-transform transform hover:scale-105 flex items-center gap-2"
                    >
                        {/* Simple SVG Download Icon */}
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M12 12.75l-3-3m0 0l-3 3m3-3v7.5" transform="rotate(180 12 12)" />
                        </svg>
                        Download
                    </button>
                </div>
            ) : (
                <div className="flex items-center justify-center h-full bg-gray-200 text-gray-500">No Image Selected</div>
            )}
        </div>

      </div>
      
    </div>
  )
}

export default ImagePreview