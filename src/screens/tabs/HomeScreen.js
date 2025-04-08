import React, { useEffect, useState } from "react";
import { View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Avatar, Button, Card, Divider, Text, Badge } from "react-native-paper";
import { COLORS } from "../../../theme";
import { useDispatch, useSelector } from "react-redux";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import CustomDrawer from "../../navigation/CustomDrawer";
import OrdersCounts from "../../components/OrdersCount";
import FIcon from "react-native-vector-icons/FontAwesome6";
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { fetchNotifications } from '../../redux/slices/notificationSlice';
import { fetchShopById } from "../../redux/slices/shopSlice";
import { getOrderRequestByFarmerId } from "../../redux/slices/orderSlice";
import AdminMessagesScreen from "../../components/AdminMessage";
import CustomHeader from "../../components/CustomHeader";
import { getFarmerById } from "../../redux/slices/authSlice";


const HomeScreen = () => {

  const { user, farmerDetails } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { shop, status } = useSelector(state => state.shop);
  const [shopExists, setShopExists] = useState(null);

  const farmerId = user?.id;
  const points = farmerDetails?.points;

  const unreadCount = useSelector((state) => state.notifications.unreadCount);
  // Drawer ka state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);


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
      setShopExists(!!shop); // True if shop exists, false otherwise
    }
  }, [shop, status]);

  // Toggle function
  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (

    <View style={styles.container}>

      {/* ✅ Header */}
      <CustomHeader
        toggleDrawer={toggleDrawer}
        user={user}
        points={points}
        unreadCount={unreadCount}
      />


      {/* ✅ Drawer */}
      <CustomDrawer isOpen={isDrawerOpen} closeDrawer={toggleDrawer} />

      {/* ✅ Scrollable Content */}
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>

        {/* Order Count */}
        <OrdersCounts />

        <Divider style={{ borderWidth: 1, borderColor: "#efefef", marginVertical: 10 }} />

        {/* Admin Messages */}
        <AdminMessagesScreen />

        {/* Action Buttons */}
        <View style={styles.actionBtns}>

          <Button
            mode="contained"
            style={styles.actionBtnItem}
            contentStyle={styles.buttonContent}
            onPress={() => navigation.navigate('Add New Product')}
          >
            <View style={styles.buttonInner}>
              <FIcon name="cart-plus" size={24} style={styles.icon} />
              <Text style={styles.buttonText}>Add New Product</Text>
            </View>
          </Button>

          {shopExists ? (
            <Button
              mode="contained"
              style={styles.actionBtnItem}
              contentStyle={styles.buttonContent}
              onPress={() => navigation.navigate('Edit Shop', { shopId: shop._id })}
            >
              <View style={styles.buttonInner}>
                <Icon name="pencil" size={24} style={styles.icon} />
                <Text style={styles.buttonText}>Edit Shop</Text>
              </View>
            </Button>
          ) : (
            <Button
              mode="contained"
              style={styles.actionBtnItem}
              contentStyle={styles.buttonContent}
              onPress={() => navigation.navigate('Create Shop')}
            >
              <View style={styles.buttonInner}>
                <Icon name="storefront" size={24} style={styles.icon} />
                <Text style={styles.buttonText}>Create Shop</Text>
              </View>
            </Button>
          )}
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

  // 🔹 Header Styling

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // Items evenly spaced
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    marginTop: 10,
  },

  menuButton: {
    padding: 5,
  },

  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  profileInfo: {
    marginLeft: 15,
  },

  nameText: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.lightBlack,
  },

  subText: {
    fontSize: 14,
    color: COLORS.primaryColor,
  },

  notificationButton: {
    padding: 5,
  },

  actionBtns: {
    paddingTop: 10,
    paddingHorizontal: 20
  },

  actionBtnItem: {
    backgroundColor: "#fff",
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#efefef",
    marginBottom: 15,
    elevation: 3
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
    color: COLORS.primaryColor
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  notificationWrapper: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: 'red',
    color: '#fff',
    fontSize: 10,
    height: 18,
    minWidth: 18,
    textAlign: 'center',
    borderRadius: 9,
    paddingHorizontal: 4,
  },


});
