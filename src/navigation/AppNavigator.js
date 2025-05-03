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
import FamilyFarmerRequestScreen from '../screens/FamilyFarmerRequestScreen';
import FamilyCustomersList from '../screens/FamilyCustomersList';
import { useTranslation } from 'react-i18next';
import UpgradePointsScreen from '../screens/UpgradePointsScreen';
import UpgradePlansScreen from '../screens/UpgradePlansScreen';
import ShopScreen from '../screens/tabs/ShopScreen';
import ActivePlansScreen from '../screens/ActivePlansScreen';
import MandiPricesScreen from '../screens/MandiPricesScreen';
import ReferralListScreen from '../screens/ReferralListScreen';


const Stack = createStackNavigator();

const AppNavigator = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation()
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
        <Stack.Screen name={t("Profile")} component={ProfileScreen} options={{ headerShown: true }} />
        <Stack.Screen name={t("Select Language")} component={SelectLang} options={{ headerShown: false }} />
        <Stack.Screen name={t("Create Shop")} component={CreateShopScreen} options={{ headerShown: true }} />
        <Stack.Screen name={t("My Details")} component={ProfileScreen} options={{ headerShown: true }} />
        <Stack.Screen name={t("Edit Shop")} component={EditShopScreen} options={{ headerShown: true }} />
        <Stack.Screen name={t("Add New Product")} component={AddProductScreen} options={{ headerShown: true }} />
        <Stack.Screen name={t("Edit Product")} component={EditProductScreen} options={{ headerShown: true }} />
        <Stack.Screen name={t("Notifications")} component={NotificationsScreen} options={{ headerShown: true }} />
        <Stack.Screen name={t("Delivery Preference")} component={DeliveryPreference} options={{ headerShown: true }} />
        <Stack.Screen name={t("My Shop Reviews")} component={ShopReviewsScreen} options={{ headerShown: true }} />
        <Stack.Screen name={t("Contact")} component={HelpSupportScreen} options={{ headerShown: true }} />

        <Stack.Screen name={t("KYC Pending")} component={KYCPendingScreen} options={{ headerShown: false }} />

        <Stack.Screen name={t("All Shops")} component={AllShopsScreen} options={{ headerShown: true }} />
        <Stack.Screen name={t("Shop Details")} component={ShopDetailsScreen} options={{ headerShown: true }} />
        <Stack.Screen name={t("Orders")} component={OrdersScreen} />
        <Stack.Screen name={t("Weather")} component={WeatherScreen} options={{ headerShown: true }}/>

        <Stack.Screen name={t("ReferandEarn")} component={ReferAndEarnScreen} options={{ headerShown: false }}/>
        <Stack.Screen name={t("Point Transactions")} component={PointTransactionScreen} options={{ headerShown: true }}/>

        <Stack.Screen name={t("Farming Tips")} component={FarmingTipsScreen} options={{ headerShown: true }}/>

        <Stack.Screen name={t("Family Farmer Requests")} component={FamilyFarmerRequestScreen} options={{ headerShown: true }}/>

        <Stack.Screen name={t("Family Customers List")} component={FamilyCustomersList} options={{ headerShown: true }}/>
        
        <Stack.Screen name={t("UpgradePoints")} component={UpgradePointsScreen} options={{ headerShown: false }}/>
        <Stack.Screen name={t("UpgradePlans")} component={UpgradePlansScreen} options={{ headerShown: false }}/>

        <Stack.Screen name={t("ActivePlans")} component={ActivePlansScreen} options={{ headerShown: false }}/>

        <Stack.Screen name={t("MandiPrice")} component={MandiPricesScreen} options={{ headerShown: false }}/>

        <Stack.Screen name="ReferralList" component={ReferralListScreen} options={{ headerShown: false }} />


      </Stack.Navigator>
      
    </NavigationContainer>
  );
};

export default AppNavigator;
