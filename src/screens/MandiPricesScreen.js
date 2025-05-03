import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity,
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import axios from 'axios';
import { Appbar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const MandiPricesScreen = () => {
    const navigation = useNavigation();
    const [data, setData] = useState([]);
    const [commodities, setCommodities] = useState([]);
    const [states, setStates] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [offset, setOffset] = useState(0);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const [selectedState, setSelectedState] = useState('Haryana');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedCommodity, setSelectedCommodity] = useState('');

    const limit = 50;

    const fetchMandiPrices = async (isNewFilter = false) => {
        if (loading || (!hasMore && !isNewFilter)) return;
        setLoading(true);

        try {
            const response = await axios.get(
                'https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070',
                {
                    params: {
                        'api-key': '579b464db66ec23bdd0000010cee58ad0085499e64d210271eee679d',
                        format: 'json',
                        limit,
                        offset: isNewFilter ? 0 : offset,
                        ...(selectedState && { 'filters[state]': selectedState }),
                        ...(selectedDistrict && { 'filters[district]': selectedDistrict }),
                        ...(selectedCommodity && { 'filters[commodity]': selectedCommodity }),
                    },
                }
            );

            const newData = response.data.records;

            if (isNewFilter) {
                setData(newData);
                setOffset(limit);
                setHasMore(newData.length === limit);
            } else {
                setData((prev) => [...prev, ...newData]);
                if (newData.length < limit) setHasMore(false);
                else setOffset(offset + limit);
            }
        } catch (error) {
            console.error('Error fetching mandi prices:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCommoditiesStatesDistricts = async () => {
        try {
            const response = await axios.get(
                'https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070',
                {
                    params: {
                        'api-key': '579b464db66ec23bdd0000010cee58ad0085499e64d210271eee679d',
                        format: 'json',
                        limit: 10000,
                    },
                }
            );

            const records = response.data.records;

            const uniqueCommodities = [...new Set(records.map((item) => item.commodity))];
            const uniqueStates = [...new Set(records.map((item) => item.state))];
            setCommodities(uniqueCommodities);
            setStates(uniqueStates);

            // State selected initially
            if (selectedState) {
                const filteredDistricts = records
                    .filter((item) => item.state === selectedState)
                    .map((item) => item.district);
                const uniqueDistricts = [...new Set(filteredDistricts)];
                setDistricts(uniqueDistricts);
            }
        } catch (error) {
            console.error('Error fetching filters:', error);
        }
    };

    useEffect(() => {
        fetchCommoditiesStatesDistricts();
    }, []);

    useEffect(() => {
        fetchMandiPrices(true);
    }, [selectedState, selectedDistrict, selectedCommodity]);

    useEffect(() => {
        // Update districts when state changes
        const updateDistricts = async () => {
            try {
                const response = await axios.get(
                    'https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070',
                    {
                        params: {
                            'api-key': '579b464db66ec23bdd0000010cee58ad0085499e64d210271eee679d',
                            format: 'json',
                            limit: 10000,
                        },
                    }
                );
                const records = response.data.records;
                const filteredDistricts = records
                    .filter((item) => item.state === selectedState)
                    .map((item) => item.district);
                const uniqueDistricts = [...new Set(filteredDistricts)];
                setDistricts(uniqueDistricts);
                setSelectedDistrict(''); // reset district on state change
            } catch (error) {
                console.error('Error fetching districts:', error);
            }
        };

        if (selectedState) {
            updateDistricts();
        }
    }, [selectedState]);

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <Text style={styles.title}>{item.commodity}</Text>
            <Text>Market: {item.market}</Text>
            <Text>District: {item.district}</Text>
            <Text>State: {item.state}</Text>
            <Text>Modal Price: ₹{item.modal_price}</Text>
            <Text>Arrival Date: {item.arrival_date}</Text>
        </View>
    );

    const renderFooter = () =>
        loading ? (
            <ActivityIndicator size="large" color="#2e7d32" style={{ marginVertical: 10 }} />
        ) : hasMore ? (
            <TouchableOpacity style={styles.loadMoreBtn} onPress={() => fetchMandiPrices()}>
                <Text style={styles.loadMoreText}>Load More</Text>
            </TouchableOpacity>
        ) : (
            <Text style={styles.noMoreText}>No more data</Text>
        );

    return (
        <>
            <Appbar.Header style={{ backgroundColor: '#0a9e57' }}>
                <Appbar.BackAction onPress={() => navigation.goBack()} color="white" />
                <Appbar.Content title="Daily Market Price ( मंडी भाव )" titleStyle={{ color: 'white' }} />
            </Appbar.Header>

            <View style={{ flex: 1 }}>
                <View style={styles.filterContainer}>

                    {/* State Dropdown */}
                    <Dropdown
                        value={selectedState}
                        onChange={(item) => setSelectedState(item.value)}
                        style={styles.dropdownMenu}
                        data={states.map((state) => ({
                            label: state,
                            value: state,
                        }))}
                        labelField="label"
                        valueField="value"
                        placeholder="Select State"
                    />

                    {/* District Dropdown */}
                    <Dropdown
                        value={selectedDistrict}
                        onChange={(item) => setSelectedDistrict(item.value)}
                        style={styles.dropdownMenu}
                        data={districts.map((district) => ({
                            label: district,
                            value: district,
                        }))}
                        labelField="label"
                        valueField="value"
                        placeholder="Select District"
                    />

                    {/* Commodity Dropdown */}
                    <Dropdown
                        value={selectedCommodity}
                        onChange={(item) => setSelectedCommodity(item.value)}
                        style={styles.dropdownMenu}
                        data={commodities.map((commodity) => ({
                            label: commodity,
                            value: commodity,
                        }))}
                        labelField="label"
                        valueField="value"
                        placeholder="Select Commodity"
                    />
                </View>

                <FlatList
                    data={data}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={{ padding: 10 }}
                    ListFooterComponent={renderFooter}
                />
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    filterContainer: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#f9f9f9',
    },
    card: {
        backgroundColor: '#fff',
        padding: 15,
        marginBottom: 10,
        borderRadius: 10,
        elevation: 2,
        marginHorizontal: 15,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1b5e20',
    },
    loadMoreBtn: {
        backgroundColor: '#2e7d32',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginVertical: 10,
    },
    loadMoreText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    noMoreText: {
        textAlign: 'center',
        color: '#999',
        marginVertical: 10,
    },
    dropdownMenu: {
        backgroundColor: "#fff",
        marginVertical: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
    },
});

export default MandiPricesScreen;
