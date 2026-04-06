import React, { useEffect, useState } from "react";
import { StyleSheet, View, ScrollView, ActivityIndicator, TouchableOpacity, Text as RNText, Alert } from "react-native";
import { useAuth } from "@/contexts/AuthContext";
import { Text } from "@/components/ui/text";
import { Card } from "@/components/ui/card";
import { useRouter, useLocalSearchParams } from "expo-router";
import HomeBar from "@/components/HomeBar";
import LogoHeader from "@/components/LogoHeader";
import ScreenWrapper from "@/components/ScreenWrapper";
import Avatar from "@/components/Avatar";
import { theme } from "@/constants/theme";
import Icon from '@/assets/icons'
import { hp, wp } from "@/helpers/common";
import { getUserData } from "@/services/userService";
import { fetchPosts } from "@/services/postService";
import PostCard from "@/components/PostCard";
import BackButton from "@/components/BackButton";
import { followUser, unfollowUser, checkIsFollowing } from "@/services/followService";

const UserProfile = () => {
    const { userId } = useLocalSearchParams();
    const { user, userData } = useAuth();
    const currentUser = userData?.data ?? userData ?? {};
    const router = useRouter();
    const [profile, setProfile] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFollowing, setIsFollowing] = useState(false);
    const [followLoading, setFollowLoading] = useState(false);

    const isOwnProfile = user?.id === userId;

    useEffect(() => {
        if (userId) {
            loadProfile();
            loadPosts();
            if (!isOwnProfile) {
                checkIsFollowing(user.id, userId).then(res => {
                    if (res.success) setIsFollowing(res.isFollowing);
                });
            }
        }
    }, [userId]);

    const loadProfile = async () => {
        let res = await getUserData(userId);
        if (res.success) {
            setProfile(res.data);
        } else {
            console.log('Error fetching user profile: ', res.msg);
        }
        setLoading(false);
    }

    const loadPosts = async () => {
        let res = await fetchPosts(1000);
        if (res.success) {
            const userPosts = res.data.filter(post => post.userId === userId);
            setPosts(userPosts);
        }
    }

    const onFollowPress = async () => {
        if (followLoading) return;
        setFollowLoading(true);

        const wasFollowing = isFollowing;
        setIsFollowing(!wasFollowing);

        const res = wasFollowing
            ? await unfollowUser(user.id, userId)
            : await followUser(user.id, userId);

        if (!res.success) {
            setIsFollowing(wasFollowing);
            Alert.alert('Error', res.msg || 'Something went wrong');
        }

        setFollowLoading(false);
    };

    if (loading) {
        return (
            <ScreenWrapper bg="white">
                <View style={styles.headerRow}>
                    <BackButton router={router} />
                    <LogoHeader title="Profile" />
                </View>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                </View>
            </ScreenWrapper>
        );
    }

    return (
        <ScreenWrapper bg="white">
            <View style={styles.headerRow}>
                <BackButton router={router} />
                <LogoHeader title="Profile" />
            </View>
            <View style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                    {/* Profile Header */}
                    <Card style={styles.profileHeader}>
                        <Avatar
                            uri={profile?.image ?? undefined}
                            size={100}
                            rounded={50}
                        />
                        <Text size="xl" bold style={styles.name}>
                            {profile?.name || "Unknown User"}
                        </Text>
                        {profile?.username && (
                            <Text style={styles.username}>@{profile.username}</Text>
                        )}

                        {/* Follow button — hidden on own profile */}
                        {!isOwnProfile && (
                            <TouchableOpacity
                                onPress={onFollowPress}
                                disabled={followLoading}
                                activeOpacity={0.75}
                                style={[
                                    styles.followButton,
                                    isFollowing ? styles.followingButton : styles.notFollowingButton,
                                ]}
                            >
                                {followLoading ? (
                                    <ActivityIndicator
                                        size="small"
                                        color={isFollowing ? theme.colors.onSecondary : theme.colors.onPrimary}
                                    />
                                ) : (
                                    <RNText style={[
                                        styles.followButtonText,
                                        isFollowing ? styles.followingButtonText : styles.notFollowingButtonText,
                                    ]}>
                                        {isFollowing ? 'Following' : 'Follow'}
                                    </RNText>
                                )}
                            </TouchableOpacity>
                        )}
                    </Card>

                    {/* Bio */}
                    {profile?.bio ? (
                        <Card style={styles.sectionCard}>
                            <Text size="lg" bold style={styles.sectionTitle}>Bio</Text>
                            <View style={styles.infoRow}>
                                <Icon name="user" strokeWidth={2} size={20} color={theme.colors.onSecondary} />
                                <Text style={styles.detail}>{profile.bio}</Text>
                            </View>
                        </Card>
                    ) : null}

                    {/* Account Info */}
                    <Card style={styles.sectionCard}>
                        <Text size="lg" bold style={styles.sectionTitle}>Info</Text>
                        {profile?.address ? (
                            <View style={styles.infoRow}>
                                <Icon name="location" strokeWidth={2} size={20} color={theme.colors.onSecondary} />
                                <Text style={styles.detail}>{profile.address}</Text>
                            </View>
                        ) : null}
                        <View style={styles.infoRow}>
                            <Icon name="lock" strokeWidth={2} size={20} color={theme.colors.onSecondary} />
                            <Text style={styles.detail}>
                                Joined {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : "N/A"}
                            </Text>
                        </View>
                    </Card>

                    {/* Their Posts */}
                    <Text size="lg" bold style={styles.postsTitle}>Posts</Text>
                    {posts.length === 0 ? (
                        <Text style={styles.noPosts}>No posts yet</Text>
                    ) : (
                        posts.map(post => (
                            <PostCard
                                key={post.id.toString()}
                                item={post}
                                currentUser={currentUser}
                                router={router}
                            />
                        ))
                    )}
                </ScrollView>

                <HomeBar active="profile" />
            </View>
        </ScreenWrapper>
    );
};

export default UserProfile;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8f8f8",
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: wp(4),
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 100,
    },
    profileHeader: {
        padding: 24,
        alignItems: "center",
        marginBottom: 16,
        gap: 8,
    },
    name: {
        textAlign: "center",
    },
    username: {
        textAlign: "center",
        color: theme.colors.gray,
    },
    followButton: {
        marginTop: 4,
        paddingHorizontal: 32,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        minWidth: 120,
        alignItems: 'center',
        justifyContent: 'center',
    },
    notFollowingButton: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
    },
    followingButton: {
        backgroundColor: 'transparent',
        borderColor: theme.colors.secondary,
    },
    followButtonText: {
        fontSize: hp(1.7),
        fontWeight: '600',
    },
    notFollowingButtonText: {
        color: theme.colors.onPrimary,
    },
    followingButtonText: {
        color: theme.colors.onSecondary,
    },
    sectionCard: {
        padding: 16,
        marginBottom: 16,
    },
    sectionTitle: {
        marginBottom: 8,
    },
    detail: {
        flex: 1,
        color: theme.colors.onSecondary,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginVertical: 6,
    },
    postsTitle: {
        marginBottom: 12,
        color: theme.colors.onSecondary,
        alignSelf: 'center',
    },
    noPosts: {
        textAlign: 'center',
        color: theme.colors.gray,
        fontSize: hp(1.8),
        marginTop: 20,
    },
});