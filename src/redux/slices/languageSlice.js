import { createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '../../../config/i18n';

const initialState = {
  language: 'en',
};

const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    setLanguage: (state, action) => {
      state.language = action.payload;
      i18n.changeLanguage(action.payload);
      AsyncStorage.setItem('selectedLanguage', action.payload);
    },
    loadLanguage: (state, action) => {
      state.language = action.payload;
      i18n.changeLanguage(action.payload);
    },
  },
});

export const { setLanguage, loadLanguage } = languageSlice.actions;
export default languageSlice.reducer;
