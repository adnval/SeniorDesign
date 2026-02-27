import { StyleSheet, Text, View, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'expo-router'
import { fetchPosts } from '@/services/postService'
import { wp, hp } from '@/helpers/common'
import { theme } from '@/constants/theme'
import ScreenWrapper from '@/components/ScreenWrapper'
import LogoHeader from '@/components/LogoHeader'
import HomeBar from '@/components/HomeBar'
import PostCard from '@/components/PostCard'
import BackButton from '@/components/BackButton'

const MyPosts = () => {
    const { user, userData } = useAuth()
    const profile = userData?.data ?? userData ?? {}
    const router = useRouter()
    const [posts, setPosts] = useState([])
    const [hasMore, setHasMore] = useState(true)
    const [loading, setLoading] = useState(true)
    let limit = 0

    useEffect(() => {
        getPosts()
    }, [])

    const getPosts = async () => {
        if (!hasMore) return
        limit = limit + 10
        let res = await fetchPosts(limit)
        if (res.success) {
            // Filter to only show current user's posts
            const myPosts = res.data.filter(post => post.userId === user?.id)
            if (myPosts.length === posts.length) setHasMore(false)
            setPosts(myPosts)
            setLoading(false)
        }
    }

    return (
        <ScreenWrapper bg="white">
            <View style={styles.headerRow}>
                <BackButton router={router} />
                <LogoHeader title="My Posts" />
            </View>
            <View style={styles.container}>
                <FlatList
                    data={posts}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.listStyle}
                    keyExtractor={item => item.id.toString()}
                    renderItem={({ item }) => (
                        <PostCard
                            item={item}
                            currentUser={profile}
                            router={router}
                        />
                    )}
                    onEndReached={getPosts}
                    onEndReachedThreshold={0.5}
                    ListEmptyComponent={
                        !loading && (
                            <Text style={styles.noPosts}>
                                You haven't posted anything yet!
                            </Text>
                        )
                    }
                    ListFooterComponent={
                        <Text style={styles.footer}>
                            {hasMore ? 'Loading more...' : 'No more posts to load'}
                        </Text>
                    }
                    ListFooterComponentStyle={{ marginBottom: 80 }}
                />
            </View>
            <HomeBar active="profile" />
        </ScreenWrapper>
    )
}

export default MyPosts

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
    listStyle: {
        paddingTop: 20,
        paddingHorizontal: wp(4),
    },
    noPosts: {
        fontSize: hp(2.2),
        textAlign: 'center',
        color: theme.colors.onSecondary,
        marginTop: 40,
    },
    footer: {
        textAlign: 'center',
        padding: 20,
        color: theme.colors.onSecondary,
    },
})