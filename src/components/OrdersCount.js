import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { COLORS } from '../../theme';
import appLogo from "../assets/kg-logo.jpg"

const OrdersCounts = () => {

    // Assuming your orders slice is named "requestOrder" and contains an array "orders"
    const { requests: orders, loading, error } = useSelector((state) => state.requestOrder);

    // Calculate counts based on order status
    const pendingCount = orders.filter(order => order.status === 'pending').length;
    const acceptedCount = orders.filter(order => order.status === 'accepted').length;
    const cancelledCount = orders.filter(order => order.status === 'cancelled').length;

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
                    <Text style={styles.title}>Pending Orders</Text>
                    <Text style={[styles.count, styles.pending]}>{pendingCount}</Text>
                </Card.Content>
            </Card>

            <Card style={styles.card}>
                <Card.Content>
                    <Text style={styles.title}>Accepted Orders</Text>
                    <Text style={[styles.count, styles.accepted]}>{acceptedCount}</Text>
                </Card.Content>
            </Card>

            <Card style={styles.card}>
                <Card.Content>
                    <Text style={styles.title}>Cancelled Orders</Text>
                    <Text style={[styles.count, styles.cancelled]}>{cancelledCount}</Text>
                </Card.Content>
            </Card>

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
