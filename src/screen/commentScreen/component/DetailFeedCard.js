import React, { memo } from 'react';
import { 
    Dimensions, 
    StyleSheet, 
    View 
} from 'react-native';
import {
    Card,
    Divider,
    Text,
} from 'react-native-paper';
import { 
    iOSColors, 
} from 'react-native-typography';

import FeedCardHeader from '../../../component/FeedCard/FeedCardHeader';
import FeedCardBottom from '../../../component/FeedCard/FeedCardBottom';
import SwitchSelector from 'react-native-switch-selector';
import RenderHTML from '../../../component/RenderHTML';
import Sponsor from '../../../component/FeedCard/Sponsor';
// import AdsenseSponsor from '../../../component/FeedCard/AdsenseSponsor';

function DetailFeedCard(props) {
    return (
        <Card
            style={{ marginTop: 5 }}>
            <FeedCardHeader
                author={props.postInfo.author}
                createdAt={props.postInfo.createdAt}
                myId={props.myId}
            />
            <Divider />
            <RenderHTML html={props.postInfo.text} />
            <Divider />
            {props.sponsor  
                // <FullSponsor navigation={props.navigation} {...props.sponsor} />
               ? <Sponsor navigation={props.navigation} {...props.sponsor} />
               : null
            }
            {/* <AdsenseSponsor /> */}
            <Divider />
            <FeedCardBottom
                id={props.postInfo.id}
                sponsorId={props.sponsor ? props.sponsor.id : null}
                postInfo={props.postInfo}
                relation={props.relation}
                relationId={props.relation?.id}
                likeCount={props.postInfo.likeCount}
                isLiked={props.relation?.isLiked}
                isCoined={props.relation?.isCoined}
                isSaved={props.relation?.isSaved}
                coinCount={props.postInfo.coinCount}
                commentCount={props.postInfo.commentCount}
                text={props.postInfo.text}
                title={props.postInfo.title}
                author={props.postInfo.author}
                createdAt={props.postInfo.createdAt}
                userCoinCount={props.relation?.userCoinCount}
                userHaveCoin={props.userHaveCoin}
                navigation={props.navigation}
            />
            <Divider />
            <View style={styles.topRightOption}>
                <Text style={{ fontWeight: 'bold' }}>จัดเรียงตาม </Text>
            <Text style={{ fontWeight: 'bold', color: iOSColors.orange }}>{
                props.showNewComment? "ใหม่" : "มาแรง"
            }</Text>
                <SwitchSelector
                    style={styles.switch}
                    height={10}
                    buttonColor={iOSColors.orange}
                    selectedColor="black"
                    textColor={iOSColors.gray}
                    selectedTextStyle={{ fontWeight: 'bold' }}
                    backgroundColor={iOSColors.lightGray}
                    options={[
                        { label: "", value: false },
                        { label: "", value: true },
                    ]}
                    initial={props.showNewComment ? 1 : 0}
                    onPress={(value) => props.changeShow()}
                />
            </View>

        </Card>
    )
}

const styles = StyleSheet.create({
    topRightOption: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: 5,
        paddingRight: 20,
    },
    switch: {
        height: 4,
        width: 30,
        marginLeft: 10
    },
    video: {
        height: 500,
        width: Dimensions.width
    }
})

export default memo(DetailFeedCard);