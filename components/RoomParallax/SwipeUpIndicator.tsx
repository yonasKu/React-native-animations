import React from "react";
import { View, StyleSheet } from "react-native";
import { ChevronUp } from "lucide-react-native";
import { MotiView } from "moti";
import { SPACING } from "./constants";

interface SwipeUpIndicatorProps {
  isOpen?: boolean;
}

// Swipe Up Indicator component
const SwipeUpIndicator: React.FC<SwipeUpIndicatorProps> = ({ isOpen = false }) => {
  return (
    <View style={styles.swipeUpIndicator}>
      {[0, 1, 2].map((index) => (
        <MotiView
          key={`chevron-${index}`}
          style={{ marginTop: index > 0 ? -5 : 0 }}
          animate={{
            opacity: isOpen ? 0 : 0.7 - (index * 0.2),
          }}
          transition={{
            type: "timing",
            duration: 300,
            delay: index * 50,
          }}
        >
          <ChevronUp size={24} color="white" />
        </MotiView>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  swipeUpIndicator: {
    position: "absolute",
    bottom: SPACING * 2,
    alignSelf: "center",
    alignItems: "center",
  },
});

export default SwipeUpIndicator;
