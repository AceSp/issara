import React from 'react';
import { Avatar } from 'react-native-paper';

export default function AvatarWrapper(props) {
    if(props.uri) return <Avatar.Image
            {...props}
            source={{ uri: props.uri }}
            />
    return <Avatar.Text
            {...props}
            label={props.label}
            />
}