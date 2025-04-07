// KYCPendingScreen.js
import React from "react";
import { View, StyleSheet, Text, Image } from "react-native";
import { Button } from "react-native-paper";
import { useSelector } from "react-redux";
import kycverification from "../../src/assets/kyc-verification.png";

const KYCPendingScreen = ({ navigation }) => {

  const { user } = useSelector((state) => state.auth);

  return (
    <View style={styles.container}>
      <Image
        source={kycverification} 
        style={styles.image}
        resizeMode="contain"
      />

      <Text style={styles.title}>KYC Verification in Progress</Text>
      <Text style={styles.subtitle}>
        Hello {user?.name}, your KYC is currently under review.
      </Text>

      <Text style={styles.message}>
        Once your KYC is successfully verified, you'll be granted full access to the dashboard.
      </Text>

      <Button
        mode="contained"
        style={styles.button}
        onPress={() => navigation.goBack()} // Or to logout or contact support
      >
        Go Back
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#fff",
  },
  image: {
    width: 250,
    height: 200,
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0A8F34",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    marginBottom: 12,
    textAlign: "center",
  },
  message: {
    fontSize: 14,
    color: "#777",
    textAlign: "center",
    marginBottom: 24,
  },
  button: {
    backgroundColor: "#0A8F34",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 5,
  },
});

export default KYCPendingScreen;
