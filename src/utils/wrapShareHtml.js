import moment from 'moment';
import { Dimensions } from 'react-native';

const { height, width } = Dimensions.get('screen');

moment.locale('th');

const styles = {
    outerDiv: `
        padding: 10px;
        border-width: 0.5px;
        border-style: solid;
    `,
    innerDiv: `
        display: flex;
        flex-direction: row;
        align-items: center;
    `,
    avatar: `
        width: 40px;
        height: 40px;
        border-radius: 50%;
        margin-right: 15px;
    `,
    title: `
        display: block;
        text-overflow: ellipsis;
        word-wrap: break-word;
        overflow: hidden;
        max-height: 4em;
        font-size: 15px;
        line-height: 20px;
        margin-bottom: 3px;
        width: ${width * 0.8};
    `,
    caption: `
        font-size: 12px;
        line-height: 20px;
        letter-spacing: 0.4px;
    `,
    hr: `
        margin: 0px;
        padding: 0px;
        borderTopColor: rgba(0, 0, 0, 0.1);
        borderBottomWidth: 0.5px;
        borderBottomColor: rgba(255, 255, 255, 0.3);
    `
}

function wrapShareHtml({ 
    title,
    text,
    author,
    createdAt,
}) {

    const shareHtmlPrefix = `
    <div style="${styles.outerDiv}">
        <div style="${styles.innerDiv}">
            <img src="${author.avatar}" style="${styles.avatar}" >
            <div>
                <h3 style="${styles.title}">${title}</h3>
                <div style="${styles.caption}">${author.itemName + " \u25CF " + moment(createdAt).fromNow()}</div>
            </div>
        </div>
        <hr style="${styles.hr}" />
    `;

    const html = shareHtmlPrefix + text + "</div>";
    return html;
}

export default wrapShareHtml;