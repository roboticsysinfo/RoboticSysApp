import React, { useCallback, useEffect, useState } from 'react';
import { View, Image, Text, FlatList, ActivityIndicator, Alert, ToastAndroid } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getProductByFarmerId, deleteProduct } from '../../redux/slices/productSlice';
import { Card, Button, IconButton, Divider } from 'react-native-paper';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { COLORS } from '../../../theme';
import FIcon from "react-native-vector-icons/FontAwesome6";
import CustomHeader from '../../components/CustomHeader';
import CustomDrawer from '../../navigation/CustomDrawer';
import { fetchNotifications } from '../../redux/slices/notificationSlice';
import { getOrderRequestByFarmerId } from '../../redux/slices/orderSlice';
import { REACT_APP_BASE_URI } from '@env'
import { useTranslation } from 'react-i18next';

const MyProducts = () => {

  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { t, i18n } = useTranslation();  

  // Fetching products and status from Redux
  const { products, status, error } = useSelector((state) => state.products);
  const { user, farmerDetails } = useSelector((state) => state.auth);
  const { shop, } = useSelector(state => state.shop);
  const [shopExists, setShopExists] = useState(null);

  const points = farmerDetails?.points;

  const unreadCount = useSelector((state) => state.notifications.unreadCount);
  // Drawer ka state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);


console.log("products", products)

  useFocusEffect(

    useCallback(() => {
      dispatch(fetchNotifications());

      if (farmerId) {
        dispatch(getOrderRequestByFarmerId(farmerId));
      }
    }, [dispatch, farmerId])

  );

  useEffect(() => {
    if (status === "succeeded") {
      setShopExists(!!shop); // True if shop exists, false otherwise
    }
  }, [shop, status]);


  const farmerId = user?.id;

  const productId = products?._id

  // Toggle function
  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  useEffect(() => {
    if (farmerId) {
      dispatch(getProductByFarmerId(farmerId)); // Dispatching action to fetch products
    }
  }, [dispatch, farmerId]);

  // Handle product deletion
  const handleDelete = (productId) => {
    Alert.alert(
      t("Confirm Deletion"),
      t("Are you sure you want to delete this product?"),
      [
        {
          text: t("No"),
          onPress: () => console.log("Deletion Cancelled"),
          style: "cancel"
        },
        {
          text: t("Yes"),
          onPress: () => {
            dispatch(deleteProduct(productId));
            ToastAndroid.show(t("Product Deleted Successfully!"), ToastAndroid.SHORT);
          }
        }
      ]
    );
  };

  // Ensure products is always an array
  const renderedProducts = Array.isArray(products) ? products : [products];

  return (

    <>

      {/* ✅ Header */}
      < CustomHeader
        toggleDrawer={toggleDrawer}
        user={user}
        points={points}
        unreadCount={unreadCount}
      />

      {/* ✅ Drawer */}
      <CustomDrawer isOpen={isDrawerOpen} closeDrawer={toggleDrawer} />

      <View style={styles.container}>

        <Button
          mode="contained"
          style={styles.addProductBtn}
          contentStyle={styles.buttonContent}
          onPress={() => navigation.navigate(t("Add New Product"))}
        >
          <View style={styles.buttonInner}>
            <FIcon name="cart-plus" size={24} color="white" style={styles.icon} />
            <Text style={styles.buttonText}>{t("addNewProduct")}</Text>
          </View>
        </Button>

        <Divider style={{ color: "#000", backgroundColor: "#000", marginBottom: 10 }} />

        {/* Handle Loading and Error States */}
        {status === "loading" && <ActivityIndicator size="large" color="#0000ff" />}
        {status === "failed" && <Text>Error fetching Products: {error?.message || JSON.stringify(error)}</Text>
        }

        {/* Handle "No products found" case */}
        {status === "succeeded" && renderedProducts.length === 0 && (

          <View style={styles.emptyContainer}>
            <Image source={noOrder} style={styles.image} />
            <Text style={styles.emptyTitle}>{t("No Products Yet")}</Text>
            <Text style={styles.emptySubtitle}>
              {t("We’ll let you know when there will be something to update you.")}
            </Text>
          </View>

        )}

        {/* Use FlatList to render products */}
        {status === "succeeded" && renderedProducts.length > 0 && (
          <FlatList
            data={renderedProducts}
            keyExtractor={(item) => item._id.toString()}
            renderItem={({ item, index }) => (
              <Card key={item._id || index} style={styles.card}>
                <View style={styles.row}>

                  <View style={styles.badgeContainer}>
                    <Text style={styles.badge}>{String(index + 1).padStart(2, '0')}</Text>
                  </View>

                  <View style={styles.infoContainer}>
                    <Text style={styles.category}>{item.category_id?.name}</Text>
                    <Text style={styles.title}>{item.name}</Text>
                    <View style={styles.actionRow}>
                      <Button
                        mode="contained" style={styles.editbtn}
                        onPress={() => navigation.navigate(t("Edit Product"), { productId: item._id })}
                      >
                        {t("Edit")}
                      </Button>
                      <FIcon style={{marginLeft: 20}} name="trash-can" color={'#DA2825'} size={20} onPress={() => handleDelete(item._id)} />
                    </View>
                  </View>

                  <Image
                    source={{ uri: `${REACT_APP_BASE_URI}/${item.product_image}` || 'https://via.placeholder.com/150' }} // Fallback image
                    style={styles.productImage}
                  />

                </View>
              </Card>
            )}
            contentContainerStyle={styles.scrollContainer}
          />
        )}
      </View>

    </>


  );
};

const styles = {
  container: { flex: 1, padding: 10 },
  scrollContainer: { paddingBottom: 20, paddingHorizontal: 10 },
  card: { elevation: 2, marginBottom: 15, padding: 10, borderRadius: 10, borderColor: "#fff", borderWidth: 1, backgroundColor: "#fff",  },
  row: { flexDirection: 'row', alignItems: 'center' },
  badgeContainer: { backgroundColor: COLORS.secondaryColor, borderRadius: 5, padding: 5, marginRight: 10,},
  badge: { color: 'white', fontWeight: 'bold' },
  infoContainer: { flex: 1 },
  category: { color: 'gray', fontSize: 12 },
  title: { fontWeight: 'bold', fontSize: 18 },
  actionRow: { flexDirection: 'row', alignItems: "center", marginTop: 10 },
  productImage: { width: 80, height: 80, borderRadius: 5, borderWidth: 1, borderColor: "#000", resizeMode: 'cover', },
  editbtn: { backgroundColor: COLORS.primaryColor, marginBottom: 0, padding: 0, color: "#fff", fontSize: 12, },
  addProductBtn: {
    borderRadius: 4,
    marginVertical: 10,
    marginHorizontal: 10
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // Centers content inside the button
    paddingVertical: 5, // Adjusts vertical spacing
  },
  buttonInner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 8, // Space between icon and text
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center" },

  image: { width: 250, height: 250, marginBottom: 16, resizeMode: "contain" },

  emptyTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 8 },

  emptySubtitle: { fontSize: 14, color: "gray", textAlign: "center", paddingHorizontal: 40 },
};

export default MyProducts;
