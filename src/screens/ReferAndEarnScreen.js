import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Card, Button, Divider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import coins from "../assets/coins.png"
import coinIcon from "../assets/coin.png"
import sampleProductImage from "../assets/sampleProduct.png"
import { COLORS } from '../../theme';
import { useNavigation } from '@react-navigation/native';


const ReferAndEarnScreen = () => {

    const navigation = useNavigation();

  const referralCode = 'www.pikpart/kdfkf';


  return (

    <ScrollView contentContainerStyle={styles.container}>

      {/* Header */}
      <View style={styles.header}>

        <TouchableOpacity onPress={ () => navigation.navigate('Dashboard')}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerText}>Refer your Friend</Text>
        <Text style={styles.subHeaderText}>Earn ₹150 each</Text>
        <Image
          source={coins}
          style={styles.coinsImage}
        />
      </View>

      {/* Referral Card */}
      <Card style={styles.card}>
        <View style={styles.pointsRow}>
          <Image source={coinIcon} style={styles.coinIcon} />
          <Text style={styles.pointsText}>300 Pts</Text>
        </View>
        <Text style={styles.cardSubText}>Total Points Earn</Text>
        <Text style={styles.referralTitle}>Referral code</Text>
        <View style={styles.codeRow}>
          <Text style={styles.code}>{referralCode}</Text>
          <TouchableOpacity style={styles.copyBtn}>
            <Text style={styles.copyText}>Copy</Text>
          </TouchableOpacity>
        </View>
      </Card>


      {/* Steps */}
      <Card style={styles.stepCard}>
        <View style={styles.step}>
          <Icon name="link-outline" size={20} color="#007aff" />
          <Text style={styles.stepText}>Invite your Friend to install the app with the link</Text>
        </View>
        <View style={styles.step}>
          <Icon name="cube-outline" size={20} color="#f39c12" />
          <Text style={styles.stepText}>Your friend places a minimum order of ₹300</Text>
        </View>
        <View style={styles.step}>
          <Icon name="cash-outline" size={20} color="#27ae60" />
          <Text style={styles.stepText}>You get ₹150 once the return period is over</Text>
        </View>
      </Card>

      {/* Rewards Section */}
      <Text style={styles.rewardHeader}>Popular in Reward <Text style={styles.points}>You have 300Pts</Text></Text>
      
      <View style={styles.rewardList}>
        {[1, 2, 3, 4].map((_, index) => (
          <Card key={index} style={styles.rewardCard}>
            <Image
              source={sampleProductImage}
              style={styles.rewardImage}
            />
            <Text style={styles.rewardTitle}>Service parts</Text>

            <Divider />

            <Button
              mode="contained"
              compact
              style={styles.useBtn}
              labelStyle={{ fontSize: 12 }}
            >
              Use 🪙 200Pts
            </Button>
          </Card>
        ))}
      </View>
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
    height: 200,
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
    marginRight: 10,
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
  rewardList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    paddingBottom: 20,
  },
  rewardCard: {
    width: '44%',
    marginTop: 12,
    padding: 20,
    borderRadius: 16,
    flexDirection: "column",
    alignItems: 'center',
    justifyContent: "center",
    backgroundColor: "#fff"
  },
  rewardImage: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
  rewardTitle: {
    fontWeight: '600',
    marginTop: 8,
    fontSize: 14
  },
  rewardDesc: {
    color: '#555',
    fontSize: 12,
  },
  useBtn: {
    marginTop: 12,
    backgroundColor: COLORS.secondaryColor,
    width: 120
  },
});

export default ReferAndEarnScreen;
