import React from 'react';
import {
    View,
    StyleSheet
} from 'react-native';
import {
    Button
} from 'react-native-paper';
import {
    Icon
} from 'react-native-elements';
import { iOSColors } from 'react-native-typography';

function NewsFeedTopTab(props) {
    return(
        <View style={styles.tab}>
          <Button
            onPress={() => props.navigation.navigate('NewFeed')}
            style={{ flex: 1}}
            labelStyle={[styles.titleText, { color: iOSColors.gray }]}
            mode="outlined"
            icon={() => <Icon
                type="ionicon"
                name="shapes-outline"
                color={iOSColors.gray}
                />
              }
          >
            ทั่วไป
          </Button>
          <Button
            style={{ flex: 1 }}
            labelStyle={[styles.titleText, { color: iOSColors.white }]}
            mode="contained"
            icon={() => <Icon
                type="font-awesome"
                name="newspaper-o"
                color={iOSColors.white}
                />
              }
          >
            ข่าว
          </Button>
          <Button
            onPress={() => props.navigation.navigate('Contest')}
            style={{ flex: 1 }}
            labelStyle={[styles.titleText, { color: iOSColors.gray }]}
            mode="outlined"
            icon={() => <Icon
                type="ionicon"
                name="trophy-outline"
                color={iOSColors.gray}
                />
              }
          >
            ประกวด
          </Button>
        </View>
    )
}

const styles = StyleSheet.create({
  tab: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    backgroundColor: iOSColors.white
  },
  titleText: {
    marginLeft: 5,
    fontSize: 20,
    color: iOSColors.orange,
    fontWeight: 'bold'
  },
})

export default NewsFeedTopTab;