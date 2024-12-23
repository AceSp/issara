import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import {
  Icon
} from 'react-native-elements';
import {
  Checkbox
} from 'react-native-paper';
import SwitchSelector from 'react-native-switch-selector';
import { iOSColors } from 'react-native-typography';

import { 
  colors,
  postCategoryArr,
  contestCategoryArr
} from '../../utils/constants';
import { 
  setShowPostData, 
  setPostCategoryData,
  setShowContestData,
  setContestCategoryData
} from '../../utils/store';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const CategoryScreen = (props) => {

  const { 
    setShowNewfeed, 
    showNew,
    setCate,
    categ,
    fromContest
  } = props.route.params;

  const [ showNewPost, setShowNewPost ] = useState(false);
  const [ category, setCategory ] = useState([]);

  useEffect(() => {
    setShowNewPost(showNew);
    setCategory(categ);
  }, [])

  const check = (value) => {
    if(!category.includes(value)) {
      setCategory([...category, value]);
    } else {
      let filteredArray = category.filter(item => item !== value);
      setCategory(filteredArray);
    }
  }

  const reset = () => {
    setCategory([])
  }

  const submit = () => {
    setShowNewfeed(showNewPost);
    setCate(category);
    if(fromContest) {
      setShowContestData(showNewPost);
      setContestCategoryData(category);
    } else {
      setShowPostData(showNewPost);
      setPostCategoryData(category);
    }
    props.navigation.goBack();
  };

  const renderCheckbox = () => {
    const cateField = [];
    const cateArr = fromContest ? contestCategoryArr : postCategoryArr;
    for (const cate of cateArr) {
      cateField.push(
        <Checkbox.Item 
          style={{ width: width*0.5 }}
          label={cate.name}
          key={cate.name}
          color={iOSColors.orange}
          onPress={(c) => check(cate.engName) }
          status={category.includes(cate.engName)? 'checked' : 'unchecked'}
          theme={{ colors: { primary: category.includes(cate.engName)? iOSColors.orange : iOSColors.black } }}
        />
        );
    }
    return cateField;
  }

  return (
    <View style={styles.Root} >
      <Text style={styles.headerText}>VivaVoce</Text>
      <Text style={styles.descriptext}>เลือกหมวดหมู่ที่คุณสนใจ</Text>
      <ScrollView style={{ alignSelf: 'stretch' }}>
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
              initial={showNew? 1 : 0}
              onPress={(value) => setShowNewPost(value)}
            />
          </View>
        </View>
      <View style={styles.categoryContainer}> 
          {renderCheckbox()}
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
    alignSelf: 'stretch',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
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