import axios from 'axios';

const API_KEY = 'wx19lij3y0uk8i68x'
const BASE_URL = 'https://techhk.aoscdn.com/'
const MAXIMUM_RETRIES = 20;




export const enhancedImageAPI = async (file) => {
    // return "hello";

    try{
        //code to upload image 
        // /api/tasks/visual/scale 

        // code to enhance image
        // /api/tasks/visual/scale/{task_id}
        const taskId = await uploadImage(file);
        console.log("Image uploaded successfully. Task ID: ", taskId);

        const enhancedImageData = await PollForEnhancedImage(taskId);
        console.log("Image enhanced successfully. Enhanced Image URL: ", enhancedImageData);

        return enhancedImageData;

    }catch(error){
        console.log("Error enhancing the image: ", error.message);
    }
}

const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('image_file', file);

    const {data} = await axios.post(`${BASE_URL}/api/tasks/visual/scale/`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            'X-API-KEY': API_KEY,


        },
    }    
    );

    if(!data?.data?.task_id){
        throw new Error("Error uploading image! Task ID not found.");
    }
    return data.data.task_id;
    // console.log(data)

    // return taskId;
 }
const fetchEnhancedImage = async (taskId) => {
    const {data} = await axios.get(`${BASE_URL}/api/tasks/visual/scale/${taskId}`, {
        headers: {
            'X-API-KEY': API_KEY,
        },
    });
    if(!data?.data?.task_id){
        throw new Error("Error fetching enhanced image! Image not found.");
    }
    return data.data;
    
 };

const PollForEnhancedImage = async (taskId, retries = 0) => {
    const result = await fetchEnhancedImage(taskId);
    if(result.state === 4){
        console.log("Processing...");

        if(retries >= MAXIMUM_RETRIES) {
            throw new Error("Max retries reached. Please try again later.");    
        }

        await new Promise((resolve) => setTimeout(resolve, 2000));

        return PollForEnhancedImage(taskId, retries + 1);
    }
    return result
}