import React from "react";
import { View, ScrollView, Text, StyleSheet, TouchableOpacity } from "react-native";
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
      <ScrollView 
        style={styles.buttonsContainer} 
        horizontal={true} // Allow horizontal scrolling
        contentContainerStyle={styles.scrollContent} // Style the content inside ScrollView
      >
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

        {/* New button for Animated Sentence */}
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() => router.push("/animatedSentence")} // Navigate to the new route
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={["#4CD964", "#5AC8FA"]} // Example new colors
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradient}
          >
            <Text style={styles.buttonText}>Try Animated Sentence</Text>
          </LinearGradient>
        </TouchableOpacity>
        
      </ScrollView>
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
  buttonsContainer: {
    flexDirection: "row",
    // Remove 'alignSelf' and 'alignItems' from here, it's redundant with ScrollView
    // gap is a newer property and may not work as expected in older versions of React Native
  },
  scrollContent: {
    overflow: 'scroll',
    alignItems: "center", // Align the button containers in the center of the scroll view
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
    width: 280, // Adjust width for a better look, based on screen size
    height: 56,
    borderRadius: 28,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#5856D6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    marginRight: 15, // Add some space between buttons
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
