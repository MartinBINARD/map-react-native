import { useDrizzleStudio } from 'expo-drizzle-studio-plugin';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Map from './components/map/Map';
import { db, initDatabase } from './utils/database';

export default function App() {
    useDrizzleStudio(db);
    const [isDbInitialized, setIsDbInitialized] = useState(false);

    useEffect(() => {
        initDatabase().then(() => setIsDbInitialized(true));
    }, []);

    return (
        <View style={styles.container}>
            <Map isDbInitialized={isDbInitialized} />
            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
