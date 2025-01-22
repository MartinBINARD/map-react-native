import { Image, StyleSheet } from 'react-native';

export default function MarkerItem({ isDragging, imageSource }) {
    return (
        <Image
            style={[styles.image, { borderColor: isDragging ? '#8a00c9' : '#fff' }]}
            source={{
                uri: imageSource,
            }}
            resizeMode="cover"
        />
    );
}

const styles = StyleSheet.create({
    image: {
        width: 80,
        height: 80,
        borderRadius: 12,
        borderWidth: 4,
    },
});
