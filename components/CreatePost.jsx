import { StyleSheet, Text, View, ScrollView } from 'react-native'
import React from 'react'
import LogoHeader from './LogoHeader'
import { theme } from "@/constants/theme";
import { wp, hp } from '@/helpers/common';
import Avatar from './Avatar';
import { useAuth } from '@/contexts/AuthContext';

const CreatePost = () => {
    const {user, userData} = useAuth();
    const profile = userData?.data ?? userData ?? {};
    console.log("Rendering profile for user:", profile);
  return (
    <View>
        <View style={styles.containter}>
            <LogoHeader title="Create Post"/>
            <ScrollView contentContainerStyle={{gap:20}}>
                <View style={styles.header}>
                    <Avatar
                        uri={user?.image}
                        size={hp(6.5)}
                        rounded={theme.radius.xl}
                        />
                        <View style={{gap:2}}>
                            <Text style={styles.username}>
                                {
                                    profile && profile.username
                                }
                            </Text>
                        </View>
                </View>
            </ScrollView>
        </View>
    </View>
  )
}

export default CreatePost

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: 30,
        paddingHorizontal: wp(4),
        gap: 15,
    },
    title: {
        fontSize: hp(2.5),
        fontWeight: theme.fonts.semibold,
        color: theme.colors.primary,
        textAlign: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    imageIcon: {
        borderRadius: theme.radius.md,
    },
    file: {
        height: hp(30),
        width: '100%',
        borderRadius: theme.radius.xl,
        overflow: 'hidden',
        borderCurve: 'continuous'
    },
    closeIcon: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    avatar: {
        height: hp(6.5),
        width: hp(6.5),
        borderRadius: theme.radius.lg,
        borderCurve: 'continuous',
        borderWidth: 1,
        borderColor: theme.colors.surface
    },
    publicText: {
        fontSize: hp(1.7),
        fontWeight: theme.fonts.medium,
        color: theme.colors.secondary

    },
    media: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1.5,
        padding: 12,
        paddingHorizontal: 18,
        borderRadius: theme.radius.lg,
        borderCurve: 'continuous',
        borderColor: theme.colors.surface
    },
    username: {
        fontSize: hp(2.2),
        fontWeifht: theme.colors.semibold,
        color: theme.colors.onSecondary,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    }

})