import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Pressable, Image } from 'react-native'
import React, {useRef, useState} from 'react'
import LogoHeader from '@/components/LogoHeader'
import { theme } from "@/constants/theme";
import { wp, hp } from '@/helpers/common';
import Avatar from '@/components/Avatar';
import { useAuth } from '@/contexts/AuthContext';
import RichTextEditor from '@/components/RichTextEditor';
import {useRouter} from 'expo-router'
import Icon from "@/assets/icons";
import { Button, ButtonText } from "@/components/ui/button";
import * as ImagePicker from 'expo-image-picker'
import getSupabaseFileUrl from '@/services/imageService'
import  {Video} from 'expo-av'
import { createOrUpdatePost } from '@/services/postService';
import { getUserImageSrc } from '@/services/imageService';
import { SafeAreaView } from 'react-native-safe-area-context';
import HomeBar from '@/components/HomeBar';
import ScreenWrapper from '@/components/ScreenWrapper';

import { useLocalSearchParams } from 'expo-router';

const CreatePost = () => {
    const { uri } = useLocalSearchParams();
    const {user, userData} = useAuth();
    const profile = userData?.data ?? userData ?? {};
    const bodyRef = useRef("");
    const editorRef = useRef("");
    const router = useRouter();
    
    // Initialize file from the captured photo URI if provided
    const [file, setFile] = useState(uri ? { uri, type: 'image' } : null);

    const onPick = async (isImage)=>{
        let mediaConfig = {
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4,3],
            quality: 0.7,
        }
        if (!isImage){
            mediaConfig = {
                mediaTypes: ImagePicker.MediaTypeOptions.Videos,
                allowsEditing: true
            }
        }
        let result = await ImagePicker.launchImageLibraryAsync(mediaConfig);
        console.log('file: ', result.assets[0])
        if (!result.canceled){
            setFile(result.assets[0]);
        }
    }

    const onSubmit = async () => {
        console.log('Submitting post with body: ', bodyRef.current, ' and file: ', file);
        if (!bodyRef.current && !file) {
            alert('Please add a caption and media to your post before submitting.');
            return;
        }

        let data = {
            image: file,
            caption: bodyRef.current,
            userId: user?.id,
        }

        // create post
        let response =  await createOrUpdatePost(data);
        console.log('Create post response: ', response);
        if(response.success){
            alert('Post created successfully!');
            router.replace('/home');
        } else {
            alert(response.msg || 'Error creating post. Please try again.');
        }
    }

    const isLocalFile = file=>{
        if (!file) return null;
        if(typeof file =='object') return true;
        return false;
    }
    const getFileType = file =>{
        if(!file) return null;
        if(isLocalFile(file)){
            return file.type;
        }
        //check image or video for remote file
        if(file.includes('postImage')){
            return 'image';
        }
        return 'video';
    }
    const getFileUri = file=>{
        console.log('Getting file URI for file: ', file);
        if (!file) return null;
        if(isLocalFile(file)){
            console.log('File is local, returning URI: ', file.uri);
            return file.uri;
        }
        console.log('File is remote, constructing Supabase URL');
        return getSupabaseFileUrl(file)?.uri;
    }


 return (
    <ScreenWrapper bg="white">
    <View style={styles.container}>
        <LogoHeader title="Create Post"/>
        <ScrollView 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
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

            <View style={styles.textEditor}>
                <RichTextEditor editorRef={editorRef} onChange={body => bodyRef.current = body} />
            </View>

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
            <Pressable style={styles.button} onPress={onSubmit}>
                <Text style={styles.buttonText}>Post</Text>
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
        height: hp(50),
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
    textEditor: {
        minHeight: hp(15),
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
    buttonText: {
        color: theme.colors.onPrimary,
        fontSize: hp(1.9),
        fontWeight: theme.fonts.semibold,
        letterSpacing: 0.3,
    },
})