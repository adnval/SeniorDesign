import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { theme } from 'constants/theme'
import Icon from 'assets/icons'

const BackButton = ({size=26, router, route=""}) => {
  const handlePress = () => {
    if (route) {
      router.push(route);
    } else {
      router.back();
    }
  };
  return (
    <Pressable onPress={handlePress}>
        <Icon name="arrowLeft" strokeWidth={2.5} size={size} color={theme.colors.primary} />
    </Pressable>
  )
}

export default BackButton;