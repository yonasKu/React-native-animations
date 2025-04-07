import { Dimensions } from "react-native";

// Screen dimensions
const { width, height } = Dimensions.get("window");

// Item dimensions
export const ITEM_WIDTH = width * 0.7;
export const ITEM_HEIGHT = height * 0.6;
export const SPACING = 10;
export const TRANSLATE_Y_AMOUNT = ITEM_HEIGHT * 0.4;

// Pagination constants
export const DOT_SIZE = 8;
export const DOT_SPACING = 8;
export const DOT_INDICATOR_SIZE = DOT_SIZE + 4;
export const INDICATOR_BORDER_SIZE = 2;
export const INDICATOR_BORDER_COLOR = "#fff";

// Colors
export const COLORS = {
  background: "#323232",
  cardBackground: "#111",
  textPrimary: "#fff",
  textSecondary: "#999",
  iconBackground: "rgba(255,255,255,0.1)",
  active: "#09c",
  inactive: "#999",
};

// Fonts
export const FONTS = {
  title: "Audiowide-Regular",
};
