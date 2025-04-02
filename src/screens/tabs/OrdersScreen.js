import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ToastAndroid } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { approveOrderRequest, cancelOrderRequest, getOrderRequestByFarmerId } from '../../redux/slices/orderSlice';
import { ActivityIndicator, Button, Card } from 'react-native-paper';
import { COLORS } from '../../../theme';
import moment from 'moment';

const OrdersScreen = () => {
  const dispatch = useDispatch();
  const { requests: orders, loading, error } = useSelector((state) => state.requestOrder);
  const { user } = useSelector((state) => state.auth);

  const farmerId = user?.id;

  console.log("orders", orders);

  useEffect(() => {
    if (farmerId) {
      dispatch(getOrderRequestByFarmerId(farmerId));
    }
  }, [dispatch, farmerId]);

  return (
    <ScrollView>
      {loading && <ActivityIndicator style={styles.loading} size="large" color={COLORS.primaryColor} />}
      {error && <Text style={styles.error}>Error fetching Order: {error?.message || JSON.stringify(error)}</Text>}
      {orders?.length === 0 && <Text style={styles.noOrders}>No orders found</Text>}

      {orders?.map((order, index) => (
        <OrderCard key={order?._id || index} order={order} />
      ))}

    </ScrollView>
  );
};

// OrderCard Component
const OrderCard = ({ order }) => {
  const dispatch = useDispatch();
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const toggleDropdown = () => setIsDropdownVisible(!isDropdownVisible);

  // Format Date using Moment.js
  const formattedDate = order?.createdAt
    ? moment(order.createdAt).format("DD-MM-YYYY hh:mm A")
    : 'N/A';

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "cancelled":
        return { color: "red", fontWeight: "bold" };
      case "pending":
        return { color: "orange", fontWeight: "bold" };
      case "accepted":
        return { color: "green", fontWeight: "bold" };
      default:
        return { color: "black", fontWeight: "bold" };
    }
  };

  const handleApprovedOrder = (orderId) => {
    Alert.alert(
      "Confirm Approval", 
      "Are you sure you want to accept this order?", 
      [
        {
          text: "No",
          onPress: () => console.log("Order approval cancelled"),
          style: "cancel"
        },
        { 
          text: "Yes", 
          onPress: () => {
            dispatch(approveOrderRequest(orderId));
            ToastAndroid.show("Order Approved Successfully!", ToastAndroid.SHORT);
          }
        }
      ]
    );
  };
  
  const handleCancelOrder = (orderId) => {
    Alert.alert(
      "Confirm Cancellation", 
      "Are you sure you want to cancel this order?", 
      [
        {
          text: "No",
          onPress: () => console.log("Order cancellation cancelled"),
          style: "cancel"
        },
        { 
          text: "Yes", 
          onPress: () => {
            dispatch(cancelOrderRequest(orderId));
            ToastAndroid.show("Order Cancelled Successfully!", ToastAndroid.SHORT);
          }
        }
      ]
    );
  };


  return (
    <Card style={styles.card}>

      <Card.Content>

        <Text style={styles.header}>Order ID: {order?._id || "N/A"}</Text>

        <Text style={styles.productName}>Product: {order?.product_id?.name || "Unknown"}</Text>

        <Text style={[styles.status, getStatusStyle(order?.status)]}>
            Status: {order?.status || "Pending"}
        </Text>

        <Text style={styles.priceText}>Price Per Unit: ₹{order?.product_id?.price_per_unit || "0"} | Unit: ₹{order?.product_id?.unit || "N/A"}</Text>

        <Text style={styles.dateTime}>Date: {formattedDate}</Text>

        <View style={styles.buttonContainer}>
          <Button mode="contained" onPress={() => handleApprovedOrder(order?._id)} style={[styles.button, styles.approveBtn]}>
            Approve
          </Button>
          <Button mode="outlined" onPress={() => handleCancelOrder(order?._id)} style={[styles.button, styles.declineBtn]}>
            <Text style={styles.declineBtntext}>Cancel</Text>
          </Button>
        </View>

        <TouchableOpacity onPress={toggleDropdown} style={styles.toggleButton}>
            <Text style={styles.toggleButtonText}>{isDropdownVisible ? "Hide Details" : "Show More"}</Text>
        </TouchableOpacity>

        {isDropdownVisible && (
          <View style={styles.dropdown}>
            <Text style={styles.dropdownText}>Customer Name: {order?.customer_id?.name || "N/A"}</Text>
            <Text style={styles.dropdownText}>Address: {order?.customer_id.address || "N/A"}</Text>
            <Text style={styles.dropdownText}>Quantity Requested: {order?.quantity_requested || "0"}</Text>
            <Text style={styles.dropdownText}>Note: {order?.notes || "N/A"}</Text>
          </View>
        )}

      </Card.Content>
    </Card>
  );
};

// Styles
const styles = StyleSheet.create({
  card: {
    marginVertical: 16,
    padding: 10,
    marginHorizontal: 20,
    backgroundColor: "#fff"
  },
  priceText:{
    fontSize: 14,
    marginTop: 10,
    fontWeight: "bold"
  },
  header: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  productName: {
    fontSize: 16,
    marginVertical: 8,
  },
  status: {
    fontSize: 14,
    color: 'green',
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
    borderColor: "#ff0000",

  },
  declineBtntext: {
    color: "#ff0000"
  },
  toggleButton: {
    marginTop: 5,
    alignItems: 'center',
  },
  toggleButtonText: {
    color: COLORS.primaryColor,
    textDecorationLine: 'underline',
    fontWeight: "600"
  },
  dropdown: {
    marginTop: 5,
    backgroundColor: '#f4f4f4',
    padding: 10,
    borderRadius: 5,
    fontSize: 16
  },
  dropdownText: {
    fontSize: 16,
    lineHeight: 24
  },
  loading: {
    textAlign: 'center',
    marginTop: 20,
  },
  error: {
    textAlign: 'center',
    marginTop: 20,
    color: 'red',
  },
  noOrders: {
    textAlign: 'center',
    marginTop: 20,
  },
  dateTime: {
    fontSize: 14,
    marginTop: 10
  }
});

export default OrdersScreen;
