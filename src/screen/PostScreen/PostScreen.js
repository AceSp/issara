import React,
{
  useState,
  useEffect,
  useContext,
  useRef
} from 'react';
import {
  View,
  Text,
  Platform,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Keyboard,
  PermissionsAndroid,
  Dimensions,
  TextInput
} from 'react-native';
import {
  request,
  check,
  PERMISSIONS,
  RESULTS
} from 'react-native-permissions'
import { Icon } from 'react-native-elements';
import { useQuery } from '@apollo/client';
import { launchImageLibrary } from 'react-native-image-picker';
import {
  Card,
  Divider,
  TouchableRipple,
  Snackbar,
} from 'react-native-paper';
import { iOSColors, material } from 'react-native-typography';
import {
  RichEditor,
  RichToolbar,
  defaultActions,
  actions
} from 'react-native-pell-rich-editor';
import { materialTall, iOSUIKitTall } from 'react-native-typography';
import HTML from 'react-native-render-html';
import RNFS from 'react-native-fs';

import PostHeader from './PostHeader';
import ME_SUBSCRIPTION from '../../graphql/subscriptions/meSub';
import GET_ME_QUERY from '../../graphql/queries/getMe';
import Loading from '../../component/Loading';
import { getMeData, store } from '../../utils/store';
import RenderHTML from '../../component/RenderHTML';
import wrapShareHtml from '../../utils/wrapShareHtml';
import FeedCardHeader from '../../component/FeedCard/FeedCardHeader';

const { height, width } = Dimensions.get('screen');

