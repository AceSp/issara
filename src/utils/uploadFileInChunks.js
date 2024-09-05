import BackgroundService from 'react-native-background-actions';
import RNFS from 'react-native-fs';
import axios from 'axios';

// Axios interceptor to log request details
axios.interceptors.request.use(request => {
  console.log('Starting Request', JSON.stringify(request, null, 2));
  return request;
});

// Axios interceptor to log response details
axios.interceptors.response.use(response => {
  console.log('Response:', JSON.stringify(response, null, 2));
  return response;
}, error => {
  console.error('Response Error:', JSON.stringify(error, null, 2));
  return Promise.reject(error);
});

const uploadFileInChunks = async (filePath) => {
  const uploadUrl =
    'http://localhost:3004/upload';
  /*
  NOTE: For base64 the chunk size should be a multiple of 3. 
  Please go through this (~1min) https://stackoverflow.com/a/7920834
  https://javascript.plainenglish.io/large-file-uploads-in-the-background-with-react-native-1b9fe49e367c
  This guy say he experiment with 500kb so I'll leave it at this for now.
  Might do some experiment myself later
  */
  const chunkSize = 511500; 
  const stat = await RNFS.stat(filePath);
  try {
    const fileSize = stat.size;
    let offset = 0;
    const now = Date.now();
    while (offset < fileSize) {
      //here we are reading only a small chunk of the file.
      const chunk = await RNFS.read(filePath, chunkSize, offset, 'base64');
      const formData = new FormData();
      // formData.append("chunk", chunk);
      // formData.append("offset", offset.toString());
      // formData.append("totalSize", fileSize.toString());
      const file = {
        fileContent: chunk,
        offset: offset.toString(),
        totalSize: fileSize.toString(),
      };
      formData.append("file", file);

      await axios({
        method: 'POST',
        url: uploadUrl,
        headers: {
          "Content-Type": "multipart/form-data"
        },
        data: formData,
      });

      let percentage = Math.round((offset / fileSize) * 100);
      console.log('filesize, offset ', fileSize, offset);
      await BackgroundService.updateNotification({
        progressBar: {
          max: 100,
          value: percentage,
        },
        taskDesc: `Uploading file: ${percentage}% completed`,
      });
      offset += chunkSize;
    }
    console.log('Upload complete');
    await BackgroundService.updateNotification({
      taskDesc: 'File Uploaded',
    });
  } catch (error) {
    console.error('Error during chunk upload:', error);
    console.log('Error Response:', error.response);
    console.log('Error Request:', error.request);
    console.log('Error Config:', error.config);
    await BackgroundService.updateNotification({
      taskDesc: 'File upload Failed',
    });
  }
};

  export default uploadFileInChunks;
