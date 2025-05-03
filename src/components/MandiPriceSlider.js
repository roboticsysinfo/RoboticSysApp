import React, { useEffect, useState, useRef } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    Dimensions,
    TouchableOpacity
} from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { getFarmerById } from '../redux/slices/authSlice';
import { useTranslation } from 'react-i18next';
import { COLORS } from '../../theme';

const { width } = Dimensions.get('window');

const MandiPriceSlider = () => {
    const [mandiData, setMandiData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stateName, setStateName] = useState('');
    const [districtName, setDistrictName] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef();
    const { t } = useTranslation();

    const dispatch = useDispatch();
    const navigation = useNavigation();
    const { user , farmerDetails} = useSelector((state) => state.auth);
    const farmerId = user?.id;

    useEffect(() => {
        if (farmerId) {
            dispatch(getFarmerById(farmerId)).then(() => {
                fetchStoredLocation(); // ✅ Now runs after farmerDetails is set
            });
        }
    }, [dispatch, farmerId]);

    const groupDataInPairs = (data) => {
        const pairs = [];
        for (let i = 0; i < data.length; i += 2) {
            pairs.push(data.slice(i, i + 2));
        }
        return pairs;
    };

    const fetchStoredLocation = () => {
        try {
            const storedState = farmerDetails?.state;
            const storedDistrict = farmerDetails?.city_district;

            console.log('Farmer Details:', farmerDetails);
            console.log('Using State:', storedState);
            console.log('Using District:', storedDistrict);

            if (storedState && storedDistrict) {
                setStateName(storedState);
                setDistrictName(storedDistrict);
                fetchMandiData(storedState, storedDistrict);
            } else {
                console.warn('Location not found');
                setLoading(false);
            }
        } catch (error) {
            console.error('Error reading location:', error);
            setLoading(false);
        }
    };

    const fetchMandiData = async (state, district) => {
        try {
            const response = await axios.get(
                'https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070',
                {
                    params: {
                        'api-key': '579b464db66ec23bdd0000010cee58ad0085499e64d210271eee679d',
                        format: 'json',
                        limit: 10,
                        'filters[state.keyword]': state,
                        'filters[district.keyword]': district,
                    },
                }
            );

            console.log("Fetched Mandi Records:", response.data.records);
            if (response.data.records.length === 0) {
                console.warn('⚠️ No mandi data found for given state/district');
            }

            setMandiData(groupDataInPairs(response.data.records));
        } catch (error) {
            console.error('Error fetching mandi data:', error);
        } finally {
            setLoading(false);
        }
    };

    // 🔁 Auto-slide
    useEffect(() => {
        if (mandiData.length > 0) {
            const intervalId = setInterval(() => {
                const nextIndex = (currentIndex + 1) % mandiData.length;
                flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
                setCurrentIndex(nextIndex);
            }, 8000);

            return () => clearInterval(intervalId);
        }
    }, [currentIndex, mandiData]);

    const renderItem = ({ item }) => (
        <View style={styles.slide}>
            {item.map((mandi, index) => (
                <View style={styles.card} key={index}>
                    <Text style={styles.commodity}>{mandi.commodity}</Text>
                    <Text>Market: {mandi.market}</Text>
                    <Text>Modal Price: ₹{mandi.modal_price}</Text>
                    <Text>Date: {mandi.arrival_date}</Text>
                </View>
            ))}
        </View>
    );

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#2e7d32" />
                <Text>Loading data...</Text>
            </View>
        );
    }

    return (
        <View style={{ flex: 1, paddingVertical: 10 }}>
            <Text style={styles.heading}>
                मंडी भाव ({stateName}, {districtName})
            </Text>
            <FlatList
                ref={flatListRef}
                data={mandiData}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                keyExtractor={(_, index) => index.toString()}
                renderItem={renderItem}
                contentContainerStyle={{ paddingHorizontal: 10 }}
                onMomentumScrollEnd={(event) => {
                    const index = Math.round(event.nativeEvent.contentOffset.x / width);
                    setCurrentIndex(index);
                }}
            />
            <TouchableOpacity
                onPress={() => navigation.navigate(t("MandiPrice"))}
            >
                <Text style={styles.mandiPriceMore}>See More</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    heading: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1b5e20',
        textAlign: 'center',
        marginBottom: 10,
    },
    slide: {
        flexDirection: 'row',
        width: width,
        justifyContent: 'space-between',
        paddingHorizontal: 5,
    },
    card: {
        width: (width - 30) / 2,
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 12,
        marginHorizontal: 5,
        marginVertical: 10,
        borderWidth: 1,
        borderColor: "#efefef",
        elevation: 3,
    },
    commodity: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#004d40',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    mandiPriceMore: {
        alignSelf: "center",
        fontSize: 16,
        fontWeight: "bold",
        marginTop: 5,
        color: COLORS.primaryColor
    }
});

export default MandiPriceSlider;
