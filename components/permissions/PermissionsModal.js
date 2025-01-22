import { Linking, Modal, Pressable, StyleSheet, Text, View } from 'react-native';

export default function PermissionsModal({ isvisible, permissions, closeModal }) {
    const openSettings = () => {
        Linking.openSettings();
        closeModal();
    };

    return (
        <Modal transparent animationType="slide" visible={isvisible}>
            <View style={styles.container}>
                <Text style={styles.modalTitle}>L'application a besoin d'accdéder aux éléments suivants</Text>
                <View>
                    {permissions?.map((permission, index) => (
                        <Text key={index} style={styles.permissionText}>
                            {permission}
                        </Text>
                    ))}
                </View>
                <View style={styles.btnContainer}>
                    <Pressable style={[styles.btn, styles.cancelBtn]} onPress={closeModal}>
                        <Text style={styles.btnText}>Annuler</Text>
                    </Pressable>
                    <Pressable style={[styles.btn, styles.okBtn]} onPress={openSettings}>
                        <Text style={styles.btnText}>OK</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        minHeight: 260,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        backgroundColor: '#fff',
        padding: 24,
    },
    modalTitle: {
        textAlign: 'center',
        fontSize: 20,
        marginBottom: 16,
        fontWeight: '600',
    },
    permissionText: {
        fontSize: 18,
        marginBottom: 8,
        fontWeight: '600',
    },
    btnContainer: {
        flexDirection: 'row',
        width: '100%',
        height: 60,
        justifyContent: 'space-evenly',
        marginVertical: 36,
    },
    btn: {
        width: 120,
        height: '100%',
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelBtn: {
        backgroundColor: 'grey',
    },
    okBtn: {
        backgroundColor: 'black',
    },
    btnText: {
        fontSize: 24,
        fontWeight: '700',
        color: '#fff',
    },
});
