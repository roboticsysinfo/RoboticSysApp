import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, ToastAndroid, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { approveOrderRequest, cancelOrderRequest, getOrderRequestByFarmerId } from '../../redux/slices/orderSlice';
import { ActivityIndicator, Button, Card } from 'react-native-paper';
import { COLORS } from '../../../theme';
import moment from 'moment';
import noOrder from "../../assets/noOrder.png";
import { useTranslation } from 'react-i18next';


const OrdersScreen = () => {

  const [refreshing, setRefreshing] = useState(false);
  const dispatch = useDispatch();
  const { requests: orders, loading, error } = useSelector((state) => state.requestOrder);
  const { user } = useSelector((state) => state.auth);
  const farmerId = user?.id;
  const { t, i18n } = useTranslation();
  const language = useSelector((state) => state.language.language);


  const loadOrders = async () => {
    setRefreshing(true);
    await dispatch(getOrderRequestByFarmerId(farmerId));
    setRefreshing(false);
  };

  useEffect(() => {
    if (farmerId) {
      loadOrders();
    }
  }, [farmerId]);

  // Update language
  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language]);

  const renderOrder = ({ item, index }) => <OrderCard key={item?._id || index} order={item} />;

  return (

    <View style={{ flex: 1 }}>

      {loading && <Text style={{ textAlign: 'center', marginTop: 20 }}>{t("Loading")}...</Text>}

      {error && orders?.length === 0 && (
        <Text style={styles.error}>
          {typeof error === 'string'
            ? `Error: ${error}`
            : 'Something went wrong while fetching orders.'}
        </Text>
      )}

      {orders?.length === 0 && !loading ? (

        <View style={styles.emptyContainer}>
          <Image source={noOrder} style={styles.image} />
          <Text style={styles.emptyTitle}>{t('No Orders Yet')}</Text>
          <Text style={styles.emptySubtitle}>
            {t("We’ll let you know when there will be something to update you.")}
          </Text>
        </View>


      ) : (
        <FlatList
          data={[...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))}
          keyExtractor={(item, index) => item?._id?.toString() || index.toString()}
          renderItem={renderOrder}
          refreshing={refreshing}
          onRefresh={loadOrders}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
};


// OrderCard Component
const OrderCard = ({ order }) => {
  const { t, i18n } = useTranslation();
  const language = useSelector((state) => state.language.language);
  const dispatch = useDispatch();
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const toggleDropdown = () => setIsDropdownVisible(!isDropdownVisible);


  // Update language
  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language]);


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
      t("Confirm Approval"),
      t("Are you sure you want to accept this order?"),
      [
        {
          text: t("No"),
          onPress: () => console.log("Order approval cancelled"),
          style: "cancel"
        },
        {
          text: t("Yes"),
          onPress: () => {
            dispatch(approveOrderRequest(orderId));
            ToastAndroid.show(t("Order Approved Successfully!"), ToastAndroid.SHORT);
          }
        }
      ]
    );
  };

  const handleCancelOrder = (orderId) => {
    Alert.alert(
      t("Confirm Cancellation"),
      t("Are you sure you want to cancel this order?"),
      [
        {
          text: t("No"),
          onPress: () => console.log("Order cancellation cancelled"),
          style: "cancel"
        },
        {
          text: t("Yes"),
          onPress: () => {
            dispatch(cancelOrderRequest(orderId));
            ToastAndroid.show(t("Order Cancelled Successfully!"), ToastAndroid.SHORT);
          }
        }
      ]
    );
  };


  return (
    <Card style={styles.card}>

      <Card.Content>

        <Text style={styles.header}>{t("Order ID")}: {order?._id || "N/A"}</Text>

        <Text style={styles.productName}>{t("Product")}: {order?.product_id?.name || "Unknown"}</Text>

        <Text style={[styles.status, getStatusStyle(order?.status)]}>
          {t("Status")}: {order?.status || t("pending")}
        </Text>

        <Text style={styles.priceText}>{t("Price Per Unit")}: ₹{order?.product_id?.price_per_unit || "0"} | Unit: ₹{order?.product_id?.unit || "N/A"}</Text>

        <Text style={styles.dateTime}>{t("Date")}: {formattedDate}</Text>

        {order?.status?.toLowerCase() === "pending" && (
          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              onPress={() => handleApprovedOrder(order?._id)}
              style={[styles.button, styles.approveBtn]}
            >
              {t("Confirm")}
            </Button>
            <Button
              mode="outlined"
              onPress={() => handleCancelOrder(order?._id)}
              style={[styles.button, styles.declineBtn]}
            >
              <Text style={styles.declineBtntext}>
                {t("Reject")}
              </Text>
            </Button>
          </View>
        )}


        <TouchableOpacity onPress={toggleDropdown} style={styles.toggleButton}>
          <Text style={styles.toggleButtonText}>{isDropdownVisible ? "Hide Details" : "Show More"}</Text>
        </TouchableOpacity>

        {isDropdownVisible && (
          <View style={styles.dropdown}>
            <Text style={styles.dropdownText}>{t("Customer Name")}: {order?.customer_id?.name || "N/A"}</Text>
            <Text style={styles.dropdownText}>{t("Address")}: {order?.customer_id.address || "N/A"}</Text>
            <Text style={styles.dropdownText}>{t("Quantity Requested")}: {order?.quantity_requested || "0"}</Text>
            <Text style={styles.dropdownText}>{t("Note")}: {order?.notes || "N/A"}</Text>
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
  priceText: {
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
    borderColor: "#DA2825",
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
  },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center" },

  image: { width: 250, height: 250, marginBottom: 16, resizeMode: "contain" },

  emptyTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 8 },

  emptySubtitle: { fontSize: 14, color: "gray", textAlign: "center", paddingHorizontal: 40 },

});

export default OrdersScreen;
