import React, { useEffect } from 'react';
import { View, Image, StyleSheet, ScrollView, ToastAndroid, Alert } from 'react-native';
import { Button, Text, Card, Avatar, Divider, ActivityIndicator } from 'react-native-paper';
import { COLORS } from '../../../theme';
import { useDispatch, useSelector } from 'react-redux';
import { deleteShop, fetchShopById } from '../../redux/slices/shopSlice';
import { REACT_APP_BASE_URI } from "@env";
import { useNavigation } from '@react-navigation/native';

const ShopScreen = () => {

  const dispatch = useDispatch()
  const navigation = useNavigation()
  const { shop, status, error } = useSelector((state) => state.shop);
  const { user } = useSelector((state) => state.auth);
  const farmerId = user?.id;

  useEffect(() => {
    if (farmerId) {
      dispatch(fetchShopById(farmerId));
    }
  }, [dispatch, farmerId]);


  // Handle product deletion
  const handleDeleteShop = (shopId) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this Shop?",
      [
        {
          text: "No",
          onPress: () => console.log("Deletion Cancelled"),
          style: "cancel"
        },
        {
          text: "Yes",
          onPress: () => {
            dispatch(deleteShop(shopId));
            ToastAndroid.show("Shop Deleted Successfully!", ToastAndroid.SHORT);
          }
        }
      ]
    );
  };


  if (status === "loading") {
    return <ActivityIndicator size="large" color={COLORS.primaryColor} />;
  }

  if (status === "failed") {
    return <Text>Error fetching shop: {error?.message || JSON.stringify(error)}</Text>

  }

  if (!shop) {
    return <Text>No shop data available</Text>;
  }

  return (
    <View style={styles.container}>

      <ScrollView>

        <Image source={{ uri: `${REACT_APP_BASE_URI}${shop?.shop_cover_image}` }} style={styles.coverImage} />

        <Card style={styles.profileCard}>
          <Card.Title
            title={shop?.shop_name}
            left={() => <Avatar.Image size={50} source={{ uri: `${REACT_APP_BASE_URI}${shop?.shop_profile_image}` }} />}
          />
        </Card>

        <View style={styles.section}>
          <Text variant="titleLarge" style={styles.sectionTitle}>About</Text>
          <Divider />
          <Text variant="bodyMedium" style={styles.paragraph}>
            {shop?.shop_description}
          </Text>
        </View>

        <View style={styles.section}>
          <Text variant="titleLarge" style={styles.sectionTitle}>Address Details</Text>
          <Divider />

          <View style={styles.flexSection}>
            <Text>Address:</Text>
            <Text>{shop?.shop_address}</Text>
          </View>

          <View style={styles.flexSection}>
            <Text>Phone Number:</Text>
            <Text>{shop?.phoneNumber}</Text>
          </View>

          <View style={styles.flexSection}>
            <Text>WhatsApp Number:</Text>
            <Text>{shop?.whatsappNumber}</Text>
          </View>

          <View style={styles.flexSection}>
            <Text>State:</Text>
            <Text>{shop?.state}</Text>
          </View>

          <View style={styles.flexSection}>
            <Text>City:</Text>
            <Text>{shop?.city_district}</Text>
          </View>

          <View style={styles.flexSection}>
            <Text>Village:</Text>
            <Text>{shop?.village_name}</Text>
          </View>


        </View>

        <View style={styles.section}>
          <Text variant="titleLarge" style={styles.sectionTitle}>Other Details</Text>
          <Divider />
          <View style={styles.flexSection}>
            <Text>Preferred Buyers :</Text>
            <Text>{shop?.preferred_buyers}</Text>
          </View>

          <View style={styles.flexSection}>
            <Text>Pricing Preference :</Text>
            <Text>{shop?.pricing_preference}</Text>
          </View>

        </View>

        <View style={styles.buttonContainer}>

          <Button
            style={styles.updateBtn}
            mode="contained"
            onPress={() => navigation.navigate('Edit Shop', { shopId: shop._id })}
          >
            Update Shop Details
          </Button>

          <Button style={styles.deleteBtn} mode="outlined" onPress={() => handleDeleteShop(shop?._id)} >
            <Text style={styles.deleteBtnText}>Delete Shop</Text>
          </Button>

        </View>

      </ScrollView>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', // Vertically center
    alignItems: 'center',      // Horizontally center
    backgroundColor: '#f0f0f0', // Optional: Set background color
  },
  flexSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd"
  },
  coverImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover'
  },
  updateBtn: {
    backgroundColor: COLORS.primaryColor,
  },
  deleteBtn: {
    borderColor: "#ff0000",

  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 10,
    fontSize: 18
  },
  deleteBtnText: { color: "#ff0000" },

  profileCard: {
    margin: 10,
    borderRadius: 0,
    backgroundColor: "#fff",
    fontWeight: "600"
  },
  section: {
    padding: 20,
    backgroundColor: "#fff"
  },
  paragraph: {
    color: 'gray',
    marginTop: 10
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    marginVertical: 15
  },
});

export default ShopScreen;
