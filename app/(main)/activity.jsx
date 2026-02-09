import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { styles } from 'constants/theme'
import HomeBar from '@/components/HomeBar'
import ScreenWrapper from '@/components/ScreenWrapper'
import LogoHeader from '@/components/LogoHeader'

const activity = () => {
  return (
    <ScreenWrapper bg="white">
      <LogoHeader title="Activity"/>
    <View style={styles.container}>
      <Text>activity</Text>
      <HomeBar active="activity" />
    </View>
    </ScreenWrapper>
  )
}

export default activity
