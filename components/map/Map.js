import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { getAllMarkers, insertMarker, removeMarker } from '../../utils/database';
import PermissionsModal from '../permissions/PermissionsModal';
import FullPicture from '../picture/FullPicture';
import PictureButton from '../picture/PictureButton';
import LocationButton from './LocationButton';
import MarkerItem from './MarkerItem';

export default function Map({ isDbInitialized }) {
    const [selectedPicture, setSelectedPicture] = useState({ id: undefined, uri: undefined });
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

    const [markers, setMarkers] = useState([]);

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
                const newMarkerId = await insertMarker({ coordinate, imageSource: result.assets[0].uri });
                setMarkers((current) => [
                    ...current,
                    {
                        id: newMarkerId,
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

    const dragStartHandler = (id) => () => {
        const markersCopy = [...markers];
        markersCopy.find((el) => el.id === id).isDragging = true;
        setMarkers(markersCopy);
    };

    const dragEndHandler = (id) => async (event) => {
        updateMarkerCoordinate({
            id,
            coordinate: event.nativeEvent.coordinate,
        });
        const markersCopy = [...markers];
        markersCopy.find((el) => el.id === id).isDragging = false;
        setMarkers(markersCopy);
    };

    const closePermissionsModal = () => {
        setMissingPermissions([]);
    };

    const displayFullPictureModal = (id, imageSource) => () => {
        setSelectedPicture({ id: id, uri: imageSource });
        ScreenOrientation.unlockAsync();
    };

    const closeFullPictureModal = () => {
        setSelectedPicture({ index: undefined, uri: undefined });
        ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    };

    const deleteMarker = (id) => () => {
        removeMarker({ id });
        const markersCopy = markers.filter((el) => el.id !== id);
        setMarkers(markersCopy);
        closeFullPictureModal();
    };

    useEffect(() => {
        if (isDbInitialized) {
            getAllMarkers().then((res) => {
                setMarkers(
                    res.map((marker) => {
                        return {
                            id: marker.id,
                            coordinate: {
                                latitude: marker.latitude,
                                longitude: marker.longitude,
                            },
                            imageSource: marker.imageSource,
                            isDragging: false,
                        };
                    }),
                );
            });
        }
    }, [isDbInitialized]);

    return (
        <>
            <MapView ref={mapRef} showsUserLocation style={styles.map} initialRegion={initialRegion} zoomControlEnabled onPress={addMarker}>
                {markers?.map((marker, index) => (
                    <Marker
                        key={index}
                        coordinate={marker.coordinate}
                        draggable
                        isPreselected
                        stopPropagation
                        onDragStart={dragStartHandler(marker.id)}
                        onDragEnd={dragEndHandler(marker.id)}
                        onPress={displayFullPictureModal(marker.id, marker.imageSource)}
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
            <FullPicture
                isVisible={!!selectedPicture.id}
                closeModal={closeFullPictureModal}
                deleteMarker={deleteMarker(selectedPicture.id)}
                imageSource={selectedPicture.uri}
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
