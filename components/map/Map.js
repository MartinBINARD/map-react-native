import { useState } from 'react';
import { StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import MarkerItem from './MarkerItem';

export default function Map() {
    const initialRegion = {
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    };

    const [markers, setMarkers] = useState([
        {
            coordinate: {
                latitude: 37.78825,
                longitude: -122.4324,
            },
            isDragging: false,
        },
    ]);

    const addMarker = (event) => {
        const { coordinate } = event.nativeEvent;
        setMarkers((current) => [
            ...current,
            {
                coordinate: coordinate,
                isDragging: false,
            },
        ]);
    };

    const dragStartHandler = (index) => () => {
        const markersCopy = [...markers];
        markersCopy[index].isDragging = true;
        setMarkers(markersCopy);
    };

    const dragEndHandler = (index) => () => {
        const markersCopy = [...markers];
        markersCopy[index].isDragging = false;
        setMarkers(markersCopy);
    };

    return (
        <MapView style={styles.map} initialRegion={initialRegion} zoomControlEnabled onPress={addMarker}>
            {markers.map((marker, index) => (
                <Marker
                    key={index}
                    coordinate={marker.coordinate}
                    draggable
                    isPreselected
                    stopPropagation
                    onDragStart={dragStartHandler(index)}
                    onDragEnd={dragEndHandler(index)}
                >
                    <MarkerItem isDragging={marker.isDragging} />
                </Marker>
            ))}
        </MapView>
    );
}

export const styles = StyleSheet.create({
    map: {
        width: '100%',
        height: '100%',
    },
});
