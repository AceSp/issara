import axios from 'axios';
import moment from 'moment';

const uploadToS3 = async (image, signRequest) => {
    const options = {
        headers: {
            "Content-Type": image.type
        }
    };
    await axios.put(signedRequest, image.uri, options);
};

const formatFilename = filename => {
    const date = moment().format("YYYYMMDD");
    const randomString = Math.random()
      .toString(36)
      .substring(2, 7);
    const cleanFileName = filename.toLowerCase().replace(/[^a-z0-9]/g, "-");
    const newFilename = `images/${date}-${randomString}-${cleanFileName}`;
    return newFilename.substring(0, 60);
};

export async function uploadImage(image) {
    const [s3sign, {data}] = useMutation(S3SIGN_MUTATION);

        const response = await s3sign({
            variables: {
                filename: formatFilename(image.name),
                filetype: image.type
            }
        });
    const { signedRequest, url } = data.s3sign;
    await uploadToS3(image, signedRequest);

    return { image,name, pictureUrl: url }

};