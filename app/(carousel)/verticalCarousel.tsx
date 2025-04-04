// app/(carousel)/verticalCarousel.tsx
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  Extrapolate,
  FadeInDown,
  withTiming,
  useDerivedValue,
  SharedValue,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');
const INDICATOR_SIZE = 10;
const INDICATOR_SPACING = 10;
const CIRCLE_SIZE = width * 0.6;

// Define types for our data
interface CarouselItem {
  id: string;
  title: string;
  description: string;
  image: any; // Using any for image require
  color: string;
}

// Sample data for the carousel
const data: CarouselItem[] = [
  {
    id: '1',
    title: 'Immersive Sound',
    description: 'Experience audio like never before with our spatial sound technology.',
    image: require('../../assets/images/urbanears_blue.png'),
    color: '#3B82F6',
  },
  {
    id: '2',
    title: 'Noise Cancellation',
    description: 'Block out the world and focus on what matters with active noise cancellation.',
    image: require('../../assets/images/urbanears_pink.png'),
    color: '#EC4899',
  },
  {
    id: '3',
    title: 'All-Day Comfort',
    description: 'Designed for extended wear with premium materials that feel great all day long.',
    image: require('../../assets/images/urbanears_grey.png'),
    color: '#6B7280',
  },
  {
    id: '4',
    title: 'Wireless Freedom',
    description: 'No cords, no limits. Move freely with our wireless technology.',
    image: require('../../assets/images/urbanears_mint.png'),
    color: '#10B981',
  },
];

// Define types for component props
interface CircleProps {
  scrollY: SharedValue<number>;
}

// Background circle component similar to headphones carousel
const Circle: React.FC<CircleProps> = ({ scrollY }) => {
  return (
    <View style={[StyleSheet.absoluteFillObject, styles.circleContainer]}>
      {data.map(({ color }, index) => {
        const inputRange = [
          (index - 0.55) * height,
          index * height,
          (index + 0.55) * height,
        ];
        const scale = interpolate(
          scrollY.value,
          inputRange,
          [0, 1, 0],
          Extrapolate.CLAMP
        );
        const opacity = interpolate(
          scrollY.value,
          inputRange,
          [0, 0.2, 0],
          Extrapolate.CLAMP
        );
        return (
          <Animated.View
            key={index}
            style={[
              styles.circle,
              {
                backgroundColor: color,
                opacity,
                transform: [{ scale }],
              },
            ]}
          />
        );
      })}
    </View>
  );
};

// Define types for Item component props
interface ItemProps {
  item: CarouselItem;
  index: number;
  scrollY: SharedValue<number>;
}

// Item component that animates based on scroll position
const Item: React.FC<ItemProps> = ({ item, index, scrollY }) => {
  const inputRange = [
    (index - 1) * height,
    index * height,
    (index + 1) * height,
  ];

  // Animation for the item scale effect
  const imageStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      scrollY.value,
      inputRange,
      [0.8, 1, 0.8],
      Extrapolate.CLAMP
    );

    const opacity = interpolate(
      scrollY.value,
      inputRange,
      [0.4, 1, 0.4],
      Extrapolate.CLAMP
    );

    return {
      transform: [{ scale }],
      opacity,
    };
  });

  // Animation for the title with parallax effect
  const titleStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      inputRange,
      [height * 0.1, 0, -height * 0.1],
      Extrapolate.CLAMP
    );

    return {
      transform: [{ translateY }],
    };
  });

  // Animation for the description with delayed parallax effect
  const descriptionStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      scrollY.value,
      inputRange,
      [width * 0.5, 0, -width * 0.5],
      Extrapolate.CLAMP
    );

    const opacity = interpolate(
      scrollY.value,
      inputRange,
      [0, 1, 0],
      Extrapolate.CLAMP
    );

    return {
      transform: [{ translateX }],
      opacity,
    };
  });

  return (
    <View style={styles.itemContainer}>
      <Animated.View style={[styles.imageContainer, imageStyle]}>
        <Image source={item.image} style={styles.image} />
      </Animated.View>
      
      <View style={styles.contentContainer}>
        <Animated.Text style={[styles.title, titleStyle]}>
          {item.title}
        </Animated.Text>
        <Animated.Text style={[styles.description, descriptionStyle]}>
          {item.description}
        </Animated.Text>
      </View>
    </View>
  );
};

