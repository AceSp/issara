import BackgroundService from 'react-native-background-actions';
import axios from 'axios';
import RNFS from 'react-native-fs';

const uploadFileInChunks = async (filePath) => {
    const uploadUrl = 'http://localhost:3004/upload';
    const chunkSize = 511500;
    const file = await RNFS.stat(filePath);

    try {
        const fileSize = file.size;
        let offset = 0;
        const now = Date.now();
        const fileName = `${now}_video.mp4`; // Assuming it's an MP4 file

        while (offset < fileSize) {
            const chunk = await RNFS.read(filePath, chunkSize, offset, 'base64');
            const formData = new FormData();
            
            // Create a Blob from the base64 string
            const blob = await fetch(`data:application/octet-stream;base64,${chunk}`).then(r => r.blob());
            
            // Append the Blob as a file
            formData.append('chunk', blob, 'chunk');
            formData.append('offset', offset.toString());
            formData.append('totalSize', fileSize.toString());
            formData.append('fileName', fileName);

            console.log('Sending request:', {
                url: uploadUrl,
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': 'Bearer YOUR_TOKEN_HERE'
                },
                formData: {
                    chunk: 'Blob',
                    offset: offset.toString(),
                    totalSize: fileSize.toString(),
                    fileName: fileName
                }
            });

            try {
                const response = await axios.post(uploadUrl, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': 'Bearer YOUR_TOKEN_HERE'
                    },
                });
                console.log('Server response:', response.data);
            } catch (error) {
                console.error('Upload failed:', {
                    message: error.message,
                    status: error.response ? error.response.status : 'No response',
                    data: error.response ? error.response.data : 'No response data',
                    request: {
                        url: uploadUrl,
                        method: 'POST',
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            'Authorization': 'Bearer YOUR_TOKEN_HERE'
                        },
                        formData: {
                            chunk: 'Blob',
                            offset: offset.toString(),
                            totalSize: fileSize.toString(),
                            fileName: fileName
                        }
                    }
                });
                await BackgroundService.updateNotification({
                    taskDesc: 'File upload Failed',
                });
                throw error; // Re-throw the error to stop the upload process
            }

            console.log('Server response:', response.data);

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
      console.error('Upload failed:', {
          message: error.message,
          status: error.response ? error.response.status : 'No response',
          data: error.response ? error.response.data : 'No response data',
      });
      await BackgroundService.updateNotification({
          taskDesc: 'File upload Failed',
      });
    }
};

export default uploadFileInChunks;
