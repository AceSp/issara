import React, { 
    useState,
    useEffect
} from 'react';
import { StyleSheet } from 'react-native';
import {
    View,
    Text,
    Dimensions
} from 'react-native';
import {
    Button, Checkbox
} from 'react-native-paper';
import {
    iOSColors,
    iOSUIKitTall
} from 'react-native-typography';

import {
    getMeData,
    getShowPostData,
    getPostCategoryData,
    getShowContestData,
    getContestCategoryData,
    store,
    setShowQuestion
} from '../utils/store';
import GokgokgokLogo from '../assets/Images/gokgokgokLogo'

const width = Dimensions.get('window').width;

function QuestionScreen(props) {
    const [check, setCheck] = useState(false);
    const [showNewPost, setShowNewPost] = useState(false);
    const [category, setCategory] = useState([]);
    const [showNewContest, setShowNewContest] = useState(false);
    const [contestCategory, setContestCategory] = useState([]);

    useEffect(() => {
        getShow();
    }, []);

    function noShowAgain() {
        if(check) setShowQuestion(false);
    }

    async function getShow() {
        const showData = await getShowPostData();
        if (showData) setShowNewPost(showData);
    }

    return (
        <View style={styles.root}>
            <GokgokgokLogo
                width='100%'
                height={100}
            />
            <Text style={iOSUIKitTall.title3}>คุณต้องการทำอะไร</Text>
            <Button
                onPress={() => {
                    noShowAgain();
                    Props.navigation.navigate('Post', {
                        showNew: showNewPost,
                        feedCategory: category,
                        comeFrom: 'NewFeed',
                    });
                }
                }
                mode="contained"
                style={styles.button}
                labelStyle={[iOSUIKitTall.bodyEmphasized, styles.buttonLabel]}
            >
                สร้างโพสต์
            </Button>
            <Button
                onPress={() => {
                    noShowAgain();
                    Props.navigation.navigate('Post', {
                    showNew: showNewContest,
                    feedCategory: contestCategory,
                    comeFrom: 'Contest',
                })
            }
            }
                mode="contained"
                style={styles.button}
                labelStyle={[iOSUIKitTall.bodyEmphasized, styles.buttonLabel]}
            >
                ร่วมประกวด
            </Button>
            <Button
                onPress={() => {
                    noShowAgain();
                    props.navigation.navigate('CreateColumn')
                }}
                mode="contained"
                style={styles.button}
                labelStyle={[iOSUIKitTall.bodyEmphasized, styles.buttonLabel]}
            >
                สร้างคอลัมน์(เพจ)
            </Button>
            <Button
                onPress={() => {
                    noShowAgain();
                    props.navigation.navigate('CreateGroup')
                }}
                mode="contained"
                style={styles.button}
                labelStyle={[iOSUIKitTall.bodyEmphasized, styles.buttonLabel]}
            >
                สร้างกลุ่ม
            </Button>
            <Button
                onPress={() => {
                    noShowAgain();
                    props.navigation.navigate('PostProductPicture')
                }}
                mode="contained"
                style={styles.button}
                labelStyle={[iOSUIKitTall.bodyEmphasized, styles.buttonLabel]}
            >
                ขายสินค้า
            </Button>
            <Button
                onPress={() => {
                    noShowAgain();
                    props.navigation.navigate('Market')
                }}
                mode="contained"
                style={styles.button}
                labelStyle={[iOSUIKitTall.bodyEmphasized, styles.buttonLabel]}
            >
                ดูสินค้า
            </Button>
            <Button
                onPress={() => {
                    noShowAgain();
                    props.navigation.navigate('PostShopPicture')
                }}
                mode="contained"
                style={styles.button}
                labelStyle={[iOSUIKitTall.bodyEmphasized, styles.buttonLabel]}
            >
                สร้างร้านค้า
            </Button>
            <Button
                onPress={() => {
                    noShowAgain();
                    props.navigation.navigate('ShopCategory')
                }}
                mode="contained"
                style={styles.button}
                labelStyle={[iOSUIKitTall.bodyEmphasized, styles.buttonLabel]}
            >
                ดูร้านค้า
            </Button>
            <Button
                onPress={() => {
                    noShowAgain();
                    console.log('go to FAQ')
                }}
                mode="contained"
                style={styles.button}
                labelStyle={[iOSUIKitTall.bodyEmphasized, styles.buttonLabel]}
            >
                ชิงโชค
            </Button>
            <Button
                onPress={() => {
                    noShowAgain();
                    props.navigation.navigate('NewFeed')
                }}
                mode="contained"
                style={styles.button}
                labelStyle={[iOSUIKitTall.bodyEmphasized, styles.buttonLabel]}
            >
                เข้าหน้าแรก
            </Button>
            <Checkbox.Item
                style={{ width: width * 0.5 }}
                label="ไม่ต้องแสดงหน้านี้อีก"
                color={iOSColors.orange}
                onPress={() => setCheck(!check)}
                status={check ? 'checked' : 'unchecked'}
                theme={{ colors: { primary: check ? iOSColors.orange : iOSColors.black } }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: iOSColors.white,
        paddingTop: 30
    },
    button: {
        margin: 5,
        width: 200,
        borderRadius: 40
    },
    buttonLabel: {
        color: iOSColors.white
    },
    categoryContainer: {
        flexDirection: 'row',
        alignSelf: 'stretch',
        flexWrap: 'wrap',
        justifyContent: 'space-between'
    },
});

export default QuestionScreen;