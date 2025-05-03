
import React, { useEffect } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Avatar, Badge, Text } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import FIcon from "react-native-vector-icons/FontAwesome6";
import { useNavigation } from "@react-navigation/native";
import { COLORS } from "../../theme";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { getFarmerById } from "../redux/slices/authSlice";
import { REACT_APP_BASE_URI } from "@env"


const CustomHeader = ({ toggleDrawer, user, points, unreadCount }) => {

  const navigation = useNavigation();
  const dispatch = useDispatch()
  const { t, i18n } = useTranslation();
  const language = useSelector((state) => state.language.language);
  const { farmerDetails, loading, error } = useSelector((state) => state.auth);

  const farmerId = user?.id;

  // Update language
  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language]);

  useEffect(() => {
    if (farmerId) {
      dispatch(getFarmerById(farmerId));
    }
  }, [dispatch, farmerId]);

  return (

    <View style={styles.header}>

      <TouchableOpacity style={styles.menuButton} onPress={toggleDrawer}>
        <Icon name="menu" size={42} color="black" />
      </TouchableOpacity>

      <View style={styles.profileContainer}>

        <Avatar.Image
          size={42}
          source={{ uri: farmerDetails?.profileImg ? `${REACT_APP_BASE_URI}/${farmerDetails.profileImg}` : "https://avatar.iran.liara.run/public/boy" }}

        />

        <View style={styles.profileInfo}>
          <Text style={styles.subText}>{t("welcome")},</Text>
          <Text style={styles.nameText}>{user ? user.name : "N/A"}</Text>
        </View>

      </View>

      <TouchableOpacity
        style={styles.walletButton}
        onPress={() => navigation.navigate(t("Point Transactions"))}
      >
        <FIcon name="wallet" size={28} color="black" />
        {points > 0 && (
          <Badge style={styles.walletBadge}><FIcon name="coins" size={10} color="white" /> {points}</Badge>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.notificationButton}
        onPress={() => navigation.navigate(t("Notifications"))}
      >
        <Icon name="bell-outline" size={32} color="black" />
        {unreadCount > 0 && (
          <Badge style={styles.badge}>{unreadCount}</Badge>
        )}
      </TouchableOpacity>

    </View>
  );
};

export default CustomHeader;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    marginTop: 10,
  },
  menuButton: {
    padding: 5,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileInfo: {
    marginLeft: 5,
  },
  nameText: {
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.lightBlack,
  },
  subText: {
    fontSize: 14,
    color: COLORS.primaryColor,
  },
  walletButton: {
    position: "relative",
    marginHorizontal: 10,
  },
  walletBadge: {
    position: "absolute",
    top: -20,
    right: -10,
    fontSize: 12,
    padding: 0,
    width: 40,
    height: 25,
    borderRadius: 100,
    backgroundColor: "#f0a500",
  },
  notificationButton: {
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "red",
    color: "#fff",
    fontSize: 10,
    height: 18,
    minWidth: 18,
    textAlign: "center",
    borderRadius: 9,
    paddingHorizontal: 4,
  },
});
