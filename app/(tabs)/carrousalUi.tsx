import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

export default function TryScreen() {
  const router = useRouter();

  const navigateToOnboarding = () => {
    router.push("/onboardingExample");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Try Advanced Animations</Text>
      <Text style={styles.description}>
        Check out some beautiful animation examples built with React Native
        Reanimated
      </Text>

      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={navigateToOnboarding}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={["#5856D6", "#FF2D55"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <Text style={styles.buttonText}>Try Onboarding Animation</Text>
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={() => router.push("/messageAnimation")}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={["#FF0050", "#FF00A0"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <Text style={styles.buttonText}>Try TikTok Messages</Text>
        </LinearGradient>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={() => router.push("/availabilityAnimation")}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={["#FF0050", "#FF00A0"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <Text style={styles.buttonText}>Try Availability Animation</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 20,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: "#AAA",
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 24,
  },
  buttonContainer: {
    width: "80%",
    height: 56,
    borderRadius: 28,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#5856D6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  gradient: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "600",
  },
});
