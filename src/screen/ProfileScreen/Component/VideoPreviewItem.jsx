 import React from 'react';
 import { View, Image, Text } from 'react-native';

 const VideoPreviewItem = ({ item, navigation }) => {
     return (
         <View style={{ flex: 1, margin: 2, width: '30%', aspectRatio: 1 }}>
             <Image
                source={{ uri: item.postInfo.thumbnail }}
                style={{ width: '100%', height: '100%', aspectRatio: 1 }}
             />
         </View>
     );
 };

 export default VideoPreviewItem;
