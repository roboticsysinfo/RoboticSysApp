import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // or any icon library


const HomeWeatherCard = ({ location, temperature, weatherIcon, onPress }) => {

    return (
        <TouchableOpacity onPress={onPress}>

            <View style={styles.container}  >

                
                <View style={styles.rightSection}>
                    <Text style={styles.temperatureText}>{temperature}°C</Text>
                    <Image
                        source={{ uri: `https://openweathermap.org/img/wn/${weatherIcon}@2x.png` }}
                        style={styles.weatherIcon}
                    />
                </View>

                <View style={styles.leftSection}>
                    <Icon name="location-on" size={20} color="#353535" />
                    <Text style={styles.locationText}>{location}</Text>
                </View>

            </View>

        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        borderRadius: 4,
        padding: 10,
        paddingVertical: 10,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3,
        width: 150,
        margin: 5
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    locationText: {
        fontSize: 14,
        fontWeight: 'bold',
        marginLeft: 0,
    },
    rightSection: {
        alignItems: 'center',
    },
    temperatureText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    weatherIcon: {
        width: 42,
        height: 42,
        fontSize: 42,
        marginVertical: 0,
    },
});

export default HomeWeatherCard;
