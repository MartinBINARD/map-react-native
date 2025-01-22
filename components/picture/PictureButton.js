import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import * as MediaLibrary from 'expo-media-library';
import { StyleSheet, TouchableOpacity } from 'react-native';

export default function PictureButton({ setMarkers, setMissingPermissions }) {
    const [locationStatus, requestLocationPermission] = Location.useForegroundPermissions();
    const [cameraStatus, requestCameraPermission] = ImagePicker.useCameraPermissions();
    const [libraryStatus, requestLibraryPermission] = MediaLibrary.usePermissions({ granularPermissions: ['photo'] });

    const tackePictureHandler = async () => {
        let locStatus = locationStatus;
        let camStatus = cameraStatus;
        let libStatus = libraryStatus;
        const permissions = [];

        if (!locStatus?.granted) {
            locStatus = await requestLocationPermission();
            if (!locStatus.granted) {
                permissions.push('Votre localisation');
            }
        }
        if (!camStatus?.granted) {
            camStatus = await requestCameraPermission();
            if (!camStatus.granted) {
                permissions.push('Votre appareil photo');
            }
        }
        if (!libStatus?.granted) {
            libStatus = await requestLibraryPermission();
            if (!libStatus.granted) {
                permissions.push("Votre galerie d'images");
            }
        }

        if (locationStatus.granted && camStatus.granted && libStatus.granted) {
            const picture = await ImagePicker.launchCameraAsync();
            if (!picture.canceled) {
                const position = await Location.getCurrentPositionAsync();
                setMarkers((current) => [
                    ...current,
                    {
                        coordinate: {
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                        },
                        isDragging: false,
                        imageSource: picture.assets[0].uri,
                    },
                ]);
                MediaLibrary.saveToLibraryAsync(picture.assets[0].uri);
            }
        } else {
            setMissingPermissions(permissions);
        }
    };

    return (
        <TouchableOpacity onPress={tackePictureHandler} style={styles.btnContainer}>
            <MaterialIcons name="photo-camera" size={30} color="black" />
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
