import React from "react";
import { View, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { Avatar, Text, List, Button } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import FIcon from "react-native-vector-icons/FontAwesome6";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../redux/slices/authSlice"; // Import logout action
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { REACT_APP_BASE_URI } from "@env"


const SettingScreen = () => {


  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { t, i18n } = useTranslation();

  const { user, farmerDetails } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logoutUser()); // Dispatch logout action
    navigation.navigate("Login"); // Redirect to login
  };

  return (

    <View style={styles.container}>

      {/* Profile Section */}
      <View style={styles.profileContainer}>

        <Avatar.Image
          size={60}
          source={{ uri: farmerDetails?.profileImg ? `${REACT_APP_BASE_URI}/${farmerDetails.profileImg}` : "https://avatar.iran.liara.run/public/boy" }}

        />

        <View style={styles.profileInfo}>
          <Text style={styles.name}>{user ? user.name : "N/A"}</Text>
          <Text style={styles.referralText}>{farmerDetails ? farmerDetails?.referralCode : "N/A"}</Text>
        </View>

        <TouchableOpacity onPress={() => { navigation.navigate(t("Profile")) }}>
          <Icon name="pencil" size={20} color="green" style={styles.editIcon} />
        </TouchableOpacity>

      </View>

      {/* Options List */}
      <ScrollView style={styles.settingListContainer}>

        <List.Section>

          <List.Item
            style={styles.drawerlistItem}
            title={t('weatherInfo')}
            left={() => <Icon name="weather-cloudy" size={22} />}
            right={() => <Icon name="chevron-right" size={22} />}
            onPress={() => navigation.navigate(t("Weather"))}
          />

          <List.Item
            style={styles.drawerlistItem}
            title={t('Active Plans')}
            left={() => <Icon name="wallet-membership" size={22} />}
            right={() => <Icon name="chevron-right" size={22} />}
            onPress={() => navigation.navigate(t("ActivePlans"))}
          />

          <List.Item
            style={styles.drawerlistItem}
            title={t('myPointsScore')}
            left={() => <FIcon name="coins" size={22} />}
            right={() => <Icon name="chevron-right" size={22} />}
            onPress={() => navigation.navigate(t("Point Transactions"))}
          />

          <List.Item
            style={styles.drawerlistItem}
            title={t('allShops')}
            left={() => <Icon name="storefront" size={22} />}
            right={() => <Icon name="chevron-right" size={22} />}
            onPress={() => navigation.navigate(t("All Shops"))}
          />

          <List.Item
            style={styles.drawerlistItem}
            title={t('myProducts')}
            left={() => <Icon name="archive-plus" size={22} />}
            right={() => <Icon name="chevron-right" size={22} />}
            onPress={() => navigation.navigate(t("My Products"))}
          />

          <List.Item
            style={styles.drawerlistItem}
            title={t('myDetails')}
            left={() => <Icon name="card-account-details" size={22} />}
            right={() => <Icon name="chevron-right" size={22} />}
            onPress={() => navigation.navigate(t("My Details"))}
          />

          <List.Item
            style={styles.drawerlistItem}
            title={t('myShopReviews')}
            left={() => <Icon name="storefront" size={22} />}
            right={() => <Icon name="chevron-right" size={22} />}
            onPress={() => navigation.navigate(t("My Shop Reviews"))}
          />

          <List.Item
            style={styles.drawerlistItem}
            title={t('deliveryPreference')}
            left={() => <Icon name="map-marker" size={22} />}
            right={() => <Icon name="chevron-right" size={22} />}
            onPress={() => navigation.navigate(t("Delivery Preference"))}
          />

          <List.Item
            style={styles.drawerlistItem}
            title={t('helpAndSupport')}
            left={() => <Icon name="help-circle" size={22} />}
            right={() => <Icon name="chevron-right" size={22} />}
            onPress={() => navigation.navigate(t("Contact"))}
          />

          <List.Item
            style={styles.drawerlistItem}
            title={t('referAndEarn')}
            left={() => <FIcon name="money-bill-1" size={22} />}
            right={() => <Icon name="chevron-right" size={22} />}
            onPress={() => navigation.navigate(t("ReferandEarn"))}
          />

          <List.Item
            style={styles.drawerlistItem}
            title={t('changeLanguage')}
            left={() => <FIcon name="language" size={22} />}
            right={() => <Icon name="chevron-right" size={22} />}
            onPress={() => navigation.navigate(t("Select Language"))}
          />


          <List.Item
            style={styles.drawerlistItem}
            title={t('Referral List')}
            left={() => <FIcon name="user" size={22} />}
            right={() => <Icon name="chevron-right" size={20} />}
            onPress={() => navigation.navigate(t("ReferralList"))}
          />


          <List.Item
            style={styles.drawerlistItem}
            title={t('farmingTips')}
            left={() => <Icon name="lightbulb-outline" size={22} />}
            right={() => <Icon name="chevron-right" size={22} />}
            onPress={() => navigation.navigate(t("Farming Tips"))}
          />

        </List.Section>

        {/* Logout Button */}
        <Button
          mode="contained"
          onPress={handleLogout}
          style={styles.logoutButton}
          icon="logout"
        >
          {t("logOut")}
        </Button>

      </ScrollView>

    </View>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  profileInfo: {
    marginLeft: 15,
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  email: {
    fontSize: 14,
    color: "gray",
  },
  editIcon: {
    marginRight: 10,
  },
  logoutButton: {
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 4,
    backgroundColor: '#DA2428',
    marginBottom: 20,
  },
  settingListContainer: {
    paddingHorizontal: 20
  },
  referralText: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 5,
    color: "gray"
  }
});

export default SettingScreen;
