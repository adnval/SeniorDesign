import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import HomeBar from '@/components/HomeBar'
import { styles } from 'constants/theme'
import ScreenWrapper from '@/components/ScreenWrapper'
import LogoHeader from '@/components/LogoHeader'


const discover = () => {
  return (
    <ScreenWrapper bg="white">
      <LogoHeader title="Discover"/>
    <View style={styles.container}>
      <Text>discover</Text>
        <HomeBar active="discover" />
    </View>
    </ScreenWrapper>
  )
}

export default discover
