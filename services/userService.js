import { supabase } from "@/lib/supabase";
export const getUserData = async (userId) => {
    try {
        const {data, error} = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        if (error) {
            throw error;
        }
        return {success: true, data};
    }catch (error) {
        console.error("Error fetching user data:", error);
        return {success: false, msg: error.message};
    }
}