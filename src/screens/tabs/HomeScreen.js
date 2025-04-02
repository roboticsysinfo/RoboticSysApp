import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { Avatar, Text,  } from "react-native-paper";
import { COLORS } from "../../../theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../redux/slices/authSlice";

const HomeScreen = () => {

  const { loading, error, token, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();


  const getUserInfo = async () => {
    try {
      const farmerData = await AsyncStorage.getItem("farmer");
      if (farmerData) {
        console.log("Async Storage Data:", JSON.parse(farmerData)); // Debug log
        dispatch(setUser(JSON.parse(farmerData))); // Update Redux state
      } else {
        console.log("No data found in AsyncStorage");
      }
    } catch (error) {
      console.log("Error fetching AsyncStorage data:", error);
    }
  };
  
  
  
  useEffect(() => {
    getUserInfo();
  }, []);



  return (

    <View style={styles.container}>

      {/* Profile Section */}
      <View style={styles.profileContainer}>

        <Avatar.Image
          size={48}
          source={{ uri: "https://avatar.iran.liara.run/public/boy" }}
        />
        <View style={styles.profileInfo}>
          <Text style={styles.subText}>Welcome,</Text>
          <Text style={styles.nameText}>{ user ? user.name : "N/A"}</Text>
        </View>

      </View>

    </View>

  );
};



export default HomeScreen;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  profileInfo: {
    marginLeft: 15,
    flex: 1,
  },
  nameText: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.lightBlack
  },
  subText: {
    fontSize: 14,
    color: COLORS.primaryColor,
  },

});