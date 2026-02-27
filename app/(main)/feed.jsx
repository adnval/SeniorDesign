import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import HomeBar from '@/components/HomeBar'
import { theme, styles } from 'constants/theme'
import ScreenWrapper from '@/components/ScreenWrapper'
import LogoHeader from '@/components/LogoHeader'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { fetchPosts } from '@/services/postService'
import { FlatList } from 'react-native'
import { wp, hp } from '@/helpers/common';
import PostCard from '@/components/PostCard'
import { supabase } from '../../lib/supabase'
import getUserData from '@/services/userService'

var limit = 0;
const feed = () => {
  const {user, userData} = useAuth();
  const profile = userData?.data ?? userData ?? {};
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  const handlePostEvent = async (payload) => {
    console.log('Change received!', payload);
    if (payload.eventType === 'INSERT' && payload?.new?.id){
      let newPost = {...payload.new};
      let res = await getUserData(newPost.userId);
      if (res.success){
        newPost.profile = res.data;
        setPosts(prevPosts => [newPost, ...prevPosts]);
      } else {
        console.log('Error fetching user data for new post: ', res.msg);
      }
    }
  }

  useEffect(() => {
    let postChannel = supabase
    .channel('posts')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, handlePostEvent)
    .subscribe();
    // getPosts();
    return () => {      
      supabase.removeChannel(postChannel);
    }
  }, [])

  const getPosts = async () => {
    console.log('Fetching posts for feed...');
    if (!hasMore) {
      console.log('No more posts to fetch');
      return;
    }
    limit = limit + 10;
    let res = await fetchPosts(limit);
    if (res.success){
      console.log('Posts fetched successfully: ', res.data);
      if (posts.length==res.data.length){
        setHasMore(false);
      }
      setPosts(res.data);
    }
  }

  return (
    <ScreenWrapper bg="white">
      <LogoHeader title="Feed"/>
    <View style={styles.container}>
      <FlatList
    data={posts}
    showsVerticalScrollIndicator={false}
    contentContainerStyle={localStyles.listStyle}
    keyExtractor={item => item.id.toString()}
    renderItem={({ item }) => <PostCard
        item={item}
        currentUser={profile}
        router={router}
    />}
    onEndReached={getPosts}
    onEndReachedThreshold={0.5}
    ListEmptyComponent={<Text style={localStyles.noPosts}>No posts yet. Create the first one!</Text>}
    ListFooterComponent={  // FIXED: only one definition, shows loading or end message
        <Text style={{ textAlign: 'center', padding: 20, color: theme.colors.onSecondary }}>
            {hasMore ? 'Loading more...' : 'No more posts to load'}
        </Text>
    }
    ListFooterComponentStyle={{ marginBottom: 80 }} // FIXED: only one definition
/>
    
      <HomeBar active="feed" />
    </View>
    </ScreenWrapper>
  )
}

export default feed

const localStyles = StyleSheet.create({
  listStyle: {
    paddingTop: 20,
    paddingHorizontal: wp(4),
  },
  noPosts: {
    fontSize: hp(2.2),
    textAlign: 'center',
    color: theme.colors.onSecondary
  },
  icons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 18,
  }
})
