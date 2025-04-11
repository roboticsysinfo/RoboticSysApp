import React, { useEffect } from 'react';
import { View, Image, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Button, Divider } from 'react-native-paper';
import { fetchRedeemProducts, redeemProduct } from '../redux/slices/redeemProductSlice';
import sampleProductImage from '../assets/productimagenot.png';
import { COLORS } from '../../theme';
import Toast from 'react-native-toast-message';
import { REACT_APP_BASE_URI } from "@env"

const RedeemProducts = () => {
    const dispatch = useDispatch();

    const { rProducts, loading } = useSelector((state) => state.redeemProducts);
    const { user, farmerDetails } = useSelector((state) => state.auth);
    farmerId = user?.id

    useEffect(() => {
        dispatch(fetchRedeemProducts());
    }, [dispatch]);

    const handleRedeem = (productId) => {

        if (!farmerId) {
            Toast.show({
                type: 'error',
                text1: 'Farmer not found',
                position: 'bottom',
            });
            return;
        }

        dispatch(redeemProduct({ farmerId: farmerId, redeemProductId: productId }))
            .unwrap()
            .then((res) => {
                Toast.show({
                    type: 'success',
                    text1: res.message || 'Redeemed successfully',
                });
            })
            .catch((err) => {
                Toast.show({
                    type: 'error',
                    text1: err?.message || 'Redemption failed',
                });
            });
    };


    return (
        <View style={styles.rewardList}>
            {loading ? (
                <ActivityIndicator
                    style={{ marginTop: 30 }}
                    size={'large'}
                    color={COLORS.primaryColor}
                />
            ) : rProducts.length === 0 ? (
                <Text style={{ textAlign: 'center', marginTop: 20 }}>
                    No products found right now
                </Text>
            ) : (
                [...rProducts] // create a shallow copy
                    .sort((a, b) => b.requiredPoints - a.requiredPoints) // sort descending
                    .map((product) => (
                        <Card key={product._id} style={styles.rewardCard}>
                            <Image
                                source={
                                    product.r_product_img
                                        ? (() => {
                                            const imgUri = `${REACT_APP_BASE_URI}/${product.r_product_img}`;
                                            console.log('Image URI:', imgUri);
                                            return { uri: imgUri };
                                        })()
                                        : sampleProductImage
                                }
                                style={styles.rewardImage}
                            />
                            <Divider />
                            <Text style={styles.rewardTitle}>{product.name}</Text>
                            <Button
                                mode="contained"
                                compact
                                style={styles.useBtn}
                                labelStyle={{ fontSize: 12, flexShrink: 1, textAlign: 'center' }}
                                onPress={() => handleRedeem(product._id)}
                            >
                                Use 🪙 {product.requiredPoints} Pts
                            </Button>
                        </Card>
                    ))
            )}
        </View>
    );


};

const styles = StyleSheet.create({
    rewardList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        paddingBottom: 20,
    },
    rewardCard: {
        width: '44%',
        marginTop: 12,
        padding: 20,
        borderRadius: 16,
        flexDirection: "column",
        alignItems: 'center',
        justifyContent: "center",
        backgroundColor: "#fff"
    },
    rewardImage: {
        width: 100,
        height: 100,
        resizeMode: 'contain',
        textAlign: "center"

    },
    rewardTitle: {
        fontWeight: '600',
        marginTop: 8,
        fontSize: 16,
        textAlign: "center"
    },
    useBtn: {
        marginTop: 12,
        backgroundColor: COLORS.secondaryColor,
        width: 130
    },
});

export default RedeemProducts;
