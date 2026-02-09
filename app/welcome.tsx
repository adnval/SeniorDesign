import { View, Text, Image, Pressable } from 'react-native'
import React from 'react'
import ScreenWrapper from 'components/ScreenWrapper'
import { StatusBar } from 'expo-status-bar'
import { hp, wp } from 'helpers/common'
import Button from 'components/Button'
import { styles } from 'constants/theme'
import { useRouter } from 'expo-router'

const welcome = () => {
    const router = useRouter();
  return (
    <ScreenWrapper bg="white">
      <StatusBar style="dark" />
      <View style={styles.centeredContainer}>
        <View style={styles.middleContent}>
            <View>  
              <Image style={styles.welcomeImage} resizeMode="contain" source={require('../assets/images/locale.png')} />
              <Text style={styles.subtitle}>Discover art where art lives.</Text>
            </View>
            <View style={styles.footer}>
                <Button buttonStyle={styles.button} textStyle={styles.buttonText} title="Get Started" 
                onPress={() => router.push('/SignUp')}/>
                <View style={styles.bottomTextContainer}>
                    <Text style={styles.secondaryText}>Already have an account?</Text>
                    <Pressable onPress={() => router.push('/login')}>
                        <Text style={styles.primaryText}>Sign In</Text>
                    </Pressable>
                </View>
            </View>
        </View>
      </View>
    </ScreenWrapper>
  )
}

export default welcome
