import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, ScrollView } from 'react-native';
import { Text, Card, Button, ActivityIndicator, Avatar, TextInput } from 'react-native-paper';
import FIcon from "react-native-vector-icons/FontAwesome6";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { fetchShops } from '../redux/slices/shopSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../../theme';
import api from '../services/api';
import { REACT_APP_BASE_URI } from '@env';
import { fetchReviews } from '../redux/slices/reviewSlice';

const AllShopsScreen = () => {

  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { shops = [], status, error } = useSelector((state) => state.shop);
  const { reviews, averageRating } = useSelector(state => state.reviews);

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredShops, setFilteredShops] = useState([]);
  const [loading, setLoading] = useState(false);

  const shopId = shops.length > 0 ? shops[0]._id : null;

  const searchShops = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/search/bynamecity/shop?keyword=${searchQuery}`);
      const sorted = res.data.sort((a, b) => (b.isFarmerUpgraded === true) - (a.isFarmerUpgraded === true));
      setFilteredShops(sorted);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    dispatch(fetchShops({ page: 1, limit: 10 }));
    dispatch(fetchReviews(shopId));
  }, [dispatch]);

  useEffect(() => {
    const sortedShops = [...shops].sort((a, b) => (b.isFarmerUpgraded === true) - (a.isFarmerUpgraded === true));
    if (searchQuery === '') {
      setFilteredShops(sortedShops);
    } else {
      searchShops();
    }
  }, [searchQuery, shops]);

  if (status === 'loading') return <ActivityIndicator style={{ marginTop: 60 }} size="large" color={COLORS.secondaryColor} />;
  if (status === 'failed') {
    return <Text>Error: {error?.message || 'An error occurred'}</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput
        mode="outlined"
        placeholder="Search by shop name or city..."
        value={searchQuery}
        onChangeText={text => setSearchQuery(text)}
        onSubmitEditing={searchShops}
        style={styles.searchInput}
      />

      {filteredShops.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No shops available</Text>
        </View>
      ) : (
        filteredShops.map((shop) => {
          const rating = shop.averageRating ? parseFloat(shop.averageRating).toFixed(1) : "0.0";
          const totalReviews = shop.totalReviews || 0;

          const shopProfileImage = shop.shop_profile_image
            ? `${REACT_APP_BASE_URI}/${shop.shop_profile_image.replace(/\\/g, '/')}`
            : 'https://via.placeholder.com/100';

          return (
            <Card key={shop._id} style={styles.card}>
              <View style={styles.row}>
                <Avatar.Image size={80} source={{ uri: shopProfileImage }} style={styles.image} />
                <View style={styles.info}>
                  <Text style={styles.shopName}>
                    {shop.shop_name}
                    {shop.isFarmerUpgraded && (
                      <Text style={styles.upgradedTag}> <Icon name="shield-star-outline" size={20} /> </Text>
                    )}
                  </Text>

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
                    onPress={() => navigation.navigate("Shop Details", { shopId: shop._id })}
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
    backgroundColor: '#fff',
    marginRight: 12,
    resizeMode: "contain",
    borderWidth: 1,
    borderColor: "#efefef"
  },
  info: {
    flex: 1,
  },
  shopName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
    flexWrap: 'wrap',
  },
  upgradedTag: {
    fontSize: 12,
    color: 'green',
    fontWeight: 'bold',
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
  },
  ratingText: {
    fontSize: 14,
    marginLeft: 2,
    fontWeight: "bold",
    color: "gray"
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
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#efefef',
  },
});
