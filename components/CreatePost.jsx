import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Pressable, Image } from 'react-native'
import React, {useRef, useState} from 'react'
import LogoHeader from './LogoHeader'
import { theme } from "@/constants/theme";
import { wp, hp } from '@/helpers/common';
import Avatar from './Avatar';
import { useAuth } from '@/contexts/AuthContext';
import RichTextEditor from './RichTextEditor';
import {useRouter} from 'expo-router'
import Icon from "@/assets/icons";
import { Button, ButtonText } from "@/components/ui/button";
import * as ImagePicker from 'expo-image-picker'
import getSupabaseFileUrl from '../services/imageService'
import  {Video} from 'expo-av'
import { createOrUpdatePost } from '@/services/postService';


const CreatePost = () => {
    const {user, userData} = useAuth();
    const profile = userData?.data ?? userData ?? {};
    console.log("Rendering profile for user:", profile);
    const bodyRef = useRef("");
    const editorRef = useRef("");
    const router = useRouter();
    const [file, setFile] = useState(file);

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
        if (!file) return normalizeFillMode;
        if(isLocalFile(file)){
            return file.uri;
        }
        return getSupabaseFileUrl(file)?.uri;
    }

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
                            <Text style={styles.publicText}>
                                Public
                            </Text>
                        </View>
                </View>
                <Pressable className="w-full" style={styles.button} onPress={onSubmit}>
                    <Text style={styles.buttonText}>Post</Text>
                </Pressable>
                <View style={styles.textEditor}>
                    <View style={styles.media}>
                        <Text style={styles.addImageText}>Add To Your Post</Text>
                        <View style={styles.mediaIcons}>
                            <TouchableOpacity onPress={()=> onPick(true)}>
                                <Icon name="image" size={30} color={theme.colors.onSecondary}/>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=> onPick(false)}>
                                <Icon name="video" size={33} color={theme.colors.onSecondary}/>
                            </TouchableOpacity>
                        </View>
                    </View>
                    {
                            file && (
                                <View style={styles.file}>
                                    {
                                        getFileType(file) == 'video'? (
                                            <Video
                                                source={{uri: getFileUri(file)}}
                                                style={{flex:1}}
                                                resizeMode='cover'
                                                useNativeControls
                                                isLooping
                                            />
                                        ):(
                                            <Image 
                                                source={{uri: getFileUri(file)}}
                                                resizeMode='cover'
                                                style={{flex:1}}
                                            />
                                        )
                                    }

                                    <Pressable onPress={()=> setFile(null)} style={styles.closeIcon}>
                                        <Icon name="delete" size={25} color={theme.colors.onPrimary}/>
                                    </Pressable>
                                </View>
                            )
                        }
                    <RichTextEditor editorRef={editorRef} onChange={body=> bodyRef.current = body} />
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
        borderColor: theme.colors.surface,
        marginBottom: hp(3),
    },
    username: {
        fontSize: hp(2.2),
        fontWeight: theme.fonts.semibold,
        color: theme.colors.onSecondary,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    publicText: {
        fontSize: hp(1.7),
        fontWeight: theme.fonts.medium,
        color: theme.colors.secondary
    },
    addImageText: {
        fontSize: hp(2),
        fontWeight: theme.fonts.semibold,
        color: theme.colors.onSecondary
    },
    mediaIcons: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15
    },
    button: {
        backgroundColor: "#8331d1",
        paddingVertical: hp(1.5),
        paddingHorizontal: wp(5),
        borderRadius: 8,
    },
    buttonText: {
      color: "#fdfcff",
      fontSize: 16,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    file: {
        height: hp(30),
        width: '100%',
        borderRadius: theme.radius.lg,
        overflow: 'hidden',
        borderCurve: 'continuous',
    },
    closeIcon: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'rgba(255,0,0, 0.5)',
        padding: 7,
        borderRadius: 50,
    },
})