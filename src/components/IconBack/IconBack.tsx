import { Colors } from "@/constants/Colors";
import FontAwesome6 from "@expo/vector-icons/MaterialIcons";
import { TouchableOpacity } from "react-native";
import { styles } from "./styles";

type IconBackProps = {
  size?: number;
  color?: string;
  onPress?: () => void;
}
const IconBack = ({
  size = 24,
  color = Colors.light.icon,
  onPress,
}: IconBackProps) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <FontAwesome6 size={size} name="arrow-left" color={color} style={styles.iconBack} />
    </TouchableOpacity>
  )
}

export default IconBack;