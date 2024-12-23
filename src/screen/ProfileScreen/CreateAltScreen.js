import React, { useState, useEffect } from 'react';
import { 
    Text, 
    Keyboard,
    TouchableOpacity,
    StyleSheet,
    View,
    TextInput,
    ScrollView
} from 'react-native';
import {
    Avatar,
    Icon
} from 'react-native-elements';

import moment from 'moment';
import 'moment/locale/th';
import { useMutation, useQuery } from '@apollo/client';

import { colors } from '../../utils/constants';
import CategoryItem from '../categoryScreen/CategoryItem';

moment.locale('th');

const categoryArr = [
    { name: "เกม", engName: "Game" },
    { name: "ขำขัน", engName: "Comedy" },
    { name: "ทีวี", engName: "TV" },
    { name: "น่ารัก", engName: "Cute" },
    { name: "ท่องเที่ยวและกิจกรรม", engName: "Travel and Activity" },
    { name: "ดนตรี", engName: "Music" },
    { name: "เทคโนโลยีและวิทยาศาสตร์", engName: "Technology and Science" },
    { name: "ความงาม", engName: "Beauty" },
    { name: "ศิลปะและดีไซน์", engName: "Art and Design" },
    { name: "หนังสือและงานเขียน", engName: "Book and Writing" },
    { name: "แฟชั่น", engName: "Fashion" },
    { name: "การเงินและธุรกิจ", engName: "Finance and Business" },
    { name: "อาหาร", engName: "Food" },
    { name: "กีฬา", engName: "Sport" },
    { name: "สุขภาพ", engName: "Health" },
    { name: "การศึกษา", engName: "Education" },
    { name: "แม่และเด็ก", engName: "Parenting" },
    { name: "เรื่องแปลก", engName: "Strange" },
    { name: "คอหวย", engName: "Lottery" },
    { name: "สายบุญ", engName: "Merit" },
    { name: "ความเชื่อและไสยศาสตร์", engName: "Superstition" },
    { name: "คนรักสัตว์", engName: "Animal" },
    { name: "ภาพยนต์และแอนิเมชั่น", engName: "Movie and Animation" },
  ]

function EditGroupScreen(props) {

  //const { group } = props.route.params;

  const [ name, setName ] = useState('');
  const [ publicGroup, setPublic ] = useState(true);
  const [ category, setCategory ] = useState([]);
  const [ about, setAbout ] = useState('');

  const [updateGroup, {data, loading}] = useMutation(UPDATE_GROUP_MUTATION);

  const check = (value) => {
      setCategory([...category, value]);
  }
    
  const unCheck = (value) => {
        let filteredArray = category.filter(item => item !== value);
        setCategory(filteredArray);
  }

  const submitGroup = () => {
          updateGroup({
              variables: {
                  id: group.id,
                  name: name,
                  public: publicGroup,
                  category: category,
                  about: about
              }
          });
    props.navigation.goBack();
  };

  const renderCategory = () => {
      const cateField = [];
      for (const cate of categoryArr) {
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
      <View style={styles.Root}>
          <ScrollView showsVerticalScrollIndicator={false}>
              <View>
                  <Text style={styles.sectionText}>ชื่อกลุ่ม</Text>
                      <TextInput 
                          style={styles.inputBox}
                          placeholder='ตั้งชื่อกลุ่ม..'
                          value={name}
                          onChangeText={(value)=>setName(value)}
                      />
              </View>
              <View style={styles.rowFlex}>
                  <Text style={styles.sectionText}>ภาพโปรไฟล์</Text>
                  <TouchableOpacity>
                      <Icon 
                          containerStyle={styles.groupPicIcon} 
                          reverse 
                          name="image" 
                          color={colors.PRIMARY}
                      /> 
                  </TouchableOpacity>        
              </View>
              <View>
                  <Text style={styles.sectionText}>เกี่ยวกับ</Text>
                      <TextInput 
                          style={styles.inputBox}
                          multiline={true}
                          placeholder='ตั้งชื่อกลุ่ม..'
                          value={about}
                          onChangeText={(value)=>setAbout(value)}
                      />
              </View>
          </ScrollView>
          <View style={styles.footer}>
              <TouchableOpacity style={styles.createButton} onPress={() => submitGroup()}>
                  <Text style={styles.footerText}>แก้ไขกลุ่ม</Text>
              </TouchableOpacity> 
          </View>       
      </View>
  )
}

const styles = StyleSheet.create({
    Root: {     
        marginTop: 20,
        paddingHorizontal: 20,
        flex: 1
    },
    switch: {
        height: 40,
        width: 200,
        marginLeft: 20,
        marginVertical: 15
    },
    categoryContainer: {
        flexDirection: 'row',
        width: 400,
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginTop: 10,
        marginBottom: 80
    },
    sectionText: {
        fontWeight: 'bold',
        fontSize: 20
    },
    inputBox: {
        width: '90%',
        borderColor: 'gray',
        borderWidth: 1,
        padding: 2,
        borderRadius: 10,
        margin: 10,
        marginLeft: 20,
        paddingHorizontal: 20,
        paddingVertical: 7,
        flexDirection: 'row', 
    },
    nameBox: { 
        height: 45,
        borderColor: 'gray',
        borderWidth: 1 ,
        borderRadius: 10,
        margin: 10,
        marginLeft: 20,
        paddingHorizontal: 10,
        flexDirection: 'row', 
    },
    rowFlex: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    groupPicIcon: {
        marginLeft: 10,
    },
    footer: {
        backgroundColor: 'white',
        position: 'absolute',
        left: 0, 
        right: 0, 
        bottom: 0,
        alignItems: 'center',
        borderColor: colors.LIGHT_GRAY,
        borderTopWidth: 2
    },
    footerText: {
        fontSize: 30,
        color: colors.BUTTON_RED
    },
    createButton: {
        padding: 10,
        paddingHorizontal: 30
    }
  })

export default EditGroupScreen;