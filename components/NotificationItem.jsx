import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { theme } from '@/constants/theme'
import Avatar from './Avatar'
import { hp } from '@/helpers/common'
import moment from 'moment'

const NotificationItem = ({ item, router }) => {
    const handleClick = () => {
        let { postId, commentId } = JSON.parse(item.data)
        if (postId) {
            router.push({ pathname: '/(main)/postDetails', params: { postId, commentId } })
        }
    }

    const createdAt = moment(item?.created_at).fromNow()

    return (
        <TouchableOpacity style={styles.container} onPress={handleClick} activeOpacity={0.7}>
            <Avatar uri={item?.sender?.image} size={hp(5.5)} rounded={theme.radius.md} />
            <View style={styles.content}>
                <View style={styles.row}>
                    <Text style={styles.name}>{item?.sender?.name}</Text>
                    <Text style={styles.time}>{createdAt}</Text>
                </View>
                <Text style={styles.title}>{item?.title}</Text>
            </View>
        </TouchableOpacity>
    )
}

export default NotificationItem

const styles = StyleSheet.create({
    container: {
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
    content: {
        flex: 1,
        gap: 3,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    name: {
        fontSize: hp(1.75),
        fontWeight: '600',
        color: theme.colors.onSecondary,
    },
    title: {
        fontSize: hp(1.6),
        color: theme.colors.gray,
    },
    time: {
        fontSize: hp(1.45),
        color: theme.colors.gray,
    },
})