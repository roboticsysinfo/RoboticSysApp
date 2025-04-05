import React from "react";
import { View, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { Avatar, Text, List, Button } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import FIcon from "react-native-vector-icons/FontAwesome6";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../redux/slices/authSlice"; // Import logout action
import { useNavigation } from "@react-navigation/native";


const SettingScreen = () => {


  const dispatch = useDispatch();
  const navigation = useNavigation();

  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logoutUser()); // Dispatch logout action
    navigation.navigate("Login"); // Redirect to login
  };

  return (

    <View style={styles.container}>

      {/* Profile Section */}
      <View style={styles.profileContainer}>

        <Avatar.Image
          size={80}
          source={{ uri: "https://avatar.iran.liara.run/public/boy" }}
        />

        <View style={styles.profileInfo}>
          <Text style={styles.name}>{user ? user.name : "N/A"}</Text>
        </View>

        <TouchableOpacity onPress={() => { navigation.navigate('Profile') }}>
          <Icon name="pencil" size={20} color="green" style={styles.editIcon} />
        </TouchableOpacity>

      </View>

      {/* Options List */}
      <ScrollView style={styles.settingListContainer}>

        <List.Section>

          <List.Item
            title="Orders"
            left={() => <Icon name="shopping" size={24} />}
            right={() => <Icon name="chevron-right" size={24} />}
            onPress={() => { navigation.navigate('My Orders') }}
          />

          <List.Item
            title="My Details"
            left={() => <Icon name="card-account-details" size={24} />}
            right={() => <Icon name="chevron-right" size={24} />}
            onPress={() => { navigation.navigate('Profile') }}
          />

          <List.Item
            title="Delivery Preference"
            left={() => <Icon name="map-marker" size={24} />}
            right={() => <Icon name="chevron-right" size={24} />}
            onPress={() => { navigation.navigate('Delivery Preference') }}
          />


          <List.Item
            title="Change Language"
            left={() => <FIcon name="language" size={24} />}
            right={() => <Icon name="chevron-right" size={24} />}
            onPress={() => { navigation.navigate('Select Language') }}
          />

          <List.Item
            title="Help & Support"
            left={() => <Icon name="help-circle" size={22} />}
            right={() => <Icon name="chevron-right" size={22} />}
            onPress={() => { navigation.navigate('Contact') }}
          />

          <List.Item
            title="Earn & Refer"
            left={() => <FIcon name="money-bill-1" size={22} />}
            right={() => <Icon name="chevron-right" size={22} />}
            onPress={() => { navigation.navigate('EarnAndRefer') }}
          />

        </List.Section>

        {/* Logout Button */}
        <Button
          mode="contained"
          onPress={handleLogout}
          style={styles.logoutButton}
          icon="logout"
        >
          Log Out
        </Button>

      </ScrollView>

    </View>

  );
};

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
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  email: {
    fontSize: 14,
    color: "gray",
  },
  editIcon: {
    marginRight: 10,
  },
  logoutButton: {
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 4,
    backgroundColor: '#DA2428',
    marginBottom: 20,
  },
  settingListContainer: {
    paddingHorizontal: 20
  }
});

export default SettingScreen;
