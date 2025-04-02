// app/(tabs)/scheduleAnimation.tsx
import React from "react";
import { StyleSheet, View, Text, ScrollView } from "react-native";
import ScheduleAnimation from "../../components/ScheduleAnimation";

export default function ScheduleAnimationScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Schedule Animation</Text>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ScheduleAnimation />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
});