const PostScreen = (props) => {
  const {
    comeFrom,
    group,
    choose,
    text,
    title,
    author,
    createdAt,
    isShare
  } = props.route.params;

  const richText = useRef();
  const richTool = useRef();

  const { state: { me } } = useContext(store);

  const [body, setBody] = useState('<p></p>');
  const [textStyle, setTextStyle] = useState([]);
  const [mediaSrcArr, setMediaSrcArr] = useState([]);
  const [mediaObjArr, setMediaObjArr] = useState([]);
  const [editorHeight, setEditorHeight] = useState(height);

  const [snackVisible, setSnackVisible] = useState(false);
  const [hasText, setHasText] = useState(false);

  function checkImagePermission() {
    if (Platform.OS === 'android') {
      check(PERMISSIONS.ANDROID.CAMERA)
        .then((result) => {
          switch (result) {
            case RESULTS.UNAVAILABLE:
              break;
            case RESULTS.DENIED:
              break;
            case RESULTS.GRANTED:
              break;
            case RESULTS.BLOCKED:
              break;
          }
        })
    } else {
      check(PERMISSIONS.IOS.CAMERA)
        .then((result) => {
          switch (result) {
            case RESULTS.UNAVAILABLE:
              setLocationPermission(false);
              break;
            case RESULTS.DENIED:
              requestLocationPermission();
              break;
            case RESULTS.GRANTED:
              setLocationPermission(true);
              locateCurrentPosition();
              break;
            case RESULTS.BLOCKED:
              setLocationPermission(false);
              break;
          }
        })
    }
  };

  // fix can't perform state update on unmount component of RichToolbar
  useEffect(() => { return () => { if (richText.current) { richText.current.webviewBridge = undefined; richText.current.selectionChangeListeners = undefined; } }; }, []);

  useEffect(() => {
    switch(choose) {
      case 1:
        chooseVideo();
        break;
      case 2:
        chooseImage();
        break;
      default:
        return;
    }
  }, [choose])

  useEffect(() => {
    if(text) setEditorHeight(50);
  }, [text])

  // useEffect(() => {
  //   setBody(wrapShareHtml({
  //     title,
  //     text,
  //     author,
  //     createdAt
  //   }))
  // })

  function chooseImage() {
    let options = {
      mediaType: 'photo',
      // includeBase64: true
    };
    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        const newMediaSrcArr = [];
        const newMediaObjArr = [];
        response.assets.forEach((asset) => {
          const pathString = asset.uri.replace('file://', '');
          newMediaObjArr.push({
            name: asset.fileName,
            type: asset.type,
            fileUri: pathString,
            fileSize: asset.fileSize
          });
          newMediaSrcArr.push(asset.uri);
          richText.current?.insertImage(asset.uri);
        });
        setMediaObjArr(mediaObjArr.concat(newMediaObjArr));
        setMediaSrcArr(mediaSrcArr.concat(newMediaSrcArr));
      }
    });
  }

  const chooseVideo = () => {
    let options = {
      mediaType: 'video',
    };
    launchImageLibrary(options, (response) => {

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        const newMediaSrcArr = [];
        const newMediaObjArr = [];
        response.assets.forEach((asset) => {
          const pathString = asset.uri.replace('file://', '');
          newMediaObjArr.push({
            name: asset.fileName,
            type: asset.type,
            fileUri: pathString,
            fileSize: asset.fileSize
          });
          newMediaSrcArr.push(asset.uri);
          richText.current?.insertVideo(asset.uri);
        });
        setMediaObjArr(mediaObjArr.concat(newMediaObjArr));
        setMediaSrcArr(mediaSrcArr.concat(newMediaSrcArr));
      }

      // if (response.didCancel) {
      //   console.log('User cancelled image picker');
      // } else if (response.error) {
      //   console.log('ImagePicker Error: ', response.error);
      // } else if (response.customButton) {
      //   console.log('User tapped custom button: ', response.customButton);
      //   alert(response.customButton);
      // } else {

      //   async function setObjArr() {
      //     const fileStat = await RNFS.stat(response.path);
      //     const fileSize = fileStat.size;

      //     const pathString = "file://" + response.path;
      //     const nameArr = response.path.split('/');
      //     const typeArr = response.path.split('.');
      //     const name = nameArr[nameArr.length - 1];
      //     const type = typeArr[typeArr.length - 1];
      //     setMediaObjArr([...mediaObjArr, {
      //       name: name,
      //       type: "video/" + type,
      //       fileUri: response.uri,
      //       // file: file,
      //       fileSize
      //     }]);
      //     setMediaSrcArr([...mediaSrcArr, pathString]);
      //     richText.current?.insertVideo(pathString);
      //   }
      //   setObjArr();
      // }
    });
  }

  function lineBreak() {
    richText.current?.insertHTML('<hr /><p><br></p>');
  };

  function handleRichTextChange(body) {
    if (body.length === 0)
      return richText.current.insertHTML("<p><br></p>");
    var regex = /(<([^>]+)>)/ig
    setHasText(!!body.replace(regex, "").length);
    setBody(body);
  }

  return (
    <View style={styles.root}>
      <PostHeader
        {...me}
        navigation={props.navigation}
        body={text
          ? body + wrapShareHtml({
            title,
            text,
            author,
            createdAt, 
          })
          : body
        }
        isShare={isShare}
        mediaObjArr={mediaObjArr}
        mediaSrcArr={mediaSrcArr}
        group={group}
        comeFrom={comeFrom}
        setSnackVisible={setSnackVisible}
        hasText={hasText}
      />
      <ScrollView >
        <View style={{
            height: editorHeight,
            paddingHorizontal: 10,
        }}>
        <RichEditor
          ref={richText}
          // initialContentHTML={wrapShareHtml({
          //   title,
          //   text,
          //   author,
          //   createdAt
          // })}
          onHeightChange={(h => setEditorHeight(h))}
          useContainer={false}
          placeholder="input content"
          onChange={(html) => handleRichTextChange(html)}
          editorStyle={{ contentCSSText: materialTall.title }}
        />
        </View>
        {/* <RenderHTML html={body} /> */}
        {
          text?
          <View style={styles.sharePreview}>
            <FeedCardHeader
              author={author}
              title={title}
              createdAt={createdAt}
              navigation={props.navigation}
              myId={me.id}
            />
            <Divider />
            <RenderHTML html={text} />
          </View>
          : null
        }
      </ScrollView>
      <Snackbar
        visible={snackVisible}
        onDismiss={() => setSnackVisible(false)}
        wrapperStyle={{ bottom: 50 }}
        duration={3000}
      >
        เขัยนอะไรสักหน่อย
      </Snackbar>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <RichToolbar
          editor={richText}
          iconTint={iOSColors.black}
          selectedIconTint={iOSColors.orange}
          unselectedButtonStyle={{
            marginHorizontal: 10,
          }}
          ref={richTool}
          actions={[
            'insertVideo',
            'chooseImage',
            "lineBreak",
            defaultActions[8],
            actions.insertImage
          ]}
          iconMap={{
            insertVideo: () => <Icon
              size={27}
              color={iOSColors.black}
              type="material-community"
              name="video-outline"
            />,
            chooseImage: () => <Icon
              size={27}
              color={iOSColors.black}
              type="material-community"
              name="camera-outline"
            />,
            lineBreak: () => <Icon
              size={27}
              color={iOSColors.black}
              name="horizontal-rule"
            />,
          }}
          insertVideo={chooseVideo}
          chooseImage={chooseImage}
          lineBreak={lineBreak}
        />
      </KeyboardAvoidingView>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: iOSColors.white,
    flex: 1
  },
  wrapper: {
    flex: 9,
    width: '90%'
  },
  mediaLine: {
    height: 50,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  button: {
    width: 90,
    height: 40,
    borderRadius: 25,
    borderWidth: 0.5,
    marginHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  previewImage: {
    width: '90%',
    height: 300,
    borderColor: 'black',
    borderWidth: 1,
    marginHorizontal: 3,
  },
  toolbar: {
    backgroundColor: iOSColors.lightGray2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  toolbarButton: {
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
  textSizeButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  textSizeBig: {
    fontSize: 25,
  },
  textSizeBigRed: {
    fontSize: 25,
    color: iOSColors.orange
  },
  textSizeSmall: {
    fontSize: 18,
    marginTop: 6,
  },
  textSizeSmallRed: {
    fontSize: 18,
    marginTop: 6,
    color: iOSColors.orange
  },
  sharePreview: {
    margin: 10,
    borderWidth: 0.5,
  }
});

export default PostScreen;

        // <RichToolbar
        //   editor={richText}
        //   iconTint={iOSColors.black}
        //   selectedIconTint={iOSColors.orange}
        //   iconSize={50}
        //   ref={richTool}
        //   actions={[
        //     'insertVideo',
        //     defaultActions[0],
        //     'setSize',
        //     defaultActions[1],
        //     defaultActions[2],
        //     'insertList',
        //     defaultActions[5],
        //     'lineBreak',
        //   ]}
        //   iconMap={{
        //     insertVideo: () => <Icon
        //       size={27}
        //       color={iOSColors.black}
        //       type="simple-line-icon"
        //       name="camrecorder"
        //     />,
        //     setSize: ({ tintColor }) => (
        //       <View style={styles.textSizeButton}>
        //         <Text
        //           style={
        //             textSize === 1 ?
        //               styles.textSizeBigRed
        //               :
        //               styles.textSizeBig}
        //          >
        //           T
        //          <Text>
        //         <Text
        //           style={
        //             textSize === 2 ?
        //               styles.textSizeSmallRed
        //               :
        //               styles.textSizeSmall}
        //         >
        //           T
        //         </Text>
        //       </View>
        //     ),
        //     insertList: () => <Icon
        //       name={toolList <= 1 ? "format-list-bulleted" : "format-list-numbered"}
        //       color={toolList === 0 ? iOSColors.black : iOSColors.orange}
        //     />,
        //     lineBreak: () => (
        //       <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        //         <F5Icon name="ruler-horizontal" size={20} />
        //       </View>
        //     )
        //    }
        //   insertVideo={chooseVideo}
        //   onPressAddImage={chooseImage}
        //   setSize={setSize}
        //   insertList={setListStyle}
        //   lineBreak={lineBreak}
        // />

        // <View style={styles.wrapper}>
        //   {renderFileUri()}
        //   <TextInput onChangeText={value => setText(value)} />
        //   <View style={styles.mediaLine}>
        //     <View style={styles.button} onPress={chooseImage}>
        //       <Icon name="photo" type="font-awesome" color={colors.PRIMARY} />
        //       <Text> รูปภาพ</Text>
        //     </View>
        //     <View style={styles.button}>
        //       <Icon name="video-plus" type="material-community" size={30} color={colors.PRIMARY} />
        //       <Text> วิดีโอ</Text>
        //     </View>
        //     <View style={styles.button}>
        //       <Icon name="link" type="entypo" size={30} color={colors.PRIMARY} />
        //       <Text> ลิงค์</Text>
        //     </View>
        //   </View>
        // </View>