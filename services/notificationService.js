import { supabase } from '../lib/supabase'
import { SUPABASE_URL } from '../constants'

export const createNotification = async (notification)=>{
    try{
        const {data, error} = await supabase
        .from('notifications')
        .insert(notification)
        .select()
        .single();

        if(error){
            console.log('Supabase error creating notification: ', error);
            return {success: false, msg: "Error creating notification"};
        }
        return {success: true, data: data};

    } catch(error){
        console.log('Error creating notification: ', error);
        return {success: false, msg: "Error creating notification"};
    }
}

export const fetchNotifications = async (receiverID)=>{
    try{
        const {data, error} = await supabase
        .from('notifications')
        .select(`
            *,
            sender: senderID(id, name, image)
            `)
        .eq('receiverID', receiverID)
        .order('created_at', { ascending: false });

        if(error){
            console.log('Supabase error fetching notifications: ', error);
            return {success: false, msg: "Error fetching notifications"};
        }
        return {success: true, data: data};

    } catch(error){
        console.log('Error fetching notifications: ', error);
        return {success: false, msg: "Error fetching notifications"};
    }
}
