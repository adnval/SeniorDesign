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

var limit = 0;
const feed = () => {
  const {user, userData} = useAuth();
  const profile = userData?.data ?? userData ?? {};
  const router = useRouter();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    getPosts();
  }, [])

  const getPosts = async () => {
    console.log('Fetching posts for feed...');
    limit = limit + 10;
    let res = await fetchPosts(limit);
    if (res.success){
      console.log('Posts fetched successfully: ', res.data);
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
        keyExtractor={item=> item.id.toString()}
        renderItem={({item})=> <PostCard
          item={item}
          currentUser={profile}
          router={router}
          />}
          ListFooterComponent={
            <View style={{marginVertical: 60}}>
            </View>
          }
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
