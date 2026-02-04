import { StyleSheet, Text, TextInput, View } from 'react-native'
import React from 'react'
import ScreenWrapper from 'components/ScreenWrapper'
import Home from 'assets/icons/Home'
import Icon from 'assets/icons'
import { StatusBar } from 'expo-status-bar'
import BackButton from 'components/BackButton'
import { styles } from 'constants/theme'
import { useRouter } from 'expo-router'

const Login = () => {
    const router = useRouter();
    return (
        <ScreenWrapper bg="white">
        <StatusBar style="dark" />
        <View style={styles.container}>
            <BackButton router={router}/>
            <View style={styles.container}>
                <Text>Welcome Back</Text>
            </View>
            <View style={styles.centeredContainer}>
                <Text>Please Login to continue</Text>
                <TextInput />
            </View>
        </View>
        </ScreenWrapper>
    )
}

export default Login

