import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { styles } from 'constants/theme'

const Button = ({
    buttonStyle,
    textStyle,
    title,
    onPress=() => {},
    loading=false,
    hasShadow=true,
}) => {

  if(loading){
    return (
      <View style={[styles.button, buttonStyle, styles.shadowStyle, {backgroundColor: 'white'}]}>
      </View>
    )
  }
    
  return (
    <Pressable onPress={onPress} style={[styles.button, buttonStyle, hasShadow && styles.shadowStyle]}>
        <Text style={[textStyle]}>{title}</Text>
    </Pressable>
  )
}

export default Button
