import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, RefreshControl, ActivityIndicator, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getFarmerReferralDetail } from '../redux/slices/farmerPlanSlice';
import { Appbar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';


const ReferralListScreen = () => {

    const dispatch = useDispatch();
    const navigation = useNavigation();
    const { referralDetail, loading } = useSelector((state) => state.farmerPlan);
    const { user, farmerDetails } = useSelector((state) => state.auth);
    const farmerid = user.id;

    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        dispatch(getFarmerReferralDetail(farmerid));
    }, [dispatch, farmerid]);


    const onRefresh = useCallback(() => {
        setRefreshing(true);
        dispatch(getFarmerReferralDetail(farmerid)).finally(() => {
            setRefreshing(false);
        });
    }, [dispatch, farmerid]);


    const renderItem = ({ item }) => (
        <View style={styles.item}>
            <Text style={styles.name}>Name: {item.name}</Text>
            <Text style={styles.referralcode}>Referral Code: {item.referralCode}</Text>
            <Text> {item._id}</Text>
        </View>
    );


    return (

        <>

            <Appbar.Header style={{ backgroundColor: '#0a9e57' }}>
                <Appbar.BackAction onPress={() => navigation.goBack()} color="white" />
                <Appbar.Content title="Referral List" titleStyle={{ color: 'white' }} />
            </Appbar.Header>

            <View style={styles.container}>

                <View style={styles.referralcardDetail}>
                    <Text style={styles.header}>Referral Code: {referralDetail?.referralCode}</Text>
                    <View style={styles.referralCardHeader}>
                        <View style={styles.subHeader}>
                            <Text style={{fontSize: 18, fontWeight: "bold"}}>Total Shares</Text>
                            <Text style={{fontSize: 20, fontWeight: "bold", color: "Orange"}}>{referralDetail?.referralShares}</Text>
                        </View>
                        <View style={styles.subHeader}>
                            <Text style={{fontSize: 18, fontWeight: "bold"}}>
                                App Downloads
                            </Text>
                            <Text style={{fontSize: 20, fontWeight: "bold", color: "Orange"}}>{referralDetail?.referralDownloads}</Text>
                        </View>
                    </View>
                </View>

                {loading && !refreshing ? (
                    <ActivityIndicator size="large" color="green" />
                ) : (
                    <FlatList
                        data={referralDetail?.referredFarmers || []}
                        keyExtractor={(item) => item._id}
                        renderItem={renderItem}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                        }
                        ListEmptyComponent={
                            <Text style={styles.empty}>No referred farmers yet.</Text>
                        }
                    />
                )}
            </View>

        </>

    );
};

export default ReferralListScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#efefef"
    },

    header: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        alignSelf: "center"
    },

    subHeader:{
        marginHorizontal: 10,
        alignItems: "center",
    },
    subHeaderText: {
        fontSize: 16,
    },
    item: {
        padding: 12,
        marginVertical: 6,
        backgroundColor: '#fff',
        borderRadius: 8,
    },
    name: {
        fontSize: 16,
        fontWeight: '600',
    },
    empty: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
        color: 'gray',
    },
    referralcardDetail: {
        flexDirection: "column",
        alignContent: "center",
        elevation: 2,
        marginBottom: 30,
        backgroundColor: "#fff",
        padding: 10
    },
    referralCardHeader: {
        flexDirection: "row",
        padding: 15,
        alignItems: "center",
        justifyContent: "center",
    }
});
