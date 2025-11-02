import { Colors } from "@/constants/Colors";
import { useState } from "react";
import { Text, TextInput, View } from "react-native";
import { styles } from "../styles";
import { InputProps } from "../types";

export const Input = ({ label, placeholder, placeholderTextColor, id, keyboardType, style, type, onChange, value }: InputProps) => {
  const [data, setData] = useState(value || "");
  const [inputFocused, setInputFocused] = useState(false);
  
  const currentValue = value !== undefined ? value : data;
  
  const formattedValue = type === "money" && currentValue
    ? `R$ ${currentValue}`
    : currentValue;

  const handleChange = (value: string) => {
    let processedValue = value;
    
    if (type === "money") {
      processedValue = value.replace(/[^\d,]/g, "");
    }
    
    if (value === undefined) {
      setData(processedValue);
    }
    
    if (onChange) {
      onChange(processedValue);
    }
  };

  return (
    <View style={styles.viewInput} key={id}>
      {label && <Text style={styles.labelInput}>{label}</Text>}
      <TextInput
        style={[styles.input, inputFocused && styles.inputFocused, style]}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor ?? Colors.light.textSecondary}
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