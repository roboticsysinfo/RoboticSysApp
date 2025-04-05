import React, { useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity, Image, ScrollView, Alert, ToastAndroid, ActivityIndicator } from "react-native";
import { TextInput, Button } from "react-native-paper";
import { launchImageLibrary } from "react-native-image-picker";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { registerFarmer } from "../redux/slices/authSlice";
import appLogo from "../../src/assets/kg-logo.jpg";

const RegisterScreen = () => {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [aadharCard, setAadharCard] = useState("");
  const [aadharCardImage, setAadharCardImage] = useState(null);
  const [password, setPassword] = useState("");

  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  // Function to pick Aadhar card image
  const pickAadharCard = async () => {
    const options = { mediaType: "photo", quality: 1 };
    launchImageLibrary(options, (response) => {
      if (!response.didCancel && !response.error) {
        setAadharCardImage(response.assets[0]);
      }
    });
  };


  const handleRegister = async () => {
    if (!name || !email || !phoneNumber || !address || !password || !aadharCard || !aadharCardImage) {
      Alert.alert("Error", "All fields are required.");
      return;
    }

    if (!/^\d{12}$/.test(aadharCard)) {
      Alert.alert("Error", "Aadhar card must be a 12-digit number.");
      return;
    }

    const formData = new FormData(); // ✅ Create Proper FormData Object
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("phoneNumber", phoneNumber);
    formData.append("address", address);
    formData.append("aadharCard", aadharCard);

    const cleanUri = Platform.OS === "android"
    ? `file://${aadharCardImage.uri}`
    : aadharCardImage.uri; // iOS keeps original format
  
  console.log("✅ Fixed Aadhar Image URI:", cleanUri);
  
  formData.append("uploadAadharCard", {
    uri: cleanUri,
    type: aadharCardImage.type || "image/jpeg",
    name: aadharCardImage.fileName || "aadhar.jpg",
  });
  


    console.log("🚀 FormData is ready to be sent!");

    dispatch(registerFarmer(formData))
      .unwrap()
      .then(() => {
        ToastAndroid.show("Registration Successful!", ToastAndroid.SHORT);
        navigation.navigate("Login");
      })
      .catch((err) => {
        console.error("❌ Registration Failed:", err);
        ToastAndroid.show("Registration Failed: " + err.message, ToastAndroid.LONG);
      });


  };


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={appLogo} style={styles.logo} />
        <Text style={styles.title}>Farmer Registration</Text>
      </View>

      <TextInput label="Full Name" mode="outlined" value={name} onChangeText={setName} style={styles.input} />
      <TextInput label="Email" mode="outlined" keyboardType="email-address" value={email} onChangeText={setEmail} style={styles.input} />
      <TextInput maxLength={10} label="Phone Number" mode="outlined" keyboardType="phone-pad" value={phoneNumber} onChangeText={setPhoneNumber} style={styles.input} />
      <TextInput label="Address" mode="outlined" value={address} onChangeText={setAddress} style={styles.input} />
      <TextInput maxLength={12} label="Aadhar Card Number" mode="outlined" keyboardType="numeric" value={aadharCard} onChangeText={setAadharCard} style={styles.input} />
      <TextInput label="Password" mode="outlined" secureTextEntry value={password} onChangeText={setPassword} style={styles.input} />

      <Button mode="outlined" onPress={pickAadharCard} style={styles.uploadButton}>
        Upload Aadhar Card
      </Button>

      {aadharCardImage && <Image source={{ uri: aadharCardImage.uri }} style={styles.previewImage} />}

      <Button mode="contained" onPress={handleRegister} style={styles.registerButton}>
        {loading ? <ActivityIndicator size="small" color="white" /> : "Register"}
      </Button>

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.loginText}>
          Already have an account? <Text style={styles.link}>Login here</Text>
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: "#fff" },
  logoContainer: { alignItems: "center", marginBottom: 20 },
  logo: { width: 150, height: 100, marginBottom: 10, resizeMode: "contain" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
  input: { width: "100%", marginBottom: 12 },
  uploadButton: { width: "100%", marginBottom: 12 },
  previewImage: { width: 200, height: 150, borderRadius: 5, marginVertical: 10 },
  registerButton: { width: "100%", backgroundColor: "#0A8F34", paddingVertical: 8, borderRadius: 5 },
  loginText: { marginTop: 15, fontSize: 14, textAlign: "center", color: "#555" },
  link: { color: "#0A8F34", fontWeight: "bold" },
});

export default RegisterScreen;