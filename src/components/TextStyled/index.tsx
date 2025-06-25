import { Colors } from "@/constants/Colors";
import { StyleProp, Text, TextStyle } from "react-native";

export type TextStyledProps = {
  text: string;
  size?: number;
  fontWeight?: "normal" | "bold" | "light";
  color?: string;
  style?: StyleProp<TextStyle>;
  type?: "text" | "title" | "subtitle" | "caption";
}

export const TextStyled = ({
  text,
  size = 16,
  fontWeight = "normal",
  color = Colors.light.text,
  style = {},
  type = "text",
}: TextStyledProps) => {
  return (
    <Text style={[{
      fontFamily: fontWeight === "bold" ? "Montserrat-Bold" :
        fontWeight === "light" ? "Montserrat-Light" : "Montserrat-Regular",
      fontSize: type === "title" ? size * 1.5 :
        type === "subtitle" ? size * 1.2 : type === 'caption' ? 12 : size,
      color: color,
    },
    style as TextStyle
    ]}>{text}</Text>
  );
}