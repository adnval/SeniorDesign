import { StyleSheet, Text, View, FlatList } from 'react-native'
import React, { useState, useEffect } from 'react'
import HomeBar from '@/components/HomeBar'
import ScreenWrapper from '@/components/ScreenWrapper'
import LogoHeader from '@/components/LogoHeader'
import { fetchNotifications } from '@/services/notificationService'
import { useAuth } from '@/contexts/AuthContext'
import { wp, hp } from '@/helpers/common'
import { useRouter } from 'expo-router'
import NotificationItem from '@/components/NotificationItem'
import { theme } from '@/constants/theme'

const activity = () => {
    const [notifications, setNotifications] = useState([])
    const { user, userData } = useAuth()
    const profile = userData?.data ?? userData ?? {}
    const router = useRouter()

    useEffect(() => {
        getNotifications()
    }, [])

    const getNotifications = async () => {
        let res = await fetchNotifications(profile.id)
        if (res.success) {
            setNotifications(res.data)
        } else {
            console.log('Error fetching notifications: ', res.msg)
        }
    }

    return (
        <ScreenWrapper bg="white">
            <LogoHeader title="Activity" />
            <View style={styles.container}>
                <FlatList
                    data={notifications}
                    keyExtractor={item => item.id.toString()}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.listStyle}
                    renderItem={({ item }) => (
                        <NotificationItem
                            item={item}
                            router={router}
                        />
                    )}
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No notifications yet</Text>
                            <Text style={styles.emptySubtext}>When someone likes or comments on your posts, you'll see it here</Text>
                        </View>
                    }
                />
                <HomeBar active="activity" />
            </View>
        </ScreenWrapper>
    )
}

export default activity

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    listStyle: {
        paddingHorizontal: wp(4),
        paddingVertical: hp(1.5),
        paddingBottom: 90,
    },
    separator: {
        height: 10,
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: hp(10),
        paddingHorizontal: wp(10),
        gap: 8,
    },
    emptyText: {
        textAlign: 'center',
        fontWeight: theme.fonts.semibold,
        color: theme.colors.onSecondary,
        fontSize: hp(2.2),
    },
    emptySubtext: {
        textAlign: 'center',
        color: theme.colors.gray,
        fontSize: hp(1.6),
        lineHeight: hp(2.4),
    },
})