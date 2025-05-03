import React, { useEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useSelector, useDispatch } from "react-redux";
import { fetchShopById } from "../redux/slices/shopSlice";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { COLORS } from "../../theme";
import HomeScreen from "../screens/tabs/HomeScreen";
import OrdersScreen from "../screens/tabs/OrdersScreen";
import MyProducts from "../screens/tabs/MyProducts";
import SettingScreen from "../screens/tabs/SettingScreen";
import ShopScreen from "../screens/tabs/ShopScreen";
import CreateShopScreen from "../screens/CreateShopScreen";
import { useTranslation } from "react-i18next";

const Tab = createBottomTabNavigator();

const TabNavigator = ({ userId }) => {
  const dispatch = useDispatch();
  const { shop, status } = useSelector(state => state.shop);
  const [shopExists, setShopExists] = useState(null);
  const { t, i18n } = useTranslation();  
  const language = useSelector((state) => state.language.language);  

  // Update language
  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language]);

  // Fetch shop by user ID
  useEffect(() => {
    dispatch(fetchShopById(userId));
  }, [dispatch, userId]);

  // Determine whether shop exists
  useEffect(() => {
    if (status === "succeeded") {
      setShopExists(!!shop);
    }
  }, [shop, status]);

  // Conditional shop tab values
  const ShopTabName = shopExists ? t("myShop") : t("createShop");
  const ShopTabComponent = shopExists ? ShopScreen : CreateShopScreen;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === t("home")) {
            iconName = "home-outline";
          } else if (route.name === t("orders")) {
            iconName = "cart-arrow-down";
          } else if (route.name === t("myProducts")) {
            iconName = "archive-plus";
          } else if (route.name === t("settings")) {
            iconName = "cog-outline";
          } else if (route.name === t("myShop") || route.name === t("createShop")) {
            iconName = shopExists ? "storefront" : "plus-box";
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarStyle: {
          backgroundColor: "#fff",
          elevation: 3,
          height: 60,
          paddingVertical: 5,
        },
        tabBarIconStyle: {
          marginBottom: 0,
          marginTop: 5,
        },
        tabBarActiveTintColor: "#fff",
        tabBarActiveBackgroundColor: COLORS.secondaryColor,
        tabBarInactiveTintColor: COLORS.primaryColor,
        tabBarLabelPosition: "below-icon",
        headerShown: false,
      })}
    >
      <Tab.Screen name={t("home")} component={HomeScreen} />
      <Tab.Screen name={t("orders")} component={OrdersScreen} options={{ headerShown: true }} />
      <Tab.Screen name={t("myProducts")} component={MyProducts} options={{ headerShown: false }} />

      <Tab.Screen
        name={ShopTabName}
        component={ShopTabComponent}
        options={{ headerShown: true }}
      />

      <Tab.Screen name={t("settings")} component={SettingScreen} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
