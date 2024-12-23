 import React from 'react';
 import { Image, TouchableOpacity } from 'react-native';

 const VideoPreviewItem = ({ item, navigation, index }) => {
    const handlePress = () => {
        navigation.navigate('UserVideo', { userId: item.postInfo.author.id, index }); 
    };

    return (
        <TouchableOpacity onPress={handlePress} style={{ flex: 1/3, aspectRatio: 0.7, margin: 1 }}>
            <Image
            source={{ uri: item.postInfo.thumbnail }}
            style={{ width: '100%', height: '100%' }}
            />
        </TouchableOpacity>
    );
 };

 export default VideoPreviewItem;
