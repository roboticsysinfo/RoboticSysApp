import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { COLORS } from '../../theme';

const OrdersCounts = () => {
    
    // Assuming your orders slice is named "requestOrder" and contains an array "orders"
    const { requests: orders, loading, error } = useSelector((state) => state.requestOrder);

    // Calculate counts based on order status
    const pendingCount = orders.filter(order => order.status === 'pending').length;
    const acceptedCount = orders.filter(order => order.status === 'accepted').length;
    const cancelledCount = orders.filter(order => order.status === 'cancelled').length;

    return (

        <View style={styles.ordersInfocontainer}>
            
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

    ordersInfocontainer: {
        padding: 20,
        flexDirection: "row",
        justifyContent: 'start',
        alignItems: 'center',
        flexWrap: "wrap",
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
    pending: {color: 'orange'},
    cancelled: { color: 'red' },
    accepted: { color: 'green' },
    count: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.primaryColor,
    },

});

export default OrdersCounts;
