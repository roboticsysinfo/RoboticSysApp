import React, { useEffect, useTransition } from 'react';
import { View, Image, StyleSheet, ScrollView, ToastAndroid, Alert } from 'react-native';
import { Button, Text, Card, Avatar, Divider, ActivityIndicator } from 'react-native-paper';
import { COLORS } from '../../../theme';
import { useDispatch, useSelector } from 'react-redux';
import { deleteShop, fetchShopById } from '../../redux/slices/shopSlice';
import { REACT_APP_BASE_URI } from "@env";
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

const ShopScreen = () => {

  const dispatch = useDispatch()
  const navigation = useNavigation()
  const { t, i18n } = useTranslation();
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
      t("Confirm Deletion"),
      t("Are you sure you want to delete this Shop?"),
      [
        {
          text: t("No"),
          onPress: () => console.log("Deletion Cancelled"),
          style: "cancel"
        },
        {
          text: t("Yes"),
          onPress: () => {
            dispatch(deleteShop(shopId));
            ToastAndroid.show(t("Shop Deleted Successfully!"), ToastAndroid.SHORT);
          }
        }
      ]
    );
  };


  if (status === "loading") {
    return <ActivityIndicator style={{ marginTop: 30 }} size="large" color={COLORS.primaryColor} />;
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

        <Image
          source={{
            uri: `${REACT_APP_BASE_URI.replace(/\/$/, '')}/${shop?.shop_cover_image?.replace(/^\//, '')}`,
          }}
          style={styles.coverImage}
        />

        <View style={styles.profileCard}>

          <Avatar.Image size={70} source={{ 
            uri: `${REACT_APP_BASE_URI.replace(/\/$/, '')}/${shop?.shop_profile_image?.replace(/^\//, '')}`
          }} />

          <Text style={styles.shopNameText}>{shop?.shop_name}</Text>

        </View>

        <View style={styles.section}>
          <Text variant="titleLarge" style={styles.sectionTitle}>{t("About Shop")}</Text>
          <Divider />
          <Text variant="bodyMedium" style={styles.paragraph}>
            {shop?.shop_description}
          </Text>
        </View>

        <View style={styles.section}>
          <Text variant="titleLarge" style={styles.sectionTitle}>{t("Address Details")}</Text>
          <Divider />

          <View style={styles.flexSection}>
            <Text>{t("Address")}:</Text>
            <Text>{shop?.shop_address}</Text>
          </View>

          <View style={styles.flexSection}>
            <Text>{t("Phone Number")}:</Text>
            <Text>{shop?.phoneNumber}</Text>
          </View>

          <View style={styles.flexSection}>
            <Text>{t("WhatsApp Number")}:</Text>
            <Text>{shop?.whatsappNumber}</Text>
          </View>

          <View style={styles.flexSection}>
            <Text>{t("State")}:</Text>
            <Text>{shop?.state}</Text>
          </View>

          <View style={styles.flexSection}>
            <Text>City:</Text>
            <Text>{shop?.city_district}</Text>
          </View>

          <View style={styles.flexSection}>
            <Text>{t("Village")}:</Text>
            <Text>{shop?.village_name}</Text>
          </View>


        </View>

        <View style={styles.section}>
          <Text variant="titleLarge" style={styles.sectionTitle}>Other Details</Text>
          <Divider />
          <View style={styles.flexSection}>
            <Text>{t("Preferred Buyers")} :</Text>
            <Text>{shop?.preferred_buyers}</Text>
          </View>

          <View style={styles.flexSection}>
            <Text>{t("Pricing Preference")} :</Text>
            <Text>{shop?.pricing_preference}</Text>
          </View>

        </View>

        <View style={styles.buttonContainer}>

          <Button
            style={styles.updateBtn}
            mode="contained"
            onPress={() => navigation.navigate(t('Edit Shop'), { shopId: shop._id })}
          >
            {t("Update Shop Details")}
          </Button>


        </View>

      </ScrollView>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    fontWeight: "bold"
  },
  deleteBtnText: { color: "#ff0000" },

  profileCard: {
    borderRadius: 0,
    backgroundColor: "#fff",
    fontWeight: "600",
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#efefef"
  },

  shopNameText: {
    fontSize: 22,
    fontWeight: "bold",
    marginLeft: 10
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
