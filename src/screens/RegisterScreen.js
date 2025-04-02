import React, { useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity, Image, ScrollView, Alert } from "react-native";
import { TextInput, Button } from "react-native-paper";
import { launchImageLibrary } from "react-native-image-picker";
import appLogo from "../../src/assets/farmer.png";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { registerFarmer, resetFarmerState } from "../redux/slices/authSlice";
import { useTranslation } from "react-i18next";

const RegisterScreen = () => {

  const { t, i18n } = useTranslation();
  const language = useSelector((state) => state.language.language);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [aadharCardImage, setAadharCardImage] = useState(null);
  const [password, setPassword] = useState("");

  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { loading, success, error, message } = useSelector((state) => state.farmer);

  // Function to pick Aadhar card image
  const pickAadharCard = async () => {
    const options = { mediaType: "photo", quality: 1 };
    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.error) {
        console.log("Image selection error:", response.error);
      } else {
        setAadharCardImage(response.assets[0]);
      }
    });
  };

  const handleRegister = async () => {
    if (!fullName || !email || !phoneNumber || !address || !password || !aadharCardImage) {
      Alert.alert("Error", "All fields are required.");
      return;
    }

    const formData = new FormData();
    formData.append("name", fullName);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("phoneNumber", phoneNumber);
    formData.append("address", address);
    formData.append("aadharCard", aadharCard); // Assuming a default Aadhar number for now
    formData.append("uploadAadharCard", {
      uri: aadharCardImage.uri,
      type: aadharCardImage.type,
      name: aadharCardImage.fileName || "aadhar.jpg",
    });

    dispatch(registerFarmer(formData));
  };

  // Handle Success or Failure
  React.useEffect(() => {
    if (success) {
      Alert.alert("Success", message, [{ text: "OK", onPress: () => navigation.replace("Login") }]);
      dispatch(resetFarmerState());
    } else if (error) {
      Alert.alert("Error", error);
    }
  }, [success, error]);

  // update language
  React.useEffect(() => {
    i18n.changeLanguage(language);
  }, [language]);


  return (

    <ScrollView key={language} contentContainerStyle={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={appLogo} style={styles.logo} />
        <Text style={styles.title}>{t('Farmer Registration')}</Text>
      </View>

      <TextInput label={t('Full Name')} mode="outlined" value={fullName} onChangeText={setFullName} style={styles.input} />
      <TextInput label={t('Email')} mode="outlined" keyboardType="email-address" value={email} onChangeText={setEmail} style={styles.input} />
      <TextInput label={t('Enter Phone Number')} mode="outlined" keyboardType="phone-pad" value={phoneNumber} onChangeText={setPhoneNumber} style={styles.input} />
      <TextInput label={t('Address')} mode="outlined" value={address} onChangeText={setAddress} style={styles.input} />
      <TextInput label={t('Password')} mode="outlined" secureTextEntry value={password} onChangeText={setPassword} style={styles.input} />

      <Button mode="outlined" onPress={pickAadharCard} style={styles.uploadButton}>
        {t('Upload Aadhar Card')}
      </Button>

      {aadharCardImage && <Image source={{ uri: aadharCardImage.uri }} style={styles.previewImage} />}

      <Button mode="contained" onPress={handleRegister} style={styles.registerButton} loading={loading} disabled={loading}>
        {loading ? t('Registering') : t('Register')}
      </Button>


      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.loginText}>
          {t('Already have an account?')} <Text style={styles.link}>{t('Login here')}</Text>
        </Text>
      </TouchableOpacity>
    </ScrollView>

  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: "#fff" },
  logoContainer: { alignItems: "center", marginBottom: 20 },
  logo: { width: 100, height: 100, marginBottom: 10 },
  input: { width: "100%", marginBottom: 12 },
  uploadButton: { width: "100%", marginBottom: 12 },
  previewImage: { width: 200, height: 150, borderRadius: 5, marginVertical: 10 },
  registerButton: { width: "100%", backgroundColor: "#0A8F34", paddingVertical: 8, borderRadius: 5 },
  loginText: { marginTop: 15, fontSize: 14, textAlign: "center", color: "#555" },
  link: { color: "#0A8F34", fontWeight: "bold" },
});

export default RegisterScreen;
