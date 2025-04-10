import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';


const WeatherSummaryCard = ({ data }) => {

  if (!data || !data.main || !data.weather || !data.wind) {
    return <Text style={{ padding: 16 }}>Loading weather data...</Text>;
  }

  const currentTemp = data.main.temp;
  const feelsLike = data.main.feels_like;
  const high = data.main.temp_max;
  const low = data.main.temp_min;
  const humidity = data.main.humidity;
  const condition = data.weather[0]?.main;
  const icon = data.weather[0]?.icon;
  const windSpeed = data.wind.speed;
  const cityName = data.name;

  return (
    <View style={styles.card}>
      {/* --- Today Weather --- */}
      <View style={styles.todaySection}>
        <Text style={styles.city}>{cityName || 'Your Location'}</Text>
        <Image
          source={{ uri: `https://openweathermap.org/img/wn/${icon}@2x.png` }}
          style={{ width: 60, height: 60 }}
        />
        <Text style={styles.temp}>{currentTemp.toFixed(1)}°C</Text>
        <Text style={styles.condition}>{condition}</Text>
        <Text style={styles.range}>Feels like: {feelsLike.toFixed(1)}°C</Text>
        <Text style={styles.range}>H: {high.toFixed(1)}°  L: {low.toFixed(1)}°</Text>
        <Text style={styles.range}>Humidity: {humidity}%</Text>
        <Text style={styles.range}>Wind: {windSpeed} m/s</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    elevation: 3,
    margin: 16,
  },
  todaySection: {
    alignItems: 'center',
    marginBottom: 16,
  },
  city: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  temp: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#000',
  },
  range: {
    fontSize: 16,
    color: '#666',
  },
  condition: {
    fontSize: 16,
    marginTop: 4,
    color: '#444',
  },
});

export default WeatherSummaryCard;
