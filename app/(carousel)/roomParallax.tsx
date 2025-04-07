import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  StatusBar,
  Image,
  ActivityIndicator,
  Platform,
  StyleProp,
  ViewStyle,
  TextStyle,
  ImageStyle,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  useAnimatedRef,
  measure,
  withSpring,
  withTiming,
  useAnimatedReaction,
  runOnJS,
  useDerivedValue,
  AnimatedStyleProp,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import {
  Camera,
  Thermometer,
  Droplets,
  Clock4,
  ChevronUp,
  Music,
  Lightbulb, // Corrected icon name likely
} from "lucide-react-native";
import { useFonts } from "expo-font";
import { data, Item as RoomItem } from "../../mocks/roomMock"; // Assuming path is correct
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
  Directions,
} from "react-native-gesture-handler";
import { MotiView } from "moti"; // Keeping Moti for consistency with original, but could be replaced by Reanimated

// Create animated components
const AnimatedImage = Animated.createAnimatedComponent(Image);

// --- Constants (Would be in src/constants/parallaxConstants.ts) ---

const { width, height } = Dimensions.get("window");
const ITEM_WIDTH = width * 0.7;
const ITEM_HEIGHT = height * 0.6;
const SPACING = 10;
const TRANSLATE_Y_AMOUNT = ITEM_HEIGHT * 0.4;

// Pagination constants
const DOT_SIZE = 8;
const DOT_SPACING = 8;
const DOT_INDICATOR_SIZE = DOT_SIZE + 4;
const INDICATOR_BORDER_SIZE = 2;
const INDICATOR_BORDER_COLOR = "#fff";

// Colors & Fonts
const COLORS = {
  background: "#323232",
  cardBackground: "#111",
  textPrimary: "#FFFFFF",
  textSecondary: "#999",
  accent: "#09c",
  white: "#FFFFFF",
  black: "#000000",
  transparent: "transparent",
  gradientOverlayStart: "rgba(0,0,0,0)",
  gradientOverlayMid: "rgba(0,0,0,0.2)",
  gradientOverlayEnd: "rgba(0,0,0,0.7)",
  iconBackground: "rgba(255,255,255,0.1)",
};

const FONTS = {
  title: "Audiowide-Regular", // Make sure this matches the loaded font key
};

// --- Types (Would be in src/types/room.ts or similar) ---
// Re-export or define Item type if not already globally available
export type Item = RoomItem;

interface BaseAnimatedProps {
  scrollX: Animated.SharedValue<number>;
  index: number;
}

interface ParallaxItemProps extends BaseAnimatedProps {
  item: Item;
  activeIndex: Animated.SharedValue<number>;
  currentIndex: number; // Pass current index for optimization
  itemWidth: number;
  itemHeight: number;
  spacing: number;
  translateYAmount: number;
}

interface ParallaxForegroundProps extends BaseAnimatedProps {
  item: Item;
  activeIndex: Animated.SharedValue<number>;
  currentIndex: number; // Pass current index for optimization
  itemWidth: number;
  itemHeight: number;
  spacing: number;
  translateYAmount: number;
  fullItemWidth: number;
  expandedItemWidth: number;
}

interface DetailsListProps {
  item: Item;
  style?: AnimatedStyleProp<ViewStyle>;
}

interface PaginationProps {
  scrollX: Animated.SharedValue<number>;
  data: Item[];
  isOpen: boolean;
}

interface DotProps extends BaseAnimatedProps {}

interface PaginationIndicatorProps {
  scrollX: Animated.SharedValue<number>;
}

interface SwipeUpIndicatorProps {
  isOpen?: boolean;
}

interface CardGradientsProps {
  gradientContainerStyles: AnimatedStyleProp<ViewStyle>;
  itemWidth: number;
  itemHeight: number;
}

// --- Helper Functions (Could be in a utils file) ---

