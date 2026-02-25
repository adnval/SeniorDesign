import { uploadFile } from "./imageService";
import { supabase } from '../lib/supabase'

export const createOrUpdatePost = async (post) => {
    try {
        // upload media to supabase
        if (post.file && typeof post.file === 'object') {
            let isImage = post?.file.type == 'image';
            let folderName = isImage ? 'postImages' : 'postVideos';
            let fileResult = await uploadFile(folderName, post.file.uri, isImage);
            console.log('File upload result: ', fileResult);
            if (fileResult.success) {
                post.image = fileResult.data; // CHANGED: was "post.file = fileResult.data", now maps to the correct "image" column in the posts table
            } else {
                return fileResult;
            }
        }

        delete post.file; // ADDED: remove the raw file object so it doesn't get sent to supabase

        const { data, error } = await supabase
            .from('posts')
            .upsert(post)
            .select()
            .single();

        if (error) {
            console.log('Supabase error creating/updating post: ', error);
            return { success: false, msg: "Error creating/updating post" };
        }
        return { success: true, data };

    } catch (error) {
        console.log('Error creating/updating post: ', error);
        return { success: false, msg: "Error creating/updating post" };
    }
}

export const fetchPosts = async (limit=10)=>{
    try{
        const {data, error} = await supabase
        .from('posts')
        .select(`
            *,
            profile: profiles (id, name, image, username)
            `)
        .order('created_at', { ascending: false })
        .limit(limit);

        if(error){
            console.log('Supabase error fetching posts: ', error);
            return {success: false, msg: "Error fetching posts"};
        }
        return {success: true, data: data};

    } catch(error){
        console.log('Error fetching posts: ', error);
        return {success: false, msg: "Error fetching posts"};
    }
}