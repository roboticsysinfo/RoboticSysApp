import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Text, Card, ActivityIndicator, Snackbar } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { getFarmerById, updateFarmerById } from '../redux/slices/authSlice';

const ProfileScreen = () => {
  const dispatch = useDispatch();
  const { user, farmerDetails, loading, error } = useSelector((state) => state.auth);

  const [form, setForm] = useState({ name: '', email: '', address: '' });
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const farmerId = user?.id;

  
  useEffect(() => {
    if (farmerId) {
      dispatch(getFarmerById(farmerId));
    }
  }, [dispatch, farmerId]);
  
  
  useEffect(() => {
    if (farmerDetails) {
      setForm({ 
        name: farmerDetails.name || '', 
        email: farmerDetails.email || '', 
        address: farmerDetails.address || '' 
      });
    }
  }, [farmerDetails]);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleUpdate = async () => {
    try {
      await dispatch(updateFarmerById({ farmerId, farmerData: form })).unwrap();
      setSnackbarVisible(true);
    } catch (error) {
      Alert.alert('Update Failed', error.message || 'Something went wrong');
    }
  };

  if (loading) return <ActivityIndicator animating={true} size="large" />;

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Title title="Farmer Profile" />
        <Card.Content>

          <TextInput mode='outlined' style={styles.textInput} label="Name" value={form.name} onChangeText={(text) => handleChange('name', text)} />
          
          <TextInput mode='outlined' style={styles.textInput} label="Email" value={form.email} onChangeText={(text) => handleChange('email', text)} keyboardType="email-address" />
          
          <TextInput mode='outlined' style={styles.textInput} label="Address" value={form.address} onChangeText={(text) => handleChange('address', text)} />
          
          <TextInput mode='outlined' style={styles.textInput} label="Phone Number" value={String(farmerDetails?.phoneNumber || '')} disabled />
          
          <TextInput mode='outlined' style={styles.textInput} label="Aadhar Card" value={String(farmerDetails?.aadharCard || '')} disabled />
          
          <Text mode='outlined' style={styles.textInput}>KYC Verified: {farmerDetails?.isKYCVerified ? '✅ Verified' : '❌ Unverified'}</Text>
          
          <Button mode="contained" onPress={handleUpdate} style={styles.button}>
            Update Profile
          </Button>

        </Card.Content>
      </Card>
      <Snackbar visible={snackbarVisible} onDismiss={() => setSnackbarVisible(false)}>
        Profile Updated Successfully
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  card: { padding: 20 },
  button: { marginTop: 20 },
  textInput: {
    marginBottom: 20,
    color: "#000"
  },
});

export default ProfileScreen;
