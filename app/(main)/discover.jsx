import { StyleSheet, View, Text, TouchableOpacity, Image, ActivityIndicator } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import * as Location from 'expo-location'
import { fetchPosts, getPostCoords, parseWKBPoint } from '../../services/postService'
import { getSupabaseFileUrl } from '../../services/imageService'
import { theme } from '../../constants/theme'
import { hp, wp } from '../../helpers/common'
import ScreenWrapper from '../../components/ScreenWrapper'
import HomeBar from '../../components/HomeBar'
import LogoHeader from '../../components/LogoHeader'
import { useRouter } from 'expo-router'
import Avatar from '../../components/Avatar'

const DEFAULT_LOCATION = { latitude: 40.7128, longitude: -74.0060 } // NYC fallback

const MapScreen = () => {
    const router = useRouter()
    const mapRef = useRef(null)
    const [posts, setPosts] = useState([])
    const [userLocation, setUserLocation] = useState(null)
    const [loading, setLoading] = useState(true)
    const [selectedPost, setSelectedPost] = useState(null)

    useEffect(() => {
        init()
    }, [])

    const init = async () => {
        await Promise.all([getUserLocation(), loadPosts()])
        setLoading(false)
    }

    const getUserLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync()
        if (status !== 'granted') {
            setUserLocation(DEFAULT_LOCATION)
            return
        }
        let loc = await Location.getCurrentPositionAsync({})
        setUserLocation({
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
        })
    }

    const loadPosts = async () => {
        let res = await fetchPosts(1000)
        if (res.success) {
            console.log('Total posts fetched: ', res.data.length)
            console.log('Posts with location: ', res.data.filter(p => p.location?.coordinates).length)
            console.log('Sample post locations: ', res.data.slice(0, 3).map(p => ({
                id: p.id,
                location: p.location,
                hasCoords: !!p.location?.coordinates
            })))
            const postsWithLocation = res.data.filter(p => {
                const coords = parseWKBPoint(p.location)
                console.log('Post', p.id, '- parsed coords:', coords)
                return coords !== null
            })
            setPosts(postsWithLocation)
        }
    }

    const centerOnUser = () => {
        if (!userLocation || !mapRef.current) return
        mapRef.current.animateToRegion({
            ...userLocation,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
        }, 600)
    }

  const centerOnNearestPost = () => {
      if (!userLocation || posts.length === 0 || !mapRef.current) return

      const nearest = posts.reduce((closest, post) => {
          const coords = getPostCoords(post)
          if (!coords) return closest
          const dist = Math.abs(coords.latitude - userLocation.latitude) + Math.abs(coords.longitude - userLocation.longitude)
          const closestCoords = getPostCoords(closest)
          const closestDist = Math.abs(closestCoords.latitude - userLocation.latitude) + Math.abs(closestCoords.longitude - userLocation.longitude)
          return dist < closestDist ? post : closest
      })

      const coords = getPostCoords(nearest)
      setSelectedPost(nearest)
      mapRef.current.animateToRegion({
          latitude: coords.latitude,
          longitude: coords.longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
      }, 600)
  }

    const openPost = (post) => {
        router.push({
            pathname: '/(main)/postDetails',
            params: { postId: post.id }
        })
    }

    if (loading) {
        return (
            <ScreenWrapper bg="white">
                <LogoHeader title="Map" />
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                </View>
                <HomeBar active="map" />
            </ScreenWrapper>
        )
    }

    return (
        <ScreenWrapper bg="white">
            <LogoHeader title="Map" />
            <View style={styles.container}>
                <MapView
                    ref={mapRef}
                    style={styles.map}
                    provider={PROVIDER_GOOGLE}
                    initialRegion={{
                        ...(userLocation || DEFAULT_LOCATION),
                        latitudeDelta: 0.08,
                        longitudeDelta: 0.08,
                    }}
                    showsUserLocation
                    showsMyLocationButton={false}
                >
                    {posts.map(post => {
                        const coords = getPostCoords(post)
                        if (!coords) return null
                        const isSelected = selectedPost?.id === post.id
                        return (
                            <Marker
                                key={post.id}
                                coordinate={coords}
                                onPress={() => setSelectedPost(isSelected ? null : post)}
                            >
                                <View style={[styles.markerShadow, isSelected && styles.markerSelected]}>
                                    <View style={styles.markerInner}>
                                        <Avatar
                                            uri={post.profile?.image}
                                            size={isSelected ? 44 : 36}
                                            rounded={999}
                                        />
                                    </View>
                                </View>
                            </Marker>
                        )
                    })}
                </MapView>

                {/* Center on user button */}
                <TouchableOpacity style={styles.locationButton} onPress={centerOnUser}>
                    <Text style={styles.locationButtonText}>📍</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.locationButton, { bottom: 210 }]} onPress={centerOnNearestPost}>
                    <Text style={styles.locationButtonText}>🗺️</Text>
                </TouchableOpacity>

                {/* Selected post preview card */}
                {selectedPost && (
                    <TouchableOpacity
                        style={styles.previewCard}
                        onPress={() => openPost(selectedPost)}
                        activeOpacity={0.9}
                    >
                        <View style={styles.previewLeft}>
                            <Avatar
                                uri={selectedPost.profile?.image}
                                size={hp(5)}
                                rounded={theme.radius.md}
                            />
                            <View style={styles.previewInfo}>
                                <Text style={styles.previewUsername}>{selectedPost.profile?.username}</Text>
                                <Text style={styles.previewCaption} numberOfLines={1}>
                                    {selectedPost.caption?.replace(/<[^>]*>?/gm, '') || 'No caption'}
                                </Text>
                            </View>
                        </View>
                        {selectedPost.image?.includes('postImages') && (
                            <Image
                                source={getSupabaseFileUrl(selectedPost.image)}
                                style={styles.previewImage}
                            />
                        )}
                    </TouchableOpacity>
                )}
            </View>
            <HomeBar active="discover" />
        </ScreenWrapper>
    )
}

export default MapScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        flex: 1,
    },
    center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    markerContainer: {
        borderWidth: 2.5,
        borderColor: 'white',
        borderRadius: 999,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    markerShadow: {
    borderRadius: 999,
    borderWidth: 2.5,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    },
    markerInner: {
        borderRadius: 999,
        overflow: 'hidden',   // clips avatar to circle without killing the shadow on the outer view
    },
    markerSelected: {
        borderColor: theme.colors.primary,
        borderWidth: 3,
    },
    locationButton: {
        position: 'absolute',
        bottom: 160,
        right: 16,
        backgroundColor: 'white',
        width: 46,
        height: 46,
        borderRadius: 23,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 4,
    },
    locationButtonText: {
        fontSize: 20,
    },
    previewCard: {
        position: 'absolute',
        bottom: 120,
        left: 16,
        right: 16,
        backgroundColor: 'white',
        borderRadius: theme.radius.xl,
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 10,
        elevation: 6,
    },
    previewLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        flex: 1,
    },
    previewInfo: {
        flex: 1,
        gap: 2,
    },
    previewUsername: {
        fontSize: hp(1.8),
        fontWeight: '600',
        color: theme.colors.onSecondary,
    },
    previewCaption: {
        fontSize: hp(1.6),
        color: theme.colors.gray,
    },
    previewImage: {
        width: 52,
        height: 52,
        borderRadius: theme.radius.md,
        marginLeft: 10,
    },
})