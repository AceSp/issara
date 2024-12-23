import React, { 
  useState, 
  useEffect 
} from 'react';
import {
  View,
  Text,
  StyleSheet
} from 'react-native';
import {
    Icon
} from 'react-native-elements';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { iOSColors } from 'react-native-typography';

const CategoryItem = (props) => {

  const [ selected, setSelected ] = useState(false);

  const press = () => {
    selected? props.unCheck(props.engName) : props.check(props.engName);
    setSelected(!selected);
  }

  useEffect(() => {
    //const found = props.category.includes(props.engName);
    props.category.includes(props.engName)? setSelected(true) : setSelected(false);
  },[props.category]);

  return (
      <TouchableOpacity onPress={() => press()}>
          <View style={ selected? styles.selectedRoot : styles.Root} >
            {selected? 
            <Icon 
                name="check"
                type="antdesign"
            />
            :
            <Icon 
                name="plus"
                type="antdesign"
            />
            }
            
            <Text style={styles.text} >{props.name}</Text>
          </View>
      </TouchableOpacity>  
  )
}

const styles = StyleSheet.create({
    Root: {
      justifyContent: 'space-around',
      alignItems: 'center',
      flexDirection: 'row',
      paddingVertical: 10,
      paddingHorizontal: 10,
      margin: 5,
      borderRadius: 40,
      borderWidth: 0,
      backgroundColor: iOSColors.lightGray
    },
    selectedRoot: {
      justifyContent: 'space-around',
      alignItems: 'center',
      flexDirection: 'row',
      paddingVertical: 10,
      paddingHorizontal: 10,
      margin: 5,
      borderRadius: 40,
      borderWidth: 0,
      backgroundColor: iOSColors.orange
    },
    text: {
        marginLeft: 7,
        fontSize: 17,
        fontWeight: 'bold'
    }
})

export default CategoryItem;