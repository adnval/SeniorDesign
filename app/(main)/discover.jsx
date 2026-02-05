import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import HomeBar from '@/components/HomeBar'
import { styles } from 'constants/theme'


const discover = () => {
  return (
    <View style={styles.container}>
      <Text>discover</Text>
        <HomeBar active="discover" />
    </View>
  )
}

export default discover
