import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native'
import React, {useEffect, useRef, useState} from 'react'
import { useLocalSearchParams } from 'expo-router';
import { fetchPostDetails, deleteComment } from '../../services/postService';
import {wp, hp} from '../../helpers/common'
import { theme } from '../../constants/theme';
import PostCard from '../../components/PostCard';
import { useAuth } from '../../contexts/AuthContext';
import {useRouter} from 'expo-router'
import LogoHeader from '../../components/LogoHeader';
import ScreenWrapper from '../../components/ScreenWrapper';
import {
  Input,
  InputField,
  InputSlot,
  InputIcon,
} from "@/components/ui/input";
import Icon from "@/assets/icons";
import { ActivityIndicator } from 'react-native';
import { createComment } from '@/services/postService';
import BackButton from '../../components/BackButton'; // ADDED
import HomeBar from '../../components/HomeBar';
import CommentItem from '../../components/CommentItem';


const postDetails = () => {
    const {postId} = useLocalSearchParams();
    const [post, setPost] = useState(null);
    const {user, userData} = useAuth();
    const profile = userData?.data ?? userData ?? {};
    const router = useRouter();
    const [startLoading, setStartLoading] = useState(true);
    const commentRef = useRef("");          // REMOVED inputRef - not needed anymore
    const [loading, setLoading] = useState(false);
    const [commentText, setCommentText] = useState(""); // ADDED: controlled input state

    console.log('post details: ', post);

    useEffect(() => {
        getPostDetails();
    }, []);

    const handleDeleteComment = async (commentId) => { // CHANGED: was (item), now (commentId) to match what CommentItem passes
        Alert.alert(
            "Delete Comment",
            "Are you sure you want to delete this comment?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Delete", style: "destructive", onPress: async () => {
                    let res = await deleteComment(commentId); // CHANGED: was item.id, now commentId
                    if (res.success){
                        setPost(prevPost => ({
                            ...prevPost,
                            comments: prevPost.comments.filter(comment => comment.id !== commentId) // CHANGED: was item.id, now commentId
                        }));
                    } else {
                        Alert.alert('Delete Comment', 'Something went wrong. Please try again.');
                    }
                }}
            ]
        );
    }

    const getPostDetails = async () => {
        let res = await fetchPostDetails(postId);
        if (res.success){
            setPost(res.data);
            setStartLoading(false);
        } else {
            console.log('Error fetching post details: ', res.msg);
            setStartLoading(false);
        }
    }

    const onNewComment = async () => {
        if (!commentRef.current) return;
        let data = {
            userId: user?.id,
            postId: post?.id,
            text: commentRef.current,
        }
        setLoading(true);
        let res = await createComment(data);
        if (res.success){
            console.log('Comment created successfully: ', res.data);
            setPost(prevPost => ({                          // ADDED: append new comment to post state so it shows immediately
                ...prevPost,
                comments: [...prevPost.comments, {
                    ...res.data,
                    user: { name: profile?.name, image: profile?.image } // ADDED: attach current user's profile so CommentItem can display name/avatar
                }]
            }));
            setLoading(false);
            commentRef.current = "";
            setCommentText("");
        } else {
            Alert.alert('Comment', res.msg);
            setLoading(false);
        }
    }

    if (startLoading || !post) {
        return (
            <ScreenWrapper bg="white">
                <View style={styles.headerRow}>
                    <BackButton router ={router} />
                    <LogoHeader title="Post Details"/>
                </View>
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                </View>
            </ScreenWrapper>
        );
    }

    return (
        <ScreenWrapper bg="white">
            <View style={styles.headerRow}>
                <BackButton router={router} />
                <LogoHeader title="Post Details"/>
            </View>
            <View style={styles.container}>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
                    <PostCard
                        item={{...post, comments: [{count: post.comments.length}]} }
                        currentUser={profile}
                        router={router}
                        hasShadow={false}
                        showMoreIcon={false}
                    />
                    <View style={{marginVertical: 15, gap: 17 }}>
                        {
                            post?.comments.map(comment=>(
                                <CommentItem
                                    key={comment.id.toString()}
                                    item={comment}
                                    onDelete={handleDeleteComment}
                                />
                            ))
                        }
                        {
                            post?.comments.length === 0 && (
                                <Text style={styles.notFound}>No comments yet. Be the first to comment!</Text>
                            )
                        }
                    </View>
                </ScrollView>

                {/* MOVED: outside ScrollView so it sticks to the bottom */}
                <View style={styles.inputContainer}>
                    <Input style={styles.input}>
                        <InputSlot style={styles.inputSlot}>
                            <InputIcon>
                                <Icon name="comment" strokeWidth={2} size={20} color={theme.colors.onSecondary} />
                            </InputIcon>
                        </InputSlot>
                        <InputField
                            placeholder="Write a comment..."
                            keyboardType="default"
                            style={styles.inputField}
                            value={commentText}
                            onChangeText={text => {
                                commentRef.current = text;
                                setCommentText(text);
                            }}
                        />
                    </Input>
                    <TouchableOpacity
                        style={[styles.sendIcon, loading && styles.sendIconLoading]}
                        onPress={onNewComment}
                        disabled={loading}
                    >
                        {loading
                            ? <ActivityIndicator size="small" color="white" />
                            : <Icon name="send" strokeWidth={2} size={20} color={theme.colors.primary} />
                        }
                    </TouchableOpacity>
                </View>
            </View>
            <HomeBar active="feed" />
        </ScreenWrapper>
    )
}

export default postDetails

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: wp(4),
    },
    list: {
        paddingHorizontal: wp(4),
        paddingTop: wp(2),
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingHorizontal: wp(4),
        paddingVertical: hp(1.5),
        borderTopWidth: 0.5,
        borderTopColor: theme.colors.secondary,
        backgroundColor: 'white',
        marginBottom: 100,
    },
    input: {
        flex: 1,
        borderRadius: theme.radius.xl,
        borderWidth: 0.8,
        borderColor: theme.colors.secondary,
        backgroundColor: '#f9f9f9',
        paddingHorizontal: 14,
        height: hp(6),
    },
    inputSlot: {
        paddingLeft: 6,
    },
    inputField: {
        fontSize: hp(1.8),
        color: theme.colors.onSecondary,
        paddingLeft: 6,
    },
    sendIcon: {
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 0.8,
        borderColor: theme.colors.primary,
        borderRadius: theme.radius.xl,
        borderCurve: 'continuous',
        height: hp(5.8),
        width: hp(5.8),
    },
    sendIconLoading: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
    },
    center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    notFound: {
        fontSize: hp(2.5),
        color: theme.colors.onSecondary,
        fontWeight: theme.fonts.medium,
        textAlign: 'center',
    },
})