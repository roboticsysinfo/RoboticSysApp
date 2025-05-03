import React, { useState, useEffect } from "react";
import { View, StyleSheet, ToastAndroid } from "react-native";
import { Text, TextInput, Button, Appbar, RadioButton } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchDeliveryPreference,
    addDeliveryPreference,
    updateDeliveryPreference,
} from "../redux/slices/deliveryPreferenceSlice";
import { useTranslation } from "react-i18next";

const DeliveryPreference = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const { preference, loading } = useSelector((state) => state.deliveryPreference);
    const { user } = useSelector((state) => state.auth);

    const farmerId = user?.id

    const [activeTab, setActiveTab] = useState("add"); // "add" or "update"
    const [formData, setFormData] = useState({
        delivery_method: "self-pickup",
        delivery_range: "",
        additional_notes: "",
    });

    useEffect(() => {
        dispatch(fetchDeliveryPreference(farmerId));
    }, [dispatch, farmerId]);

    useEffect(() => {
        if (preference) {
            setFormData({
                delivery_method: preference.delivery_method || "self-pickup",
                delivery_range: preference.delivery_range || "",
                additional_notes: preference.additional_notes || "",
            });
        }
    }, [preference]);

    const handleSubmit = async () => {
        try {
            if (activeTab === "add") {
                await dispatch(addDeliveryPreference({ farmer_id: farmerId, ...formData })).unwrap();
                ToastAndroid.show(t("Delivery Preference Added Successfully!"), ToastAndroid.SHORT);
            } else {
                await dispatch(updateDeliveryPreference({ farmerId, updatedData: formData })).unwrap();
                ToastAndroid.show(t("Delivery Preference Updated Successfully!"), ToastAndroid.SHORT);
            }
        } catch (error) {
            ToastAndroid.show("Error Occurred!", ToastAndroid.SHORT);
        }
    };
    

    return (
        <View style={styles.container}>
            {/* 🔹 Header with Tabs */}
            <Appbar.Header>
                <Appbar.Action
                    icon="plus"
                    onPress={() => setActiveTab("add")}
                    color={activeTab === "add" ? "blue" : "gray"}
                />
                <Appbar.Action
                    icon="pencil"
                    onPress={() => setActiveTab("update")}
                    color={activeTab === "update" ? "blue" : "gray"}
                />
                <Appbar.Content title={t("Delivery Preference")} />
            </Appbar.Header>

            {/* 🔹 Form */}
            <View style={styles.formContainer}>
                <Text style={styles.label}>{t("Select Delivery Method")}</Text>
                <RadioButton.Group
                    onValueChange={(value) => setFormData({ ...formData, delivery_method: value })}
                    value={formData.delivery_method}
                >
                    <View style={styles.radioRow}>
                        <RadioButton value="self-pickup" />
                        <Text>{t("Self Pickup")}</Text>
                    </View>
                    <View style={styles.radioRow}>
                        <RadioButton value="delivery-by-farmer" />
                        <Text>{t("Delivery by Farmer")}</Text>
                    </View>
                </RadioButton.Group>

                <TextInput
                    mode="outlined"
                    label={t("Delivery Range")}
                    value={formData.delivery_range}
                    onChangeText={(text) => setFormData({ ...formData, delivery_range: text })}
                    style={styles.textInput}
                />

                <TextInput
                    mode="outlined"
                    label={t("Additional Notes")}
                    value={formData.additional_notes}
                    onChangeText={(text) => setFormData({ ...formData, additional_notes: text })}
                    multiline
                    style={styles.textInput}
                />

                <Button style={{padding: 8, borderRadius: 4}} mode="contained" loading={loading} onPress={handleSubmit}>
                    {activeTab === "add" ? t("Add Preference") : t("Update Preference")}
                </Button>
                
            </View>
        </View>
    );
};

export default DeliveryPreference;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },
    formContainer: { padding: 20 },
    label: { fontSize: 16, fontWeight: "bold", marginBottom: 5 },
    input: { marginBottom: 15 },
    radioRow: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
    textInput: {
        marginBottom: 20,
        color: "#000"
    },
});
