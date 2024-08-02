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
import { useMutation } from "@apollo/client";
import {Icon} from 'react-native-elements';
import Avatar from '../FeedCard/Avatar';
import moment from 'moment';
import 'moment/locale/th';
import { iOSColors } from "react-native-typography";

import LIKE_COMMENT_MUTATION from '../../graphql/mutations/likeComment';




function CommentItem(props) {

  const [likeComment, {data}] = useMutation(LIKE_COMMENT_MUTATION);

  const [ liked, setLiked ] = useState(false);

  useEffect(() => {
    if(liked != props.relation.isLiked) {
        setLiked(props.relation.isLiked);
    }
  },[props.relation.isLiked])

  const likePress = () => {
    setLiked(!liked);
    likeComment({ 
      variables: {commentId: props.commentInfo.id}
    });
  } 

  let likeCount = props.commentInfo.likeCount + (props.relation.isLiked? (liked? 0 : -1 ) : (liked? 1 : 0))

  return (
    <View>
      <View style={styles.topContainer}>
        <Avatar 
          source={props.commentInfo.author.avatar}
          style={styles.avatar} />
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
                  color={iOSColors.red}  
                  size={18} />
          :  
          <Text>ถูกใจ</Text> 
                  }
          {likeCount > 0?
          <Text>  {likeCount}</Text> 
          : null}
          </View>    
        </TouchableOpacity>
        {
          props.showReplyButton 
          ? null
          : <TouchableOpacity 
              onPress={() => props.navigation.navigate('MoreComment', 
              { 
                comment: {
                  commentInfo: props.commentInfo,
                  relation: props.relation
                }, 
                textAutoFocus: true,
                postInfo: props.postInfo
              }
              )}>
            <Text style={{marginHorizontal: 20}}>ตอบกลับ</Text>
          </TouchableOpacity>
        }
      </View>
      <TouchableOpacity 
      onPress={() => props.navigation.navigate('MoreComment', 
      { 
        comment: {
          commentInfo: props.commentInfo,
          relation: props.relation
        }, 
        postInfo: props.postInfo
      })} 
      underlayColor='#dddcf5'>
      <View style={styles.bottomContainer}>
        {props.commentInfo.commentCount? <Text style={{fontWeight: 'bold'}}>ดูการตอบกลับอีก {props.commentInfo.commentCount} รายการ</Text> : <View></View> }
      </View>
      </TouchableOpacity>
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

export default memo(CommentItem);
