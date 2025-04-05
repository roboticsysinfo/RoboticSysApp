import React, { useEffect, useState } from 'react';
import { View, ScrollView, ToastAndroid, StyleSheet, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { updateShop, fetchShopByShopId } from '../redux/slices/shopSlice';
import { launchImageLibrary } from "react-native-image-picker";
import api from '../services/api';
import { useNavigation } from '@react-navigation/native';
import { Dropdown } from 'react-native-element-dropdown';


const EditShopScreen = ({ route }) => {
    const { shopId } = route.params;
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const { shop } = useSelector(state => state.shop);


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
        dispatch(fetchShopByShopId(shopId));
    }, [shopId]);


    useEffect(() => {
        if (shop && Object.keys(shop).length > 0) { // ✅ Ensure `shop` has data
            setFormData({
                shop_name: shop?.shop_name || '',
                shop_address: shop?.shop_address || '',
                state: shop?.state || '',
                city_district: shop?.city_district || '',
                village_name: shop?.village_name || '',
                phoneNumber: shop?.phoneNumber?.toString() || '',  // ✅ Ensure String
                whatsappNumber: shop?.whatsappNumber?.toString() || '', // ✅ Ensure String
                pricing_preference: shop?.pricing_preference || '',
                preferred_buyers: shop?.preferred_buyers || '',
                shop_description: shop?.shop_description || '',
                shop_profile_image: shop?.shop_profile_image || null,
                shop_cover_image: shop?.shop_cover_image || null,
            });
        }
    }, [shop]);


    useEffect(() => {
        api.get('/states-cities')
            .then(response => {
                setStates(response.data); // Ensure it updates correctly
            })
            .catch(error => console.error("Error fetching states:", error));
    }, []);

    const handleStateChange = (selectedState) => {

        setFormData(prevState => ({ ...prevState, state: selectedState, city_district: '' }));

        const selectedStateData = states.find(item => item.state === selectedState);

        if (selectedStateData) {
            setCities(selectedStateData.districts);
        } else {
            setCities([]);
        }
    };


    // 📸 **Pick Shop Profile Image**
    const pickShopProfileImage = () => {
        const options = { mediaType: "photo", quality: 1 };
        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log("User cancelled image picker");
            } else if (response.error) {
                console.log("Image selection error:", response.error);
            } else {
                setFormData(prev => ({
                    ...prev,
                    shop_profile_image: response.assets[0].uri, // ✅ Save Image URI
                }));
            }
        });
    };

    // 📸 **Pick Shop Cover Image**
    const pickShopCoverImage = () => {
        const options = { mediaType: "photo", quality: 1 };
        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log("User cancelled image picker");
            } else if (response.error) {
                console.log("Image selection error:", response.error);
            } else {
                setFormData(prev => ({
                    ...prev,
                    shop_cover_image: response.assets[0].uri, // ✅ Save Image URI
                }));
            }
        });
    };


    const handleSubmit = async () => {
        const formDataToSend = new FormData();
    
        // Append normal text fields
        Object.keys(formData).forEach(key => {
            if (key !== "shop_profile_image" && key !== "shop_cover_image") {
                formDataToSend.append(key, formData[key]);
            }
        });
    
        // Append images correctly
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
            await dispatch(updateShop({ id: shopId, shopData: formDataToSend }));
            ToastAndroid.show("Shop Updated Successfully!", ToastAndroid.SHORT);
            navigation.goBack();
        } catch (error) {
            console.error("Update Error:", error);
        }
    };
    

    return (


        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
        >
            <ScrollView
                style={styles.container}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{ flexGrow: 1 }}
            >

                <TextInput
                    mode='outlined'
                    style={styles.textInput}
                    label="Shop Name"
                    value={formData.shop_name}
                    onChangeText={text => setFormData(prev => ({ ...prev, shop_name: text }))}
                />

                <TextInput
                    mode='outlined'
                    style={styles.textInput}
                    label="Shop Address"
                    value={formData.shop_address} onChangeText={text => setFormData(prev => ({ ...prev, shop_address: text }))}
                />

                <Dropdown
                    style={styles.dropdownMenu}
                    data={states.map(item => ({ label: item.state, value: item.state }))} // Correct Mapping
                    value={formData.state}
                    labelField="label"
                    valueField="value"
                    placeholder="Select State"
                    onChange={item => handleStateChange(item.value)}
                />


                <Dropdown
                    style={styles.dropdownMenu}
                    data={cities.map(city => ({ label: city, value: city }))} // Mapping Districts Correctly
                    value={formData.city_district}
                    labelField="label"
                    valueField="value"
                    placeholder="Select City/District"
                    onChange={item => setFormData(prevState => ({ ...prevState, city_district: item.value }))}
                />

                <TextInput
                    mode='outlined'
                    style={styles.textInput}
                    label="Village"
                    value={formData.village_name}
                    onChangeText={text => setFormData(prev => ({ ...prev, village_name: text }))}
                />

                <TextInput
                    mode='outlined'
                    style={styles.textInput}
                    label="Phone Number"
                    keyboardType="phone-pad"
                    value={formData.phoneNumber}
                    onChangeText={text => setFormData(prev => ({ ...prev, phoneNumber: text }))}
                />

                <TextInput
                    mode='outlined'
                    style={styles.textInput}
                    label="WhatsApp Number"
                    keyboardType="phone-pad"
                    value={formData.whatsappNumber}
                    onChangeText={text => setFormData(prev => ({ ...prev, whatsappNumber: text }))}
                />

                <Dropdown
                    style={styles.dropdownMenu}
                    data={[{ label: "Fixed Price", value: "fixed_price" }, { label: "Negotiation Price", value: "negotiation_price" }]}
                    labelField="label"
                    valueField="value"
                    value={formData.pricing_preference}
                    placeholder="Select Pricing Preference"
                    onChange={item => setFormData(prev => ({ ...prev, pricing_preference: item.value }))}
                />

                <Dropdown
                    style={styles.dropdownMenu}
                    data={[{ label: "Retail Customers", value: "retail_customers" }, { label: "Wholesalers", value: "wholesalers" }, { label: "Restaurants", value: "restaurants" }, { label: "Hotels", value: "hotels" }]}
                    labelField="label"
                    valueField="value"
                    value={formData.preferred_buyers}
                    placeholder="Select Preferred Buyers"
                    onChange={item => setFormData(prev => ({ ...prev, preferred_buyers: item.value }))}
                />

                <TextInput
                    mode='outlined'
                    style={styles.textinputTextarea}
                    label="Shop Description"
                    value={formData.shop_description}
                    onChangeText={text => setFormData(prev => ({ ...prev, shop_description: text }))}
                />

                {/* Shop Profile Image */}
                {formData.shop_profile_image && (
                    <Image source={{ uri: formData.shop_profile_image }} style={styles.imagePreview} />
                )}
                <Button mode="outlined" onPress={pickShopProfileImage}>
                    Upload Shop Profile Image
                </Button>

                {/* Shop Cover Image */}
                {formData.shop_cover_image && (
                    <Image source={{ uri: formData.shop_cover_image }} style={styles.imagePreview} />
                )}
                <Button mode="outlined" onPress={pickShopCoverImage}>
                    Upload Shop Cover Image
                </Button>


                <Button style={{marginBottom: 60 , marginTop: 20}} mode="contained" onPress={handleSubmit}>Update Shop</Button>

            </ScrollView>
        </KeyboardAvoidingView>


    );
};

export default EditShopScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f0f0f0',
    },
    dropdownMenu: {
        backgroundColor: "#fff",
        marginVertical: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
    },
    textInput: {
        marginBottom: 20,
        color: "#000"
    },
    textinputTextarea: {
        height: 100,
        marginBottom: 20,
    }
});
