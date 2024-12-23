import React, { View } from 'react';
import { useWindowDimensions } from 'react-native';
import HTML, { 
    HTMLContentModel, 
    HTMLElementModel 
} from 'react-native-render-html';
// import { IGNORED_TAGS } from 'react-native-render-html/src/HTMLUtils';
import {
  iOSUIKitTall,
} from 'react-native-typography'

import { VideoPlayer } from './Video/views/index';

const videoModel = HTMLElementModel.fromCustomModel({
    tagName: 'video',
    mixedUAStyles: {
        width: '100%',
        height: 'auto'
    },
    contentModel: HTMLContentModel.block
});

const tagsStyles = {
    p: { paddingHorizontal: 10 },
    h3: { ...iOSUIKitTall.subheadEmphasized, paddingHorizontal: 10 },
    h4: { ...iOSUIKitTall.title3, paddingHorizontal: 10 },
    h5: { ...iOSUIKitTall.subhead, paddingHorizontal: 10 },
    // hr: {
    //     margin: 40,
    //     borderTopWidth: 1,
    //     borderTopColor: "rgba(0, 0, 0, 0.1)",
    //     borderBottomWidth: 1,
    //     borderBottomColor: "rgba(255, 255, 255, 0.3)"
    // },
    // img: {
    //     maxWidth: '100%',
    //     marginLeft: 'auto',
    //     marginRight: 'auto'
    // }
}

const RenderHTML = React.memo(function RenderHTML({ html }) {
    const { width } = useWindowDimensions();
    return (
        <HTML
            // containerStyle={{ paddingHorizontal: 10 }}
            source={{ html: html }}
            baseFontStyle={iOSUIKitTall.body}
            tagsStyles={tagsStyles}
            // renderers={{
            //     video: ({ src, poster }) => <VideoPlayer
            //         key={src}
            //         uri={src}
            //     />
            //     ,
            // }}
            // renderers={{
            //     video: ({ tnode }) => {
            //         const sourceNode = tnode.children.find(child => child.tagName === 'source');
            //         const src = sourceNode?.domNode?.attribs?.src;
                    
            //         if (!src) {
            //             return null; // Or handle the case where src is not found
            //         }
            //         return (
            //             <VideoPlayer
            //                 key={src}
            //                 uri={src}
            //             />
            //         );
            //     }
            // }}
            renderers={{
                img: ({ tnode }) => {
                    return (
                        <VideoPlayer
                            key={0}
                            uri={"http://localhost:3004/hls/14021403/7353622259174591776/7353622259174591776_0.m3u8"}
                        />
                    );
                }
            }}
            customHTMLElementModels={{ video: videoModel }}
            contentWidth={width}
            // ignoredDomTags={IGNORED_TAGS.filter(tag => tag !== 'video')}
        />
    )
});

export default RenderHTML;