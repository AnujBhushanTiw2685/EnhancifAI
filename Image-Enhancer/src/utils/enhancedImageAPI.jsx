import axios from 'axios';

// Helper to convert File to Base64
const toBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});

const MAXIMUM_RETRIES = 20;

export const enhancedImageAPI = async (file) => {
    try {
        const base64File = await toBase64(file);

        
        const taskId = await uploadImage(base64File);
        console.log("Image uploaded. Task ID: ", taskId);

        
        const enhancedImageData = await PollForEnhancedImage(taskId);
        console.log("Full API Response:", enhancedImageData); 

       
        if (enhancedImageData?.image) {
            return enhancedImageData.image; 
        } else {
            throw new Error("API finished but no image URL found.");
        }

    } catch (error) {
        console.log("Error enhancing the image: ", error.message);
        throw error;
    }
}
const uploadImage = async (base64File) => {
    // Call your own Vercel API endpoint
    const { data } = await axios.post('/api/upload', { 
        imageBase64: base64File 
    });

    if (!data?.data?.task_id) {
        throw new Error("Error uploading image! Task ID not found.");
    }
    return data.data.task_id;
}

const fetchEnhancedImage = async (taskId) => {
    // Call your own Vercel API endpoint
    const { data } = await axios.get(`/api/status?taskId=${taskId}`);
    
    if (!data?.data?.task_id) {
        throw new Error("Error fetching status! Image not found.");
    }
    return data.data;
};

const PollForEnhancedImage = async (taskId, retries = 0) => {
    const result = await fetchEnhancedImage(taskId);
    
    // Check if processing (State 4 usually means "Processing" in PicWish)
    // Adjust this check based on PicWish docs if 'state' codes differ
    if (result.state !== 1) { // Assuming 1 = Success. If 4 is processing, keep your logic.
       // YOUR LOGIC WAS: if(result.state === 4) ... 
       // Make sure you know which state number means "Success" vs "Processing"
       
       if(result.state === 1) { 
           return result; // Done!
       } else if (result.state < 0) {
           throw new Error("Image processing failed on server.");
       }
       
       // Still processing...
       console.log("Processing...");
       if (retries >= MAXIMUM_RETRIES) {
           throw new Error("Max retries reached.");
       }
       
       await new Promise((resolve) => setTimeout(resolve, 2000));
       return PollForEnhancedImage(taskId, retries + 1);
    }
    
    return result;
}
