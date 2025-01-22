import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { StyleSheet, TouchableOpacity } from 'react-native';

export default function LocationButton({ onPress }) {
    return (
        <TouchableOpacity activeOpacity={0.8} style={styles.btnContainer} onPress={onPress}>
            <FontAwesome5 name="location-arrow" size={30} color="#4275f4" />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    btnContainer: {
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 99,
    },
});
