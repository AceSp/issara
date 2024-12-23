/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableWithoutFeedback,
  Animated,
} from 'react-native';
import PostItem from '../component/PostItem';

import { withCollapsible } from 'react-navigation-collapsible';

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

let arr = [];
for(let i = 0; i <= 100; i++) {
  arr.push({id: `${i}`, title: `${i} item`})
}
const DATA = arr;

class YourTimeLineScreen extends React.Component {
  
  constructor(props) {
    super(props)
 
      this.state = {
        reactionItemClose: true, 
      };
    }

  postDetail = () => {
    return this.props.navigation.navigate('Detail');
  }

  closeReactionItem = () => {
    this.setState({reactionItemClose: !this.state.reactionItemClose})
  }

  closeView() {
    if(!this.state.reactionItemClose)
    return {
    position: 'absolute',
    zIndex: 10,
    top:0,
    bottom:0,
    left:0,
    right:0,
    }
  };


  render() {

    const {paddingHeight, animatedY, onScroll} = this.props.collapsible;

  return (
    <View>
    <TouchableWithoutFeedback onPress={this.closeReactionItem}><View style={this.closeView()}></View></TouchableWithoutFeedback>
    <AnimatedFlatList

        contentContainerStyle={{paddingTop: paddingHeight}}
        scrollIndicatorInsets={{top: paddingHeight}}
        onScroll={onScroll}
        _mustAddThis={animatedY}

        data={DATA}
        renderItem={({ item }) => (
          <PostItem
            id={item.id}
            title={item.title}
            postDetail={this.postDetail}
            timeLineState={this.state}
            closeReactionItem={this.closeReactionItem}
          />
        )}
        keyExtractor={item => item.id}
      />
    </View>
  );
  }
}

const styles = StyleSheet.create({
  wall: {
    backgroundColor: 'red',
    flex:1,
    position: 'absolute',
    zIndex: 10,
    top:0,
    bottom:0,
    left:0,
    right:0,
  }
})


export default withCollapsible(YourTimeLineScreen, {iOSCollapsedColor: '#031'});