// Simple debounce function
const debounce = <F extends (...args: any[]) => any>(
  func: F,
  waitFor: number
) => {
  let timeout: NodeJS.Timeout | null = null;

  const debounced = (...args: Parameters<F>) => {
    if (timeout !== null) {
      clearTimeout(timeout);
      timeout = null;
    }
    timeout = setTimeout(() => func(...args), waitFor);
  };

  return debounced as (...args: Parameters<F>) => ReturnType<F>;
};

// Get icon component by detail title or extra title
const getIconByTitle = (title: string): React.ReactElement | null => {
  const lowerTitle = title.toLowerCase();
  const iconProps = { size: 18, color: COLORS.white };

  switch (lowerTitle) {
    // Detail Icons
    case "temperature":
      return <Thermometer {...iconProps} />;
    case "humidity":
      return <Droplets {...iconProps} />;
    case "timer":
      return <Clock4 {...iconProps} />;
    // Extra Icons
    case "lights":
      return <Lightbulb {...iconProps} />; // Corrected name?
    case "air conditioner":
      return <Droplets {...iconProps} />; // Maybe a different icon? AC?
    case "music":
      return <Music {...iconProps} />;
    default:
      return <Camera {...iconProps} />; // Default fallback
  }
};

// --- Components (Each would be in its own file, e.g., src/components/Parallax/SwipeUpIndicator.tsx) ---

// --- SwipeUpIndicator Component ---
const SwipeUpIndicator: React.FC<SwipeUpIndicatorProps> = React.memo(
  ({ isOpen = false }) => {
    return (
      <View style={styles.swipeUpIndicatorContainer}>
        {[0, 1, 2].map((index) => (
          <MotiView
            key={`chevron-${index}`}
            style={styles.swipeUpChevron}
            from={{ opacity: 0.7 - index * 0.2, translateY: 0 }}
            animate={{
              opacity: isOpen ? 0 : 0.7 - index * 0.2,
              translateY: isOpen ? -10 : 0,
            }}
            transition={{
              type: "timing",
              duration: 300,
              delay: index * 50,
            }}
          >
            <ChevronUp size={24} color={COLORS.white} />
          </MotiView>
        ))}
      </View>
    );
  }
);

// --- Dot Component ---
const Dot: React.FC<DotProps> = React.memo(({ index, scrollX }) => {
  const dotStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollX.value,
      [
        (index - 0.5) * (ITEM_WIDTH + SPACING),
        index * (ITEM_WIDTH + SPACING),
        (index + 0.5) * (ITEM_WIDTH + SPACING),
      ],
      [0.5, 1, 0.5],
      Extrapolation.CLAMP
    );

    const width = interpolate(
      scrollX.value,
      [
        (index - 1) * (ITEM_WIDTH + SPACING),
        index * (ITEM_WIDTH + SPACING),
        (index + 1) * (ITEM_WIDTH + SPACING),
      ],
      [DOT_SIZE, DOT_SIZE * 1.5, DOT_SIZE],
      Extrapolation.CLAMP
    );

    return { opacity, width };
  });

  return <Animated.View style={[styles.paginationDot, dotStyle]} />;
});

// --- PaginationIndicator Component ---
const PaginationIndicator: React.FC<PaginationIndicatorProps> = React.memo(
  ({ scrollX }) => {
    const indicatorStyle = useAnimatedStyle(() => {
      // Calculate translation based on scroll position relative to item width and dot spacing
      const translateX = interpolate(
        scrollX.value / (ITEM_WIDTH + SPACING),
        [0, data.length - 1], // input range covers all items
        [0, (data.length - 1) * (DOT_SIZE + DOT_SPACING)], // output range covers all dots
        Extrapolation.CLAMP
      );
      // Or simpler if snapping works perfectly:
      // const translateX = (scrollX.value / (ITEM_WIDTH + SPACING)) * (DOT_SIZE + DOT_SPACING);

      return {
        transform: [{ translateX }],
      };
    });

    return (
      <Animated.View style={[styles.paginationIndicator, indicatorStyle]} />
    );
  }
);

