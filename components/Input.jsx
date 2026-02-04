import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Input = (props) => {
  return (
    <View style={[styles.container, props.containerStyles]}>
        {
            props.icon && props.icon
        }
      <TextInput 
        style={{flex: 1}} 
        placeholder={props.placeholder}
        value={props.value}
        onChangeText={props.onChangeText}
        placeholderTextColor={theme.colors.accent}
      />
    </View>
  )
}

export default Input

const styles = StyleSheet.create({})