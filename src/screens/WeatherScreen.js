import React from 'react';
import { ScrollView } from 'react-native';
import { useSelector } from 'react-redux';

import WeatherSummaryCard from '../components/weather/WeatherSummaryCard';
import FiveDaysForecastSlider from '../components/weather/FiveDaysForecastSlider';

const WeatherScreen = () => {
  const { weatherData, forecastData, loading } = useSelector(state => state.weather);

  if (loading || !weatherData) return null;

  // 🔍 Group forecast data by day
  const groupForecastByDay = (list) => {
    const grouped = {};
    list.forEach(item => {
      const day = item.dt_txt.split(' ')[0];
      if (!grouped[day]) grouped[day] = [];
      grouped[day].push(item);
    });

    return Object.values(grouped).map(entries => entries[4] || entries[0]);
  };

  const fiveDayData = forecastData?.list ? groupForecastByDay(forecastData.list).slice(0, 5) : [];

  return (
    <ScrollView style={{ flex: 1 }}>
      <WeatherSummaryCard data={weatherData} />
      {fiveDayData.length > 0 && <FiveDaysForecastSlider data={fiveDayData} />}
    </ScrollView>
  );
};

export default WeatherScreen;
