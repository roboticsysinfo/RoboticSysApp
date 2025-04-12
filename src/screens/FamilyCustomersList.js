import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, RefreshControl, ActivityIndicator, StyleSheet, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getRequestsForFarmer } from '../redux/slices/familyFarmerSlice';
import { Card } from 'react-native-paper';
import familyCustomer from "../assets/family-customer.png"
import { COLORS } from '../../theme';

const FamilyCustomersList = () => {

  const dispatch = useDispatch();
  const { requests, loading, error } = useSelector((state) => state.familyfarmer);
  const { user } = useSelector((state) => state.auth);
  const farmerId = user?.id;

  const [refreshing, setRefreshing] = useState(false);

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

  const acceptedRequests = requests?.filter(req => req.status === 'accepted');

  console.log("accpeted request by farmer", acceptedRequests)

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.requestId}># {item._id.slice(-6)}</Text>
      </View>

      <View style={styles.topRow}>
        <Image
          source={{ uri: item.fromCustomer?.profileImage || 'https://via.placeholder.com/50' }}
          style={styles.profileImage}
        />
        <View style={styles.nameMessageContainer}>
          <View style={styles.nameDateRow}>
            <View>
              <Text style={styles.nameText}>{item.fromCustomer?.name || 'Unknown'}</Text>
              <Text style={styles.detailText}>📍 {item.fromCustomer?.address || 'Unknown'}</Text>
              <Text style={styles.detailText}>📞 {item.fromCustomer?.phoneNumber || 'N/A'}</Text>
              <Text style={styles.detailText}>📧 {item.fromCustomer?.email || 'N/A'}</Text>
            </View>
            <Text style={styles.dateText}>{new Date(item.createdAt).toLocaleDateString()}</Text>
          </View>
        </View>
      </View>
    </Card>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Image source={familyCustomer} style={styles.image} />
      <Text style={styles.emptyTitle}>
        {error ? `Error: ${error}` : 'No Accepted Family Customers Found!'}
      </Text>
      <Text style={styles.emptySubtitle}>
        Once someone joins your family, they will appear here.
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading && !refreshing ? (
        <ActivityIndicator size="large" color={COLORS.primaryColor} style={styles.loader} />
      ) : (
        <FlatList
          data={acceptedRequests}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          ListEmptyComponent={renderEmpty}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primaryColor]} />
          }
          contentContainerStyle={acceptedRequests?.length === 0 ? styles.emptyContainer : {}}
        />
      )}
    </View>
  );
};

export default FamilyCustomersList;

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
  header: {
    marginBottom: 8,
  },
  requestId: {
    fontWeight: 'bold',
    fontSize: 16,
    color: COLORS.lightBlack,
    marginBottom: 10
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
    alignItems: 'flex-start',
  },
  nameText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  detailText: {
    fontSize: 14,
    color: '#555',
    marginTop: 2,
  },
  dateText: {
    fontSize: 12,
    color: 'gray',
    marginTop: 2,
  },
});
