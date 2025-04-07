import React from "react";
import { View, Text, StyleSheet } from "react-native";
import {
  Thermometer,
  Droplets,
  Clock4,
  LightbulbIcon,
  Music,
  Camera,
} from "lucide-react-native";
import Animated from "react-native-reanimated";
import { SPACING, COLORS } from "./constants";
import { Item } from "../../mocks/roomMock";

interface DetailsListProps {
  item: Item;
  style?: any;
}

// Get icon by title
function getIconByTitle(title: string) {
  switch (title.toLowerCase()) {
    case "lights":
      return <LightbulbIcon size={18} color="white" />;
    case "air conditioner":
      return <Droplets size={18} color="white" />;
    case "music":
      return <Music size={18} color="white" />;
    default:
      return <Camera size={18} color="white" />;
  }
}

// Details list component
const DetailsList = React.forwardRef<Animated.View, DetailsListProps>(
  ({ item, style }, ref) => {
    return (
      <Animated.View ref={ref} style={[styles.detailsList, style]}>
        {item.details.map((detail, index) => (
          <View key={index} style={styles.detailRow}>
            <View style={styles.detailIconContainer}>
              {detail.title === "temperature" && <Thermometer size={18} color="white" />}
              {detail.title === "humidity" && <Droplets size={18} color="white" />}
              {detail.title === "timer" && <Clock4 size={18} color="white" />}
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailTitle}>{detail.title.toUpperCase()}</Text>
              <View style={styles.detailValueContainer}>
                <Text style={styles.detailValue}>
                  {typeof detail.value === "boolean"
                    ? detail.value
                      ? "ON"
                      : "OFF"
                    : detail.value}
                </Text>
                <Text style={styles.detailUnit}>{detail.unit}</Text>
              </View>
              {detail.title === "timer" && (
                <View
                  style={[
                    styles.detailIndicator,
                    {
                      backgroundColor: detail.value ? COLORS.active : COLORS.inactive,
                      shadowColor: detail.value ? COLORS.active : "transparent",
                    },
                  ]}
                />
              )}
            </View>
          </View>
        ))}
        
        {/* Extra details section */}
        {item.extras && (
          <>
            <View style={styles.separator} />
            
            <View style={styles.extrasContainer}>
              {item.extras.map((extra) => (
                <View key={extra.title} style={styles.extraRow}>
                  <View style={styles.detailIconContainer}>
                    {getIconByTitle(extra.title)}
                  </View>
                  <View style={styles.detailContent}>
                    <Text style={styles.detailTitle}>{extra.title.toUpperCase()}</Text>
                    <Text style={[
                      styles.detailValue, 
                      { color: extra.value ? "#fff" : "#999" }
                    ]}>
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
  }
);

const styles = StyleSheet.create({
  detailsList: {
    position: "absolute",
    bottom: SPACING,
    left: SPACING,
    right: SPACING,
    padding: SPACING,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: SPACING / 2,
    gap: SPACING / 2,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING / 2,
    marginVertical: SPACING / 4,
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
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  detailValueContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailValue: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: "bold",
  },
  detailUnit: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginLeft: 2,
  },
  detailIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: SPACING,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 3,
  },
  separator: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    marginVertical: SPACING,
    marginLeft: -SPACING,
    marginRight: -SPACING,
    width: "100%",
    alignSelf: "center",
  },
  extrasContainer: {
    gap: SPACING / 4,
    paddingVertical: SPACING / 2,
  },
  extraRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING / 2,
    justifyContent: "space-between",
  },
});

export default DetailsList;
