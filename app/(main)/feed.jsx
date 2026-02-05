import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import HomeBar from '@/components/HomeBar'
import { styles } from 'constants/theme'

const feed = () => {
  return (
    <View style={styles.container}>
      <Text>feed</Text>
      <HomeBar active="feed" />
    </View>
  )
}

export default feed

