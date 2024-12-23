import React, { useEffect, useState, useRef, memo, useLayoutEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  Modal,
  Image
} from 'react-native';
import { Icon } from 'react-native-elements';
import {
  TouchableRipple
} from 'react-native-paper';
import { materialTall, materialColors, iOSColors } from 'react-native-typography';
import ImageViewer from 'react-native-image-zoom-viewer';

import Loading from '../../component/Loading';
import { colors } from '../../utils/constants';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const ShopImageScreen = (props) => {

 const { images } = props.route.params;

  const [ imageViewVisible, setImageView ] = useState(false);
  const [ imageIndex, setImageIndex ] = useState(0);

  const onImagePress = (index) => {
    setImageView(true);
    setImageIndex(index);
  }

  const renderImages = () => {
    let arr = [];
    for(const[index, image] of images.entries()) {
        arr.push(
        <TouchableRipple onPress={() => onImagePress(index)} key={index} style={styles.smallImage}>
          <Image style={styles.smallImage} source={{ uri:image.url }} />
        </TouchableRipple>
        )
    }
    return arr;
  }

  return (
    
    <View style={styles.Root}>
            <Modal 
              onRequestClose={() => setImageView(false)}
              visible={imageViewVisible} 
              transparent={imageViewVisible}>
                <ImageViewer 
                  imageUrls={images}
                  index={imageIndex}
                  onCancel={() => setImageView(false)}
                  enableSwipeDown={true}
                  enablePreload={true}
                />
            </Modal>
      <ScrollView>
          <View style={styles.imageContainer}>
            {renderImages()}
          </View>
      </ScrollView>
    </View>

  )
}

const styles = StyleSheet.create({
  Root: {     
      flex: 1,
      backgroundColor: iOSColors.white
  },
  divider: {
    marginVertical: 10
  },
  imageContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center'
  },
  aboutRow: {
    flexDirection: 'row',
    paddingVertical: 5
  },
  smallImage: {
    width: width*0.325,
    height: width*0.325,
    borderRadius: 1,
    margin: 1
  }
})

export default ShopImageScreen;