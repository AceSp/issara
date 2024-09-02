import BackgroundService from 'react-native-background-actions';
import axios from 'axios';
import RNFS from 'react-native-fs';

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
    const file = await RNFS.stat(filePath);

    try {
      const fileSize = file.size;
      let offset = 0;
      while (offset < fileSize) {
        //here we are reading only a small chunk of the file.
        const chunk = await RNFS.read(filePath, chunkSize, offset, 'base64');
        const formData = new FormData();
        formData.append('chunk', {
            uri: `data:application/octet-stream;base64,${chunk}`,
            type: 'application/octet-stream',
            name: 'chunk'
        });
        formData.append('offset', offset.toString());
        formData.append('totalSize', fileSize.toString());
        formData.append('fileName', file.name);

        await axios.post(uploadUrl, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': 'Bearer YOUR_TOKEN_HERE'
            },
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
      await BackgroundService.updateNotification({
        taskDesc: 'File upload Failed',
      });
    }
  };

  export default uploadFileInChunks;
