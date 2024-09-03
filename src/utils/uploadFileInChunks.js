import BackgroundService from 'react-native-background-actions';
import axios from 'axios';
import RNFS from 'react-native-fs';

const uploadFileInChunks = async (filePath) => {
    const serverUrl = 'http://localhost:3004/upload'; // Replace with your actual server URL
    const chunkSize = 1024 * 1024; // 1MB chunks
    const file = await RNFS.stat(filePath);
    const fileSize = file.size;
    let offset = 0;

    try {
        while (offset < fileSize) {
            const chunk = await RNFS.read(filePath, chunkSize, offset, 'base64');
            const formData = new FormData();
            
            // Convert base64 to Blob
            const byteCharacters = atob(chunk);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], {type: 'application/octet-stream'});
            
            formData.append('chunk', blob, 'chunk');
            formData.append('offset', offset.toString());
            formData.append('totalSize', fileSize.toString());
            formData.append('fileName', file.name);

            const response = await axios.post(serverUrl, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    console.log(`Chunk upload progress: ${percentCompleted}%`);
                },
            });

            console.log(`Chunk uploaded successfully. Server response:`, response.data);

            offset += chunkSize;
            const totalProgress = Math.round((offset / fileSize) * 100);
            console.log(`Total upload progress: ${totalProgress}%`);
        }

        console.log('Video upload completed successfully');
        return 'Upload successful';
    } catch (error) {
        console.error('Error uploading video:', error);
        throw error;
    }
};


export default uploadFileInChunks;
