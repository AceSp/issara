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
      <Text>This is the PostTextScreen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5fcff',
  },
});

export default PostPreviewScreen;
