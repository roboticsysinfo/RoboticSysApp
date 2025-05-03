import React, { useState, useEffect } from 'react';
import { View, ScrollView, ToastAndroid, StyleSheet, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { createShop } from '../redux/slices/shopSlice';
import { launchImageLibrary } from "react-native-image-picker";
import api from '../services/api';
import { useNavigation } from '@react-navigation/native';
import { Dropdown } from 'react-native-element-dropdown';
import { useTranslation } from 'react-i18next';

const CreateShopScreen = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const { t } = useTranslation()

    const [formData, setFormData] = useState({
        shop_name: '',
        shop_address: '',
        state: '',
        city_district: '',
        village_name: '',
        phoneNumber: '',
        whatsappNumber: '',
        pricing_preference: '',
        preferred_buyers: '',
        shop_description: '',
        shop_profile_image: null,
        shop_cover_image: null,
    });

    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);

    useEffect(() => {
        api.get('/states-cities')
            .then(response => {
                setStates(response.data);
            })
            .catch(error => console.error("Error fetching states:", error));
    }, []);

    const handleStateChange = (selectedState) => {
        setFormData(prevState => ({ ...prevState, state: selectedState, city_district: '' }));
        const selectedStateData = states.find(item => item.state === selectedState);
        setCities(selectedStateData ? selectedStateData.districts : []);
    };

    const pickImage = (imageType) => {
        launchImageLibrary({ mediaType: "photo", quality: 1 }, (response) => {
            if (!response.didCancel && !response.error) {
                setFormData(prev => ({
                    ...prev,
                    [imageType]: response.assets[0].uri,
                }));
            }
        });
    };

    const handleSubmit = async () => {
        const formDataToSend = new FormData();
        Object.keys(formData).forEach(key => {
            if (key !== "shop_profile_image" && key !== "shop_cover_image") {
                formDataToSend.append(key, formData[key]);
            }
        });

        if (formData.shop_profile_image) {
            formDataToSend.append("shop_profile_image", {
                uri: formData.shop_profile_image,
                name: "shop_profile.jpg",
                type: "image/jpeg"
            });
        }
        if (formData.shop_cover_image) {
            formDataToSend.append("shop_cover_image", {
                uri: formData.shop_cover_image,
                name: "shop_cover.jpg",
                type: "image/jpeg"
            });
        }

        try {
            await dispatch(createShop(formDataToSend));
            ToastAndroid.show(t("Shop Created Successfully!"), ToastAndroid.SHORT);
            navigation.replace(t("myShop"));
        } catch (error) {
            console.error("Create Error:", error);
        }
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
            <ScrollView style={styles.container} keyboardShouldPersistTaps="handled" contentContainerStyle={{ flexGrow: 1 }}>

                <TextInput mode='outlined' style={styles.textInput} label={t("Shop Name")} value={formData.shop_name} onChangeText={text => setFormData(prev => ({ ...prev, shop_name: text }))} />

                <TextInput mode='outlined' style={styles.textInput} label={t("Shop Address")} value={formData.shop_address} onChangeText={text => setFormData(prev => ({ ...prev, shop_address: text }))} />

                <Dropdown style={styles.dropdownMenu} data={states.map(item => ({ label: item.state, value: item.state }))} value={formData.state} labelField="label" valueField="value" placeholder={t("Select State")} onChange={item => handleStateChange(item.value)} />

                <Dropdown style={styles.dropdownMenu} data={cities.map(city => ({ label: city, value: city }))} value={formData.city_district} labelField="label" valueField="value" placeholder={t("Select City/District")} onChange={item => setFormData(prevState => ({ ...prevState, city_district: item.value }))} />

                <TextInput mode='outlined' style={styles.textInput} label={t("Village")} value={formData.village_name} onChangeText={text => setFormData(prev => ({ ...prev, village_name: text }))} />

                <TextInput mode='outlined' style={styles.textInput} label={t("Phone Number")} keyboardType="phone-pad" value={formData.phoneNumber} onChangeText={text => setFormData(prev => ({ ...prev, phoneNumber: text }))} />

                <TextInput mode='outlined' style={styles.textInput} label={t("WhatsApp Number")} keyboardType="phone-pad" value={formData.whatsappNumber} onChangeText={text => setFormData(prev => ({ ...prev, whatsappNumber: text }))} />


                <Dropdown
                    style={styles.dropdownMenu}
                    data={[
                        { label: t("Fixed Price"), value: "fixed_price" },
                        { label: t("Negotiation Price"), value: "negotiation_price" }
                    ]}
                    labelField="label"
                    valueField="value"
                    value={formData.pricing_preference}
                    placeholder={t("Select Pricing Preference")}
                    onChange={item => setFormData(prev => ({ ...prev, pricing_preference: item.value }))}
                />


                <Dropdown
                    style={styles.dropdownMenu}
                    data={[
                        { label: t("Retail Customers"), value: "retail_customers" },
                        { label: t("Wholesalers"), value: "wholesalers" },
                        { label: t("Restaurants"), value: "restaurants" },
                        { label: t("Hotels"), value: "hotels" }
                    ]}
                    labelField="label"
                    valueField="value"
                    value={formData.preferred_buyers}
                    placeholder={t("Select Preferred Buyers")}
                    onChange={item => setFormData(prev => ({ ...prev, preferred_buyers: item.value }))}
                />



                <TextInput mode='outlined' style={styles.textInput} label="Shop Description" value={formData.shop_description} onChangeText={text => setFormData(prev => ({ ...prev, shop_description: text }))} />

                {formData.shop_profile_image && <Image source={{ uri: formData.shop_profile_image }} style={styles.imagePreview} />}
                <Button mode="outlined" onPress={() => pickImage('shop_profile_image')}>{t("Upload Shop Profile Image")}</Button>

                {formData.shop_cover_image && <Image source={{ uri: formData.shop_cover_image }} style={styles.imagePreview} />}
                <Button mode="outlined" onPress={() => pickImage('shop_cover_image')}>{t("Upload Shop Cover Image")}</Button>

                <Button style={{ marginBottom: 60, marginTop: 20 }} mode="contained" onPress={handleSubmit}>{t("Create Shop")}</Button>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default CreateShopScreen;

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#f0f0f0' },
    dropdownMenu: { backgroundColor: "#fff", marginVertical: 10, borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10 },
    textInput: { marginBottom: 20, color: "#000" },
    imagePreview: { width: 100, height: 100, marginVertical: 10 },
});
