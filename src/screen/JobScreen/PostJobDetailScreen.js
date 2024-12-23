import React, 
{ 
    useContext, 
    useEffect, 
    useState 
} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    ScrollView,
    KeyboardAvoidingView,
    Keyboard,
} from 'react-native';
import {
    Icon,
} from 'react-native-elements';
import {
    Menu,
    TextInput,
    TouchableRipple,
    Button,
    RadioButton,
    Chip
} from 'react-native-paper';
import {
    useMutation,
    useLazyQuery
} from '@apollo/client';
import { materialTall, materialColors, iOSColors } from 'react-native-typography';
// import BackgroundUpload from 'react-native-background-upload';

import CREATE_JOB_MUTATION from '../../graphql/mutations/createProduct';
import GET_SIGNED_URL_MUTATION from '../../graphql/mutations/getSignedUrls';
import { colors, imageUrl, mediaUrl, videoUrl } from '../../utils/constants';
import { store } from '../../utils/store';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

let yearList = [];
let current_year = new Date().getFullYear();
let years = current_year;
while (years >= 1950) {
    yearList.push(years);
    years--;
};;

const PostJobDetailScreen = (props) => {
    const {
        imageObjArr
    } = props.route.params;

    const { state: { me } } = useContext(store);

    const [tag, setTag] = useState('');
    const [tagList, setTagList] = useState([]);
    const [productName, setProductName] = useState('');
    const [detail, setDetail] = useState('');
    const [price, setPrice] = useState('');
    // const [mediaObjArr, setMediaObjArr] = useState([]);
    const [render, setRender] = useState(false);

    const [tagError, setTagError] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [detailError, setDetailError] = useState(false);
    const [productNameError, setProductNameError] = useState(false);
    const [priceError, setPriceError] = useState(false);

    const [createProduct, { data, loading, error }] = useMutation(CREATE_JOB_MUTATION);

    const [getSignedUrl, { data: data_url }] = useMutation(GET_SIGNED_URL_MUTATION);

    const onAddTag = (e) => {
        if(tag.length === 0) return;
        setTagList(tagList.concat(tag));
        setTag('');
        setTagError(false);
    };

    function renderTag() {
        const arr = [];
        for(const [i, t] of tagList.entries()) {
            arr.push(<Chip 
                style={styles.tag} 
                key={i}
                onClose={() => setTagList(tagList.slice(0, i).concat(tagList.slice(i+1)))}
                >
                    {t}
                </Chip>
                )
        }
        return arr;
    }

    const validateJob = () => {
        let haveError = false;
        if(!tagList.length) {
            setTagError(true);
            haveError = true;
        }
        if(productName === '') {
            setNameError(true);
            haveError = true;
        }
        if(!imageObjArr.length) {
            setImageError(true);
            haveError = true;
        }
        if(price === '') {
            setPriceError(true);
            haveError = true;
        }
        if(detail === '') {
            setDetailError(true);
            haveError = true;
        }
        if (haveError) return true
        else return false
    }

    const changeText = (value) => {
        const str = value.replace(/\D/g, '');
        return str;
    }

    function handleUploadFile() {
        Keyboard.dismiss();

        if (validateJob()) return;

        uploadFile();
    }

    // async function uploadFile() {
    //     try {
    //         const uploadIdArr = [];
    //         const mediaArr = [];
    //         for (let item of imageObjArr) {
    //             const options = {
    //                 url: item.fileType === 'video/mp4' ? videoUrl : imageUrl,
    //                 path: item.fileUri.replace("file://", ""),
    //                 type: 'multipart',
    //                 method: 'POST',
    //                 headers: {
    //                     'content-type': item.fileType, // Customize content-type
    //                 },
    //                 field: item.fileType === 'video/mp4' ? 'video' : 'image',
    //                 // Below are options only supported on Android
    //                 notification: {
    //                     enabled: true
    //                 },
    //                 useUtf8Charset: true
    //             }

    //             const uploadId = await BackgroundUpload.startUpload(options)

    //             uploadIdArr.push(uploadId)
    //             //file url on the cloud
    //             const fileUrl = `${mediaUrl}/${me.id}/${item.fileName}`
    //             mediaArr.push(fileUrl);
    //         }
    //         props.navigation.navigate('Job', {
    //             comeFrom: 'PostJobDetail',
    //             uploadIdArr,
    //             jobVariable: {
    //                 productName,
    //                 tag: tagList,
    //                 price: parseInt(price),
    //                 detail,
    //                 pictures: mediaArr
    //             }
    //         })
    //     } catch (error) {
    //         console.log(error);
    //         console.log('at postheader => uploadFile');
    //     }
    // }

    const submit = (imgUrlArr) => {
        createProduct({
            variables: {
                productName,
            }
        });
        props.navigation.navigate('Market', { posted: true });
    };

    return (

        <View style={styles.Root}>
            <ScrollView keyboardShouldPersistTaps="handled" >
                <KeyboardAvoidingView style={styles.header}>
                    <Text style={[materialTall.display3, styles.order]} >2</Text>
                    <Text style={[materialTall.subheading, styles.directionText]}>
                        {"ใส่ข้อมูลครบจบขายเร็ว เพราะจะทำให้ผู้ซื้อตัดสินใจได้ง่ายขึ้น"}
                    </Text>
                </KeyboardAvoidingView>
                <KeyboardAvoidingView>
                    <View style={styles.sectionView}>
                        <View style={styles.tagView}>
                            {/* <Text style={styles.tagText}>
                                เพิ่มแท็ก
                            </Text> */}
                            <TextInput 
                                placeholder="เพิ่มแท็ก"
                                InputProps={{ disableUnderline: true }}
                                value={tag}
                                onChangeText={value => setTag(value)}
                                onBlur={onAddTag}
                                fullWidth
                                mode="outlined"
                                error={tagError}
                            />
                        </View>
                        <View style={styles.errorContainer}>
                            {tagError
                                ? <Text style={styles.errorText}>
                                    โปรดใส่รายละเอียด
                                </Text> : null}
                        </View>
                        <View style={styles.tagContainer}>
                            {renderTag()}
                        </View>
                        <TextInput
                            theme={{ colors: { primary: iOSColors.orange } }}
                            label="หัวข้อประกาศ"
                            style={[materialTall.headline, styles.textInput]}
                            value={productName}
                            maxLength={140}
                            onFocus={() => setProductNameError(false)}
                            onChangeText={(value) => setProductName(value)}
                            selectionColor="black"
                            error={productNameError}
                        />
                        <View style={styles.underTitle}>
                            <View>
                                {productNameError ? <Text style={{ color: colors.ERROR }}>โปรดระบุหัวช้อประกาศ</Text> : null}
                            </View>
                            <Text style={[materialTall.caption, { alignSelf: 'flex-end' }]}>
                                {productNameError.length}/140
                            </Text>
                        </View>
                        <TextInput
                        label="ราคาเต็ม"
                        style={[materialTall.headline, styles.textInput]}
                        keyboardType="number-pad"
                        value={price}
                        onFocus={() => setPriceError(false)}
                        onChangeText={value => setPrice(changeText(value))}
                        error={priceError}
                        />
                        <TextInput
                            label="รายละเอียด"
                            multiline
                            style={[materialTall.headline, styles.textInput]}
                            placeholder="รายละเอียด..."
                            value={detail}
                            onChangeText={value => setDetail(value)}
                        />
                    </View>
                </KeyboardAvoidingView>
                <Button
                    mode="contained"
                    onPress={handleUploadFile}
                    labelStyle={materialTall.headlineWhite} >
                    ลงขาย
                </Button>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    Root: {
        flex: 1,
        backgroundColor: iOSColors.lightGray
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10
    },
    sectionView: {
        backgroundColor: 'white',
        paddingHorizontal: 20,
        paddingVertical: 20,
        marginTop: 5,
        borderBottomWidth: 1,
        borderTopWidth: 1,
        borderColor: iOSColors.lightGray2
    },
    button: {
        backgroundColor: 'black'
    },
    rightInputButton: {
        borderBottomWidth: 1,
        borderColor: iOSColors.midGray,
        backgroundColor: iOSColors.lightGray,
        width: width * 0.6,
        paddingRight: 10,
        alignItems: 'center'
    },
    inputButton: {
        borderBottomWidth: 1,
        borderColor: iOSColors.Gray,
        marginTop: 15,
        paddingTop: 5,
        backgroundColor: iOSColors.lightGray,
        height: 64,
        justifyContent: 'center'
    },
    addressButton: {
        backgroundColor: iOSColors.lightGray,
        color: 'black',
        borderBottomWidth: 2
    },
    textInputView: {
        width: width * 0.6,
        flexDirection: 'row',
        alignItems: 'center'
    },
    textInput: {
        backgroundColor: iOSColors.lightGray,
        marginTop: 15
    },
    label: {
        marginLeft: 15,
        marginBottom: 0,
        color: materialColors.blackSecondary
    },
    placeholderText: {
        marginLeft: 15,
        lineHeight: 30,
        marginBottom: 5
    },
    rowView: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'stretch',
        justifyContent: 'space-between',
        marginVertical: 10
    },
    inputText: {
        fontSize: 20,
        color: materialColors.blackTertiary
    },
    directionText: {
        flex: 1,
        flexWrap: 'wrap',
        marginRight: 10
    },
    switch: {
        width: width * 0.6
    },
    order: {
        marginHorizontal: 30
    },
    underTitle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 5,
        marginRight: 10
    },
    errorText: {
        color: colors.ERROR,
        marginTop: 5
    },
    tag: {
        // margin: '0px 5px 10px 0px',
        marginTop: 10,
        marginBottom: 0,
        margonLeft: 0,
        marginRight: 5
    },
    tagContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'row',
    },
    tagView: {
        display: 'flex',
    },
    tagText: {
        width: 80,
        borderRightStyle: 'solid',
        borderWidth: 1,
        marginRight: 10,
        marginBottom: 20,
        borderColor: 'grey',
        marginTop: 4,
    },
})

export default PostJobDetailScreen;