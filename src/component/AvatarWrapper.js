import React, { useState, useEffect } from 'react';
import { Avatar } from 'react-native-paper';

export default function AvatarWrapper({ uri, label, style, size, onError, ...restProps }) {
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        setHasError(false);
    }, [uri]);

    if (uri && !hasError) {
        return (
            <Avatar.Image
                {...restProps}
                source={{ uri }}
                onError={(e) => {
                    if (onError) onError(e);
                    setHasError(true);
                }}
                size={size ? size : 40}
            />
        );
    }

    return <Avatar.Text size={size ? size : 40} {...restProps} label={label} />;
}