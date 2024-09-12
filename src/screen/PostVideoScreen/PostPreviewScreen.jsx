import * as React from 'react';
import { 
  View, 
  Text, 
  StyleSheet 
} from 'react-native';
import { VideoPlayer } from '../Video/views';

function PostPreviewScreen({
  uri
}) {
  return (
    <View style={styles.container}>
      <VideoPlayer uri={uri} style={styles.video} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  video: {
    flex: 1,
  },
});

export default PostPreviewScreen;
