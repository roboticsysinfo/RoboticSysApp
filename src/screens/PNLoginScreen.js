import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import appLogo from "../../src/assets/kg-logo.jpg";
import '../../config/i18n';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { sendOTP } from '../redux/slices/authSlice'; // Import Redux action

const PNLoginScreen = () => {
  const { t, i18n } = useTranslation();
  const [phoneNumber, setphoneNumber] = useState('');
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const language = useSelector((state) => state.language.language);
  const { otpSent, isKYCVerified, loading } = useSelector((state) => state.auth);
  

  // Update language
  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language]);

  // const handleSendOTP = () => {

  //   if (!phoneNumber || phoneNumber.length !== 10) {
  //     Alert.alert("Error", t('Please enter a valid phone number.'));
  //     return;
  //   }

  //   dispatch(sendOTP(phoneNumber)).then((result) => {

  //     if (sendOTP.fulfilled.match(result)) {
  //       navigation.replace('OTP Verify', { phoneNumber }); // Navigate to OTP screen if successful
  //     } else {
  //       Alert.alert("Error", result.payload?.message || t('Cannot Find Phone Number, Please Use Another Number') );
  //     }
  //   });

  // };


  const handleSendOTP = () => {
    if (!phoneNumber || phoneNumber.length !== 10) {
      Alert.alert("Error", t('Please enter a valid phone number.'));
      return;
    }
  
    dispatch(sendOTP(phoneNumber)).then((result) => {
      if (sendOTP.fulfilled.match(result)) {
        const { isKYCVerified } = result.payload;
  
        if (!isKYCVerified) {
          navigation.replace('KYC Pending'); // 🚨 Navigate to KYC pending screen
        } else {
          navigation.replace('OTP Verify', { phoneNumber }); // ✅ Verified, go to OTP screen
        }
  
      } else {
        Alert.alert("Error", result.payload?.message || t('Cannot Find Phone Number, Please Use Another Number'));
      }
    });
  };
  



  return (

    <View style={styles.container}>

      {/* Logo Section */}
      <View style={styles.logoContainer}>
        <Image source={appLogo} style={styles.logo} />
        <Text style={styles.title}>{t('Login')}</Text>
      </View>

      {/* Mobile Number Input */}
      <TextInput
        label={t('Enter Phone Number')}
        value={phoneNumber}
        onChangeText={setphoneNumber}
        keyboardType="phone-pad"
        maxLength={10}
        style={styles.input}
        mode="outlined"
      />

      {/* Send OTP Button */}
      <Button mode="contained" onPress={handleSendOTP} style={styles.button} loading={loading}>
        {t('Send OTP')}
      </Button>

      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={styles.loginText}>
          {t('Dont have an account?')} <Text style={styles.link}>{t('Register Here')}</Text>{"\n"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default PNLoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#00A859',
    marginTop: 8,
  },
  input: {
    width: '100%',
    marginBottom: 20,
  },
  button: {
    width: '100%',
    paddingVertical: 8,
    backgroundColor: '#00A859',
    borderRadius: 4
  },
  loginText: {
    marginTop: 15,
    fontSize: 14,
    textAlign: "center",
    color: "#555",
  },
  link: {
    color: "#0A8F34",
    fontWeight: "bold",
  },
});
