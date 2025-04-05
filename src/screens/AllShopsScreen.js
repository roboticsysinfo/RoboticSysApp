import React, { useEffect } from 'react';
import { View, StyleSheet, Image, ScrollView } from 'react-native';
import { Text, Card, Button, ActivityIndicator } from 'react-native-paper';
import FIcon from "react-native-vector-icons/FontAwesome6";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { fetchShops } from '../redux/slices/shopSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../../theme';

const AllShopsScreen = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const { shops = [], status, error } = useSelector((state) => state.shop);
    const { reviews, averageRating } = useSelector(state => state.reviews);

    const totalReviews = reviews.length;
    const rating = parseFloat(averageRating) || 0;

    useEffect(() => {
        dispatch(fetchShops({ page: 1, limit: 10 }));
    }, [dispatch]);

    if (status === 'loading') return <ActivityIndicator size="small" color={COLORS.primaryColor} />;
    if (status === 'failed') {
        return <Text>Error: {error?.message || 'An error occurred'}</Text>;
    }

    console.log("total reviews", totalReviews)
    console.log("rating", rating)

    return (
        <ScrollView contentContainerStyle={styles.container}>

            {shops.length === 0 ? (

                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No shops available</Text>
                </View>

            ) : (
                shops.map((shop) => {

                    const rating = shop.averageRating ? parseFloat(shop.averageRating).toFixed(1) : "0.0";
                    const totalReviews = shop.totalReviews || 0;

                    return (
                        <Card key={shop._id} style={styles.card}>
                            <View style={styles.row}>
                                <Image
                                    source={{ uri: shop.shop_profile_image || 'https://via.placeholder.com/80' }}
                                    style={styles.image}
                                />

                                <View style={styles.info}>
                                    <Text style={styles.shopName}>{shop.shop_name}</Text>

                                    <View style={styles.detailsRow}>
                                        <View style={styles.location}>
                                            <FIcon
                                                name="location-dot"
                                                size={16}
                                                color={COLORS.secondaryColor}
                                                style={{ marginRight: 5 }}
                                            />
                                            <Text style={styles.city}>{shop.city_district || "Unknown"}</Text>
                                        </View>

                                        <View style={styles.rating}>
                                            <Icon name="star" size={16} color="#FFD700" style={{ marginRight: 2 }} />
                                            <Text style={styles.ratingText}>{rating} ({totalReviews})</Text>
                                        </View>
                                    </View>

                                    <Button
                                        mode="contained"
                                        onPress={() => navigation.navigate("Shop Details", shop._id)}
                                        labelStyle={{ fontSize: 12 }}
                                        style={styles.button}
                                    >
                                        View Details
                                    </Button>
                                </View>
                            </View>
                        </Card>
                    );
                })
            )}
        </ScrollView>
    );
};


export default AllShopsScreen;

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#F5F5F5',
        flexGrow: 1,
    },
    card: {
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
        backgroundColor: '#fff',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 8,
        backgroundColor: '#ccc',
        marginRight: 12,
    },
    info: {
        flex: 1,
    },
    shopName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 6,
    },
    detailsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "space-between",
        marginVertical: 8,
    },
    city: {
        fontSize: 14,
        color: '#333',
    },

    location: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    rating: {
        flexDirection: 'row',
        alignItems: 'center',
        // marginRight: 10,
    },
    ratingText: {
        fontSize: 14,
        marginLeft: 2,
    },
    button: {
        alignSelf: 'flex-end',
        marginTop: 6,
        borderColor: '#000',
        borderRadius: 4,
        paddingVertical: 0
    },

    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyText: {
        fontSize: 16,
        color: '#888',
        textAlign: 'center',
    },


});
