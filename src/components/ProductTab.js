import React from 'react';
import { ScrollView, StyleSheet, View, Image, Text } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { REACT_APP_BASE_URI } from '@env';
import FIcon from "react-native-vector-icons/FontAwesome6";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const ProductsTab = () => {
  const { products } = useSelector((state) => state.shop);
  console.log("products from product tab", products);

  const productImage = products?.product_image
    ? `${REACT_APP_BASE_URI}/${products.product_image}`
    : 'https://via.placeholder.com/150';


  return (
    <ScrollView style={{ flex: 1 }}>

      <View style={styles.productsGrid}>
        {products.map((product, i) => {

          return (
            <Card key={product._id || i} style={styles.productCard}>

              <Card.Cover source={{ uri: productImage }} style={styles.product_image} />
              <Card.Content>

                <Title style={styles.product_title}>{product.name}</Title>
                <Paragraph>₹ {product.price_per_unit} / {product.unit}</Paragraph>

                <Text>
                  <Icon name="calendar" size={16} /> {product.harvest_date?.slice(0, 10)}
                </Text>

              </Card.Content>

            </Card>
          );
        })}
      </View>

    </ScrollView>

  );
};

export default ProductsTab;

const styles = StyleSheet.create({
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    padding: 10,
  },
  productCard: {
    width: '45%',
    marginVertical: 10,
    backgroundColor: "#fff",

  },
  product_image: {
    height: 120,
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0
  },
  product_title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
