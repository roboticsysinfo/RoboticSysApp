import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Card, Title, Paragraph, Text, Divider } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next'; // Importing useTranslation hook

const AboutTab = () => {
  const { selectedShop: shop } = useSelector(state => state.shop);
  const { t } = useTranslation(); // Using useTranslation hook to get the t function for translation

  if (!shop) return null;

  return (
    <ScrollView style={{ flex: 1 }}>

      <Card style={styles.tabContent}>
        <Card.Content>
          <Title style={styles.sectionTitle}>{t("About Shop")}</Title>
          <Paragraph>{shop.shop_description || "No description available"}</Paragraph>
        </Card.Content>
      </Card>

      <View style={styles.section}>
        <Text variant="titleLarge" style={styles.sectionTitle}>{t("Address Details")}</Text>
        <Divider />
        <View style={styles.flexSection}><Text>{t("Address")}:</Text><Text>{shop?.shop_address}</Text></View>
        <View style={styles.flexSection}><Text>{t("Phone Number")}:</Text><Text>{shop?.phoneNumber}</Text></View>
        <View style={styles.flexSection}><Text>{t("WhatsApp Number")}:</Text><Text>{shop?.whatsappNumber}</Text></View>
        <View style={styles.flexSection}><Text>{t("State")}:</Text><Text>{shop?.state}</Text></View>
        <View style={styles.flexSection}><Text>{t("City")}:</Text><Text>{shop?.city_district}</Text></View>
        <View style={styles.flexSection}><Text>{t("Village")}:</Text><Text>{shop?.village_name}</Text></View>
      </View>

      <View style={styles.section}>
        <Text variant="titleLarge" style={styles.sectionTitle}>{t("Other Details")}</Text>
        <Divider />
        <View style={styles.flexSection}><Text>{t("Preferred Buyers")} :</Text><Text>{shop?.preferred_buyers}</Text></View>
        <View style={styles.flexSection}><Text>{t("Pricing Preference")} :</Text><Text>{shop?.pricing_preference}</Text></View>
      </View>

    </ScrollView>
  );
};

export default AboutTab;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  coverImage: {
    width: '100%',
    height: 150,
  },
  profileSection: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  info: {
    marginLeft: 16,
  },
  subTitle: {
    color: 'gray',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  stars: {
    color: '#FFD700',
    fontSize: 16,
  },
  rating: {
    marginLeft: 8,
    fontWeight: 'bold',
  },
  tabContent: {
    padding: 16,
    color: "#000",
    backgroundColor: "#fff"
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    padding: 10,
  },
  productCard: {
    width: '45%',
    marginVertical: 10,
  },

  flexSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd"
  },

  sectionTitle: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: "bold"
  },

  section: {
    padding: 20,
    backgroundColor: "#fff"
  },

});
