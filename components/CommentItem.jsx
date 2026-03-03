import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { theme } from '../constants/theme'
import Avatar from './Avatar'
import { hp } from '../helpers/common'
import moment from 'moment'
import Icon from '@/assets/icons'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'expo-router'

const CommentItem = ({ item, onDelete }) => {
    const { userData } = useAuth();
    const router = useRouter();
    const profile = userData?.data ?? userData ?? {};
    const createdAt = moment(item?.created_at).fromNow();
    const canDelete = item?.userId === profile?.id;

    return (
        <View style={styles.container}>
            <Avatar uri={item?.user?.image} size={hp(4.5)} rounded={theme.radius.md} />
            <View style={styles.content}>
                <View style={styles.header}>
                    <View style={styles.nameRow}>
                        <TouchableOpacity onPress={() => router.push({ pathname: '/(main)/userProfile', params: { userId: item?.userId } })}>
                            <Text style={styles.name}>{item?.user?.name}</Text>
                        </TouchableOpacity>
                        <Text style={styles.dot}>·</Text>
                        <Text style={styles.time}>{createdAt}</Text>
                    </View>
                    {canDelete && (
                        <TouchableOpacity onPress={() => onDelete(item.id)} style={styles.deleteButton}>
                            <Icon name="delete" size={16} color={theme.colors.gray} />
                        </TouchableOpacity>
                    )}
                </View>
                <Text style={styles.commentText}>{item?.text}</Text>
            </View>
        </View>
    )
}

export default CommentItem

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'flex-start',
    },
    content: {
        flex: 1,
        gap: 4,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    name: {
        fontSize: hp(1.7),
        fontWeight: '600',
        color: theme.colors.onSecondary,
    },
    dot: {
        fontSize: hp(1.7),
        color: theme.colors.gray,
    },
    time: {
        fontSize: hp(1.5),
        color: theme.colors.gray,
    },
    commentText: {
        fontSize: hp(1.75),
        color: theme.colors.onSecondary,
        lineHeight: hp(2.5),
    },
    deleteButton: {
        padding: 4,
    },
})