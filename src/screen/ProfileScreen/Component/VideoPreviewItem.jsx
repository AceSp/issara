 import React from 'react';
 import { View, Image, Text } from 'react-native';

 const VideoPreviewItem = ({ item, navigation }) => {
     return (
         <View style={{ flex: 1/3, aspectRatio: 0.7, margin: 1 }}>
             <Image
                source={{ uri: item.postInfo.thumbnail }}
                style={{ width: '100%', height: '100%' }}
             />
         </View>
     );
 };

 export default VideoPreviewItem;
