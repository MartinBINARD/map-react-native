import { StyleSheet } from 'react-native';
import MapView from 'react-native-maps';

export default function Map() {
    const initialRegion = {
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    };
    return <MapView style={styles.map} initialRegion={initialRegion} zoomControlEnabled />;
}

export const styles = StyleSheet.create({
    map: {
        width: '100%',
        height: '100%',
    },
});
