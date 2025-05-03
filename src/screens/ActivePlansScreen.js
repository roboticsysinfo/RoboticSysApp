import React, { useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getActiveFarmerPlan } from '../redux/slices/farmerPlanSlice';
import { ActivityIndicator, Card, Title, Paragraph, Appbar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '../../theme';
import { useNavigation } from '@react-navigation/native';

const ActivePlansScreen = () => {

    const dispatch = useDispatch();
    const navigation = useNavigation();
    const { activePlan, loading, error } = useSelector((state) => state.farmerPlan);
    const { user, farmerDetails } = useSelector((state) => state.auth);
    const farmerId = user.id;

    useEffect(() => {
        dispatch(getActiveFarmerPlan(farmerId));
    }, [farmerId]);

    if (loading) {
        return <ActivityIndicator size={'large'} color={COLORS.primaryColor} style={styles.centered} />;
    }

    if (error) {
        return <Text style={styles.errorText}> {error}</Text>;
    }

    return (

        <>

            <Appbar.Header style={{ backgroundColor: '#0a9e57', }}>
                <Appbar.BackAction onPress={() => navigation.goBack()} color="white" />
                <Appbar.Content title="Your Active Plans" titleStyle={{ color: 'white' }} />
            </Appbar.Header>


            <View style={styles.container}>
                {activePlan ? (

                    <Card style={styles.card}>

                        <Card.Content>

                            <Title style={styles.title}>
                                <Icon name="account-star" size={24} color={COLORS.primaryColor} /> {activePlan.planName}
                            </Title>

                            <Paragraph style={styles.row}>
                                <Icon name="currency-inr" size={20} color="black" />
                                <Text style={styles.bold}> Amount:</Text> ₹{activePlan.planAmount}
                            </Paragraph>

                            <Paragraph style={styles.row}>
                                <Icon name="calendar-check" size={20} color="black" />
                                <Text style={styles.bold}> Valid for:</Text> {activePlan.planValidityDays} days
                            </Paragraph>

                            <Paragraph style={styles.row}>
                                <Icon name="calendar-clock" size={20} color="black" />
                                <Text style={[styles.bold, { color: COLORS.danger }]}> Expires on:</Text>{' '}
                                {new Date(activePlan.expiresAt).toLocaleDateString()}
                            </Paragraph>

                        </Card.Content>

                    </Card>

                ) : (

                    <Text style={styles.noPlanText}>😔 No active plan found.</Text>

                )}
            </View>

        </>

    );
};

export default ActivePlansScreen;

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#efefef',
        flex: 1,
    },
    card: {
        borderRadius: 12,
        elevation: 4,
        backgroundColor: '#fff',
    },
    title: {
        fontWeight: 'bold',
        fontSize: 20,
        marginBottom: 12,
        color: COLORS.primaryColor,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 4,
        fontSize: 16,
    },
    bold: {
        fontWeight: 'bold',
        marginLeft: 5,
    },
    centered: {
        marginTop: 100,
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginTop: 100,
    },
    noPlanText: {
        fontSize: 16,
        textAlign: 'center',
        marginTop: 50,
        color: '#999',
    },
});
