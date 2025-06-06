import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../redux/slices/authSlice";
import languageReducer from "../redux/slices/languageSlice";
import productsReducer from "../redux/slices/productSlice";
import requestOrderReducer from "../redux/slices/orderSlice";
import shopReducer from "../redux/slices/shopSlice";
import categoryReducer from "../redux/slices/categorySlice";
import deliveryPreferenceReducer from "../redux/slices/deliveryPreferenceSlice";
import notificationsReducer from "../redux/slices/notificationSlice"
import reviewReducer from "../redux/slices/reviewSlice"
import adminReducer from "../redux/slices/adminSlice";
import redeemProductsReducer from "../redux/slices/redeemProductSlice";
import weatherReducer from "../redux/slices/weatherSlice";
import rewardReducer from "../redux/slices/rewardSlice";
import farmingTipsReducer from "../redux/slices/farmingTipsSlice";
import familyFarmerReducer from "../redux/slices/familyFarmerSlice"
import farmerPlanReducer from "../redux/slices/farmerPlanSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { persistStore, persistReducer } from "redux-persist";



// 🔹 Persist Config
const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ['weather'],
};


// 🔹 Wrap Reducers with PersistReducer
const persistedAuthReducer = persistReducer(persistConfig, authReducer);

const store = configureStore({

  reducer: {
    auth: persistedAuthReducer, // Auth reducer persist 
    weather: weatherReducer,
    language: languageReducer,
    products: productsReducer,
    requestOrder: requestOrderReducer,
    shop: shopReducer,
    categories: categoryReducer,
    deliveryPreference: deliveryPreferenceReducer,
    notifications: notificationsReducer,
    reviews: reviewReducer,
    adminData: adminReducer,
    redeemProducts: redeemProductsReducer,
    reward: rewardReducer,
    farmingTips: farmingTipsReducer,
    familyfarmer: familyFarmerReducer,
    farmerPlan: farmerPlanReducer
  },
  
  devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Persist ke errors ko avoid karne ke liye
    }),
});

const persistor = persistStore(store);

export { store, persistor };
