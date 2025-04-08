import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { registerFarmer } from "../redux/slices/authSlice";
import * as ImagePicker from "react-native-image-picker";
import { ActivityIndicator, TextInput, Button } from "react-native-paper";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import appLogo from "../../src/assets/kg-logo.jpg";
import { useNavigation, useRoute } from "@react-navigation/native";

const RegisterScreen = () => {


  const route = useRoute();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const referralFromParams = route.params?.ref || "";  //  Get referral code for auto fill

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [aadharCard, setAadharCard] = useState("");
  const [password, setPassword] = useState("");
  const [aadharImage, setAadharImage] = useState(null);
  const [referralCode, setReferralCode] = useState(referralFromParams); // Auto-fill
  const [loading, setLoading] = useState(false);


  const handlePickImage = () => {
    ImagePicker.launchImageLibrary({ mediaType: "photo" }, (response) => {
      if (response.didCancel || response.errorCode) return;

      if (response.assets && response.assets.length > 0) {
        setAadharImage(response.assets[0]);
      }
    });
  };

  const handleRegister = async () => {
    if (!name || !email || !password || !phoneNumber || !address || !aadharImage) {
      alert("All fields are required including Aadhaar Card image");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("phoneNumber", phoneNumber);
    formData.append("address", address);
    formData.append("aadharCard", aadharCard);
    formData.append("referralCode", referralCode);
    formData.append("uploadAadharCard", {
      uri: aadharImage.uri,
      type: aadharImage.type || "image/jpeg",
      name: aadharImage.fileName || "aadhar.jpg",
    });

    setLoading(true);
    const result = await dispatch(registerFarmer(formData));
    setLoading(false);

    if (registerFarmer.fulfilled.match(result)) {
      alert(result.payload.message);
      navigation.replace("KYC Pending"); 
    } else {
      alert(result.payload);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={appLogo} style={styles.logo} />
        <Text style={styles.title}>Farmer Registration</Text>
      </View>

      <TextInput
        label="Full Name"
        mode="outlined"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        label="Email"
        mode="outlined"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        maxLength={10}
        label="Phone Number"
        mode="outlined"
        keyboardType="phone-pad"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        style={styles.input}
      />
      <TextInput
        label="Address"
        mode="outlined"
        value={address}
        onChangeText={setAddress}
        style={styles.input}
      />
      <TextInput
        maxLength={12}
        label="Aadhaar Card Number"
        mode="outlined"
        keyboardType="numeric"
        value={aadharCard}
        onChangeText={setAadharCard}
        style={styles.input}
      />
      <TextInput
        label="Password"
        mode="outlined"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />

      <TextInput
        label="Referral Code (optional)"
        mode="outlined"
        value={referralCode}
        onChangeText={setReferralCode}
        style={styles.input}
      />

      <Button mode="outlined" onPress={handlePickImage} style={{ marginBottom: 10 }}>
        {aadharImage ? "Change Aadhaar Image" : "Upload Aadhaar Card"}
      </Button>
      {aadharImage && (
        <Image
          source={{ uri: aadharImage.uri }}
          style={{ width: 200, height: 120, marginBottom: 10, borderRadius: 5 }}
        />
      )}

      <Button
        mode="contained"
        style={styles.registerButton}
        onPress={handleRegister}
        disabled={loading}
      >
        {loading ? <ActivityIndicator color="#fff" /> : "Register"}
      </Button>

      <TouchableOpacity>
        <Text style={styles.loginText}>
          Already have an account? <Text style={styles.link}>Login here</Text>
        </Text>
      </TouchableOpacity>
      
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 150,
    height: 100,
    marginBottom: 10,
    resizeMode: "contain",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    marginBottom: 12,
  },
  registerButton: {
    width: "100%",
    backgroundColor: "#0A8F34",
    paddingVertical: 8,
    borderRadius: 5,
    marginTop: 10,
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

export default RegisterScreen;
