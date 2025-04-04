// app/(carousel)/_layout.tsx
import { Stack } from "expo-router";
import React from "react";

export default function CarouselLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Carousels",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="headphonesCarousel"
        options={{
          title: "Headphones Carousel",
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="verticalCarousel"
        options={{
          title: "Vertical Carousel",
          headerShown: true,
        }}
      />
    </Stack>
  );
}