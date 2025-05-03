import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerFarmer } from "../redux/slices/authSlice";
import * as ImagePicker from "react-native-image-picker";
import { ActivityIndicator, TextInput, Button, Checkbox, Text } from "react-native-paper";
import { View, StyleSheet, Image, ScrollView, TouchableOpacity } from "react-native";
import appLogo from "../../src/assets/kg-logo.jpg";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import api from "../services/api";
import { Dropdown } from "react-native-element-dropdown"; // Import Dropdown


const RegisterScreen = () => {

  const route = useRoute();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const language = useSelector((state) => state.language.language);

  const referralFromParams = route.params?.ref || "";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [aadharCard, setAadharCard] = useState("");
  const [password, setPassword] = useState("");
  const [aadharImage, setAadharImage] = useState(null);
  const [profileImg, setProfileImg] = useState(null);
  const [state, setState] = useState("");
  const [city_district, setCityDistrict] = useState("");
  const [statesList, setStatesList] = useState([]);
  const [citiesList, setCitiesList] = useState([]);
  const [referralCode, setReferralCode] = useState(referralFromParams);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [termsAndConditions, setTermsAndConditions] = useState(false);
  

  useEffect(() => {
    i18n.changeLanguage(language);
    fetchStates();
  }, [language]);

  const fetchStates = async () => {
    try {
      const response = await api.get('/states-cities');
      const states = response.data.map(item => item.state);
      setStatesList(states);
    } catch (error) {
      console.error("Error fetching states:", error);
    }
  };

  const fetchCities = async (selectedState) => {
    try {
      const response = await api.get('/states-cities');
      const selectedStateData = response.data.find(item => item.state === selectedState);
      if (selectedStateData) {
        setCitiesList(selectedStateData.districts);
      }
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  const handlePickImage = () => {
    ImagePicker.launchImageLibrary({ mediaType: "photo" }, (response) => {
      if (response.didCancel || response.errorCode) return;

      if (response.assets && response.assets.length > 0) {
        setProfileImg(response.assets[0]);
      }
    });
  };

  const handlePickAadharImage = () => {
    ImagePicker.launchImageLibrary({ mediaType: "photo" }, (response) => {
      if (response.didCancel || response.errorCode) return;

      if (response.assets && response.assets.length > 0) {
        setAadharImage(response.assets[0]);
      }
    });
  };


  const validateFields = () => {
    const newErrors = {};

    if (!name.trim()) newErrors.name = "Full Name is required";
    if (!email.trim()) newErrors.email = "Email is required";
    if (!phoneNumber.trim()) newErrors.phoneNumber = "Phone Number is required";
    if (!address.trim()) newErrors.address = "Address is required";
    if (!aadharCard.trim()) newErrors.aadharCard = "Aadhaar Number is required";
    if (!password.trim()) newErrors.password = "Password is required";
    if (!state) newErrors.state = "State is required";
    if (!city_district) newErrors.city_district = "City/District is required";
    if (!aadharImage) newErrors.aadharImage = "Aadhaar image is required";
    if (!termsAndConditions) newErrors.termsAndConditions = "You must agree to the Terms & Conditions and Privacy Policy";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateFields()) return;

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("phoneNumber", phoneNumber);
    formData.append("address", address);
    formData.append("aadharCard", aadharCard);
    formData.append("referralCode", referralCode);
    formData.append("state", state);
    formData.append("city_district", city_district);

    formData.append("uploadAadharCard", {
      uri: aadharImage.uri,
      type: aadharImage.type || "image/jpeg",
      name: aadharImage.fileName || "aadhar.jpg",
    });
    formData.append("profileImg", {
      uri: profileImg.uri,
      type: profileImg.type || "image/jpeg",
      name: profileImg.fileName || "profile.jpg",
    });
    formData.append("agreedToPrivacyPolicyAndTermsAndConditions", termsAndConditions ? "true" : "false");
    formData.append("agreementTimestamp", new Date().toISOString());

    setLoading(true);
    const result = await dispatch(registerFarmer(formData));
    setLoading(false);

    if (registerFarmer.fulfilled.match(result)) {
      alert(result.payload.message);
      navigation.replace(t("KYC Pending"));
    } else {
      alert(result.payload);
    }
  };

  return (

    <ScrollView contentContainerStyle={styles.container}>

      <View style={styles.logoContainer}>
        <Image source={appLogo} style={styles.logo} />
        <Text style={styles.title}>{t('Farmer Registration')}</Text>
      </View>

      <TextInput
        label={t('Full Name')}
        mode="outlined"
        value={name}
        onChangeText={setName}
        style={styles.input}
        error={!!errors.name}
      />
      {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

      <TextInput
        label={t('Email')}
        mode="outlined"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        error={!!errors.email}
      />
      {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

      <TextInput
        maxLength={10}
        label={t('Enter Phone Number')}
        mode="outlined"
        keyboardType="phone-pad"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        style={styles.input}
        error={!!errors.phoneNumber}
      />
      {errors.phoneNumber && <Text style={styles.errorText}>{errors.phoneNumber}</Text>}

      <TextInput
        label={t('Address')}
        mode="outlined"
        value={address}
        onChangeText={setAddress}
        style={styles.input}
        error={!!errors.address}
      />
      {errors.address && <Text style={styles.errorText}>{errors.address}</Text>}

      <TextInput
        maxLength={12}
        label={t('Aadhaar Card Number')}
        mode="outlined"
        keyboardType="numeric"
        value={aadharCard}
        onChangeText={setAadharCard}
        style={styles.input}
        error={!!errors.aadharCard}
      />
      {errors.aadharCard && <Text style={styles.errorText}>{errors.aadharCard}</Text>}

      <TextInput
        label={t('Password')}
        mode="outlined"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        error={!!errors.password}
      />
      {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

      <TextInput
        label={t('Referral Code (optional)')}
        mode="outlined"
        value={referralCode}
        onChangeText={setReferralCode}
        style={styles.input}
      />

      <Dropdown
        style={styles.dropdownMenu}
        data={statesList.map(state => ({ label: state, value: state }))}
        labelField="label"
        valueField="value"
        value={state}
        onChange={item => {
          setState(item.value);
          fetchCities(item.value);
        }}
        placeholder={t("Select State")}
        error={!!errors.state}
      />
      {errors.state && <Text style={styles.errorText}>{errors.state}</Text>}


      <Dropdown
        style={styles.dropdownMenu}
        data={citiesList.map(city => ({ label: city, value: city }))}
        labelField="label"
        valueField="value"
        value={city_district}
        onChange={item => setCityDistrict(item.value)}
        placeholder={t("Select City/District")}
        error={!!errors.city_district}
      />
      {errors.city_district && <Text style={styles.errorText}>{errors.city_district}</Text>}


      <TouchableOpacity onPress={handlePickAadharImage} style={styles.imagePicker}>
        <Text>{t('Upload Aadhaar Image')}</Text>
      </TouchableOpacity>
      {errors.aadharImage && <Text style={styles.errorText}>{errors.aadharImage}</Text>}
      {aadharImage && (
        <Image
          source={{ uri: aadharImage.uri }}
          style={{ width: 100, height: 100, marginBottom: 10 }}
        />
      )}

      <TouchableOpacity onPress={handlePickImage} style={styles.imagePicker}>
        <Text>{t('Upload Profile Image')}</Text>
      </TouchableOpacity>
      {errors.profileImg && <Text style={styles.errorText}>{errors.profileImg}</Text>}
      {profileImg && (
        <Image
          source={{ uri: profileImg.uri }}
          style={{ width: 100, height: 100, marginBottom: 10, borderRadius: 50 }}
        />
      )}




      <View style={styles.checkboxContainer}>
        <Checkbox
          status={termsAndConditions ? "checked" : "unchecked"}
          onPress={() => setTermsAndConditions(!termsAndConditions)}
        />
        <Text style={styles.checkboxText}>{t("Agree to Terms & Conditions")}</Text>
      </View>
      {errors.termsAndConditions && <Text style={styles.errorText}>{errors.termsAndConditions}</Text>}


      <Button
        mode="contained"
        onPress={handleRegister}
        style={styles.submitButton}
        loading={loading}
        disabled={loading}
      >
        {t("Register")}
      </Button>
      
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  logoContainer: { alignItems: "center", marginBottom: 20 },
  logo: { width: 100, height: 100, marginBottom: 10 },
  title: { fontSize: 24, fontWeight: "bold" },
  input: { marginBottom: 10 },
  errorText: { color: "red", fontSize: 12 },
  imagePicker: { marginBottom: 10, padding: 10, backgroundColor: "#e0e0e0", borderRadius: 5 },
  dropdownMenu: { backgroundColor: "#fff", marginVertical: 10, borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10 },
  checkboxContainer: { flexDirection: "row", alignItems: "center" },
  checkboxText: { marginLeft: 10 },
  submitButton: { marginTop: 20 },
});

export default RegisterScreen;
