import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Image, ToastAndroid } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { createProduct } from '../redux/slices/productSlice';
import { launchImageLibrary } from 'react-native-image-picker';
import { Dropdown } from 'react-native-element-dropdown';
import DatePicker from 'react-native-date-picker';
import { useNavigation } from '@react-navigation/native';
import { fetchCategories } from '../redux/slices/categorySlice';

const AddProductScreen = () => {

    const dispatch = useDispatch();
    const navigation = useNavigation();
    const { categories } = useSelector(state => state.categories);

    const [formData, setFormData] = useState({

        name: '',
        season: '',
        price_per_unit: '',
        quantity: '',
        unit: '',
        category_id: '',
        harvest_date: new Date(),
        description: '',
        product_image: null,

    });

    const [openDatePicker, setOpenDatePicker] = useState(false);

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    const pickProductImage = () => {
        const options = { mediaType: 'photo', quality: 1 };
        launchImageLibrary(options, (response) => {
            if (!response.didCancel && !response.error) {
                
                setFormData(prev => ({ ...prev, product_image: response.assets[0].uri }));
            }
        });
    };

    const handleSubmit = () => {
        const formDataToSend = new FormData();
        formDataToSend.append('name', formData.name);
        formDataToSend.append('season', formData.season);
        formDataToSend.append('price_per_unit', formData.price_per_unit);
        formDataToSend.append('quantity', formData.quantity);
        formDataToSend.append('unit', formData.unit);
        formDataToSend.append('category_id', formData.category_id);
        formDataToSend.append('harvest_date', formData.harvest_date.toISOString());
        formDataToSend.append('description', formData.description);

        if (formData.product_image) {
            formDataToSend.append('product_image', {
                uri: formData.product_image,
                name: 'product_image.jpg',
                type: 'image/jpeg',
            });
        }

        dispatch(createProduct(formDataToSend))
            .unwrap()
            .then(() => {
                ToastAndroid.show('Product Added Successfully!', ToastAndroid.SHORT);
                navigation.goBack();
            })
            .catch(error => console.error('Create Product Error:', error));
    };

    return (
        <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
            
            <TextInput
                mode='outlined'
                label="Product Name"
                value={formData.name}
                onChangeText={text => setFormData(prev => ({ ...prev, name: text }))}
                style={styles.textInput}
            />

            <Dropdown
                style={styles.dropdown}
                data={[{ label: 'Winter', value: 'winter' }, { label: 'Summer', value: 'summer' }]}
                value={formData.season}
                labelField="label"
                valueField="value"
                placeholder="Select Season"
                onChange={item => setFormData(prev => ({ ...prev, season: item.value }))}
            />

            <TextInput
                mode='outlined'
                label="Price Per Unit"
                keyboardType="numeric"
                value={formData.price_per_unit}
                onChangeText={text => setFormData(prev => ({ ...prev, price_per_unit: text }))}
                style={styles.textInput}
            />

            <TextInput
                mode='outlined'
                label="Quantity"
                keyboardType="numeric"
                value={formData.quantity}
                onChangeText={text => setFormData(prev => ({ ...prev, quantity: text }))}
                style={styles.textInput}
            />

            <Dropdown
                style={styles.dropdown}
                data={[{ label: 'kg', value: 'kg' }, { label: 'liters', value: 'liters' }, { label: 'tons', value: 'tons' }, { label: 'pieces', value: 'pieces' }]}
                value={formData.unit}
                labelField="label"
                valueField="value"
                placeholder="Select Unit"
                onChange={item => setFormData(prev => ({ ...prev, unit: item.value }))}
            />

            <Dropdown
                style={styles.dropdown}
                data={categories.map(cat => ({ label: cat.name, value: cat._id }))}
                value={formData.category_id}
                labelField="label"
                valueField="value"
                placeholder="Select Category"
                onChange={item => setFormData(prev => ({ ...prev, category_id: item.value }))}
            />

            <Button mode='outlined' onPress={() => setOpenDatePicker(true)}>
                Select Harvest Date
            </Button>

            <DatePicker
                modal
                open={openDatePicker}
                date={formData.harvest_date}
                mode="date"
                onConfirm={(date) => {
                    setOpenDatePicker(false);
                    setFormData(prev => ({ ...prev, harvest_date: date }));
                }}
                onCancel={() => setOpenDatePicker(false)}
            />

            <TextInput
                mode='outlined'
                label="Product Description"
                value={formData.description}
                onChangeText={text => setFormData(prev => ({ ...prev, description: text }))}
                style={styles.textArea}
            />

            {formData.product_image && <Image source={{ uri: formData.product_image }} style={styles.imagePreview} />}
            <Button mode='outlined' onPress={pickProductImage}>Upload Product Image</Button>

            <Button mode='contained' onPress={handleSubmit} style={styles.submitButton}>Add Product</Button>

        </ScrollView>
    );
};

export default AddProductScreen;

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#f0f0f0' },
    textInput: { marginBottom: 20 },
    textArea: { height: 100, marginBottom: 20 },
    dropdown: { backgroundColor: '#fff', marginBottom: 20, padding: 10, borderRadius: 5 },
    imagePreview: { width: 100, height: 100, alignSelf: 'center', marginVertical: 10 },
    submitButton: { marginTop: 20 , marginBottom: 60}
});
