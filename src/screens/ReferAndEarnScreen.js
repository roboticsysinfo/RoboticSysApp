import React, { useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Share } from 'react-native';
import { Card, Button, Divider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import coins from "../assets/coins.png"
import coinIcon from "../assets/coin.png"
import sampleProductImage from "../assets/sampleProduct.png"
import { COLORS } from '../../theme';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import Clipboard from '@react-native-clipboard/clipboard';
import Toast from 'react-native-toast-message';
import { getFarmerById } from '../redux/slices/authSlice';
import { fetchRedeemProducts } from '../redux/slices/redeemProductSlice';
import RedeemProducts from '../components/RedeemProducts';
import { incrementReferralShare } from '../redux/slices/rewardSlice';


const ReferAndEarnScreen = () => {

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const { user, farmerDetails, loading, error } = useSelector((state) => state.auth);
  const { rproducts } = useSelector((state) => state.redeemProducts);


  const userId = user?.id;

  const referralCode = farmerDetails?.referralCode;
  const points = farmerDetails?.points;


  useFocusEffect(
    useCallback(() => {
      if (userId) {
        dispatch(getFarmerById(userId));
      }
    }, [dispatch, userId])
  );

  useEffect(() => {
    dispatch(fetchRedeemProducts());
    if (userId) {
      dispatch(getFarmerById(userId));
    }
  }, [dispatch, userId]);


  // Copy Referral Code
  const handleCopy = () => {
    Clipboard.setString(referralCode);
    Toast.show({
      type: 'success',
      text1: 'Referral code copied!',
      position: 'bottom',
    });
  };

  // Share Download Url with Referral Code

  const shareReferral = async () => {
    const message = `Join our app and get rewards! Use my referral code: ${referralCode}.\nDownload the app: https://yourappdownloadlink.com`;
  
    try {
      const result = await Share.share({ message });
  
      if (result.action === Share.sharedAction) {
        const res = await dispatch(incrementReferralShare(userId));
  
        // Check for daily limit
        if (res.payload?.message?.includes("Daily share limit")) {
          Toast.show({
            type: 'info',
            text1: res.payload.message,
            position: 'bottom',
          });
        } else {
          // ✅ Re-fetch updated points
          dispatch(getFarmerById(userId));
        }
      }
  
    } catch (error) {
      console.log("Error sharing referral:", error);
    }
  };
  




  return (

    <ScrollView contentContainerStyle={styles.container}>

      {/* Header */}
      <View style={styles.header}>

        <TouchableOpacity onPress={() => navigation.replace('Dashboard')}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerText}>Refer your Friend</Text>
        <Text style={styles.subHeaderText}>Earn 10 points each</Text>
        <Image
          source={coins}
          style={styles.coinsImage}
        />
      </View>

      {/* Referral Card */}
      <Card style={styles.card}>

        <View style={styles.pointsRow}>
          <Image source={coinIcon} style={styles.coinIcon} />
          <Text style={styles.pointsText}>{points} Points</Text>
        </View>

        <Text style={styles.cardSubText}>Total Points Earn</Text>
        <Text style={styles.referralTitle}>Referral code</Text>

        <View style={styles.codeRow}>
          <Text style={styles.code}>{referralCode}</Text>
          <TouchableOpacity
            style={styles.copyBtn}
            onPress={handleCopy}
          >
            <Text style={styles.copyText}>Copy</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.shareContainer}>
          <Button
            mode="contained"
            onPress={shareReferral}
            style={styles.shareButton}
            icon="share-variant"
          >
            Share Referral Code
          </Button>
        </View>

      </Card>


      {/* Steps */}
      <Card style={styles.stepCard}>
        <View style={styles.step}>
          <Icon name="link-outline" size={20} color="#007aff" />
          <Text style={styles.stepText}>Invite your Friend to install the app with the link or referral code</Text>
        </View>
        <View style={styles.step}>
          <Icon name="cube-outline" size={20} color="#f39c12" />
          <Text style={styles.stepText}>When Your friend register on the app after KYC approve get 10 points each</Text>
        </View>
        <View style={styles.step}>
          <Icon name="cash-outline" size={20} color="#27ae60" />
          <Text style={styles.stepText}>You also get 10 Points when your friend register on the app</Text>
        </View>
      </Card>

      {/* Rewards Section */}
      <Text style={styles.rewardHeader}>Popular in Reward </Text>
      <Text style={{ fontSize: 18, paddingHorizontal: 16, fontWeight: "bold", color: "#f39c12" }}>Redeem Exciting Products with points</Text>

      <RedeemProducts />

    </ScrollView>

  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 100,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: COLORS.primaryColor,
    padding: 20,
    height: 180,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    position: 'relative',
  },
  headerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 50,
  },
  subHeaderText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
  },
  coinsImage: {
    position: 'absolute',
    right: 10,
    top: 40,
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
  card: {
    margin: 16,
    padding: 16,
    borderRadius: 16,
    elevation: 3,
  },
  pointsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  coinIcon: {
    width: 30,
    height: 30,
    marginRight: 5,
  },
  pointsText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  cardSubText: {
    color: '#999',
    marginBottom: 10,
  },
  referralTitle: {
    fontSize: 16,
    color: '#f39c12',
    fontWeight: '600',
    marginTop: 10,
  },
  codeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  code: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  copyBtn: {
    backgroundColor: '#d4fddc',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  copyText: {
    color: '#2ecc71',
    fontWeight: '600',
  },
  stepCard: {
    marginHorizontal: 16,
    marginTop: 10,
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#f8f9ff',
    borderWidth: 1,
    borderColor: '#d0d7f9',
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  stepText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    lineHeight: 22
  },
  rewardHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 16,
    marginTop: 20,
  },
  points: {
    fontSize: 14,
    color: '#f39c12',
  },

  shareContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  shareButton: {
    backgroundColor: '#00A859',
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderRadius: 6,
  },
});

export default ReferAndEarnScreen;