// --- Pagination Component ---
const Pagination: React.FC<PaginationProps> = React.memo(
  ({ scrollX, data, isOpen }) => {
    const containerStyle = useAnimatedStyle(() => {
      // Fade out pagination slightly when an item is open
      return {
        opacity: withTiming(isOpen ? 0 : 1, { duration: 300 }), // Use timing for smoother fade
      };
    });

    return (
      <Animated.View style={[styles.paginationContainer, containerStyle]}>
        {data.map((_, index) => (
          <Dot key={`dot-${index}`} index={index} scrollX={scrollX} />
        ))}
        <PaginationIndicator scrollX={scrollX} />
      </Animated.View>
    );
  }
);

// --- DetailsList Component ---
const DetailsList = React.memo(
  React.forwardRef<Animated.View, DetailsListProps>(({ item, style }, ref) => {
    // Added memo and forwardRef with types
    return (
      <Animated.View ref={ref} style={[styles.detailsListContainer, style]}>
        {/* Main Details */}
        {item.details.map((detail, index) => (
          <View key={`detail-${index}`} style={styles.detailRow}>
            <View style={styles.detailIconContainer}>
              {getIconByTitle(detail.title)}
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailTitle}>
                {detail.title.toUpperCase()}
              </Text>
              <View style={styles.detailValueContainer}>
                <Text style={styles.detailValue}>
                  {/* Handle boolean display */}
                  {typeof detail.value === "boolean"
                    ? detail.value
                      ? "ON"
                      : "OFF"
                    : detail.value}
                </Text>
                {detail.unit && (
                  <Text style={styles.detailUnit}>{detail.unit}</Text>
                )}
              </View>
              {/* Specific indicator for timer */}
              {detail.title === "timer" && (
                <View
                  style={[
                    styles.detailIndicator,
                    {
                      backgroundColor: detail.value
                        ? COLORS.accent
                        : COLORS.textSecondary,
                      shadowColor: detail.value
                        ? COLORS.accent
                        : COLORS.transparent,
                    },
                  ]}
                />
              )}
            </View>
          </View>
        ))}

        {/* Separator and Extra Details */}
        {item.extras && item.extras.length > 0 && (
          <>
            <View style={styles.detailsSeparator} />
            <View style={styles.extrasContainer}>
              {item.extras.map((extra, index) => (
                <View key={`extra-${index}`} style={styles.extraRow}>
                  {/* Use Row structure consistent with details */}
                  <View style={styles.detailIconContainer}>
                    {getIconByTitle(extra.title)}
                  </View>
                  <View style={styles.detailContent}>
                    <Text style={styles.detailTitle}>
                      {extra.title.toUpperCase()}
                    </Text>
                    <Text
                      style={[
                        styles.detailValue,
                        {
                          color: extra.value
                            ? COLORS.white
                            : COLORS.textSecondary,
                        },
                      ]}
                    >
                      {extra.value ? "ON" : "OFF"}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </>
        )}
      </Animated.View>
    );
  })
);

// --- CardGradients Component ---
const CardGradients: React.FC<CardGradientsProps> = React.memo(
  ({ gradientContainerStyles, itemWidth, itemHeight }) => {
    const gradientWidth = itemWidth / 3; // Example width
    const bottomGradientHeight = itemHeight / 3;

    return (
      <>
        {/* Left/Right edge fade */}
        <Animated.View
          style={[styles.gradientContainer, gradientContainerStyles]}
        >
          <LinearGradient
            style={[styles.edgeGradient, { width: gradientWidth, left: 0 }]}
            colors={[COLORS.gradientOverlayMid, COLORS.gradientOverlayStart]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            pointerEvents="none"
          />
          <LinearGradient
            style={[styles.edgeGradient, { width: gradientWidth, right: 0 }]}
            colors={[COLORS.gradientOverlayStart, COLORS.gradientOverlayMid]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            pointerEvents="none"
          />
        </Animated.View>

        {/* Bottom gradient for text visibility */}
        <LinearGradient
          style={[styles.bottomGradient, { height: bottomGradientHeight }]}
          colors={[COLORS.gradientOverlayStart, COLORS.gradientOverlayEnd]}
          pointerEvents="none" // Important: allow touches to pass through
        />
      </>
    );
  }
);

// --- ParallaxForeground Component ---
const ParallaxForeground: React.FC<ParallaxForegroundProps> = React.memo(
  ({
    item,
    index,
    scrollX,
    activeIndex,
    currentIndex,
    itemWidth,
    itemHeight,
    spacing,
    translateYAmount,
    fullItemWidth,
    expandedItemWidth,
  }) => {
    const textRef = useAnimatedRef<Animated.View>();
    const detailsRef = useAnimatedRef<Animated.View>(); // Ref for details if needed for animation
    const [textHeight, setTextHeight] = useState<number>(0); // For potential layout adjustments

    // Determine if the card is currently active (1) or inactive (0) with spring physics
    const isActiveSpringy = useDerivedValue(() => {
      return withSpring(activeIndex.value === index ? 1 : 0, {
        damping: 15, // Adjusted spring params
        stiffness: 150,
      });
    }, [activeIndex, index]); // Dependencies

    // --- Animated Styles ---

    // Image scale and parallax translation based on scroll position
    const imageStyles = useAnimatedStyle(() => {
      const scale = interpolate(
        scrollX.value,
        [
          (index - 1) * fullItemWidth,
          index * fullItemWidth,
          (index + 1) * fullItemWidth,
        ],
        [1, 1 + 0.1, 1], // Scale up slightly when centered
        Extrapolation.CLAMP
      );

      const translateX = interpolate(
        scrollX.value,
        [
          (index - 1) * fullItemWidth,
          index * fullItemWidth,
          (index + 1) * fullItemWidth,
        ],
        [
          fullItemWidth * 0.1,
          0,
          -fullItemWidth * 0.1,
        ],
        Extrapolation.CLAMP
      );

      return { transform: [{ scale }, { translateX }] };
    });

    // Measure text height (only if needed, e.g., for complex vertical centering)
    // Using state here adds complexity, consider if truly necessary.
    // If not, the `measure` logic can be removed.
    useEffect(() => {
      if (textRef.current && Platform.OS !== "web") {
        // measure might behave differently on web
        // Use requestAnimationFrame to ensure layout is ready
        requestAnimationFrame(() => {
          const measured = measure(textRef);
          if (measured) {
            // console.log(`Measured text height for ${item.title}: ${measured.height}`);
            // runOnJS(setTextHeight)(measured.height); // Avoid if not strictly needed
          } else {
            console.warn("Could not measure text view");
          }
        });
      }
    }, [textRef, item.title]); // Re-measure if item title changes

    // Text fade and slide based on scroll position
    const textStyles = useAnimatedStyle(() => {
      const opacity = interpolate(
        scrollX.value,
        [
          (index - 0.5) * fullItemWidth,
          index * fullItemWidth,
          (index + 0.5) * fullItemWidth,
        ],
        [0, 1, 0],
        Extrapolation.CLAMP
      );
      const translateX = interpolate(
        scrollX.value,
        [
          (index - 1) * fullItemWidth,
          index * fullItemWidth,
          (index + 1) * fullItemWidth,
        ],
        [itemWidth * 0.5, 0, -itemWidth * 0.5], // Slide in/out
        Extrapolation.CLAMP
      );
      return { opacity, transform: [{ translateX }] };
    });

    // Top-right icon fade and scale based on scroll position
    const iconStyles = useAnimatedStyle(() => {
      const opacity = interpolate(
        scrollX.value,
        [
          (index - 0.3) * fullItemWidth,
          index * fullItemWidth,
          (index + 0.3) * fullItemWidth,
        ],
        [0, 1, 0], // Fade in/out faster than text
        Extrapolation.CLAMP
      );
      const scale = interpolate(
        scrollX.value,
        [
          (index - 0.5) * fullItemWidth,
          index * fullItemWidth,
          (index + 0.5) * fullItemWidth,
        ],
        [0.5, 1, 0.5],
        Extrapolation.CLAMP
      );
      return { opacity, transform: [{ scale }] };
    });

    // Card vertical translation and width expansion when active
    const cardStyles = useAnimatedStyle(() => {
      const translateY = interpolate(
        isActiveSpringy.value,
        [0, 1],
        [0, -translateYAmount],
        Extrapolation.CLAMP
      );
      const width = interpolate(
        isActiveSpringy.value,
        [0, 1],
        [itemWidth, expandedItemWidth], // Expand width when active
        Extrapolation.CLAMP
      );
      return {
        width,
        transform: [{ translateY }],
      };
    });

    // Adjust gradient container width to match card expansion
    const gradientContainerStyles = useAnimatedStyle(() => {
      return {
        width: interpolate(
          isActiveSpringy.value,
          [0, 1],
          [itemWidth, expandedItemWidth],
          Extrapolation.CLAMP
        ),
      };
    });

    // Details list fade-in/out when card is activated/deactivated
    const detailsListStyles = useAnimatedStyle(() => {
      return {
        opacity: isActiveSpringy.value, // Fade in details only when active
      };
    });

    // Optimization: Render complex children only for nearby items
    const shouldRenderContent = Math.abs(currentIndex - index) <= 1; // Render current, previous, and next
    const isCurrentItem = currentIndex === index;

    return (
      <Animated.View style={[styles.cardContainer, cardStyles]}>
        {/* Image Background */}
        <Animated.View style={styles.imageOuterContainer}>
          <AnimatedImage
            source={{ uri: item.image }}
            style={[styles.image, imageStyles]}
          />
          {/* Render gradients only when content should be visible */}
          {shouldRenderContent && (
            <CardGradients
              gradientContainerStyles={gradientContainerStyles}
              itemWidth={itemWidth}
              itemHeight={itemHeight}
            />
          )}
        </Animated.View>

        {/* Foreground Content (Text, Icons, Details) - Render conditionally */}
        {shouldRenderContent && (
          <>
            {/* Rotated Title Text */}
            <View style={[styles.textWrapper]}>
              <Animated.View
                style={[styles.textContainer, textStyles]}
                ref={textRef}
              >
                <Text style={styles.itemTitle}>
                  {item.title.toUpperCase()}
                </Text>
              </Animated.View>
            </View>

            {/* Top Right Icon */}
            <View style={styles.iconContainer}>
              <Animated.View style={[iconStyles]}>
                <Camera size={24} color={COLORS.white} />
              </Animated.View>
            </View>

            {/* Details List (appears when card is active) */}
            <DetailsList
              item={item}
              ref={detailsRef}
              style={detailsListStyles} // Apply fade animation
            />

            {/* Swipe Up Indicator (only show for the current, non-active item) */}
            {isCurrentItem && (
              <SwipeUpIndicator isOpen={activeIndex.value === index} />
            )}
          </>
        )}
      </Animated.View>
    );
  }
);

// --- ParallaxItem Component (Gesture Handling Wrapper) ---
const ParallaxItem: React.FC<ParallaxItemProps> = React.memo(
  ({
    item,
    index,
    scrollX,
    activeIndex,
    currentIndex,
    itemWidth,
    itemHeight,
    spacing,
    translateYAmount,
  }) => {
    // Log when this component renders
    useEffect(() => {
      console.log(`ParallaxItem ${index} rendered, currentIndex: ${currentIndex}`);
    }, [index, currentIndex]);

    // Gestures to open/close the card details
    const flingUp = Gesture.Fling()
      .direction(Directions.UP)
      .numberOfPointers(1)
      .onBegin(() => {
        console.log(`Fling Up BEGAN for index: ${index}`);
      })
      .onStart(() => {
        console.log(`Fling Up STARTED for index: ${index}`);
        // Only allow opening if not already open and this is the current item
        if (activeIndex.value === -1 && currentIndex === index) {
          console.log(`Setting activeIndex to ${index}`);
          activeIndex.value = index; // Open this item
        }
      })
      .onEnd(() => {
        console.log(`Fling Up ENDED for index: ${index}`);
      });

    const flingDown = Gesture.Fling()
      .direction(Directions.DOWN)
      .numberOfPointers(1)
      .onBegin(() => {
        console.log(`Fling Down BEGAN for index: ${index}`);
      })
      .onStart(() => {
        console.log(`Fling Down STARTED for index: ${index}`);
        // Only allow closing if this item is the one currently open
        if (activeIndex.value === index) {
          console.log(`Setting activeIndex to -1`);
          activeIndex.value = -1; // Close the currently open item
        }
      })
      .onEnd(() => {
        console.log(`Fling Down ENDED for index: ${index}`);
      });

    // Add a tap gesture as fallback
    const tap = Gesture.Tap()
      .numberOfTaps(1)
      .onStart(() => {
        console.log(`Tap detected for index: ${index}`);
        // Toggle the active state
        if (activeIndex.value === index) {
          activeIndex.value = -1; // Close if this item is open
        } else if (activeIndex.value === -1 && currentIndex === index) {
          activeIndex.value = index; // Open this item if nothing is open
        }
      });

    // Combine gestures with proper priority
    const combinedGesture = Gesture.Race(
      flingUp,
      flingDown,
      tap
    );

    return (
      <GestureDetector gesture={combinedGesture}>
        <View style={styles.itemContainer}>
          <ParallaxForeground
            item={item}
            index={index}
            scrollX={scrollX}
            activeIndex={activeIndex}
            currentIndex={currentIndex}
            itemWidth={itemWidth}
            itemHeight={itemHeight}
            spacing={spacing}
            translateYAmount={translateYAmount}
            fullItemWidth={itemWidth + spacing} // Pass calculated constant
            expandedItemWidth={itemWidth + spacing * 2} // Pass calculated constant
          />
        </View>
      </GestureDetector>
    );
  }
);

// --- Main Screen Component (RoomParallaxScreen.tsx) ---

export default function RoomParallaxScreen() {
  const scrollX = useSharedValue(0);
  const activeIndex = useSharedValue(-1); // -1 means no item is active/expanded
  const [currentVisibleIndex, setCurrentVisibleIndex] = useState(0);
  const [isItemOpen, setIsItemOpen] = useState(false);

  // Load custom font
  const [fontsLoaded, fontError] = useFonts({
    [FONTS.title]: require("../../assets/fonts/Audiowide-Regular.ttf"), // Use constant key
  });

  // Update state based on whether an item is active (open)
  // Using useAnimatedReaction to react to shared value changes
  useAnimatedReaction(
    () => activeIndex.value, // Depend on activeIndex
    (currentValue, previousValue) => {
      if (currentValue !== previousValue) {
        runOnJS(setIsItemOpen)(currentValue !== -1);
      }
    },
    [activeIndex] // Dependency array for the reaction
  );

  // Debounced function to update the current visible index state after scrolling stops
  const debouncedSetCurrentIndex = useCallback(
    debounce((index: number) => {
      console.log("Setting current index:", index);
      setCurrentVisibleIndex(index);
    }, 100), // ~100ms debounce after scroll momentum ends
    [] // No dependencies, function is stable
  );

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
  }, [activeIndex]); // Recompute when activeIndex changes

  const animatedListStyle = useAnimatedStyle(() => {
    return {
      gap: listGap.value,
    };
  });

  // Loading state while fonts are loading or if there's an error
  if (!fontsLoaded && !fontError) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" />
        <ActivityIndicator size="large" color={COLORS.textSecondary} />
      </View>
    );
  }
  if (fontError) {
    console.error("Font loading error:", fontError);
    // Optionally return an error message component
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ color: "red" }}>Error loading fonts.</Text>
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
          animatedListStyle,
        ]} // Apply animated gap
        // Critical props for snapping behavior:
        snapToInterval={ITEM_WIDTH + SPACING} // Snap to the total width of an item + initial spacing
        decelerationRate="fast" // Helps snapping feel crisp
        disableIntervalMomentum // Helps ensure landing on snap points
        // Control scroll based on whether an item is open
        scrollEnabled={!isItemOpen} // Disable list scroll when an item is expanded
        scrollEventThrottle={16} // Standard for smooth scroll tracking
        onScroll={scrollHandler}
        // Performance optimizations:
        windowSize={5} // Render items slightly outside the viewport
        initialNumToRender={3} // Render initial items quickly
        maxToRenderPerBatch={3} // Control batch rendering
        renderItem={({ item, index }) => (
          <ParallaxItem
            item={item}
            index={index}
            scrollX={scrollX}
            activeIndex={activeIndex}
            currentIndex={currentVisibleIndex} // Pass the current index state
            itemWidth={ITEM_WIDTH} // Pass constants as props
            itemHeight={ITEM_HEIGHT}
            spacing={SPACING}
            translateYAmount={TRANSLATE_Y_AMOUNT}
          />
        )}
      />
      {/* Pagination remains visible, but fades slightly when item is open */}
      <Pagination scrollX={scrollX} data={data} isOpen={isItemOpen} />
    </GestureHandlerRootView>
  );
}

