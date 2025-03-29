import { View, Image, Text, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import Animated, { useAnimatedStyle, interpolate } from 'react-native-reanimated';
import { Item } from '../../constants/mockData';
import { BlurView } from 'expo-blur';
import { useState } from 'react';

const { height } = Dimensions.get('window');
const SPACING = 20;
const ITEM_SIZE = height * 0.72;

type AnimatedCardProps = {
  item: Item;
  index: number;
  scrollY: Animated.SharedValue<number>;
};

export const AnimatedCard = ({ item, index, scrollY }: AnimatedCardProps) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const animatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [index - 1, index, index + 1],
      [0.3, 1, 0.3]
    );
    
    const scale = interpolate(
      scrollY.value,
      [index - 1, index, index + 1],
      [0.8, 1, 0.8]
    );

    return {
      opacity,
      transform: [{ scale }]
    };
  });

  return (
    <Animated.View style={[styles.container, animatedStyle, { backgroundColor: item.bg }]}>
      <Image
        source={{ uri: item.image }}
        style={StyleSheet.absoluteFillObject}
        blurRadius={50}
        onLoadStart={() => setImageLoading(true)}
        onLoadEnd={() => setImageLoading(false)}
        onError={() => setImageError(true)}
      />
      <View style={styles.contentContainer}>
        <View style={styles.imageContainer}>
          {imageLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#fff" />
            </View>
          )}
          <Image 
            source={{ uri: item.image }} 
            style={styles.mainImage}
            onLoadStart={() => setImageLoading(true)}
            onLoadEnd={() => setImageLoading(false)}
            onError={() => setImageError(true)}
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={3}>{item.title}</Text>
          <Text style={styles.description} numberOfLines={3}>{item.description}</Text>
          <View style={styles.authorContainer}>
            <Image 
              source={{ uri: item.author.avatar }} 
              style={styles.avatar}
              onError={() => setImageError(true)}
            />
            <Text style={styles.authorName}>{item.author.name}</Text>
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: ITEM_SIZE,
    padding: SPACING,
    margin: SPACING,
    borderRadius: 8,
    overflow: 'hidden',
  },
  contentContainer: {
    flex: 1,
    padding: SPACING,
    gap: SPACING * 2,
  },
  imageContainer: {
    width: '100%',
    height: ITEM_SIZE * 0.4,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  mainImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  textContainer: {
    gap: SPACING,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
  },
  description: {
    fontSize: 16,
    color: '#ddd',
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING / 2,
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    aspectRatio: 1,
  },
  authorName: {
    fontSize: 12,
    color: '#ddd',
  }
});