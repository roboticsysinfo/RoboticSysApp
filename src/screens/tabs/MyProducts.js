import React, { useEffect } from 'react';
import { View, Image, Text, FlatList, ActivityIndicator, Alert, ToastAndroid } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getProductByFarmerId, deleteProduct } from '../../redux/slices/productSlice';
import { Card, Button, IconButton, Divider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../../../theme';
import FIcon from "react-native-vector-icons/FontAwesome6";

const MyProducts = () => {
  
  const dispatch = useDispatch();
  const navigation = useNavigation();

  // Fetching products and status from Redux
  const { products, status, error } = useSelector((state) => state.products);
  const { user } = useSelector((state) => state.auth);

  const farmerId = user?.id;

  const productId = products?._id

  useEffect(() => {
    if (farmerId) {
      dispatch(getProductByFarmerId(farmerId)); // Dispatching action to fetch products
    }
  }, [dispatch, farmerId]);

  // Handle product deletion
  const handleDelete = (productId) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this product?",
      [
        {
          text: "No",
          onPress: () => console.log("Deletion Cancelled"),
          style: "cancel"
        },
        {
          text: "Yes",
          onPress: () => {
            dispatch(deleteProduct(productId));
            ToastAndroid.show("Product Deleted Successfully!", ToastAndroid.SHORT);
          }
        }
      ]
    );
  };

  // Ensure products is always an array
  const renderedProducts = Array.isArray(products) ? products : [products];

  return (
    <View style={styles.container}>

      <Button
        mode="contained"
        style={styles.addProductBtn}
        contentStyle={styles.buttonContent} 
        onPress={() => navigation.navigate('Add New Product')}
      >
        <View style={styles.buttonInner}>
          <FIcon name="cart-plus" size={24} color="white" style={styles.icon} />
          <Text style={styles.buttonText}>Add New Product</Text>
        </View>
      </Button>


      <Divider style={{ color: "#000", backgroundColor: "#000", marginBottom: 10 }} />

      {/* Handle Loading and Error States */}
      {status === "loading" && <ActivityIndicator size="large" color="#0000ff" />}
      {status === "failed" && <Text>Error fetching Products: {error?.message || JSON.stringify(error)}</Text>
      }

      {/* Handle "No products found" case */}
      {status === "succeeded" && renderedProducts.length === 0 && (
        <Text>No products found</Text>
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
                      onPress={() => navigation.navigate('Edit Product', { productId: item._id })}
                    >
                      Edit
                    </Button>
                    <IconButton icon="delete" onPress={() => handleDelete(item._id)} />
                  </View>
                </View>

                <Image
                  source={{ uri: `https://kisaangrowth-backend.onrender.com/${item.product_image}` || 'https://via.placeholder.com/150' }} // Fallback image
                  style={styles.image}
                />


              </View>
            </Card>
          )}
          contentContainerStyle={styles.scrollContainer}
        />
      )}
    </View>
  );
};

const styles = {
  container: { flex: 1, padding: 10 },
  scrollContainer: { paddingBottom: 20, paddingHorizontal: 10 },
  card: { marginBottom: 15, padding: 10, borderRadius: 10, borderColor: "#efefef", borderWidth: 1 },
  row: { flexDirection: 'row', alignItems: 'center' },
  badgeContainer: { backgroundColor: COLORS.secondaryColor, borderRadius: 5, padding: 5, marginRight: 10 },
  badge: { color: 'white', fontWeight: 'bold' },
  infoContainer: { flex: 1 },
  category: { color: 'gray', fontSize: 12 },
  title: { fontWeight: 'bold', fontSize: 16 },
  actionRow: { flexDirection: 'row', alignItems: "center", marginTop: 10 },
  image: { width: 80, height: 80, borderRadius: 5, borderWidth: 1, borderColor: "#000", resizeMode: 'cover', },
  editbtn: { backgroundColor: COLORS.primaryColor, marginBottom: 0, padding: 0, color: "#fff", fontSize: 12,  },
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
};

export default MyProducts;
