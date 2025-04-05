import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import appLogo from "../../src/assets/kg-logo.jpg";
import { useNavigation } from "@react-navigation/native";
import { ScrollView } from "react-native-gesture-handler";
import { Button, Divider, List } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import FIcon from "react-native-vector-icons/FontAwesome6";
import { logoutUser } from "../redux/slices/authSlice";
import { useDispatch } from "react-redux";

const CustomDrawer = ({ isOpen, closeDrawer }) => {
    if (!isOpen) return null; // Agar drawer open nahi hai toh kuch bhi return mat karo

    const dispatch = useDispatch()
    const navigation = useNavigation()

    const handleLogout = () => {
        dispatch(logoutUser()); // Dispatch logout action
        navigation.navigate("Login"); // Redirect to login
    };

    return (
        <View style={styles.drawerContainer}>

            {/* 🔹 Header Section with Logo & Close Button */}

            <View style={styles.header}>

                {/* Logo Image */}

                <Image
                    source={appLogo}
                    style={styles.logo}
                />

                {/* Close Button */}
                <TouchableOpacity onPress={closeDrawer} style={styles.closeButton}>
                    <Text style={styles.closeText}>✕</Text>
                </TouchableOpacity>

            </View>

            <Divider />

            {/* Drawer Menu */}
            {/* Options List */}
            <ScrollView style={styles.settingListContainer}>

                <List.Section>

                    <List.Item
                        title="Orders"
                        left={() => <Icon name="shopping" size={22} />}
                        right={() => <Icon name="chevron-right" size={22} />}
                        onPress={() => { navigation.navigate('Orders') }}
                    />

                    <List.Item
                        title="All Shops"
                        left={() => <Icon name="storefront" size={22} />}
                        right={() => <Icon name="chevron-right" size={22} />}
                        onPress={() => { navigation.navigate('All Shops') }}
                    />

                    <List.Item
                        title="My Products"
                        left={() => <Icon name="archive-plus" size={22} />}
                        right={() => <Icon name="chevron-right" size={22} />}
                        onPress={() => { navigation.navigate('My Products') }}
                    />

                    <List.Item
                        title="My Details"
                        left={() => <Icon name="card-account-details" size={22} />}
                        right={() => <Icon name="chevron-right" size={22} />}
                        onPress={() => { navigation.navigate('My Details') }}
                    />

                    <List.Item
                        title="My Shop Reviews"
                        left={() => <Icon name="storefront" size={22} />}
                        right={() => <Icon name="chevron-right" size={22} />}
                        onPress={() => { navigation.navigate('My Shop Reviews') }}
                    />

                    <List.Item
                        title="Delivery Preference"
                        left={() => <Icon name="map-marker"
                            size={22} />}
                        right={() => <Icon name="chevron-right" size={22} />}
                        onPress={() => { navigation.navigate('Delivery Preference') }}
                    />

                    <List.Item
                        title="Help & Support"
                        left={() => <Icon name="help-circle" size={22} />}
                        right={() => <Icon name="chevron-right" size={22} />}
                        onPress={() => { navigation.navigate('Contact') }}
                    />

                    <List.Item
                        title="Refer & Earn"
                        left={() => <FIcon name="money-bill-1" size={22} />}
                        right={() => <Icon name="chevron-right" size={22} />}
                        onPress={() => { navigation.navigate('ReferandEarn') }}
                    />

                    <List.Item
                        title="Change Language"
                        left={() => <FIcon name="language" size={22} />}
                        right={() => <Icon name="chevron-right" size={22} />}
                        onPress={() => { navigation.navigate('Select Language') }}
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
    drawerContainer: {
        position: "absolute",
        top: 0,
        left: 0,
        width: 300,
        height: "100%",
        backgroundColor: "white",
        padding: 20,
        shadowColor: "#000",
        shadowOpacity: 0.5,
        shadowOffset: { width: 2, height: 2 },
        elevation: 5,
        zIndex: 1024
    },
    // 🔹 Header styling with row alignment
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between", // Space between logo & close button
        marginBottom: 20,
    },
    logo: {
        width: 150,
        height: 80,
        resizeMode: "contain",
    },
    closeButton: {
        padding: 10,
    },
    closeText: {
        fontSize: 18,
        fontWeight: "bold",
    },
    drawerText: {
        fontSize: 14,
    },
    logoutButton: {
        marginRight: 30,
        marginTop: 20,
        borderRadius: 4,
        backgroundColor: '#DA2428',
        marginBottom: 20,
    },
});

export default CustomDrawer;
