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
            profile: profiles (id, name, image, username),
            postLikes (*),
            comments (count)
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

export const createPostLike = async (postLike)=>{
    try{
        const {data, error} = await supabase
        .from('postLikes')
        .insert(postLike)
        .select()
        .single();

        if(error){
            console.log('Supabase error creating post like: ', error);
            return {success: false, msg: "Error creating post like"};
        }
        return {success: true, data: data};

    } catch(error){
        console.log('Error creating post like: ', error);
        return {success: false, msg: "Error creating post like"};
    }
}

export const removePostLike = async (postId, userId)=>{
    try{
        const {error} = await supabase
        .from('postLikes')
        .delete()
        .eq('postId', postId)
        .eq('UserId', userId)

        if(error){
            console.log('Supabase error removing post like: ', error);
            return {success: false, msg: "Error removing post like"};
        }
        return {success: true};

    } catch(error){
        console.log('Error removing post like: ', error);
        return {success: false, msg: "Error removing post like"};
    }
}

export const fetchPostDetails = async (postId)=>{
    try{
        const {data, error} = await supabase
        .from('posts')
        .select(`
            *,
            profile: profiles (id, name, image, username),
            postLikes (*),
            comments (*, user: profiles(id, name, image))
            `)
        .eq('id', postId)
        .order('created_at', { ascending: false, foreignTable: 'comments' })
        .single();

        if(error){
            console.log('Supabase error fetching post details: ', error);
            return {success: false, msg: "Error fetching post details"};
        }
        return {success: true, data: data};

    } catch(error){
        console.log('Error fetching post details: ', error);
        return {success: false, msg: "Error fetching post details"};
    }
}

export const createComment = async (comment)=>{
    try{
        const {data, error} = await supabase
        .from('comments')
        .insert(comment)
        .select()
        .single();

        if(error){
            console.log('Supabase error creating comment: ', error);
            return {success: false, msg: "Error creating comment"};
        }
        return {success: true, data: data};

    } catch(error){
        console.log('Error creating comment: ', error);
        return {success: false, msg: "Error creating comment"};
    }
}

export const deleteComment = async (commentId)=>{
    try{
        const {error} = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId)

        if(error){
            console.log('Supabase error removing comment: ', error);
            return {success: false, msg: "Error removing comment"};
        }
        return {success: true};

    } catch(error){
        console.log('Error removing comment: ', error);
        return {success: false, msg: "Error removing comment"};
    }
}

export const parseWKBPoint = (wkb) => {
    if (!wkb || typeof wkb !== 'string') return null
    try {
        const bytes = new Uint8Array(wkb.match(/.{1,2}/g).map(b => parseInt(b, 16)))
        const view = new DataView(bytes.buffer)

        // byte 0: byte order, bytes 1-4: type, check for SRID flag
        const hasSRID = (view.getUint32(1, true) & 0x20000000) !== 0
        const offset = hasSRID ? 9 : 5  // skip byte order(1) + type(4) + optional SRID(4)

        const lng = view.getFloat64(offset, true)
        const lat = view.getFloat64(offset + 8, true)

        console.log('Parsed WKB - lat:', lat, 'lng:', lng)

        if (isNaN(lat) || isNaN(lng)) return null
        return { latitude: lat, longitude: lng }
    } catch (e) {
        console.log('WKB parse error:', e)
        return null
    }
}

export const getPostCoords = (post) => {
    return parseWKBPoint(post.location)
}