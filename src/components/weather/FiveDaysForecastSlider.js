import React from 'react';
import { FlatList, Text, View, StyleSheet, Image } from 'react-native';
import moment from 'moment';
import { useTranslation } from 'react-i18next';

const FiveDaysForecastSlider = ({ data }) => {

  const { t } = useTranslation();

  return (
    <View style={{ paddingHorizontal: 20 }}>
      <Text style={styles.title}>{t("5-Day Forecast")}</Text>
      <FlatList
        horizontal
        data={data}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
          const day = moment(item.dt_txt).format('dddd');
          const temperature = Math.round(item.main.temp);
          const condition = item.weather[0].main; // e.g., Clear, Rain
          const icon = item.weather[0].icon;

          return (
            <View style={styles.card}>
              <Text style={styles.day}>{day}</Text>
              <Image
                source={{ uri: `https://openweathermap.org/img/wn/${icon}@2x.png` }}
                style={styles.icon}
              />
              <Text style={styles.temp}>{temperature}°</Text>
              <Text style={styles.condition}>{condition}</Text>
            </View>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  card: {
    padding: 12,
    marginVertical: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginRight: 10,
    alignItems: 'center',
    elevation: 2,
    width: 100,
  },
  icon: {
    width: 50,
    height: 50,
    marginVertical: 4,
  },
  day: {
    fontWeight: '600',
  },
  temp: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  condition: {
    fontSize: 12,
    color: '#555',
  },
});

export default FiveDaysForecastSlider;
