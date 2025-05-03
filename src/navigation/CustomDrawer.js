import React, { useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    TouchableWithoutFeedback,
} from "react-native";
import appLogo from "../../src/assets/kg-logo.jpg";
import { useNavigation } from "@react-navigation/native";
import { ScrollView } from "react-native-gesture-handler";
import { Button, Divider, List } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import FIcon from "react-native-vector-icons/FontAwesome6";
import { logoutUser } from "../redux/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";


const CustomDrawer = ({ isOpen, closeDrawer }) => {

    const dispatch = useDispatch();
    const navigation = useNavigation();
    const { t, i18n } = useTranslation();
    const language = useSelector((state) => state.language.language);


    // Update language
    useEffect(() => {
        i18n.changeLanguage(language);
    }, [language]);


    if (!isOpen) return null;


    const handleLogout = () => {
        dispatch(logoutUser());
        navigation.navigate("Login");
    };


    return (

        <View style={styles.overlayContainer}>

            {/* Tappable transparent area to close drawer */}
            <TouchableWithoutFeedback onPress={closeDrawer}>
                <View style={styles.backdrop} />
            </TouchableWithoutFeedback>

            {/* Actual Drawer */}
            <View style={styles.drawerContainer}>

                <View style={styles.header}>
                    <Image source={appLogo} style={styles.logo} />
                    <TouchableOpacity onPress={closeDrawer} style={styles.closeButton}>
                        <Text style={styles.closeText}>✕</Text>
                    </TouchableOpacity>
                </View>

                <Divider />

                <ScrollView style={styles.settingListContainer}>

                    <List.Section>

                        <List.Item
                            style={styles.drawerlistItem}
                            title={t('Daily Mandi Price')}
                            left={() => <FIcon name="coins" size={22} />}
                            right={() => <Icon name="chevron-right" size={22} />}
                            onPress={() => navigation.navigate(t("MandiPrice"))}
                        />

                        <List.Item
                            style={styles.drawerlistItem}
                            title={t('Upgrade Plan')}
                            left={() => <FIcon name="coins" size={22} />}
                            right={() => <Icon name="chevron-right" size={22} />}
                            onPress={() => navigation.navigate(t("UpgradePlans"))}
                        />

                        <List.Item
                            style={styles.drawerlistItem}
                            title={t('weatherInfo')}
                            left={() => <Icon name="weather-cloudy" size={22} />}
                            right={() => <Icon name="chevron-right" size={22} />}
                            onPress={() => navigation.navigate(t("Weather"))}
                        />


                        <List.Item
                            style={styles.drawerlistItem}
                            title={t('Upgrade Points')}
                            left={() => <FIcon name="coins" size={22} />}
                            right={() => <Icon name="chevron-right" size={22} />}
                            onPress={() => navigation.navigate(t("UpgradePoints"))}
                        />

                        <List.Item
                            style={styles.drawerlistItem}
                            title={t('myPointsScore')}
                            left={() => <FIcon name="coins" size={22} />}
                            right={() => <Icon name="chevron-right" size={22} />}
                            onPress={() => navigation.navigate(t("Point Transactions"))}
                        />

                        <List.Item
                            style={styles.drawerlistItem}
                            title={t('allShops')}
                            left={() => <Icon name="storefront" size={22} />}
                            right={() => <Icon name="chevron-right" size={22} />}
                            onPress={() => navigation.navigate(t("All Shops"))}
                        />

                        <List.Item
                            style={styles.drawerlistItem}
                            title={t('myProducts')}
                            left={() => <Icon name="archive-plus" size={22} />}
                            right={() => <Icon name="chevron-right" size={22} />}
                            onPress={() => navigation.navigate(t("My Products"))}
                        />

                        <List.Item
                            style={styles.drawerlistItem}
                            title={t('myDetails')}
                            left={() => <Icon name="card-account-details" size={22} />}
                            right={() => <Icon name="chevron-right" size={22} />}
                            onPress={() => navigation.navigate(t("My Details"))}
                        />

                        <List.Item
                            style={styles.drawerlistItem}
                            title={t('myShopReviews')}
                            left={() => <Icon name="storefront" size={22} />}
                            right={() => <Icon name="chevron-right" size={22} />}
                            onPress={() => navigation.navigate(t("My Shop Reviews"))}
                        />

                        <List.Item
                            style={styles.drawerlistItem}
                            title={t('deliveryPreference')}
                            left={() => <Icon name="map-marker" size={22} />}
                            right={() => <Icon name="chevron-right" size={22} />}
                            onPress={() => navigation.navigate(t("Delivery Preference"))}
                        />

                        <List.Item
                            style={styles.drawerlistItem}
                            title={t('referAndEarn')}
                            left={() => <FIcon name="money-bill-1" size={22} />}
                            right={() => <Icon name="chevron-right" size={22} />}
                            onPress={() => navigation.navigate(t("ReferandEarn"))}
                        />

                        <List.Item
                            style={styles.drawerlistItem}
                            title={t('helpAndSupport')}
                            left={() => <Icon name="help-circle" size={22} />}
                            right={() => <Icon name="chevron-right" size={22} />}
                            onPress={() => navigation.navigate(t("Contact"))}
                        />


                        <List.Item
                            style={styles.drawerlistItem}
                            title={t('changeLanguage')}
                            left={() => <FIcon name="language" size={22} />}
                            right={() => <Icon name="chevron-right" size={22} />}
                            onPress={() => navigation.navigate(t("Select Language"))}
                        />

                        <List.Item
                            style={styles.drawerlistItem}
                            title={t('farmingTips')}
                            left={() => <Icon name="lightbulb-outline" size={22} />}
                            right={() => <Icon name="chevron-right" size={22} />}
                            onPress={() => navigation.navigate(t("Farming Tips"))}
                        />

                    </List.Section>

                    <Button
                        mode="contained"
                        onPress={handleLogout}
                        style={styles.logoutButton}
                        icon="logout"
                    >
                        {t('logOut')}
                    </Button>
                </ScrollView>
            </View>
        </View>
    );
};


const styles = StyleSheet.create({
    overlayContainer: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        flexDirection: "row-reverse", // ← Changed from 'row' to 'row-reverse'
        zIndex: 999,
    },
    backdrop: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.3)", // Darken background
    },
    drawerContainer: {
        width: 300,
        height: "100%",
        backgroundColor: "white",
        padding: 20,
        shadowColor: "#000",
        shadowOpacity: 0.5,
        shadowOffset: { width: -2, height: 2 },
        elevation: 5,
        zIndex: 1024,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
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
    logoutButton: {
        marginRight: 30,
        marginTop: 20,
        borderRadius: 4,
        backgroundColor: "#DA2428",
        marginBottom: 20,
    },
    drawerlistItem: {
        borderBottomWidth: 1,
        borderColor: "#ddd",
        fontSize: 12
    }
});

export default CustomDrawer;
