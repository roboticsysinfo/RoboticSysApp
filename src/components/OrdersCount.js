import React, { useEffect } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { COLORS } from '../../theme';
import appLogo from "../assets/kg-logo.jpg"
import HomeWeatherCard from './weather/HomeWeatherCard';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

const OrdersCounts = () => {

    const navigation = useNavigation();
    const { t, i18n } = useTranslation();
    const language = useSelector((state) => state.language.language);


    // Assuming your orders slice is named "requestOrder" and contains an array "orders"
    const { requests: orders, loading, error } = useSelector((state) => state.requestOrder);
    const { weatherData, } = useSelector(state => state.weather);

    const currentTemp = weatherData?.main?.temp;
    const feelsLike = weatherData?.main?.feels_like;
    const condition = weatherData?.weather?.[0]?.main;
    const icon = weatherData?.weather?.[0]?.icon;
    const cityName = weatherData?.name;

    // Calculate counts based on order status
    const pendingCount = orders.filter(order => order.status === 'pending').length;
    const acceptedCount = orders.filter(order => order.status === 'accepted').length;
    const cancelledCount = orders.filter(order => order.status === 'cancelled').length;

    // Update language
    useEffect(() => {
        i18n.changeLanguage(language);
    }, [language]);

    return (

        <View style={styles.ordersInfocontainer}>

            {/* Background Logo */}
            <Image
                source={appLogo} // ✅ Update with your logo path
                style={styles.backgroundLogo}
                resizeMode="contain"
            />

            <Card style={styles.card}>
                <Card.Content>
                    <Text style={styles.title}>{t("pendingOrders")}</Text>
                    <Text style={[styles.count, styles.pending]}>{pendingCount}</Text>
                </Card.Content>
            </Card>

            <Card style={styles.card}>
                <Card.Content>
                    <Text style={styles.title}>{t("acceptedOrders")}</Text>
                    <Text style={[styles.count, styles.accepted]}>{acceptedCount}</Text>
                </Card.Content>
            </Card>

            <Card style={styles.card}>
                <Card.Content>
                    <Text style={styles.title}>{t("cancelledOrders")}</Text>
                    <Text style={[styles.count, styles.cancelled]}>{cancelledCount}</Text>
                </Card.Content>
            </Card>


            <HomeWeatherCard
                location={cityName}
                temperature={currentTemp}
                weatherIcon={icon}
                onPress={() => navigation.navigate(t("Weather"))}
            />


        </View>

    );
};

const styles = StyleSheet.create({

    backgroundLogo: {
        ...StyleSheet.absoluteFillObject,
        opacity: 0.2,
        zIndex: -1,
        alignSelf: 'center',
        justifyContent: "center",
        width: '100%', // Adjust size as needed
        height: '100%',
        left: 15,
        top: 30
    },
    ordersInfocontainer: {
        padding: 20,
        flexDirection: "row",
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexWrap: "wrap",
        position: 'relative', // Important to allow absolute image behind
    },

    card: {
        width: 150,
        marginVertical: 5,
        padding: 5,
        alignItems: 'center',
        justifyContent: "center",
        elevation: 3,
        borderRadius: 4,
        backgroundColor: "#fff",
        margin: 5
    },
    title: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    pending: { color: 'orange' },
    cancelled: { color: 'red' },
    accepted: { color: 'green' },
    count: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.primaryColor,
    },

});

export default OrdersCounts;