// --- Styles (Would be in styles.ts or colocated) ---

const styles = StyleSheet.create({
  // Containers
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: "center", // Center FlatList vertically
    // alignItems: 'center', // AlignItems center might conflict with FlatList width
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  flatListContentContainer: {
    // Center items vertically within the available space
    alignItems: "center",
    // Add padding to center the first/last items correctly when snapped
    paddingHorizontal: (width - ITEM_WIDTH) / 2,
    paddingVertical: (height - ITEM_HEIGHT) / 2, // Adjust as needed for vertical centering
  },
  cardContainer: {
    width: ITEM_WIDTH, // Base width
    height: ITEM_HEIGHT,
    borderRadius: SPACING, // Use constant
    overflow: "hidden",
    backgroundColor: COLORS.cardBackground,
    position: "relative", // Needed for absolute positioned children
  },
  imageOuterContainer: {
    // Container for image + gradients
    ...StyleSheet.absoluteFillObject,
    borderRadius: SPACING,
    overflow: "hidden", // Clip gradients and scaled image
  },
  // Image & Gradients
  image: {
    ...StyleSheet.absoluteFillObject, // Fill imageOuterContainer
    resizeMode: "cover",
    opacity: 0.9, // Slight fade for effect
  },
  gradientContainer: {
    ...StyleSheet.absoluteFillObject, // Fill imageOuterContainer
    // No background color needed here
  },
  edgeGradient: {
    // Common style for left/right gradients
    position: "absolute",
    top: 0,
    bottom: 0,
  },
  bottomGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    // Height defined dynamically in component
  },
  // Text & Icons
  textWrapper: {
    position: 'absolute',
    left: SPACING * 4, // Further increase left margin to prevent cropping
    bottom: SPACING * 6, // Move up more from bottom for better visibility
    width: ITEM_HEIGHT * 0.85, // Reduce width slightly to prevent overflow
    transform: [{ rotate: '-90deg' }],
    transformOrigin: '0% 50%',
    zIndex: 10, // Ensure text is above other elements
  },
  textContainer: {
    paddingHorizontal: SPACING * 2, // Increase padding for better text positioning
  },
  itemTitle: {
    color: 'white',
    fontSize: 46, // Slightly reduce font size for better fit
    fontFamily: 'Audiowide-Regular',
    textTransform: 'uppercase',
    letterSpacing: 1,
    textShadowColor: 'rgba(0,0,0,0.7)', // Increase shadow opacity for better contrast
    textShadowOffset: { width: 2, height: 2 }, // Slightly larger shadow offset
    textShadowRadius: 6, // Larger shadow radius for better visibility
  },
  iconContainer: {
    position: "absolute",
    right: SPACING,
    top: SPACING,
    zIndex: 2, // Ensure icon is above gradients
  },
  // Details List
  detailsListContainer: {
    position: "absolute",
    bottom: 0, // Align to bottom when expanded
    left: SPACING,
    right: SPACING,
    padding: SPACING,
    backgroundColor: "rgba(0,0,0,0.6)", // Slightly darker background for contrast
    borderTopLeftRadius: SPACING / 2, // Rounded corners only at top
    borderTopRightRadius: SPACING / 2,
    gap: SPACING / 2, // Spacing between rows
    // Initially transparent and non-interactive until expanded
    opacity: 0, // Controlled by animation
    // pointerEvents: 'none', // Use animation to enable/disable interaction if needed
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING, // Increase gap for clarity
  },
  detailIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.iconBackground,
    justifyContent: "center",
    alignItems: "center",
  },
  detailContent: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  detailTitle: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: "600", // Slightly bolder title
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  detailValueContainer: {
    flexDirection: "row",
    alignItems: "baseline", // Align text baselines
  },
  detailValue: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: "bold",
  },
  detailUnit: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginLeft: 3, // Small space before unit
  },
  detailIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: SPACING,
    // Shadow properties for depth
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 3, // for Android shadow
  },
  detailsSeparator: {
    height: 1,
    backgroundColor: COLORS.iconBackground, // Use subtle color
    marginVertical: SPACING,
    // Adjust margins to span correctly within the padded container
    marginLeft: -SPACING,
    marginRight: -SPACING,
  },
  extrasContainer: {
    gap: SPACING / 2, // Consistent gap
    // paddingVertical: SPACING / 2, // Padding might not be needed if gap is used
  },
  extraRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING, // Consistent gap
    // justifyContent: 'space-between', // Handled by detailContent flex
  },
  // Pagination
  paginationContainer: {
    flexDirection: "row",
    position: "absolute",
    bottom: SPACING * 3, // Position from bottom of screen
    alignSelf: "center",
    gap: DOT_SPACING, // Use constant
    alignItems: "center", // Align dots and indicator vertically
    padding: SPACING / 2, // Add some padding
    backgroundColor: "rgba(0,0,0,0.2)", // Optional subtle background
    borderRadius: DOT_SIZE + SPACING, // Make it rounded
  },
  paginationDot: {
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: COLORS.white,
    // Width is animated
  },
  paginationIndicator: {
    position: "absolute",
    width: DOT_INDICATOR_SIZE,
    height: DOT_INDICATOR_SIZE,
    borderRadius: DOT_INDICATOR_SIZE / 2,
    borderWidth: INDICATOR_BORDER_SIZE,
    borderColor: INDICATOR_BORDER_COLOR,
    // Adjust position to align perfectly over the dots
    top:
      (DOT_SIZE - DOT_INDICATOR_SIZE) / 2 + SPACING / 2 - INDICATOR_BORDER_SIZE, // Center vertically within paginationContainer padding
    left:
      (DOT_SIZE - DOT_INDICATOR_SIZE) / 2 + SPACING / 2 - INDICATOR_BORDER_SIZE, // Center horizontally within paginationContainer padding
    // Transform is animated
  },
  // Swipe Up Indicator
  swipeUpIndicatorContainer: {
    position: "absolute",
    bottom: SPACING * 2,
    alignSelf: "center",
    alignItems: "center",
    // Prevent touches from interfering when hidden
    pointerEvents: "none",
  },
  swipeUpChevron: {
    // Negative margin for stacking effect
    marginTop: -5,
  },
  itemContainer: {
    width: ITEM_WIDTH,
    height: ITEM_HEIGHT,
  },
});
