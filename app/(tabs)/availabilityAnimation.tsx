// app/(tabs)/availabilityAnimation.tsx
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from "react-native";
import AvailabilityAnimation, {
  HomeType,
  UserType,
} from "../../components/AvailabilityAnimation";
import AnimatedTicker from "../../components/AnimatedTicker";
import LeaderboardAnimation from "../../components/LeaderboardAnimation";
import { Feather } from "@expo/vector-icons";
import { MotiView } from "moti";
import { Easing } from "react-native-reanimated";
import { CallingAnimation } from "@/components/CallingAnimation";

const _color = "#4A1FB0";
const _size = 100;

// Generate random homes
const generateFakeHome = (): HomeType => {
  return {
    key: Math.random().toString(36).substring(2, 10),
    image: `https://picsum.photos/200/300?random=${Math.floor(
      Math.random() * 1000
    )}`,
  };
};

// Generate a collection of homes
const generateFakeHomes = (count = 3): HomeType[] => {
  return Array(count)
    .fill(0)
    .map(() => generateFakeHome());
};

// Generate random sales amount
const generateRandomSales = () => {
  return Math.floor(Math.random() * 9000000) + 1000000;
};

// Generate random sales person data
const generateSalesPersons = (): UserType[] => {
  const names = ["Alice", "Bob", "Charlie", "David", "Eva", "Frank", "Grace"];

  return names
    .map((name) => ({
      name,
      score: Math.floor(Math.random() * 50) + 50, // Random score between 50-100
      avatar: `https://i.pravatar.cc/150?u=${name.toLowerCase()}`,
    }))
    .sort((a, b) => b.score - a.score); // Sort by score in descending order
};

export default function AvailabilityScreen() {
  const [data, setData] = useState<HomeType[]>(generateFakeHomes());
  const [isLoading, setIsLoading] = useState(false);
  const [totalSales, setTotalSales] = useState(generateRandomSales());
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [salesPersons, setSalesPersons] = useState<UserType[]>(
    generateSalesPersons()
  );
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const generateNewData = () => {
    // Clear any existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // Set loading state
    setIsLoading(true);

    // Generate new data after random delay
    const randomDelay = Math.floor(Math.random() * 1000) + 1000; // Between 1-2 seconds
    timerRef.current = setTimeout(() => {
      setData(generateFakeHomes());
      setTotalSales(generateRandomSales());
      setSalesPersons(generateSalesPersons());
      setIsLoading(false);
    }, randomDelay);
  };

  // Toggle leaderboard visibility
  const toggleLeaderboard = () => {
    setShowLeaderboard((prev) => !prev);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Availability Animation</Text>
        <Text style={styles.description}>
          Using Moti and Reanimated to create skeleton loaders and entrance
          animations
        </Text>

        <View style={styles.salesCard}>
          <Text style={styles.salesTitle}>Total Sales</Text>
          <AnimatedTicker value={totalSales} fontSize={40} currency={true} />
        </View>

        <View style={styles.card}>
          <AvailabilityAnimation data={data} isLoading={isLoading} />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={generateNewData}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Generate New Data</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              { marginTop: 12, backgroundColor: "#6200EE" },
            ]}
            onPress={toggleLeaderboard}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>
              {showLeaderboard ? "Hide Leaderboard" : "Show Leaderboard"}
            </Text>
          </TouchableOpacity>
        </View>

        {showLeaderboard && (
          <View style={styles.leaderboardCard}>
            <LeaderboardAnimation users={salesPersons} />
          </View>
        )}
        {/* <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          {[...Array(3).keys()].map((index) => {
            return (
              <MotiView
                key={index} // Ensure a unique key for each MotiView
                from={{ opacity: 1, scale: 1 }}
                animate={{ opacity: 0, scale: 4 }}
                transition={{
                  type: "timing",
                  duration: 2000,
                  easing: Easing.out(Easing.ease),
                  delay: index * 400, // Stagger the animation slightly
                }}
                style={[StyleSheet.absoluteFillObject, styles.phoneIcon,styles.center]}
              />
            );
          })}
          <View style={[styles.phoneIcon, styles.center]}>
            <Feather name="phone-outgoing" size={32} color="#fff" />
          </View> 
        </View>*/}
        <View style={styles.callingAnimationContainer}>
          <CallingAnimation size={60} color="#3498db" waveCount={3} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 16,
  },
  phoneIcon: {
    width: _size,
    height: _size,
    borderRadius: _size / 2,
    backgroundColor: _color,
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: "#666",
    marginBottom: 24,
    textAlign: "center",
  },
  salesCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    alignItems: "center",
  },
  
  salesTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonContainer: {
    marginBottom: 24,
  },
  button: {
    backgroundColor: "#007AFF",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  leaderboardCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 24,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  callingAnimationContainer: {
    height: 400,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
});
