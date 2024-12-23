 import React, { useState } from 'react';
 import { Image, StyleSheet } from 'react-native';
 import { DEFAULT_AVATAR } from '../../utils/constants';

 const Avatar = ({ source, style }) => {
     const [avatarLoadError, setAvatarLoadError] = useState(false);

     const handleAvatarError = () => {
         setAvatarLoadError(true);
     };

     return (
         <Image 
             source={
                 !avatarLoadError && source
                     ? { uri: source }
                     : DEFAULT_AVATAR
             }
             onError={handleAvatarError}
             style={style ? style : styles.avatar}
         />
     );
 };

 const styles = StyleSheet.create({
     avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 2,
        borderColor: 'white',
     },
 });

 export default Avatar;