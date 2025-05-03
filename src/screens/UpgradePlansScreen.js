import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Card, Text, Button, Divider, Appbar } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { COLORS } from "../../theme";
import { useNavigation } from "@react-navigation/native";
import RazorpayCheckout from "react-native-razorpay";
import api from "../services/api";
import { useSelector } from "react-redux";
import Toast from "react-native-toast-message";
import { RAZORPAY_KEY_ID } from "@env";

const UpgradePlansScreen = () => {
  const navigation = useNavigation();
  const { user } = useSelector((state) => state.auth);
  const farmerId = user?.id;

  const basePrice = 100;
  const gst = Math.round(basePrice * 0.18);
  const totalPrice = basePrice + gst; // 118

  const handleUpgrade = () => {
    const options = {
      description: "Upgrade to Farmer Plan",
      currency: "INR",
      key: RAZORPAY_KEY_ID,
      amount: totalPrice * 100, // ₹118 * 100 = 11800 paise
      name: "Farmer Friendly Plan",
      prefill: {
        email: user.email,
        contact: user.phone,
      },
      theme: {
        color: COLORS.primaryColor,
      },
    };

    RazorpayCheckout.open(options)
      .then((data) => {
        const { razorpay_payment_id } = data;

        api.post("/farmer/applyUpgradePlan", {
          farmerId,
          planName: "Farmer Friendly Plan",
          planAmount: basePrice, // original price without GST
          planValidityDays: 360,
        })
          .then((response) => {
            if (response.data.success) {
              Toast.show({
                type: "success",
                text1: "Plan Upgraded Successfully!",
                text2: "You have successfully upgraded your plan.",
              });
            } else {
              Toast.show({
                type: "error",
                text1: "Upgrade Failed",
                text2: response.data.message,
              });
            }
          })
          .catch((error) => {
            const message =
              error?.response?.data?.message ||
              "There was an error processing your upgrade.";

            if (message === "Shop not found for this farmer") {
              alert("Shop not found. Please create a shop first.");
            } else {
              Toast.show({
                type: "error",
                text1: "Error",
                text2: message,
              });
            }
          });
      })
      .catch((error) => {
        console.log("Payment Failed", error);
        Toast.show({
          type: "error",
          text1: "Payment Failed",
          text2: "Please try again later.",
        });
      });
  };

  return (
    <>
      <Appbar.Header style={{ backgroundColor: COLORS.primaryColor }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} color="white" />
        <Appbar.Content title="Upgrade Plan" titleStyle={{ color: "white" }} />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.container}>
        <Card style={styles.card}>
          <View style={styles.titleRow}>
            <View>
              <Text style={styles.planTitle}>Farmer Friendly Plan</Text>
              <Text style={styles.planPrice}>
                ₹{totalPrice}{" "}
                <Text style={{ fontSize: 13, color: "gray" }}>
                  (incl. 18% GST)
                </Text>
              </Text>
            </View>
          </View>

          <Divider style={{ marginVertical: 5 }} />

          <Card.Content>
            <Text style={styles.featureTitle}>Features:</Text>
            <Text style={styles.featureItem}>
              <Icon name="check-circle-outline" size={20} color={COLORS.primaryColor} />{" "}
              Highlighted profile on top
            </Text>
            <Text style={styles.featureItem}>
              <Icon name="check-circle-outline" size={20} color={COLORS.primaryColor} />{" "}
              Special badge for upgraded users
            </Text>
            <Text style={styles.featureItem}>
              <Icon name="check-circle-outline" size={20} color={COLORS.primaryColor} />{" "}
              Increased visibility in shops
            </Text>

            <Button
              mode="contained"
              onPress={handleUpgrade}
              style={styles.upgradeButton}
              labelStyle={{ fontSize: 16 }}
            >
              Upgrade Now
            </Button>

            <Text style={styles.termsText}>* Terms & Conditions apply</Text>
          </Card.Content>
        </Card>
      </ScrollView>

      <Toast />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#efefef",
  },
  card: {
    borderRadius: 20,
    backgroundColor: COLORS.white,
    elevation: 5,
    overflow: "hidden",
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  planTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.lightBlack,
  },
  planPrice: {
    fontSize: 16,
    color: COLORS.primaryColor,
    marginTop: 10,
    fontWeight: "bold",
  },
  featureTitle: {
    marginVertical: 10,
    fontWeight: "bold",
    fontSize: 16,
    color: COLORS.primaryColor,
  },
  featureItem: {
    marginVertical: 4,
    fontSize: 14,
    color: COLORS.lightBlack,
  },
  upgradeButton: {
    marginTop: 20,
    backgroundColor: COLORS.primaryColor,
    borderRadius: 10,
    paddingVertical: 6,
  },
  termsText: {
    marginTop: 5,
    fontSize: 10,
    color: "gray",
    textAlign: "center",
  },
});

export default UpgradePlansScreen;