// Define types for Ticker component props
interface TickerProps {
  scrollY: SharedValue<number>;
}

// Ticker component for the feature name
const Ticker: React.FC<TickerProps> = ({ scrollY }) => {
  const inputRange = [-height, 0, height];
  const translateY = interpolate(
    scrollY.value,
    inputRange,
    [40, 0, -40],
    Extrapolate.CLAMP
  );

  return (
    <View style={styles.tickerContainer}>
      <Animated.View style={{ transform: [{ translateY }] }}>
        {data.map(({ title }, index) => {
          return (
            <Text key={index} style={styles.tickerText}>
              {title}
            </Text>
          );
        })}
      </Animated.View>
    </View>
  );
};

// Define types for Pagination component props
interface PaginationProps {
  scrollY: SharedValue<number>;
}

// Pagination component that shows indicators on the right side
const Pagination: React.FC<PaginationProps> = ({ scrollY }) => {
  return (
    <View style={styles.paginationContainer}>
      <Animated.View
        style={[
          styles.paginationIndicator,
          {
            transform: [
              {
                translateY: interpolate(
                  scrollY.value,
                  [0, height * (data.length - 1)],
                  [0, (data.length - 1) * (INDICATOR_SIZE + INDICATOR_SPACING)],
                  Extrapolate.CLAMP
                ),
              },
            ],
          },
        ]}
      />
      {data.map((item, index) => {
        return (
          <View key={item.id} style={styles.paginationDotContainer}>
            <View
              style={[styles.paginationDot, { backgroundColor: item.color }]}
            />
          </View>
        );
      })}
    </View>
  );
};

export default function VerticalCarousel() {
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      
      <Circle scrollY={scrollY} />
      
      <Animated.FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <Item item={item} index={index} scrollY={scrollY} />
        )}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={height}
        decelerationRate="fast"
      />
      
      <Pagination scrollY={scrollY} />
      <Ticker scrollY={scrollY} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  itemContainer: {
    width,
    height,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  imageContainer: {
    width: width * 0.7,
    height: width * 0.7,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  contentContainer: {
    alignItems: 'flex-start',
    alignSelf: 'flex-end',
    width: width * 0.8,
    paddingRight: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#444',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  description: {
    fontSize: 16,
    color: '#888',
    lineHeight: 24,
    maxWidth: width * 0.7,
  },
  paginationContainer: {
    position: 'absolute',
    right: 20,
    top: '50%',
    transform: [{ translateY: -((data.length * (INDICATOR_SIZE + INDICATOR_SPACING)) / 2) }],
    height: data.length * (INDICATOR_SIZE + INDICATOR_SPACING),
    justifyContent: 'center',
    alignItems: 'center',
  },
  paginationDot: {
    width: INDICATOR_SIZE * 0.3,
    height: INDICATOR_SIZE * 0.3,
    borderRadius: INDICATOR_SIZE * 0.15,
  },
  paginationDotContainer: {
    width: INDICATOR_SIZE,
    height: INDICATOR_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: INDICATOR_SPACING / 2,
  },
  paginationIndicator: {
    width: INDICATOR_SIZE,
    height: INDICATOR_SIZE,
    borderRadius: INDICATOR_SIZE / 2,
    borderWidth: 2,
    borderColor: '#ddd',
    position: 'absolute',
  },
  tickerContainer: {
    position: 'absolute',
    top: 40,
    left: 20,
    overflow: 'hidden',
    height: 40,
  },
  tickerText: {
    fontSize: 24,
    lineHeight: 40,
    textTransform: 'uppercase',
    fontWeight: '800',
    color: '#444',
  },
  circleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    position: 'absolute',
    top: '15%',
  },
});