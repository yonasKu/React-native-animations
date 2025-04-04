// app/(carousel)/index.tsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

export default function CarouselIndex() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Carousel Animations</Text>
      <Text style={styles.subtitle}>
        Explore different carousel animations built with React Native Reanimated
      </Text>
      
      <ScrollView style={styles.buttonsContainer} contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() => router.push("/(carousel)/headphonesCarousel")}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={["#3B82F6", "#2563EB"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradient}
          >
            <Text style={styles.buttonText}>Headphones Carousel</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() => router.push("/(carousel)/roomParallax")}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={["#6D28D9", "#4C1D95"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradient}
          >
            <Text style={styles.buttonText}>Room Parallax</Text>
          </LinearGradient>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() => router.push("/(carousel)/verticalCarousel")}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={["#FF0050", "#FF00A0"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradient}
          >
            <Text style={styles.buttonText}>Vertical Carousel</Text>
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
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 60,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#ccc",
    marginBottom: 30,
  },
  buttonsContainer: {
    flex: 1,
  },
  scrollContent: {
    gap: 20,
  },
  buttonContainer: {
    borderRadius: 12,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  gradient: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});