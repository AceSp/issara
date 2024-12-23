import React, { 
  useState, 
  useEffect, 
  memo 
} from "react";
import { 
  StyleSheet, 
  Text, 
  View,
  TouchableOpacity
} from "react-native";
import {Icon, Avatar} from 'react-native-elements';
import moment from 'moment';
import 'moment/locale/th';
import { useMutation } from "@apollo/client";
import { iOSColors } from "react-native-typography";

import LIKE_REPLY_MUTATION from '../../graphql/mutations/likeReply';
import AvatarWrapper from "../AvatarWrapper";

function ReplyItemHeader(props) {

  const [likeReply, {data}] = useMutation(LIKE_REPLY_MUTATION);

  const [ liked, setLiked ] = useState(false);

  useEffect(() => {
    if(liked != props.userRelation.isLiked) {
        setLiked(props.userRelation.isLiked);
    }
  },[props.userRelation.isLiked])

  const likePress = () => {
    setLiked(!liked);
    likeReply({ 
      variables: {
        id: props.commentInfo.id,
        parentid: props.parentId
      }
    });
  } 

  let likeCount = props.commentInfo.likeCount + (props.userRelation.isLiked? (liked? 0 : -1 ) : (liked? 1 : 0))

  return (
    <View>
      <View style={styles.topContainer}>
        <AvatarWrapper 
          uri={props.commentInfo.author.avatar}
          label={props.commentInfo.author.itemName[0]}
        />
        <View style={styles.commentBox} >
          <View style={styles.commentBoxMeta}>
            <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{props.commentInfo.author.username}</Text>
            <Text style={{margin: 1.5}}>   {moment(props.commentInfo.createdAt).fromNow()}</Text>
          </View>
         
          <Text>
           {props.commentInfo.text}
          </Text>
        </View>
      </View>
      <View style={styles.middleContainer}>
        <TouchableOpacity onPress={() => likePress()}>
        <View style={styles.likeButton}>
          {liked? 
          <Icon 
                  name="thumbs-up" 
                  type='font-awesome'
                  color={iOSColors.orange}  
                  size={18} />
          :  
          <Text>ถูกใจ</Text> 
                  }
          {likeCount > 0?
          <Text>  {likeCount}</Text> 
          : null}
          </View>  
        </TouchableOpacity>
        <TouchableOpacity onPress={() => props.inputRef.current.focus()}>
          <Text style={{marginHorizontal: 20}}>ตอบกลับ</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  commentBox: {
    backgroundColor: '#ffe8e8',
    marginVertical: 0,
    marginRight: 20,
    marginHorizontal: 10,
    borderRadius: 20,
    padding: 10
  },
  commentBoxMeta: {
    flexDirection: 'row',
    alignItems: 'flex-end'
  },
  topContainer: {
      flexDirection: 'row',
      width: 380,
      marginHorizontal: 20,
      marginTop: 10,
  },
  middleContainer: {
    flexDirection: 'row', 
    marginLeft: 80,
    marginBottom: 5,
    marginTop: 10
  },
  bottomContainer: {
    flexDirection: 'row', 
    marginLeft: 80,
    marginBottom: 5,
  },
  likeButton: {
    flexDirection: 'row'
  }

})

export default memo(ReplyItemHeader);