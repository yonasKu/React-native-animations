import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  StatusBar,
  Image as RNImage,
  ActivityIndicator,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  useAnimatedRef,
  measure,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Camera } from 'lucide-react-native';
import { useFonts } from 'expo-font';
import { data, Item } from '../../mocks/roomMock';

const { width, height } = Dimensions.get('window');
const ITEM_WIDTH = width * 0.7;
const ITEM_HEIGHT = height * 0.6;
const SPACING = 10;
const ITEM_FULL_SIZE = ITEM_WIDTH + SPACING;

const AnimatedImage = Animated.createAnimatedComponent(RNImage);

type ParallaxItemProps = {
  item: Item;
  index: number;
  scrollX: Animated.SharedValue<number>;
};

function ParallaxItem({ item, index, scrollX }: ParallaxItemProps) {
  const textRef = useAnimatedRef<Animated.View>();
  const [textHeight, setTextHeight] = React.useState<number>(0);

  // Scale factor for the parallax effect
  const SCALE_FACTOR = 0.1;
  
  const imageStyles = useAnimatedStyle(() => {
    const scale = interpolate(
      scrollX.value / ITEM_FULL_SIZE,
      [index - 0.1, index, index + 0.1],
      [1, 1.1, 1],
      Extrapolation.CLAMP
    );

    const translateX = interpolate(
      scrollX.value / ITEM_FULL_SIZE,
      [index - 1, index, index + 1],
      [ITEM_FULL_SIZE * SCALE_FACTOR, 0, -ITEM_FULL_SIZE * SCALE_FACTOR],
      Extrapolation.CLAMP
    );

    return {
      transform: [{ scale }, { translateX }],
    };
  });

  // Measure the text height for animations
  React.useEffect(() => {
    if (textRef.current) {
      const measureText = async () => {
        try {
          const measured = await measure(textRef);
          if (measured) {
            setTextHeight(measured.height);
          }
        } catch (error) {
          console.log('Error measuring text:', error);
        }
      };
      measureText();
    }
  }, [textRef]);

  // Text animation styles
  const textStyles = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        scrollX.value / ITEM_FULL_SIZE,
        [index - 0.5, index, index + 0.5],
        [0, 1, 0],
        Extrapolation.CLAMP
      ),
      transform: [
        {
          translateX: interpolate(
            scrollX.value / ITEM_FULL_SIZE,
            [index - 1, index, index + 1],
            [ITEM_WIDTH * 0.5, 0, -ITEM_WIDTH * 0.5],
            Extrapolation.CLAMP
          ),
        },
      ],
    };
  });

  // Icon animation styles
  const iconStyles = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        scrollX.value / ITEM_FULL_SIZE,
        [index - 0.3, index, index + 0.3],
        [0, 1, 0],
        Extrapolation.CLAMP
      ),
      transform: [
        {
          scale: interpolate(
            scrollX.value / ITEM_FULL_SIZE,
            [index - 0.5, index, index + 0.5],
            [0.5, 1, 0.5],
            Extrapolation.CLAMP
          ),
        },
      ],
    };
  });

  return (
    <View style={styles.itemContainer}>
      <Animated.View style={[styles.imageContainer]}>
        <AnimatedImage
          source={{ uri: item.image }}
          style={[styles.image, imageStyles]}
        />
        {/* Left gradient overlay */}
        <LinearGradient
          style={[styles.leftGradient]}
          colors={['rgba(0,0,0,0.2)', 'rgba(0,0,0,0)']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
        />
        {/* Right gradient overlay */}
        <LinearGradient
          style={[styles.rightGradient]}
          colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.2)']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
        />
        {/* Bottom gradient for text visibility */}
        <LinearGradient
          style={[styles.bottomGradient]}
          colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.7)']}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
        />
      </Animated.View>

      {/* Text container positioned on the left side */}
      <View style={styles.textWrapper}>
        <Animated.View style={[styles.textContainer, textStyles]} ref={textRef}>
          <Text style={styles.itemTitle}>
            {item.title.toUpperCase()}
          </Text>
        </Animated.View>
      </View>

      {/* Camera icon */}
      <View style={styles.iconContainer}>
        <Animated.View style={[iconStyles]}>
          <Camera size={24} color="white" />
        </Animated.View>
      </View>
    </View>
  );
}

export default function RoomParallax() {
  const scrollX = useSharedValue(0);

  const [fontsLoaded] = useFonts({
    'Audiowide-Regular': require('../../assets/fonts/Audiowide-Regular.ttf'),
  });

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollX.value = event.contentOffset.x;
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" />
        <ActivityIndicator size="large" color="#999" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Animated.FlatList
        data={data}
        keyExtractor={(item) => item.key}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.flatListContent}
        snapToInterval={ITEM_FULL_SIZE}
        decelerationRate="fast"
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        renderItem={({ item, index }) => (
          <ParallaxItem item={item} index={index} scrollX={scrollX} />
        )}
        style={styles.flatList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#323232',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flatList: {
    flexGrow: 0,
  },
  flatListContent: {
    paddingHorizontal: (width - ITEM_WIDTH) / 2,
    gap: SPACING * 2,
  },
  itemContainer: {
    width: ITEM_WIDTH,
    height: ITEM_HEIGHT,
    borderRadius: SPACING,
    overflow: 'hidden',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  imageContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#111',
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.95,
    objectFit: 'cover',
  },
  leftGradient: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: ITEM_WIDTH / 3,
  },
  rightGradient: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: ITEM_WIDTH / 3,
  },
  bottomGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: ITEM_HEIGHT / 2,
  },
  textWrapper: {
    position: 'absolute',
    left: SPACING,
    bottom: ITEM_HEIGHT / 4,
    justifyContent: 'center',
  },
  textContainer: {
    position: 'relative',
  },
  itemTitle: {
    color: 'white',
    fontSize: 32,
    textTransform: 'uppercase',
    fontFamily: 'Audiowide-Regular',
    transform: [{ rotate: '90deg' }],
  },
  iconContainer: {
    position: 'absolute',
    right: SPACING,
    top: SPACING,
    padding: SPACING / 2,
  },
});
