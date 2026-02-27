import { decode } from 'base64-arraybuffer'
import * as FileSystem from 'expo-file-system/legacy'
import { supabase } from '../lib/supabase'
import { SUPABASE_URL } from '../constants'

export const getSupabaseFileUrl = filepath => {
    if (filepath) {
        console.log('supbase url: ', SUPABASE_URL);
        let fp = `${SUPABASE_URL}/storage/v1/object/public/uploads/${filepath}`;
        console.log('Constructed Supabase file URL: ', fp);
        return { uri: fp };

    }
    return null;
}

export const getUserImageSrc = imagePath => {
    console.log('Getting image source for path: ', imagePath);
    if (!imagePath) {
        return require('../assets/images/defaultUser.png');
    }

    // Local URI from image picker (before upload completes)
    if (typeof imagePath === 'string' && imagePath.startsWith('file://')) {
        return { uri: imagePath };
    }

    // Supabase storage path — build the full URL
    if (typeof imagePath === 'string') {
        console.log('Constructing Supabase URL for image path: ', imagePath);
        return getSupabaseFileUrl(imagePath);
    }

    return require('../assets/images/defaultUser.png');
}
export const uploadFile = async (folderName, fileUri, isImage=true)=>{
    console.log('Uploading file: ', fileUri);
    try{
        let fileName=getFilePath(folderName, isImage);
        const fileBase64 = await FileSystem.readAsStringAsync(fileUri, {
            encoding: 'base64'
        });
        let imageData = decode(fileBase64);
        let {data, error} = await supabase
        .storage
        .from('uploads')
        .upload(fileName, imageData, {
            cacheControl: '3600',
            upsert: false,
            contentType: isImage? 'image/*': 'video/*'
        });
        if(error){
            console.log('Supabase upload error: ', error)
            return {success: false, msg: "Error uploading media"}
        }
        console.log('data: ', data);
        return {success: true, data: data.path};
    } catch(error){
        console.log('file upload error: ', error)
        return {success: false, msg: "Error uploading media"}
    }
}

export const getFilePath = (folderName, isImage)=>{
    return `/${folderName}/${(new Date()).getTime()}${isImage? '.png': '.mp4'}`;
}

export const downloadFile = async (url)=>{
    try{
        const {uri} = await FileSystem.downloadAsync(url, getLocalFilePath(url));
        return uri;
    } catch(error){
        return null;
     }
    }

export const getLocalFilePath = (filepath)=>{
    let fileName = filepath.split('/').pop();
    return `${FileSystem.documentDirectory}${fileName}`;
}