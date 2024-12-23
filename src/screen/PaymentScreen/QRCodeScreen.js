import React, {
  useRef,
  useState,
  useEffect,
  useContext,
} from 'react';
import { ScrollView } from 'react-native';
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
} from 'react-native';
import {
  Button,
  Divider,
  Snackbar
} from 'react-native-paper';
import {
  iOSColors,
  iOSUIKit,
  iOSUIKitTall
} from 'react-native-typography';
import { useQuery } from '@apollo/client';
import Skeleton from 'react-native-skeleton-placeholder';
import QRCode from 'react-native-qrcode-svg';
import Timeline from 'react-native-timeline-flatlist';
import RNFS from 'react-native-fs';
import CameraRoll from '@react-native-camera-roll/camera-roll';
import ViewShot from 'react-native-view-shot';
import Share from 'react-native-share';

import {
  store,
} from '../../utils/store'
import GET_QR_CODE_QUERY from '../../graphql/queries/getQRCode';
import { LOGO_ICON } from '../../utils/constants';

const width = Dimensions.get('window').width;
const QRSize = width * 0.6;
const height = Dimensions.get('window').height;
// const pk = "SHOP#2021-02-21T11:40:27.873Z#Jeanne54";
// const id = "SPONSOR#2021-02-21T11:43:56.288Z@SHOP#2021-02-21T11:40:27.873Z#Jeanne54";
// const amount = 1000;
const process = [
  {
    title: 'กด "บันทึก" รูป QR ด้านบนลงในโทรศัพท์    มือถือของคุณ',
    icon: (
      <Text style={[
        iOSUIKitTall.title3Emphasized,
        { color: iOSColors.white }
      ]}>
        1
      </Text>
    )
  },
  {
    title: 'เปิดแอพพลิเคชั่นธนาคารที่คุณมี',
    icon: (
      <Text style={[
        iOSUIKitTall.title3Emphasized,
        { color: iOSColors.white }
      ]}>
        2
      </Text>
    )
  },
  {
    title: 'ไปยังเมนู "แสกน" หรือ "แสกนจ่าย" จากนั้นกดปุ่ม "รูปภาพ" ในหน้าแสกนเพื่อ เลือกรูป QR ในมือถือของคุณ',
    icon: (
      <Text style={[
        iOSUIKitTall.title3Emphasized,
        { color: iOSColors.white }
      ]}>
        3
      </Text>
    )
  },
]

function QRCodeScreen(props) {
    const { 
      pk,
      id,
    } = props.route.params;

  const { state: { me } } = useContext(store);

  const [snackVisible, setSnackVisible] = useState(false);

  const { loading, error, data } = useQuery(
    GET_QR_CODE_QUERY,
    {
      variables: {
        pk: pk,
        id: id,
      }
    }
  );

  const QRRef = useRef();
  const ViewShotRef = useRef();

  function saveQRToDisk() {
    // const now = Date.now();
    ViewShotRef.current.capture()
      .then(uri => CameraRoll.save(uri))
      .then(() => setSnackVisible(true))
      .catch((error) => console.log(error))
    // QRRef?.current?.toDataURL((data) => {
    //   RNFS.writeFile(RNFS.CachesDirectoryPath + `/mixxer${now}.png`, uri, 'base64')
    //     .then((success) => {
    //       return CameraRoll.save(
    //         RNFS.CachesDirectoryPath + `/mixxer${now}.png`
    //       )
    //     })
    //     .catch((error) => console.log(error))
    //     .then(() => {
    //       setSnackVisible(true)
    //     })
    //     .catch((error) => console.log(error))
    // })
  }

  async function shareQR() {
    ViewShotRef.current.capture()
      .then(uri => { 
        Share.open({ url: uri })
      })
      .catch((error) => console.log(error))
  }

  return (
    <View style={styles.Root}>
      <View style={styles.QRView} >
      <ViewShot
        style={styles.shotView}
        ref={ViewShotRef}
      >
        {
          loading
            ? (
              <Skeleton>
                <View style={styles.QRCodeImage}>
                </View>
              </Skeleton>
            )
            : (
              <View style={styles.QRCodeImage}>
                <QRCode
                  size={QRSize}
                  value={data.getQRCode}
                  logo={LOGO_ICON}
                  getRef={QRRef}
                />
              </View>
            )
        }
      </ViewShot>
      </View>
      <View style={styles.QROption}>
        <Button
          onPress={saveQRToDisk}
          icon='download'
          labelStyle={[iOSUIKitTall.bodyEmphasized, { color: iOSColors.orange }]}
        >
          บันทึกรูป
        </Button>
        <Button
          onPress={shareQR}
          icon='share-variant'
          labelStyle={[iOSUIKitTall.bodyEmphasized, { color: iOSColors.orange }]}
        >
          แชร์
        </Button>
      </View>
      <Text style={[iOSUIKitTall.title3Emphasized, styles.topicText]}>
        วิธีชำระเงิน
        </Text>
      <Timeline
        data={process}
        showTime={false}
        circleSize={30}
        circleColor={iOSColors.orange}
        lineColor={iOSColors.orange}
        style={styles.orderList}
        titleStyle={iOSUIKitTall.title3}
        innerCircle='element'
      />
      <Snackbar
        visible={snackVisible}
        onDismiss={() => setSnackVisible(false)}
        wrapperStyle={{ bottom: 10 }}
        duration={3000}
      >
        บันทึกรูปแล้ว
      </Snackbar>
    </View>
  )
}


const styles = StyleSheet.create({
  Root: {
    backgroundColor: iOSColors.white,
    flex: 1
  },
  QRView: {
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    width: QRSize + 60,
    height: QRSize + 60,
    marginTop: 20,
    borderWidth: 1,
  },
  shotView: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    alignSelf: 'stretch',
  },
  QRCodeImage: {
    height: QRSize,
    width: QRSize,
  },
  topicText: {
    marginVertical: 10,
    marginLeft: 20,
  },
  orderText: {
    color: iOSColors.white
  },
  orderList: {
    marginHorizontal: 20
  },
  QROption: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignSelf: 'center',
    width: QRSize,
  }
})

export default QRCodeScreen;