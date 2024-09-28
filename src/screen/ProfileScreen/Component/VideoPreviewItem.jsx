 import React from 'react';
 import { View, Image, Text } from 'react-native';

 const VideoPreviewItem = ({ item, navigation }) => {
     return (
         <View style={{ flex: 1, margin: 2 }}>
             <Image
                 source={{ uri: item.postInfo.thumbnail }}
                 style={{ width: '100%', height: 150 }}
             />
             <Text>{item.postInfo.title}</Text>
         </View>
     );
 };

 export default VideoPreviewItem;