import { Colors } from "@/constants/Colors";
import { useState } from "react";
import { Text, TextInput, View } from "react-native";
import { styles } from "../styles";
import { InputProps } from "../types";

export const Input = ({ label, placeholder, id, keyboardType, style, type }: InputProps) => {
  const [data, setData] = useState("");
  const [inputFocused, setInputFocused] = useState(false);
  const formattedValue = type === "money" && data
    ? `R$ ${data}`
    : data;

  const handleChange = (value: string) => {
    if (type === "money") {
      const cleaned = value.replace(/[^\d,]/g, "");
      setData(cleaned);
    } else {
      setData(value);
    }
  };

  return (
    <View style={styles.viewInput} key={id}>
      {label && <Text style={styles.labelInput}>{label}</Text>}
      <TextInput
        style={[styles.input, inputFocused && styles.inputFocused, style]}
        placeholder={placeholder}
        placeholderTextColor={Colors.light.textTertiary}
        keyboardType={keyboardType || "default"}
        autoCapitalize="words"
        value={formattedValue}
        onChangeText={(value) => handleChange(value)}
        onFocus={() => setInputFocused(true)}
        onBlur={() => setInputFocused(false)}
      />
    </View>
  );
}