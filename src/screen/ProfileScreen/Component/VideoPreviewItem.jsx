 import React from 'react';
 import { View, Image, Text } from 'react-native';

 const VideoPreviewItem = ({ item, navigation }) => {
     return (
         <View style={{ flex: 1, margin: 2, width: '33.33%' }}>
             <Image
                 source={{ uri: item.postInfo.thumbnail }}
                 style={{ width: '100%', height: 150 }}
             />
             <Text style={{ textAlign: 'center' }}>{item.postInfo.title}</Text>
         </View>
     );
 };

 export default VideoPreviewItem;
