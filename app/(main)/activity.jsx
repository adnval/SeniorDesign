import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { styles } from 'constants/theme'
import HomeBar from '@/components/HomeBar'


const activity = () => {
  return (
    <View style={styles.container}>
      <Text>activity</Text>
      <HomeBar active="activity" />
    </View>
  )
}

export default activity
