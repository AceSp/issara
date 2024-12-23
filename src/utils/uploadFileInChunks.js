import BackgroundService from 'react-native-background-actions';
import { VIDEO_URL } from './apollo-client';
import axios from 'axios';

const uploadFileInChunks = async ({
  filePath,
  userId,
  videoId,
  imageId,
}) => {
  try {
    let uploadUrl = VIDEO_URL;
    const formData = new FormData();
    if(videoId) {
      uploadUrl = uploadUrl + 'upload';
      formData.append("file", {
        uri: 'file://' + filePath,  
        name: 'file.mp4',          
        type: 'video/mp4',           
      });
      formData.append("videoId", videoId);
    }
    else if(imageId) {
      uploadUrl = uploadUrl + 'upload-image'
      formData.append("file", {
        uri: 'file://' + filePath,
        name: 'file.jpg',          
        type: 'image/jpg',           
      });
      formData.append("imageId", imageId);
    } else throw new Error('must provide imageId or videoId')

    formData.append("userId", userId);

    let config = {
      headers: {
        "Content-Type": "multipart/form-data"
      },
      onUploadProgress: async function(progressEvent) {
        let percentCompleted = Math.round( (progressEvent.loaded * 100) / progressEvent.total );
        // let percentage = Math.round((offset / fileSize) * 100);
        // console.log('filesize, offset ', fileSize, offset);
        console.log('percent ', percentCompleted);
        await BackgroundService.updateNotification({
          progressBar: {
            max: 100,
            value: percentCompleted,
          },
          taskDesc: `Uploading file: ${percentCompleted}% completed`,
        });
        // offset += chunkSize;
      }
    };

    await axios.post(uploadUrl, formData, config)
  } catch (error) {
    console.error('Error during chunk upload:', error);
    await BackgroundService.updateNotification({
      taskDesc: 'File upload Failed',
    });
  }
};

export default uploadFileInChunks