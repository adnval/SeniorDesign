import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import HomeBar from '@/components/HomeBar'
import { styles } from 'constants/theme'
import ScreenWrapper from '@/components/ScreenWrapper'
import LogoHeader from '@/components/LogoHeader'

const feed = () => {
  return (
    <ScreenWrapper bg="white">
      <LogoHeader title="Feed"/>
    <View style={styles.container}>
      <Text>feed</Text>
      <HomeBar active="feed" />
    </View>
    </ScreenWrapper>
  )
}

export default feed

