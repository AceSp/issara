import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity 
} from 'react-native';
import {
  Icon
} from 'react-native-elements';
import SwitchSelector from 'react-native-switch-selector';
import { iOSColors } from 'react-native-typography';

import { 
  colors,
  newsCategoryArr
} from '../../utils/constants';
import CategoryItem from './CategoryItem';
import { setShowNewsData, setNewsCategoryData } from '../../utils/store';

const CategoryScreen = (props) => {

  const { 
    setShowNewfeed, 
    showNew,
    setCate,
    categ 
  } = props.route.params;

  const [ showNewPost, setShowNewPost ] = useState(false);
  const [ category, setCategory ] = useState([]);

  useEffect(() => {
    setShowNewPost(showNew);
    setCategory(categ);
  }, [])

  const check = (value) => {
    setCategory([...category, value]);
  }

  const unCheck = (value) => {
      let filteredArray = category.filter(item => item !== value);
      setCategory(filteredArray);
  }

  const reset = () => {
    setCategory([])
  }

  const submit = () => {
    setShowNewfeed(showNewPost);
    setCate(category);
    setShowNewsData(showNewPost);
    setNewsCategoryData(category);
    props.navigation.goBack();
  };

  const renderCategory = () => {
    const cateField = [];
    for (const cate of newsCategoryArr) {
      cateField.push(<CategoryItem 
        name={cate.name} 
        engName={cate.engName} 
        check={check} 
        unCheck={unCheck}
        category={category}
        key={cate.engName}/>);
    }
    return cateField;
  }

  return (
    <View style={styles.Root} >
      <Text style={styles.headerText}>VivaVoce</Text>
      <Text style={styles.descriptext}>เลือกหมวดหมู่ที่คุณสนใจ</Text>
      <ScrollView>
        <View style={styles.topOption}>
          <TouchableOpacity onPress={() => reset()}>
            <View style={styles.resetButton}>
              <Text style={{fontWeight: 'bold'}}>รีเซ็ต</Text>
              <Icon 
                name="refresh"
              />
            </View>
          </TouchableOpacity>
          <View style={styles.topRightOption}>
            <Text style={{fontWeight: 'bold'}}>จัดเรียงตาม</Text>
            <SwitchSelector 
              style={styles.switch}
              buttonColor={iOSColors.orange}
              selectedColor="black"
              textColor={iOSColors.gray}
              selectedTextStyle={{fontWeight: 'bold'}}
              backgroundColor={iOSColors.lightGray2}
              options={[
                { label: "มาแรง", value: false },
                { label: "ใหม่", value: true },
              ]}
              initial={showNew? 0 : 1}
              onPress={(value) => setShowNewPost(value)}
            />
          </View>
        </View>
      <View style={styles.categoryContainer}> 
          {renderCategory()}
        </View>
      </ScrollView>
      <TouchableOpacity onPress={() => submit()}>
        <View style={styles.footer}>
          <Text style={styles.footerText}>ตกลง</Text>
        </View>
      </TouchableOpacity> 
    </View>
  )
}

const styles = StyleSheet.create({
  Root: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center'
  },
  headerText: {
    fontSize: 40,
    fontFamily: 'AbrilFatface-Regular',
    color: iOSColors.orange,
    marginTop: 10
  },
  descriptext: {
    fontSize: 20,
    marginTop: 10
  },
  categoryContainer: {
    flexDirection: 'row',
    width: 400,
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  footer: {
    marginBottom: 10,
    paddingHorizontal: 30,
    paddingVertical: 15
  },
  footerText: {
    fontSize: 30,
    color: colors.BUTTON_RED
  },
  topOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 20
  },
  topRightOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switch: {
    height: 40,
    width: 100,
    marginLeft: 10
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center'
  }
})

export default CategoryScreen;