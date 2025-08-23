import { Colors } from "@/constants/Colors";
import { StyleProp, Text, TextStyle } from "react-native";

export type TextStyledProps = {
  text: string;
  size?: number;
  fontWeight?: "normal" | "bold" | "light" | "medium";
  color?: string;
  style?: StyleProp<TextStyle>;
  type?: "text" | "title" | "subtitle" | "caption";
}

export const TextStyled: React.FC<TextStyledProps & TextStyle> = ({
  text,
  size = 16,
  fontWeight = "normal",
  color = Colors.light.text,
  style = {},
  type = "text",
  ...rest
}) => {
  return (
    <Text
      style={[
        {
          fontFamily: fontWeight === "bold"
            ? "Montserrat-Bold"
            : fontWeight === "light"
            ? "Montserrat-Light"
            : fontWeight === "medium"
            ? "Montserrat-Semibold"
            : "Montserrat-Regular",
          fontSize:
            type === "title"
              ? size * 1.5
              : type === "subtitle"
              ? size * 1.2
              : type === "caption"
              ? 12
              : size,
          color: color,
        },
        style as TextStyle,
      ]}
      {...rest}
    >
      {text}
    </Text>
  );
};