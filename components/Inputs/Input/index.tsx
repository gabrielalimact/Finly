import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { styles } from "../styles";
import { InputProps } from "../types";

export const Input = ({label, placeholder, id} : InputProps) => {
  const [data, setData] = useState("");
  const [inputFocused, setInputFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  }
  return (
    <View style={styles.viewInput}>
      <Text style={styles.labelInput}>{label}</Text>
      <TextInput
        style={[styles.input, inputFocused && styles.inputFocused]}
        placeholder="******"
        keyboardType="default"
        autoCapitalize="words"
        value={data}
        onChangeText={setData}
        onFocus={() => setInputFocused(true)}
        onBlur={() => setInputFocused(false)}
        secureTextEntry={!showPassword}
        autoComplete="password"
      />

      <TouchableOpacity style={{ position: 'absolute', right: 12, top: 35 }} onPress={handleShowPassword}>
        <IconSymbol name={showPassword ? 'eye.slash' : 'eye'} size={24} color={Colors.light.icon} />
      </TouchableOpacity>
    </View>
  );
}