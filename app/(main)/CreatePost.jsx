import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Pressable, Image, ActivityIndicator, TextInput } from 'react-native'
import React, {useRef, useState, useEffect} from 'react'
import LogoHeader from '@/components/LogoHeader'
import { theme } from "@/constants/theme";
import { wp, hp } from '@/helpers/common';
import Avatar from '@/components/Avatar';
import { useAuth } from '@/contexts/AuthContext';
import {useRouter} from 'expo-router'
import Icon from "@/assets/icons";
import * as ImagePicker from 'expo-image-picker'
import getSupabaseFileUrl from '@/services/imageService'
import  {Video} from 'expo-av'
import { createOrUpdatePost } from '@/services/postService';
import { SafeAreaView } from 'react-native-safe-area-context';
import HomeBar from '@/components/HomeBar';
import ScreenWrapper from '@/components/ScreenWrapper';
import { useLocalSearchParams } from 'expo-router';
import * as Location from 'expo-location';

const CreatePost = () => {
    const { uri } = useLocalSearchParams();
    const {user, userData} = useAuth();
    const profile = userData?.data ?? userData ?? {};
    const router = useRouter();
    const [caption, setCaption] = useState('');
    const [loading, setLoading] = useState(false);
    const [location, setLocation] = useState(null);
    const [locationName, setLocationName] = useState(null);
    const [file, setFile] = useState(uri ? { uri, type: 'image' } : null);

    useEffect(() => {
        getLocation();
    }, []);

    const getLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            setLocation({ latitude: 40.7128, longitude: -74.0060 });
            setLocationName('New York, NY');
            return;
        }
        let loc = await Location.getCurrentPositionAsync({});
        const coords = { latitude: loc.coords.latitude, longitude: loc.coords.longitude };
        setLocation(coords);

        try {
            let geo = await Location.reverseGeocodeAsync(coords);
            if (geo?.[0]) {
                const { city, region } = geo[0];
                setLocationName([city, region].filter(Boolean).join(', '));
            }
        } catch (e) {
            console.log('Reverse geocode error:', e);
        }
    }

    const onPick = async (isImage) => {
        let mediaConfig = {
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4,3],
            quality: 0.7,
        }
        if (!isImage) {
            mediaConfig = {
                mediaTypes: ImagePicker.MediaTypeOptions.Videos,
                allowsEditing: true
            }
        }
        let result = await ImagePicker.launchImageLibraryAsync(mediaConfig);
        if (!result.canceled && result.assets?.[0]) {
            setFile(result.assets[0]);
        }
    }

    const onSubmit = async () => {
        if (loading) return;
        if (!caption && !file) {
            alert('Please add a caption or media to your post before submitting.');
            return;
        }

        let data = {
            file: file,
            caption: caption,
            userId: user?.id,
            location: location ? `POINT(${location.longitude} ${location.latitude})` : 'POINT(-74.0060 40.7128)',
        }

        setLoading(true);
        let response = await createOrUpdatePost(data);
        setLoading(false);
        if (response.success) {
            alert('Post created successfully!');
            router.replace('/feed');
        } else {
            alert(response.msg || 'Error creating post. Please try again.');
        }
    }

    const isLocalFile = file => {
        if (!file) return null;
        if (typeof file == 'object') return true;
        return false;
    }

    const getFileType = file => {
        if (!file) return null;
        if (isLocalFile(file)) return file.type;
        if (file.includes('postImage')) return 'image';
        return 'video';
    }

    const getFileUri = file => {
        if (!file) return null;
        if (isLocalFile(file)) return file.uri;
        return getSupabaseFileUrl(file)?.uri;
    }

    return (
        <ScreenWrapper bg="white">
            <View style={styles.container}>
                <LogoHeader title="Create Post" showBackButton={true}/>
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.header}>
                        <Avatar
                            uri={profile?.image ?? undefined}
                            size={hp(6.5)}
                            rounded={theme.radius.xl}
                        />
                        <View style={{gap: 3}}>
                            <Text style={styles.username}>
                                {profile && profile.username}
                            </Text>
                            <View style={styles.publicBadge}>
                                <Icon name="user" size={11} color={theme.colors.secondary}/>
                                <Text style={styles.publicText}>Public</Text>
                            </View>
                        </View>
                    </View>

                    <TextInput
                        style={styles.captionInput}
                        placeholder="What's on your mind?"
                        placeholderTextColor={theme.colors.gray}
                        multiline
                        value={caption}
                        onChangeText={setCaption}
                        textAlignVertical="top"
                        blurOnSubmit={false}
                    />

                    {locationName && (
                        <View style={styles.locationCard}>
                            <Icon name="location" size={16} color={theme.colors.primary} strokeWidth={2} />
                            <Text style={styles.locationText}>{locationName}</Text>
                        </View>
                    )}

                    {file && (
                        <View style={styles.file}>
                            {getFileType(file) == 'video' ? (
                                <Video
                                    source={{uri: getFileUri(file)}}
                                    style={{flex: 1}}
                                    resizeMode='cover'
                                    useNativeControls
                                    isLooping
                                />
                            ) : (
                                <Image
                                    source={{uri: getFileUri(file)}}
                                    resizeMode='cover'
                                    style={{flex: 1}}
                                />
                            )}
                            <Pressable onPress={() => setFile(null)} style={styles.closeIcon}>
                                <Icon name="delete" size={20} color="#fff"/>
                            </Pressable>
                        </View>
                    )}

                    <View style={styles.media}>
                        <Text style={styles.addImageText}>Add to your post</Text>
                        <View style={styles.mediaIcons}>
                            <TouchableOpacity style={styles.mediaIconBtn} onPress={() => onPick(true)}>
                                <Icon name="image" size={22} color={theme.colors.onSecondary}/>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.mediaIconBtn} onPress={() => onPick(false)}>
                                <Icon name="video" size={22} color={theme.colors.onSecondary}/>
                            </TouchableOpacity>
                        </View>
                    </View>

                </ScrollView>
                <SafeAreaView edges={['bottom']} style={styles.footer}>
                    <Pressable
                        style={[styles.button, loading && styles.buttonDisabled]}
                        onPress={onSubmit}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator size="small" color={theme.colors.onPrimary} />
                        ) : (
                            <Text style={styles.buttonText}>Post</Text>
                        )}
                    </Pressable>
                </SafeAreaView>
            </View>
            <HomeBar active="capture"/>
        </ScreenWrapper>
    )
}

