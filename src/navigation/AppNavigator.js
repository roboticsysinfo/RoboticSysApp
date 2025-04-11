import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from '../screens/SplashScreen';
import OtpScreen from '../screens/OtpScreen';
import PNLoginScreen from '../screens/PNLoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import SelectLang from '../screens/SelectLang';
import { useDispatch } from 'react-redux';
import { loadLanguage } from '../redux/slices/languageSlice';
import { setUser } from '../redux/slices/authSlice';
import EditShopScreen from '../screens/EditShopScreen';
import EditProductScreen from '../screens/EditProductScreen';
import AddProductScreen from '../screens/AddProductScreen';
import CreateShopScreen from '../screens/CreateShopScreen';
import TabNavigator from './TabNavigator';
import NotificationsScreen from '../screens/tabs/NotificationsScreen';
import DeliveryPreference from '../screens/DeliveryPreference';
import ProfileScreen from '../screens/ProfileScreen';
import ShopReviewsScreen from '../screens/ShopReviewsScreen';
import HelpSupportScreen from "../screens/HelpSupportScreen"
import ShopDetailsScreen from '../screens/ShopDetailsScreen';
import AllShopsScreen from '../screens/AllShopsScreen';
import OrdersScreen from '../screens/tabs/OrdersScreen';
import KYCPendingScreen from '../screens/KYCPendingScreen';
import ReferAndEarnScreen from '../screens/ReferAndEarnScreen';
import { navigationRef } from '../services/navigationService';
import WeatherScreen from '../screens/WeatherScreen';
import PointTransactionScreen from '../screens/PointTransactionScreen';
import FarmingTipsScreen from '../screens/FarmingTipsScreen';


const Stack = createStackNavigator();

const AppNavigator = () => {
  const dispatch = useDispatch();
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [isLanguageSet, setIsLanguageSet] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const farmerData = await AsyncStorage.getItem("farmer");

        if (token && farmerData) {
          dispatch(setUser(JSON.parse(farmerData)));
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Error checking auth:", error);
      }
    };

    checkAuth();
  }, []);


  useEffect(() => {
    const fetchLanguage = async () => {
      try {
        const savedLang = await AsyncStorage.getItem('selectedLanguage');
        if (savedLang) {
          dispatch(loadLanguage(savedLang));
          setIsLanguageSet(true);
        } else {
          setIsLanguageSet(false);
        }
      } catch (error) {
        console.log("Error fetching language:", error);
      }
    };

    fetchLanguage();
  }, [dispatch]);

  if (isLoggedIn === null || isLanguageSet === null) {
    return null;
  }

  return (
    <NavigationContainer ref={navigationRef}>

      <Stack.Navigator initialRouteName={isLoggedIn ? 'Dashboard' : isLanguageSet ? 'Login' : 'Select Language'}>

        <Stack.Screen name="Dashboard" component={TabNavigator} options={{ headerShown: false }} />
        <Stack.Screen name="SplashScreen" component={SplashScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={PNLoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="OTP Verify" component={OtpScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: true }} />
        <Stack.Screen name="Select Language" component={SelectLang} options={{ headerShown: false }} />
        <Stack.Screen name="Create Shop" component={CreateShopScreen} options={{ headerShown: true }} />
        <Stack.Screen name="My Details" component={ProfileScreen} options={{ headerShown: true }} />
        <Stack.Screen name="Edit Shop" component={EditShopScreen} options={{ headerShown: true }} />
        <Stack.Screen name="Add New Product" component={AddProductScreen} options={{ headerShown: true }} />
        <Stack.Screen name="Edit Product" component={EditProductScreen} options={{ headerShown: true }} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} options={{ headerShown: true }} />
        <Stack.Screen name="Delivery Preference" component={DeliveryPreference} options={{ headerShown: true }} />
        <Stack.Screen name="My Shop Reviews" component={ShopReviewsScreen} options={{ headerShown: true }} />
        <Stack.Screen name="Contact" component={HelpSupportScreen} options={{ headerShown: true }} />

        <Stack.Screen name="KYC Pending" component={KYCPendingScreen} options={{ headerShown: false }} />

        <Stack.Screen name="All Shops" component={AllShopsScreen} options={{ headerShown: true }} />
        <Stack.Screen name="Shop Details" component={ShopDetailsScreen} options={{ headerShown: true }} />
        <Stack.Screen name="Orders" component={OrdersScreen} />
        <Stack.Screen name="Weather" component={WeatherScreen} options={{ headerShown: true }}/>

        <Stack.Screen name="ReferandEarn" component={ReferAndEarnScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Point Transactions" component={PointTransactionScreen} options={{ headerShown: true }}/>

        <Stack.Screen name="Farming Tips" component={FarmingTipsScreen} options={{ headerShown: true }}/>

      </Stack.Navigator>
      
    </NavigationContainer>
  );
};

export default AppNavigator;
