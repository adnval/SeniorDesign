import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { theme } from "@/constants/theme";
import {RichToolbar, actions, RichEditor} from 'react-native-pell-rich-editor'

const RichTextEditor = ({
    editorRef,
    onChange
}) => {
  return (
    <View style={{minHeight: 285}}>
        <RichToolbar
            actions={[
                actions.setBold,
                actions.setItalic,
                actions.insertBulletsList,
                actions.insertOrderedList,
                actions.insertLink,
                actions.keyboard,
                actions.setStrikethrough,
                actions.setUnderline,
                actions.checkboxList,
            ]}
            style={styles.richBar}
            flatContainerStyle={styles.flatStyle}
            editor={editorRef}
            disabled={false}
            selectedIconTint={theme.colors.primary}
        />
        <RichEditor
            ref={editorRef}
            containerStyle={styles.rich}
            editorStyle={styles.contentStyle}
            placeholder={"What's on your mind?"}
            onChange={onChange}
        />
    </View>
  )
}

export default RichTextEditor

const styles = StyleSheet.create({
    richBar: {
        borderTopRightRadius: theme.radius.lg,
        borderTopLeftRadius: theme.radius.lg,
        backgroundColor: theme.colors.secondary,
    },
    rich: {
        minHeight: 240,
        flex: 1,
        borderWidth: 1.5,
        borderTopWidth: 0,
        borderBottomLeftRadius: theme.radius.lg,
        borderBottomRightRadius: theme.radius.lg,
        borderColor: theme.colors.surface,
        padding: 5,

    },
    contentStyle: {
        color: theme.colors.onSecondary,
        placeholderColor: theme.colors.surface

    },
    flatStyle: {
        paddingHorizontal: 8,
        gap: 4,
    }
})