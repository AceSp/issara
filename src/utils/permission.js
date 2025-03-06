import { Alert, Linking } from 'react-native';
import {
  request,
  check,
  PERMISSIONS,
  RESULTS
} from 'react-native-permissions';

export async function requestPermission({ permission, setPermission, header, text }) {
    console.log("Requesting Permission:", permission);
    const response = await request(permission);
    console.log("Permission Response:", response);

    if (response === RESULTS.GRANTED) {
        if(setPermission) setPermission(true);
        // openGallery();
    } else if (response === RESULTS.BLOCKED) {
        Alert.alert(
            header,
            text,
            [
                { text: "ยกเลิก", style: "cancel" },
                {
                    text: "แก้ไขการอนุญาติ",
                    onPress: () => Linking.openSettings(),
                },
            ]
        );
    } else {
        if(setPermission) setPermission(false);
    }
}

export async function checkPermission({ permission, setPermission }) {
    const result = await check(permission);
    console.log("Permission Status:", result);

    switch (result) {
        case RESULTS.GRANTED:
            if(setPermission) setPermission(true);
            break;
        case RESULTS.DENIED:
            requestGalleryPermission();
            break;
        case RESULTS.BLOCKED:
        case RESULTS.UNAVAILABLE:
            if(setPermission) setPermission(false);
            break;
    }
}

