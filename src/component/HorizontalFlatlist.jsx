import React, { useState, useRef, forwardRef } from 'react';
import {
  FlatList,
  Animated,
  RefreshControl,
  StyleSheet,
  View,
  GestureResponderEvent,
  PanResponder,
} from 'react-native';

const HorizontalPullToRefresh = forwardRef(({ 
  data,
  renderItem,
  onRefresh,
  refreshing,
  onVerticalRefresh,
  ...flatListProps 
}, ref) => {
  const [horizontalRefreshing, setHorizontalRefreshing] = useState(false);
  const [gestureX, setGestureX] = useState(0);
  const listRef = useRef(null);
  const scrollOffset = useRef(0);
  const refreshThreshold = 0;

  const handleScroll = (event) => {
    scrollOffset.current = event.nativeEvent.contentOffset.x;
  };

  const handleGestureStart = (event) => {
    setGestureX(event.nativeEvent.pageX);
  };

  const handleGestureMove = (event) => {
    if (scrollOffset.current === 0) {
      const diff = event.nativeEvent.pageX - gestureX;
      console.log(diff)
      if (diff > refreshThreshold && !horizontalRefreshing) {
        setHorizontalRefreshing(true);
        onRefresh?.().finally(() => {
          setHorizontalRefreshing(false);
        });
      }
    }
  };

  return (
    <FlatList
      ref={ref}
      horizontal
      {...flatListProps}
      data={data}
      renderItem={renderItem}
      onScroll={handleScroll}
      onTouchStart={handleGestureStart}
      onTouchMove={handleGestureMove}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onVerticalRefresh}
        />
      }
      refreshing={horizontalRefreshing}
    />
  );
});

HorizontalPullToRefresh.displayName = 'HorizontalPullToRefresh';

export default HorizontalPullToRefresh;