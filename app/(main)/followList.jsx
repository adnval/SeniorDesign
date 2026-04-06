import React, { useEffect, useState } from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity, ActivityIndicator, Text } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Avatar from '@/components/Avatar';
import ScreenWrapper from '@/components/ScreenWrapper';
import LogoHeader from '@/components/LogoHeader';
import { theme } from '@/constants/theme';
import { hp, wp } from '@/helpers/common';
import { supabase } from '@/lib/supabase';

const FollowList = () => {
    const { userId, type } = useLocalSearchParams();
    const router = useRouter();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const isFollowers = type === 'followers';
    const title = isFollowers ? 'Followers' : 'Following';

    useEffect(() => {
        fetchList();
    }, [userId, type]);

    const fetchList = async () => {
        setLoading(true);
        try {
            const { data: followData, error: followError } = isFollowers
                ? await supabase.from('follows').select('follower_id').eq('following_id', userId)
                : await supabase.from('follows').select('following_id').eq('follower_id', userId);

            if (followError) {
                console.log('follows query error:', followError);
                setUsers([]);
                setLoading(false);
                return;
            }

            if (!followData || followData.length === 0) {
                setUsers([]);
                setLoading(false);
                return;
            }

            const ids = followData.map(row => isFollowers ? row.follower_id : row.following_id);

            const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('id, username, name, image')
                .in('id', ids);

            if (profileError) {
                console.log('profiles query error:', profileError);
                setUsers([]);
            } else {
                setUsers(profileData ?? []);
            }
        } catch (e) {
            console.log('fetchList exception:', e);
        }
        setLoading(false);
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            activeOpacity={0.7}
            onPress={() => router.push({ pathname: '/(main)/userProfile', params: { userId: item.id } })}
        >
            <Avatar
                uri={item.image ?? undefined}
                size={hp(5.5)}
                rounded={theme.radius.md}
            />
            <View style={styles.cardContent}>
                <View style={styles.cardRow}>
                    <Text style={styles.name}>{item.name || item.username}</Text>
                </View>
                {item.username ? (
                    <Text style={styles.username}>@{item.username}</Text>
                ) : null}
            </View>
        </TouchableOpacity>
    );

    return (
        <ScreenWrapper bg="white">
            <LogoHeader title={title} showBackButton={true} />
            <View style={styles.container}>
                {loading ? (
                    <View style={styles.centered}>
                        <ActivityIndicator size="large" color={theme.colors.primary} />
                    </View>
                ) : users.length === 0 ? (
                    <View style={styles.centered}>
                        <Text style={styles.emptyText}>
                            {isFollowers ? 'No followers yet.' : 'Not following anyone yet.'}
                        </Text>
                    </View>
                ) : (
                    <FlatList
                        data={users}
                        keyExtractor={(item) => item.id}
                        renderItem={renderItem}
                        contentContainerStyle={styles.list}
                        showsVerticalScrollIndicator={false}
                        ItemSeparatorComponent={() => <View style={styles.separator} />}
                    />
                )}
            </View>
        </ScreenWrapper>
    );
};

export default FollowList;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        color: theme.colors.gray,
        fontSize: hp(1.8),
    },
    list: {
        paddingHorizontal: wp(4),
        paddingTop: 12,
        paddingBottom: 40,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 10,
        paddingHorizontal: 14,
        backgroundColor: 'white',
        borderRadius: theme.radius.xl,
        borderCurve: 'continuous',
        borderWidth: 0.5,
        borderColor: theme.colors.secondary,
    },
    cardContent: {
        flex: 1,
        gap: 3,
    },
    cardRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    name: {
        fontSize: hp(1.75),
        fontWeight: '600',
        color: theme.colors.onSecondary,
    },
    username: {
        fontSize: hp(1.6),
        color: theme.colors.gray,
    },
    separator: {
        height: 10,
    },
});