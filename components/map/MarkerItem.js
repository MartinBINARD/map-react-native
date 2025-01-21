import { Image, StyleSheet } from 'react-native';

export default function MarkerItem({ isDragging }) {
    return (
        <Image
            style={[styles.image, { borderColor: isDragging ? '#8a00c9' : '#fff' }]}
            source={{
                uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUqNqnr8-J5enuQU81PuPhc_qIMSi9cIDXlQ&s',
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
