 import React from 'react';
 import { View, Image, Text } from 'react-native';

 const VideoPreviewItem = ({ item, navigation }) => {
     return (
         <View style={{ flex: 1, margin: 2, width: '30%', height: 120 }}>
             <Image
                source={{ uri: item.postInfo.thumbnail }}
                style={{ width: '100%', height: '100%' }}
             />
             {/* <Text style={{ textAlign: 'center', position: 'absolute', bottom: 0, left: 0, right: 0 }}>{item.postInfo.title}</Text> */}
         </View>
     );
 };

 export default VideoPreviewItem;
