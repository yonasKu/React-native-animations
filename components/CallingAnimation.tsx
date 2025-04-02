// components/CallingAnimation.tsx
import React from "react";
import { View, StyleSheet } from "react-native";
import { MotiView } from "moti";
import { Easing } from "react-native-reanimated";
import { Feather } from "lucide-react-native";

interface CallingAnimationProps {
  size?: number;
  color?: string;
  waveCount?: number;
}

export const CallingAnimation: React.FC<CallingAnimationProps> = ({
  size = 60,
  color = "#3498db",
  waveCount = 3,
}) => {
  return (
    <View style={[styles.container, { width: size * 4, height: size * 4 }]}>
      {/* Animated waves */}
      {Array(waveCount)
        .fill(0)
        .map((_, index) => (
          <MotiView
            key={index}
            style={[
              styles.circle,
              {
                width: size,
                height: size,
                borderRadius: size / 2,
                backgroundColor: color,
              },
            ]}
            from={{
              opacity: 0.7,
              scale: 1,
            }}
            animate={{
              opacity: 0,
              scale: 4,
            }}
            transition={{
              type: "timing",
              duration: 2000,
              easing: Easing.out(Easing.ease),
              delay: index * 400,
              loop: true,
              repeatReverse: false,
            }}
          />
        ))}

      {/* Phone icon in the middle */}
      <View
        style={[
          styles.dot,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: color,
            position: "absolute",
            zIndex: 10,
          },
        ]}
      >
        <View style={[styles.dot, styles.circle]}>
          {/* <Feather name="phone-outgoing" size={32} color="#fff" /> */}
        </View>
        {/* You can add a phone icon here if needed */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  dot: {
    alignItems: "center",
    justifyContent: "center",
  },
  circle: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
});
