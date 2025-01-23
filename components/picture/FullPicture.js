import EvilIcons from '@expo/vector-icons/EvilIcons';
import { StatusBar } from 'expo-status-bar';
import { Image, Modal, Platform, Pressable, StyleSheet } from 'react-native';

export default function FullPicture({ isVisible, closeModal, imageSource, deleteMarker }) {
    return (
        <>
            <StatusBar style="light" />
            <Modal visible={isVisible} animationType="fade" statusBarTranslucent>
                <Pressable style={styles.container} onPress={closeModal}>
                    <Image style={styles.image} resizeMode="contain" source={{ uri: imageSource }} />
                    <Pressable style={styles.btnContainer}>
                        <EvilIcons name="trash" size={30} color="grey" onPress={deleteMarker} style={styles.trashIcon} />
                    </Pressable>
                </Pressable>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'black',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    btnContainer: {
        position: 'absolute',
        bottom: 30,
        left: '50%',
        transform: [{ translateX: -25 }],
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 99,
    },
    trashIcon: {
        marginBottom: Platform.select({ android: 4 }),
    },
});
