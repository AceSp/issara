import React, { useState } from 'react';
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
import SwitchSelector from 'react-native-switch-selector';

import { colors } from '../../utils/constants';
import CREATE_GROUP_MUTATION from '../../graphql/mutations/createGroup';
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

function CreateGroupScreen(props) {

    const [ name, setName ] = useState('');
    const [ publicGroup, setPublic ] = useState(true);
    const [ category, setCategory ] = useState([]);

    const [createGroup, {data, loading}] = useMutation(
        CREATE_GROUP_MUTATION,
        {
            onCompleted(data) {
                props.navigation.goBack();
                props.navigation.navigate('GroupRoom', { group: data.createGroup.group });
            },
        }
        );

    const check = (value) => {
        setCategory([...category, value]);
    }
    
    const unCheck = (value) => {
          let filteredArray = category.filter(item => item !== value);
          setCategory(filteredArray);
    }

    const submitGroup = () => {
            createGroup({
                variables: {
                    name: name,
                    public: publicGroup,
                    category: category
                }
            });
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
                    <View style={styles.nameBox}>
                        <TextInput 
                            style={styles.inputBox}
                            placeholder='ตั้งชื่อกลุ่ม..'
                            value={name}
                            onChangeText={(value)=>setName(value)}
                        />
                    </View>
                </View>
                <View style={styles.rowFlex}>
                    <Text style={styles.sectionText}>ภาพกลุ่ม</Text>
                    <TouchableOpacity>
                        <Icon 
                            containerStyle={styles.groupPicIcon} 
                            reverse 
                            name="image" 
                            color={colors.PRIMARY}
                        /> 
                    </TouchableOpacity>
                    
                </View>
                <View style={styles.rowFlex}>
                    <Text style={styles.sectionText}>ประเภท</Text>
                    <SwitchSelector 
                        style={styles.switch}
                        buttonColor={colors.PRIMARY}
                        selectedColor="black"
                        textColor={colors.SECONDARY}
                        selectedTextStyle={{fontWeight: 'bold'}}
                        backgroundColor={colors.LIGHT_GREY_2}
                        options={[
                            { label: "สาธารณะ", value: true },
                            { label: "กลุ่มปิด", value: false },
                        ]}
                        initial={0}
                        onPress={(value) => setPublic(value)}
                    />
                </View>
                <View>
                    <Text style={styles.sectionText}>หมวดหมู่</Text>
                    <View style={styles.categoryContainer}> 
                    {renderCategory()}
                    </View>
                </View>
            </ScrollView>
            <View style={styles.footer}>
                <TouchableOpacity style={styles.createButton} onPress={() => submitGroup()}>
                    <Text style={styles.footerText}>สร้างกลุ่ม</Text>
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
        flex: 1
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

export default CreateGroupScreen;