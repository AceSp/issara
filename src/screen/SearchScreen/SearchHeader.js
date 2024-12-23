import React, { Component, useState, useEffect } from 'react';
import { 
    View,
    StyleSheet
 } from 'react-native';
import { Avatar, Text, Divider, Button } from 'react-native-elements';
import ProfileButtonGroup from '../../component/ProfileButtonGroup';
import formatNumber from '../../utils/formatNumber';
import { colors } from '../../utils/constants';
import { IconButton, Searchbar } from 'react-native-paper';

export default function SearchHeader({
    searchText,
    setSearchText,
    search,
    goBack,
}) {
    return (
        <View style={styles.Root}>
            <IconButton 
                style={styles.backButton}
                icon="arrow-left"
                onPress={goBack}
            />
            <Searchbar 
                style={styles.searchBar}
                inputStyle={styles.searchBarInput}
                value={searchText}
                onChangeText={(value) => setSearchText(value)}
                onBlur={() => search(searchText)}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    backButton: {
        width: 40,
    },
    Root: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 5,
        height: 50,
        backgroundColor: 'white',
    },
    searchBar: {
        flex: 1,
        height: 36,
    },
    searchBarInput: {
        alignSelf: 'center',
    },
})


