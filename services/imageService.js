export const getUserImageSrc = imagePath => {
    if (!imagePath) {
        return require('../assets/images/defaultUser.png');
    }
    
    // If it's an object from image picker with a uri property
    if (typeof imagePath === 'object' && imagePath.uri) {
        return { uri: imagePath.uri };
    }
    
    // If it's a string URL
    if (typeof imagePath === 'string') {
        return { uri: imagePath };
    }
    
    // Fallback to default
    return require('../assets/images/defaultUser.png');
}