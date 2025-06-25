import { StyleProp, TextStyle } from "react-native";

export type InputProps = {
  id: string;
  type?: "text" | "email" | "number" | "phone" | "money"
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  style?: StyleProp<TextStyle>;
}