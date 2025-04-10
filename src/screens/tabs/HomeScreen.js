import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  PermissionsAndroid,
  Platform,
} from "react-native";
import { Button, Divider, Text } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import FIcon from "react-native-vector-icons/FontAwesome6";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import Geolocation from "@react-native-community/geolocation";

import { COLORS } from "../../../theme";
import CustomDrawer from "../../navigation/CustomDrawer";
import OrdersCounts from "../../components/OrdersCount";
import AdminMessagesScreen from "../../components/AdminMessage";
import CustomHeader from "../../components/CustomHeader";

import { getFarmerById } from "../../redux/slices/authSlice";
import { fetchNotifications } from "../../redux/slices/notificationSlice";
import { getOrderRequestByFarmerId } from "../../redux/slices/orderSlice";
import { fetchShopById } from "../../redux/slices/shopSlice";
import { fetchFiveDayForecast, fetchWeatherData } from "../../redux/slices/weatherSlice";



const HomeScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const { user, farmerDetails } = useSelector((state) => state.auth);
  const { shop, status } = useSelector((state) => state.shop);
  const unreadCount = useSelector((state) => state.notifications.unreadCount);

  const [shopExists, setShopExists] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const hasRequestedLocation = useRef(false);

  const farmerId = user?.id;
  const points = farmerDetails?.points;

  // 🔄 On screen focus: fetch notifications, farmer, orders
  useFocusEffect(
    useCallback(() => {
      dispatch(fetchNotifications());
      dispatch(getFarmerById());
      if (farmerId) {
        dispatch(getOrderRequestByFarmerId(farmerId));
      }
    }, [dispatch, farmerId])
  );

  useEffect(() => {
    if (status === "succeeded") {
      setShopExists(!!shop);
    }
  }, [shop, status]);

  // ✅ Request location permission
  const requestLocationPermission = async () => {
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Location Permission",
            message: "App needs access to your location to show weather",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK",
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn("Permission error:", err);
        return false;
      }
    }
    return true; // iOS auto-allowed
  };

  // ✅ Fetch weather data after permission and geolocation
  const getLocationAndFetchWeather = async () => {
    if (hasRequestedLocation.current) return;
    hasRequestedLocation.current = true;

    const permissionGranted = await requestLocationPermission();
    if (!permissionGranted) return;

    Geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        dispatch(fetchWeatherData({ lat: latitude, lon: longitude }));
        dispatch(fetchFiveDayForecast({ lat: latitude, lon: longitude }));
      },
      (err) => {
        console.warn("Geolocation error:", err.message);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 1000 }
    );
  };

  useEffect(() => {
    getLocationAndFetchWeather();
  }, []);

  // ✅ Toggle drawer
  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <View style={styles.container}>
      <CustomHeader
        toggleDrawer={toggleDrawer}
        user={user}
        points={points}
        unreadCount={unreadCount}
      />

      <CustomDrawer isOpen={isDrawerOpen} closeDrawer={toggleDrawer} />

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <OrdersCounts />
        <Divider style={styles.divider} />
        <AdminMessagesScreen />

        <View style={styles.actionBtns}>
          <Button
            mode="contained"
            style={styles.actionBtnItem}
            contentStyle={styles.buttonContent}
            onPress={() => navigation.navigate("Add New Product")}
          >
            <View style={styles.buttonInner}>
              <FIcon name="cart-plus" size={24} style={styles.icon} />
              <Text style={styles.buttonText}>Add New Product</Text>
            </View>
          </Button>

          <Button
            mode="contained"
            style={styles.actionBtnItem}
            contentStyle={styles.buttonContent}
            onPress={() =>
              navigation.navigate(
                shopExists ? "Edit Shop" : "Create Shop",
                shopExists ? { shopId: shop._id } : {}
              )
            }
          >
            <View style={styles.buttonInner}>
              <Icon
                name={shopExists ? "pencil" : "storefront"}
                size={24}
                style={styles.icon}
              />
              <Text style={styles.buttonText}>
                {shopExists ? "Edit Shop" : "Create Shop"}
              </Text>
            </View>
          </Button>
        </View>
      </ScrollView>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  divider: {
    borderWidth: 1,
    borderColor: "#efefef",
    marginVertical: 10,
  },
  actionBtns: {
    paddingTop: 10,
    paddingHorizontal: 20,
  },
  actionBtnItem: {
    backgroundColor: "#fff",
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#efefef",
    marginBottom: 15,
    elevation: 3,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 5,
  },
  buttonInner: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 8,
    color: COLORS.primaryColor,
  },
  buttonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
});
