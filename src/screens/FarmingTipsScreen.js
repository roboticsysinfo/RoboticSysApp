import React, { useEffect, useRef, useState, useCallback } from 'react';
import { FlatList, View, Text, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFarmerTips } from '../redux/slices/farmingTipsSlice';
import { COLORS } from '../../theme';

const { width } = Dimensions.get('window');

const FarmingTipsScreen = () => {
  const dispatch = useDispatch();
  const { tips, loading } = useSelector(state => state.farmingTips);
  const [visibleItems, setVisibleItems] = useState([]);

  useEffect(() => {
    dispatch(fetchFarmerTips());
  }, [dispatch]);

  console.log("farming tips on screen", tips)

  const extractYouTubeId = (url) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/);
    return match ? match[1] : null;
  };

  const viewabilityConfig = { itemVisiblePercentThreshold: 50 };

  const onViewableItemsChanged = useCallback(({ viewableItems }) => {
    setVisibleItems(viewableItems.map(item => item.item._id));
  }, []);

  const viewabilityConfigCallbackPairs = useRef([{ viewabilityConfig, onViewableItemsChanged }]);

  const renderItem = ({ item }) => {
    const videoId = extractYouTubeId(item.youtubeLink);
    const isVisible = visibleItems.includes(item._id);

    return (
      <View style={styles.card}>
        <Text style={styles.title}>{item.title}</Text>
        {videoId && isVisible ? (
          <YoutubePlayer height={230} videoId={videoId} />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>Video will load when visible</Text>
          </View>
        )}
      </View>
    );
  };

  if (loading) {
    return <ActivityIndicator size="large" color={COLORS.primaryColor} style={{ marginTop: 20 }} />;
  }

  return (
    <FlatList
      data={tips}
      keyExtractor={(item) => item._id}
      renderItem={renderItem}
      contentContainerStyle={{ padding: 16,  }}
      viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
    />
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    elevation: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  placeholder: {
    height: 200,
    backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  placeholderText: {
    fontStyle: 'italic',
    color: '#888',
  },
});

export default FarmingTipsScreen;
