import React, { useEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useSelector, useDispatch } from "react-redux";
import { fetchShopById } from "../redux/slices/shopSlice"; // Import API action
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { COLORS } from "../../theme";
import HomeScreen from "../screens/tabs/HomeScreen";
import OrdersScreen from "../screens/tabs/OrdersScreen";
import MyProducts from "../screens/tabs/MyProducts";
import SettingScreen from "../screens/tabs/SettingScreen";
import ShopScreen from "../screens/tabs/ShopScreen"; // My Shop
import CreateShopScreen from "../screens/CreateShopScreen";


const Tab = createBottomTabNavigator();


const TabNavigator = ({ userId }) => {


   const dispatch = useDispatch();
   const { shop, status } = useSelector(state => state.shop);
   const [shopExists, setShopExists] = useState(null);


   useEffect(() => {
      dispatch(fetchShopById(userId));
   }, [dispatch, userId]);


   useEffect(() => {
      if (status === "succeeded") {
         setShopExists(!!shop); // True if shop exists, false otherwise
      }
   }, [shop, status]);


   return (
      <Tab.Navigator
         screenOptions={({ route }) => ({

            tabBarIcon: ({ focused, color, size }) => {
               let iconName;
               if (route.name === "Home") {
                  iconName = "home-outline";
               } else if (route.name === "Orders") {
                  iconName = "cart-arrow-down";
               } else if (route.name === "My Products") {
                  iconName = "archive-plus";
               } else if (route.name === "Settings") {
                  iconName = "cog-outline";
               } else if (route.name === "My Shop" || route.name === "Create Shop") {
                  iconName = shopExists ? "storefront" : "plus-box"; // Dynamic Icon Change
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
               marginTop: 5
            },
            tabBarActiveTintColor: "#fff",
            tabBarActiveBackgroundColor: COLORS.secondaryColor,
            tabBarInactiveTintColor: COLORS.primaryColor,
            tabBarLabelPosition: "below-icon",
            headerShown: false,
         })}
      >
         <Tab.Screen name="Home" component={HomeScreen} />
         <Tab.Screen name="Orders" component={OrdersScreen} options={{ headerShown: true }} />
         <Tab.Screen name="My Products" component={MyProducts} options={{ headerShown: true }} />

         {/* Shop Screen (Dynamically Rendered) */}
         {shopExists ? (
            <Tab.Screen name="My Shop" component={ShopScreen} options={{ headerShown: true }} />
         ) : (
            <Tab.Screen name="Create Shop" component={CreateShopScreen} options={{ headerShown: true }} />
         )}

         <Tab.Screen name="Settings" component={SettingScreen} />
      </Tab.Navigator>
   );
};

export default TabNavigator;
