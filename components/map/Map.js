import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import PermissionsModal from '../permissions/PermissionsModal';
import PictureButton from '../picture/PictureButton';
import LocationButton from './LocationButton';
import MarkerItem from './MarkerItem';

export default function Map() {
    const [missingPermissions, setMissingPermissions] = useState([]);
    const mapRef = useRef();
    const [libraryStatus, requestLibraryPermission] = ImagePicker.useMediaLibraryPermissions();
    const [locationStatus, requestLocationPermission] = Location.useForegroundPermissions();

    const getUserLocation = async () => {
        let status = locationStatus;
        if (!status?.granted) {
            status = await requestLocationPermission();
        }
        if (status?.granted) {
            const position = await Location.getCurrentPositionAsync();
            mapRef.current?.animateToRegion(
                {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    latitudeDelta: 0.3,
                    longitudeDelta: 0.15,
                },
                2000,
            );
        } else {
            setMissingPermissions(['Votre localisation']);
        }
    };

    useEffect(() => {
        getUserLocation();
    }, []);

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
            imageSource: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUqNqnr8-J5enuQU81PuPhc_qIMSi9cIDXlQ&s',
        },
    ]);

    const addMarker = async (event) => {
        event.persist();
        let status = libraryStatus;
        if (!status?.granted) {
            status = await requestLibraryPermission();
        }

        if (status?.granted) {
            const result = await ImagePicker.launchImageLibraryAsync({ quality: 0.5 });
            console.log(result);
            if (!result.canceled) {
                const { coordinate } = event.nativeEvent;
                setMarkers((current) => [
                    ...current,
                    {
                        coordinate: coordinate,
                        isDragging: false,
                        imageSource: result.assets[0].uri,
                    },
                ]);
            }
        } else {
            setMissingPermissions(["Votre galerie d'images"]);
        }
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

    const closePermissionsModal = () => {
        setMissingPermissions([]);
    };

    return (
        <>
            <MapView ref={mapRef} showsUserLocation style={styles.map} initialRegion={initialRegion} zoomControlEnabled onPress={addMarker}>
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
                        <MarkerItem isDragging={marker.isDragging} imageSource={marker.imageSource} />
                    </Marker>
                ))}
            </MapView>
            <View style={styles.btnContainer}>
                <LocationButton onPress={getUserLocation} />
                <PictureButton setMarkers={setMarkers} setMissingPermissions={setMissingPermissions} />
                <View style={{ width: 60 }} />
            </View>
            <PermissionsModal
                closeModal={closePermissionsModal}
                permissions={missingPermissions}
                isvisible={missingPermissions.length > 0}
            />
        </>
    );
}

export const styles = StyleSheet.create({
    map: {
        width: '100%',
        height: '100%',
    },
    btnContainer: {
        position: 'absolute',
        bottom: 30,
        left: 40,
        right: 40,
        height: 60,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});