export default CreatePost

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: wp(4),
    },
    scrollContent: {
        gap: 20,
        paddingBottom: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 4,
    },
    username: {
        fontSize: hp(2),
        fontWeight: theme.fonts.semibold,
        color: theme.colors.onSecondary,
    },
    publicBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: theme.colors.surface,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 20,
        alignSelf: 'flex-start',
    },
    publicText: {
        fontSize: hp(1.5),
        fontWeight: theme.fonts.medium,
        color: theme.colors.secondary,
    },
    captionInput: {
        minHeight: hp(15),
        fontSize: hp(1.9),
        color: theme.colors.onSecondary,
        paddingHorizontal: 2,
        paddingTop: 0,
    },
    file: {
        height: hp(28),
        width: '100%',
        borderRadius: theme.radius.lg,
        overflow: 'hidden',
        borderCurve: 'continuous',
    },
    closeIcon: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'rgba(0,0,0,0.45)',
        padding: 6,
        borderRadius: 50,
    },
    media: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        padding: 12,
        paddingHorizontal: 16,
        borderRadius: theme.radius.lg,
        borderCurve: 'continuous',
        borderColor: theme.colors.surface,
    },
    addImageText: {
        fontSize: hp(1.8),
        fontWeight: theme.fonts.medium,
        color: theme.colors.onSecondary,
    },
    mediaIcons: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    mediaIconBtn: {
        padding: 8,
        borderRadius: theme.radius.md,
        backgroundColor: theme.colors.surface,
    },
    footer: {
        paddingTop: 12,
        paddingBottom: hp(10),
        borderTopWidth: 1,
        borderTopColor: theme.colors.surface,
        backgroundColor: theme.colors.background,
    },
    button: {
        backgroundColor: theme.colors.primary,
        paddingVertical: hp(1.6),
        borderRadius: theme.radius.lg,
        alignItems: 'center',
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    buttonText: {
        color: theme.colors.onPrimary,
        fontSize: hp(1.9),
        fontWeight: theme.fonts.semibold,
        letterSpacing: 0.3,
    },
    locationCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: theme.radius.lg,
        borderCurve: 'continuous',
        borderWidth: 1,
        borderColor: theme.colors.surface,
        backgroundColor: theme.colors.surface,
        alignSelf: 'flex-start',
    },
    locationText: {
        fontSize: hp(1.7),
        color: theme.colors.onSecondary,
        fontWeight: theme.fonts.medium,
    },
})