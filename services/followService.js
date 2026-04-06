import { supabase } from '../lib/supabase';

/**
 * Follow a user.
 * @param {string} followerId - The ID of the user doing the following (current user)
 * @param {string} followingId - The ID of the user being followed
 */
export const followUser = async (followerId, followingId) => {
    try {
        const { data, error } = await supabase
            .from('follows')
            .insert({ follower_id: followerId, following_id: followingId })
            .select()
            .single();

        if (error) return { success: false, msg: error.message };
        return { success: true, data };
    } catch (err) {
        console.log('followUser error:', err);
        return { success: false, msg: err.message };
    }
};

/**
 * Unfollow a user.
 * @param {string} followerId - The ID of the user doing the unfollowing (current user)
 * @param {string} followingId - The ID of the user being unfollowed
 */
export const unfollowUser = async (followerId, followingId) => {
    try {
        const { error } = await supabase
            .from('follows')
            .delete()
            .eq('follower_id', followerId)
            .eq('following_id', followingId);

        if (error) return { success: false, msg: error.message };
        return { success: true };
    } catch (err) {
        console.log('unfollowUser error:', err);
        return { success: false, msg: err.message };
    }
};

/**
 * Check if a user is following another user.
 * @param {string} followerId
 * @param {string} followingId
 * @returns {{ success: boolean, isFollowing: boolean }}
 */
export const checkIsFollowing = async (followerId, followingId) => {
    try {
        const { data, error } = await supabase
            .from('follows')
            .select('follower_id')
            .eq('follower_id', followerId)
            .eq('following_id', followingId)
            .maybeSingle();

        if (error) return { success: false, msg: error.message };
        return { success: true, isFollowing: !!data };
    } catch (err) {
        console.log('checkIsFollowing error:', err);
        return { success: false, msg: err.message };
    }
};

/**
 * Get all followers of a user.
 * @param {string} userId
 */
export const getFollowers = async (userId) => {
    try {
        const { data, error } = await supabase
            .from('follows')
            .select('follower_id, users(*)')
            .eq('following_id', userId);

        if (error) return { success: false, msg: error.message };
        return { success: true, data };
    } catch (err) {
        console.log('getFollowers error:', err);
        return { success: false, msg: err.message };
    }
};

/**
 * Get all users that a user is following.
 * @param {string} userId
 */
export const getFollowing = async (userId) => {
    try {
        const { data, error } = await supabase
            .from('follows')
            .select('following_id, users(*)')
            .eq('follower_id', userId);

        if (error) return { success: false, msg: error.message };
        return { success: true, data };
    } catch (err) {
        console.log('getFollowing error:', err);
        return { success: false, msg: err.message };
    }
};

/**
 * Get follower and following counts for a user.
 * @param {string} userId
 */
export const getFollowCounts = async (userId) => {
    try {
        const [followersRes, followingRes] = await Promise.all([
            supabase.from('follows').select('*', { count: 'exact', head: true }).eq('following_id', userId),
            supabase.from('follows').select('*', { count: 'exact', head: true }).eq('follower_id', userId),
        ]);

        return {
            success: true,
            followerCount: followersRes.count ?? 0,
            followingCount: followingRes.count ?? 0,
        };
    } catch (err) {
        console.log('getFollowCounts error:', err);
        return { success: false, msg: err.message };
    }
};