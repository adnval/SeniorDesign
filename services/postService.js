import { uploadFile } from "./imageService";
import { supabase } from '../lib/supabase'

export const createOrUpdatePost = async (post)=>{
    try{
        //upload media to supabase
        if (post.file && typeof post.file === 'object'){
            let isImage = post?.file.type == 'image';
            let folderName = isImage? 'postImage': 'postVideo';
            let fileResult = await uploadFile(folderName, post.file.uri, isImage);
            console.log('File upload result: ', fileResult);
            if(fileResult.success) post.file = fileResult.data;
            else {
                return fileResult;
            }
        }

        const {data, error} = await supabase
        .from('posts')
        .upsert(post)
        .select()
        .single();

        if(error){
            console.log('Supabase error creating/updating post: ', error);
            return {success: false, msg: "Error creating/updating post"};
        }
        return {success: true, data};

    } catch(error){
        console.log('Error creating/updating post: ', error);
        return {success: false, msg: "Error creating/updating post"};
    }
}