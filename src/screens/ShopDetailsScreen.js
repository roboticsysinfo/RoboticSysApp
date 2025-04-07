import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, Dimensions, ActivityIndicator, ScrollView } from 'react-native';
import { Text, Card, Title, Paragraph, Avatar, Divider } from 'react-native-paper';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { COLORS } from '../../theme';
import { clearSelectedShop, fetchProductsByShopId, fetchShopByShopId } from '../redux/slices/shopSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { REACT_APP_BASE_URI } from '@env';
import FIcon from "react-native-vector-icons/FontAwesome6";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AboutTab from '../components/AboutTab';
import ProductsTab from '../components/ProductTab';


const initialLayout = { width: Dimensions.get('window').width };

const ShopDetailsScreen = ({ route }) => {

  const { shopId } = route.params;
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { selectedShop: shop, status } = useSelector(state => state.shop);
  const { reviews, averageRating } = useSelector(state => state.reviews);
  const { products } = useSelector((state) => state.shop);

  const totalReviews = reviews.length;
  const rating = parseFloat(averageRating) || 0;

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'about', title: 'About' },
    { key: 'products', title: 'Products' },
  ]);

  const renderScene = SceneMap({
    about: AboutTab,
    products: ProductsTab,
  });


  useEffect(() => {
    dispatch(fetchShopByShopId(shopId));
    dispatch(fetchProductsByShopId(shopId));
    return () => {
      dispatch(clearSelectedShop());
    };
  }, [dispatch, shopId]);


  const coverImage = shop?.shop_cover_image ? `${REACT_APP_BASE_URI}/${shop.shop_cover_image}` : 'https://via.placeholder.com/300';
  const profileImage = shop?.shop_profile_image ? `${REACT_APP_BASE_URI}/${shop.shop_profile_image}` : 'https://via.placeholder.com/100';


  if (status === "loading" || !shop) {
    return (
      <View style={styles.container}>

        <ActivityIndicator style={{ marginTop: 60 }} size="large" color={COLORS.secondaryColor} />

      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: coverImage }} style={styles.coverImage} />

      <View style={styles.profileSection}>
        <Avatar.Image size={80} source={{ uri: profileImage }} />
        <View style={styles.info}>
          <Title>{shop.shop_name}</Title>
          <Paragraph style={styles.subTitle}>{shop.city_district}</Paragraph>
          <View style={styles.ratingRow}>
            <Text style={styles.stars}><Icon name="star" /></Text>
            <Text style={styles.rating}>{rating}</Text>
          </View>
        </View>
      </View>

      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
        renderTabBar={props => (
          <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: '#000' }}
            style={{ backgroundColor: COLORS.primaryColor }}
            renderLabel={({ route, focused }) => (
              <Text style={{ color: focused ? "#fff" : 'gray', margin: 8 }}>
                {route.title}
              </Text>
            )}
          />
        )}
      />
    </View>
  );


};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  coverImage: {
    width: '100%',
    height: 150,
  },
  profileSection: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  info: {
    marginLeft: 16,
  },
  subTitle: {
    color: 'gray',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  stars: {
    color: '#FFD700',
    fontSize: 16,
  },
  rating: {
    marginLeft: 8,
    fontWeight: 'bold',
  },
  tabContent: {
    padding: 16,
    color: "#000",
    backgroundColor: "#fff"
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    padding: 10,
  },
  productCard: {
    width: '45%',
    marginVertical: 10,
  },

  flexSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd"
  },

  sectionTitle: {
    fontSize: 18,
    marginBottom: 10,
    fontSize: 18
  },

  section: {
    padding: 20,
    backgroundColor: "#fff"
  },

});

export default ShopDetailsScreen;
