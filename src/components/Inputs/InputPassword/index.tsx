import { Colors } from "@/constants/Colors";
import Feather from "@expo/vector-icons/Feather";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { styles } from "../styles";
import { InputProps } from "../types";

export const InputPassword = ({ label, id, onChange, value }: InputProps) => {
  const [data, setData] = useState(value || "");
  const [inputFocused, setInputFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const currentValue = value !== undefined ? value : data;

  const handleChange = (newValue: string) => {
    if (value === undefined) {
      setData(newValue);
    }
    
    if (onChange) {
      onChange(newValue);
    }
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  }
  return (
    <View style={styles.viewInput}>
      <Text style={styles.labelInput}>{label}</Text>
      <TextInput
        style={[styles.input, inputFocused && styles.inputFocused]}
        placeholder="******"
        placeholderTextColor={Colors.light.gray}
        id={id}
        value={currentValue}
        onChangeText={handleChange}
        onFocus={() => setInputFocused(true)}
        onBlur={() => setInputFocused(false)}
        secureTextEntry={!showPassword}
        autoComplete="password"
      />

      <TouchableOpacity style={{ position: 'absolute', right: 12, top: 35 }} onPress={handleShowPassword}>
        <Feather name={showPassword ? 'eye-off' : 'eye'} size={20} color={Colors.light.icon} />
      </TouchableOpacity>
    </View>
  );
}