import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from '../screens/SplashScreen';
import OtpScreen from '../screens/OtpScreen';
import TabNavigator from './TabNavigator';
import PNLoginScreen from '../screens/PNLoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import SelectLang from '../screens/SelectLang';
import { useDispatch } from 'react-redux';
import { loadLanguage } from '../redux/slices/languageSlice';
import OrdersScreen from '../screens/tabs/OrdersScreen';
import SettingScreen from '../screens/tabs/SettingScreen';
import NotificationsScreen from '../screens/tabs/NotificationsScreen';
import MyProducts from '../screens/tabs/MyProducts';
import { setUser } from '../redux/slices/authSlice';
import EditShopScreen from '../screens/EditShopScreen';
import EditProductScreen from '../screens/EditProductScreen';
import AddProductScreen from '../screens/AddProductScreen';
import CreateShopScreen from '../screens/CreateShopScreen';
import ShopScreen from '../screens/tabs/ShopScreen';


const Stack = createStackNavigator();

const AppNavigator = () => {
  const dispatch = useDispatch();
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [isLanguageSet, setIsLanguageSet] = useState(null);  // NEW STATE for Language

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const farmerData = await AsyncStorage.getItem("farmer");
  
        if (token && farmerData) {
          dispatch(setUser(JSON.parse(farmerData))); // Load farmer into Redux
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
          setIsLanguageSet(true); // Language already set
        } else {
          setIsLanguageSet(false); // Language not set
        }
      } catch (error) {
        console.log("Error fetching language:", error);
      }
    };

    fetchLanguage();
  }, [dispatch]);

  if (isLoggedIn === null || isLanguageSet === null) {
    return null; // Prevents flicker before determining states
  }

  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName={
          isLoggedIn 
            ? 'Home' 
            : isLanguageSet 
              ? 'Login' // If language is set, go to login
              : 'Select Language' // Otherwise, go to Select Language first
        }
      >
        <Stack.Screen name="SplashScreen" component={SplashScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={PNLoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="OTP Verify" component={OtpScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={TabNavigator} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Select Language" component={SelectLang} options={{ headerShown: false }} />

        <Stack.Screen name="Orders" component={OrdersScreen} options={{ headerShown: true }} />
        <Stack.Screen name="Settings" component={SettingScreen} options={{ headerShown: true }} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} options={{ headerShown: true }} />
        <Stack.Screen name="My Products" component={MyProducts} options={{ headerShown: true }} />

       
        <Stack.Screen name="Create Shop" component={CreateShopScreen} options={{ headerShown: true }} />
        <Stack.Screen name="Edit Shop" component={EditShopScreen} options={{ headerShown: true }} />

        <Stack.Screen name="Add New Product" component={AddProductScreen} options={{ headerShown: true }} />
        <Stack.Screen name="Edit Product" component={EditProductScreen} options={{ headerShown: true }} />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
