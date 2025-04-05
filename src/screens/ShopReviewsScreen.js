import React, { useState, useCallback, useEffect } from 'react';
import { View, ScrollView, RefreshControl, Image, StyleSheet, TouchableOpacity, Alert, ToastAndroid } from 'react-native';
import { Text, Card, Avatar, IconButton } from 'react-native-paper';
import OverallRating from '../components/OverallRating';
import noReviewsImage from "../assets/reviews.png"
import { useDispatch, useSelector } from 'react-redux';
import { fetchReviews, deleteReview } from '../redux/slices/reviewSlice';
import FIcon from "react-native-vector-icons/FontAwesome6";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import moment from 'moment';

const ReviewScreen = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);

  const { shop, status } = useSelector(state => state.shop);
  const { reviews } = useSelector(state => state.reviews);



  const shopId = shop?._id

  useEffect(() => {
    if (shopId) {
      dispatch(fetchReviews(shopId));
    }
  }, [dispatch, shopId]);


  const onRefresh = useCallback(async () => {
    if (!shopId) return;

    setRefreshing(true);
    await dispatch(fetchReviews(shopId));
    setRefreshing(false);
  }, [dispatch, shopId]);



  const handleDelete = (reviewId) => {
    Alert.alert(
      "Are you sure?",
      "Do you really want to delete this review?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const res = await dispatch(deleteReview(reviewId)).unwrap();
              ToastAndroid.show(res.message || "Review deleted!", ToastAndroid.SHORT);
            } catch (error) {
              ToastAndroid.show(error || "Failed to delete review", ToastAndroid.SHORT);
            }
          },
        },
      ]
    );
  };


  return (

    <ScrollView
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      contentContainerStyle={{ flexGrow: 1, padding: 16 }}
    >

      {reviews.length > 0 ? (

        <View>

          {/* ✅ Overall Rating Component - Correctly Placed */}
          <OverallRating rating={reviews.rating} totalReviews={120} />

          {[...reviews]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Sort by latest
            .map((item) => (

              <Card key={item._id} style={styles.reviewCard}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>

                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: "space-between", }}>

                    <Avatar.Image size={40} source={{ uri: item.avatar || "https://avatar.iran.liara.run/public/boy" }} />

                    <View style={{ marginLeft: 10, flexDirection: "row", justifyContent: "space-between" }}>

                      <View>

                        <Text style={{ fontWeight: 'bold' }}>{item.user_id?.name}</Text>
                        <View style={{ flexDirection: 'row', marginVertical: 5, }}>
                          {[...Array(5)].map((_, i) => (

                            <Icon
                              key={i}
                              name={i < item.rating ? 'star' : 'star-outline'}
                              size={16}
                              color="#FFD700"
                              style={styles.icon}
                            />

                          ))}
                        </View>

                      </View>

                    </View>

                    <View style={{ flexDirection: "row", justifyContent: "flex-end", width: "50%", }}>
                      <TouchableOpacity onPress={() => handleDelete(item._id)}>
                        <Icon
                          name="trash-can-outline"
                          size={20}
                          style={styles.iconDelete}
                        />
                      </TouchableOpacity>
                    </View>


                  </View>

                </View>


                <Text style={{ color: 'gray', fontSize: 12, marginTop: 10 }}>
                  {moment(item.createdAt).fromNow()}
                </Text>

                <Text style={{ marginTop: 10 }}>{item.comment}</Text>

              </Card>

            ))}

        </View>

      ) : (

        <View style={styles.emptyContainer}>
          <Image source={noReviewsImage} style={styles.image} />
          <Text style={styles.emptyTitle}>No Reviews Yet</Text>
          <Text style={styles.emptySubtitle}>
            No reviews just yet – but your harvest is just getting started!
          </Text>
        </View>

      )}
    </ScrollView>

  );
};

export default ReviewScreen;


const styles = StyleSheet.create({

  container: { flex: 1, backgroundColor: "#fff", padding: 16 },

  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center", },

  image: { width: 200, height: 200, marginBottom: 16 },

  emptyTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 8 },

  emptySubtitle: { fontSize: 14, color: "gray", textAlign: "center", paddingHorizontal: 40 },

  // Title (User Name) Styling
  reviewCard: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "whitesmoke",
    borderRadius: 4
  },


  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333"
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },

  // Description (Message) Styling
  description: {
    fontSize: 14,
    color: "#666",
    marginTop: 10,
    width: 200,
    lineHeight: 20
  },

  // Time Styling
  time: {
    fontSize: 12,
    color: "gray"
  },

  iconDelete: {
    color: "#DA2528"

  }


});
