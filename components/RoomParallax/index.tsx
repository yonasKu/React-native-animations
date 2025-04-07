import React, { useState } from "react";
import {
  View,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  withTiming,
  useDerivedValue,
  runOnJS,
} from "react-native-reanimated";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useFonts } from "expo-font";
import { data } from "../../mocks/roomMock";
import ParallaxItem from "./ParallaxItem";
import Pagination from "./Pagination";
import {
  ITEM_WIDTH,
  ITEM_HEIGHT,
  SPACING,
  COLORS,
} from "./constants";

// Simple debounce function
function debounce(func: Function, waitFor: number) {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), waitFor);
  };
}

const { width, height } = Dimensions.get("window");

const RoomParallax: React.FC = () => {
  const scrollX = useSharedValue(0);
  const activeIndex = useSharedValue(-1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isItemOpen, setIsItemOpen] = useState(false);

  // Debounced function to update current index
  const debouncedSetCurrentIndex = React.useCallback(debounce((index: number) => {
    console.log("Setting current index:", index);
    setCurrentIndex(index);
  }, 100), []);

  // Animated scroll handler
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
    onMomentumEnd: (event) => {
      // Calculate index based on the center of the screen snap point
      const index = Math.round(event.contentOffset.x / (ITEM_WIDTH + SPACING));
      // Use debounced function to update state on JS thread
      runOnJS(debouncedSetCurrentIndex)(index);
    },
  });

  // Determine the gap between items based on whether an item is open
  const listGap = useDerivedValue(() => {
    // Animate the gap change smoothly
    return withTiming(activeIndex.value !== -1 ? SPACING * 4 : SPACING, {
      duration: 300,
    });
  }, [activeIndex]);

  const animatedListStyle = useDerivedValue(() => {
    // Update isItemOpen state when activeIndex changes
    if (activeIndex.value !== -1 && !isItemOpen) {
      runOnJS(setIsItemOpen)(true);
    } else if (activeIndex.value === -1 && isItemOpen) {
      runOnJS(setIsItemOpen)(false);
    }
    
    return {
      gap: listGap.value,
    };
  });

  const [fontsLoaded] = useFonts({
    'Audiowide-Regular': require('../../assets/fonts/Audiowide-Regular.ttf'),
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
    <GestureHandlerRootView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Animated.FlatList
        data={data}
        keyExtractor={(item) => item.key}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[
          styles.flatListContentContainer,
          { gap: activeIndex.value !== -1 ? SPACING * 4 : SPACING }
        ]}
        snapToInterval={ITEM_WIDTH + SPACING}
        decelerationRate="fast"
        scrollEventThrottle={16}
        onScroll={scrollHandler}
        scrollEnabled={activeIndex.value === -1}
        renderItem={({ item, index }) => (
          <ParallaxItem
            item={item}
            index={index}
            scrollX={scrollX}
            activeIndex={activeIndex}
            currentIndex={currentIndex}
          />
        )}
      />
      <Pagination scrollX={scrollX} data={data} isOpen={isItemOpen} />
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  flatListContentContainer: {
    alignItems: "center",
    paddingHorizontal: (width - ITEM_WIDTH) / 2,
    paddingVertical: (height - ITEM_HEIGHT) / 2,
  },
});

export default RoomParallax;
