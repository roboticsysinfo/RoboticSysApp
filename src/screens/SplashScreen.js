import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { COLORS, FONTS } from '../../theme';
import  appLogo  from "../../src/assets/kg-logo.jpg"

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Select Language');
    }, 2000); // Navigate to Login Screen after 2 seconds

    return () => clearTimeout(timer);
  }, [navigation]);

  return (

    <View style={styles.container}>
        <Image
          source={appLogo}
          style={styles.headerImage}
        />
        {/* <Text style={styles.text}>Kissan Growth</Text> */}
        <Text style={styles.subtext}>Customer App</Text>
    </View>

  );
};

const styles = StyleSheet.create({
  
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "#fff" },
  
  headerImage: {
    width: 250,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 40,
  },

  text: { fontSize: 38, fontWeight: 'bold', color: '#fff' },
  subtext: { fontSize: 24, fontWeight: 'bold', color: '#fff', fontFamily: FONTS.bold },

});

export default SplashScreen;
