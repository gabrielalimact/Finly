import { Colors } from "@/constants/Colors";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from "react-native";

type ButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'tertiary';
  size?: 'small' | 'medium' | 'large';
}
const Button = ({
  label,
  onPress,
  disabled = false,
  loading = false,
  variant = 'primary',
  size = 'medium',
  ...props
} : ButtonProps) => {
  return (
 <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        styles[variant],
        disabled  && styles.disabled,
      ]}
    >
      {
        loading ? (
          <ActivityIndicator color={Colors.light.black} />
        ) : (
          <Text style={[
            styles[size],
            {
              color: disabled  ? Colors.light.textTertiary : Colors.light.black,
              fontFamily: 'Montserrat-SemiBold',
            }
          ]}>
            {label}
          </Text>
        )
      }
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    padding: 10,
    borderRadius: 50,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.light.black,
  },
  primary: {
    backgroundColor: Colors.light.green,
  },
  secondary: {
    backgroundColor: Colors.light.bgGray,
    borderColor: Colors.light.border,
    borderWidth: 2,
  },
  tertiary: {
    backgroundColor: 'transparent',
  },
  small: {
    fontSize: 12,
  },
  medium: {
    fontSize: 14,
  },
  large: {
    fontSize: 18,
  },
  disabled: {
    backgroundColor: '#E0E0E0',
  },
})

export default Button;