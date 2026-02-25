import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { theme } from '@/constants/theme'
import { hp, wp } from '@/helpers/common'
import Avatar from './Avatar'
import moment from 'moment'
import Icon from '@/assets/icons'
import RenderHtml from 'react-native-render-html'
import { getSupabaseFileUrl } from '../services/imageService'
import { Video } from 'expo-av'

const PostCard = ({ item, currentUser, router, hasShadow = true }) => {
    const shadowStyles = {
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    }

    const textStyle = {
        color: theme.colors.onSecondary,
        fontSize: hp(1.75),
        lineHeight: hp(2.6),
    }

    const tagStyles = {
        div: textStyle,
        p: textStyle,
        ol: textStyle,
        ul: textStyle,
        li: textStyle,
    }

    const createdAt = moment(item?.created_at).format('MMM D');

    const openPostDetails = () => {
        router.push(`/post/${item.id}`);
    }

    const hasImage = item?.image && item.image.includes('postImages');
    const hasVideo = item?.image && item.image.includes('postVideos');
    const liked=true;
    const likes = [];

    return (
        <View style={[styles.container, hasShadow && shadowStyles]}>

            {/* Header */}
            <View style={styles.header}>
                <View style={styles.userInfo}>
                    <Avatar
                        size={hp(5)}
                        uri={item?.profile?.image}
                        rounded={theme.radius.md}
                    />
                    <View style={{ gap: 3 }}>
                        <Text style={styles.userName}>{item?.profile?.username}</Text>
                        <Text style={styles.postDate}>{createdAt}</Text>
                    </View>
                </View>
                <TouchableOpacity onPress={openPostDetails} style={styles.menuButton}>
                    <Icon name="threeDotsHorizontal" size={hp(2.8)} strokeWidth={3} color={theme.colors.onSecondary} />
                </TouchableOpacity>
            </View>

            {/* Caption */}
            {item?.caption ? (
                <View style={styles.postBody}>
                    <RenderHtml
                        contentWidth={wp(88)}
                        source={{ html: item?.caption }}
                        tagsStyles={tagStyles}
                    />
                </View>
            ) : null}

            {hasImage && (
                <Image
                    source={getSupabaseFileUrl(item.image)}
                    transition={100}
                    style={styles.postMedia}
                    contentFit="cover"
                />
            )}

            {hasVideo && (
                <Video
                    source={getSupabaseFileUrl(item.image)}
                    style={styles.postMedia}
                    resizeMode="cover"
                    useNativeControls
                    isLooping
                />
            )}
        <View style={styles.footer}>
            <TouchableOpacity style={styles.footerButton}>
                <Icon name="heart" fill={liked ? theme.colors.onTertiary : 'none'} size={hp(2.2)} strokeWidth={2} color={liked? theme.colors.onTertiary: theme.colors.gray} />
                <Text style={styles.count}>{likes?.length}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.footerButton}>
                <Icon name="comment" size={hp(2.2)} strokeWidth={2} color={theme.colors.gray} />
                <Text style={styles.count}>{likes?.length}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.footerButton}>
                <Icon name="share" size={hp(2.2)} strokeWidth={2} color={theme.colors.gray} />
            </TouchableOpacity>
        

        </View>
        </View>
    )
}

export default PostCard

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
        marginHorizontal: 0,
        borderRadius: theme.radius.xl,
        borderCurve: 'continuous',
        paddingHorizontal: 14,
        paddingVertical: 14,
        borderWidth: 0.5,
        backgroundColor: 'white',
        borderColor: theme.colors.secondary,
        shadowColor: '#000',
        gap: 12,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    menuButton: {
        padding: 4,
    },
    userName: {
        fontSize: hp(1.8),
        color: theme.colors.onSecondary,
        fontWeight: theme.fonts.semibold,
    },
    postDate: {
        fontWeight: theme.fonts.medium,
        color: theme.colors.gray,
        fontSize: hp(1.45),
    },
    postBody: {
        paddingHorizontal: 2,
    },
    postMedia: {
        height: hp(30),
        width: '100%',
        borderRadius: theme.radius.lg,
        borderCurve: 'continuous',
        backgroundColor: theme.colors.secondary,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
    },
    footerButton: {
        marginLeft: 5,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
    },
    count: {
        color: theme.colors.onSecondary,
        fontSize: hp(1.8),
    },
})