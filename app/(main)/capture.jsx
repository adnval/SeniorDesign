import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import HomeBar from '@/components/HomeBar'
import { styles } from 'constants/theme'


const capture = () => {
  return (
    <View style={styles.container}>
      <Text>capture</Text>
      <HomeBar active="capture" />
    </View>
  )
}

export default capture
