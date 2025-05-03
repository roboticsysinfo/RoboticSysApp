import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, RefreshControl, ActivityIndicator, StyleSheet, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { clearFamilyMessages, getRequestsForFarmer, updateRequestStatus } from '../redux/slices/familyFarmerSlice';
import { Button, Card, Divider } from 'react-native-paper';
import norequest from "../assets/request.png";
import { COLORS } from '../../theme';
import { Snackbar } from 'react-native-paper';
import { useTranslation } from 'react-i18next';


const FamilyFarmerRequestScreen = () => {

  
  const dispatch = useDispatch();
  const {t} = useTranslation();
  const { requests, loading, error } = useSelector((state) => state.familyfarmer);
  const { user } = useSelector((state) => state.auth);
  const farmerId = user?.id;


  const [refreshing, setRefreshing] = useState(false);
  // Snackbar state
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarError, setSnackbarError] = useState(false);


  const fetchRequests = useCallback(() => {
    if (farmerId) {
      dispatch(getRequestsForFarmer(farmerId));
    }
  }, [dispatch, farmerId]);


  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);


  const onRefresh = () => {
    setRefreshing(true);
    dispatch(getRequestsForFarmer(farmerId)).finally(() => setRefreshing(false));
  };


  // Handle confirm request
  const handleConfirmRequest = (requestId) => {
    dispatch(updateRequestStatus({ requestId, status: 'accepted' }))
      .unwrap()
      .then((res) => {
        setSnackbarMessage(res.message || t('Request confirmed successfully'));
        setSnackbarError(false);
        setSnackbarVisible(true);
        fetchRequests(); // Refresh the list
      })
      .catch((err) => {
        setSnackbarMessage(err.message || t('Failed to confirm request'));
        setSnackbarError(true);
        setSnackbarVisible(true);
      });
  };


  // Handle reject request
  const handleRejectRequest = (requestId) => {
    dispatch(updateRequestStatus({ requestId, status: 'rejected' }))
      .unwrap()
      .then((res) => {
        setSnackbarMessage(res.message || t('Request rejected successfully'));
        setSnackbarError(false);
        setSnackbarVisible(true);
        fetchRequests(); // Refresh the list
      })
      .catch((err) => {
        setSnackbarMessage(err.message || t('Failed to reject request'));
        setSnackbarError(true);
        setSnackbarVisible(true);
      });
  };



  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.requestId}># {item._id.slice(-6)}</Text>
      </View>
      <Divider style={{ marginVertical: 8 }} />
      <View style={styles.topRow}>
        <Image
          source={{ uri: item.fromCustomer?.profileImage || 'https://avatar.iran.liara.run/public/boy' }}
          style={styles.profileImage}
        />
        <View style={styles.nameMessageContainer}>
          <View style={styles.nameDateRow}>
            <View>
              <Text style={styles.nameText}>{item.fromCustomer?.name || 'Unknown'}</Text>
              <Text style={styles.dateText}>{item.fromCustomer?.address || 'Unknown'}</Text>
            </View>
            <Text style={styles.dateText}>{new Date(item.createdAt).toLocaleDateString()}</Text>
          </View>
          <Text style={styles.messageText}>{t(item.message)}</Text>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={() => handleConfirmRequest(item._id)}
          style={[styles.button, styles.approveBtn]}
        >
          {t("Confirm")}
        </Button>
        <Button
          mode="outlined"
          onPress={() => handleRejectRequest(item._id)}
          style={[styles.button, styles.declineBtn]}
        >
          <Text style={styles.declineBtntext}>{t("Reject")}</Text>
        </Button>
      </View>
    </Card>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Image source={norequest} style={styles.image} />
      <Text style={styles.emptyTitle}>
        {error ? `Error: ${error}` : t("No Family Requests Found Yet!")}
      </Text>
      <Text style={styles.emptySubtitle}>
          {t(" We’ll let you know when there will be something to update you.")}
      </Text>
    </View>
  );

  const pendingRequests = requests?.filter((item) => item.status === 'pending');

  return (

    <>

      <View style={styles.container}>
        {loading && !refreshing ? (
          <ActivityIndicator size="large" color={COLORS.primaryColor} style={styles.loader} />
        ) : (
          <FlatList
            data={pendingRequests}
            keyExtractor={(item) => item._id}
            renderItem={renderItem}
            ListEmptyComponent={renderEmpty}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primaryColor]} />
            }
            contentContainerStyle={pendingRequests?.length === 0 ? styles.emptyContainer : {}}
          />
        )}
      </View>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => {
          setSnackbarVisible(false);
          dispatch(clearFamilyMessages());
        }}
        duration={3000}
        style={{ backgroundColor: snackbarError ? 'red' : 'green' }}
      >
        {snackbarMessage}
      </Snackbar>

    </>

  );
};

export default FamilyFarmerRequestScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loader: {
    marginTop: 50,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  image: {
    width: 250,
    height: 250,
    marginBottom: 16,
    resizeMode: "contain"
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8
  },
  emptySubtitle: {
    fontSize: 14,
    color: "gray",
    textAlign: "center",
    paddingHorizontal: 40
  },
  card: {
    margin: 20,
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#fff',
    elevation: 3,
  },
  requestId: {
    fontWeight: 'bold',
    fontSize: 16,
    color: COLORS.lightBlack,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
    backgroundColor: '#eee',
    resizeMode: "cover"
  },
  nameMessageContainer: {
    flex: 1,
  },
  nameDateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nameText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  dateText: {
    fontSize: 12,
    color: 'gray',
  },
  messageText: {
    marginTop: 10,
    fontSize: 14,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
    padding: 5,
  },
  button: {
    flex: 1,
    margin: 5,
  },
  approveBtn: {
    backgroundColor: COLORS.primaryColor,
  },
  declineBtn: {
    borderColor: "#DA2825",
  },
  declineBtntext: {
    color: "#ff0000"
  },
});
