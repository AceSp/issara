import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight,
} from 'react-native';
import {
  SearchBar,
  Icon,
  Overlay
} from 'react-native-elements';
import { debounce } from 'throttle-debounce';

import { colors } from '../../../utils/constants';

const AddressList = (props) => {

  const [ text, setText ] = useState('');

  useEffect(() => {
    debounce(1000, props.getAddress(text));
  },[text]);

  const _renderItem = (itemProps) => {

    const chooseItem = () => {
      if(props.findOne) {
        if(props.setTambon) props.setTambon(itemProps.item.name);
        if(props.setAmphoe) props.setAmphoe(itemProps.item.name);
        if(props.setChangwat) props.setChangwat(itemProps.item.name);
        if(props.setRegion) props.setRegion(itemProps.item.name);
        if(props.setZipcode) props.setZipcode(itemProps.item.name);
      } else {
        if(props.setTambon) props.setTambon(itemProps.item.TambonThai);
        if(props.setAmphoe) props.setAmphoe(itemProps.item.AmphoeThai);
        if(props.setChangwat) props.setChangwat(itemProps.item.ChangwatThai);
        if(props.setRegion) props.setRegion(itemProps.item.officialRegion);
        if(props.setZipcode) props.setZipcode(itemProps.item.postCodeMain);
      };
      props.setVisible(false);
    };
    if(!itemProps.item) return <View></View>
      return(
          <TouchableOpacity onPress={() => chooseItem()} style={{
            padding: 12,
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 5
            }}>
              <Text>
                {itemProps.item.Name}
              </Text>
          </TouchableOpacity>
      )
  }

  return (
    <Overlay 
        onRequestClose={() => props.setVisible(false)} 
        fullScreen 
        isVisible={props.visible}
        animationType='slide'
    >
      <View>
        <TouchableHighlight underlayColor={colors.LIGHT_GRAY} style={styles.closeOverlay} onPress={() => props.setVisible(false)}>
          <Icon type="antdesign" name="caretdown" size={25} /> 
        </TouchableHighlight> 
          <View style={styles.Root}>
              <FlatList
                  ListHeaderComponent={
                      <View style={styles.header}>
                          <SearchBar 
                              placeholder="ค้นหาสมาชิก"
                              containerStyle={styles.search}  
                              value={text}
                              lightTheme
                              onChangeText={(value) => setText(value)}
                            />
                            {text !== ''? 
                              <TouchableOpacity onPress={() => props.getAddress(text)} style={styles.searchButton}>
                                  <Text style={styles.buttonText}>ค้นหา</Text>
                              </TouchableOpacity> 
                              : null }
                      </View>
                  }
                  contentContainerStyle={{ alignSelf: 'stretch' }}
                  data={props.address? props.address : []}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={_renderItem}
                  onEndReachedThreshold={0.9}
                  removeClippedSubviews={true}
                  keyboardShouldPersistTaps="handled"
              />
          </View>
      </View>                      
    </Overlay>      
  )
}

const styles = StyleSheet.create({
  Root: {     
    //backgroundColor: '#f2f2f2',
    justifyContent: 'center',
  },
  header: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'white',
      shadowColor: 'white',
      borderColor: 'white'
  },
  search: {
      flex: 1,
      backgroundColor: 'white'
  },
  closeOverlay: {
    alignSelf: 'stretch',
    paddingBottom: 5
  },

})

export default AddressList;