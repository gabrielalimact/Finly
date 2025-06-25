import { Colors } from "@/constants/Colors";
import { SimpleLineIcons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { styles } from "./styles";

type IconBackProps = {
  size?: number;
  color?: string;
  onPress?: () => void;
}
const IconBack = ({
  size = 16,
  color = Colors.light.icon,
  onPress,
}: IconBackProps) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <SimpleLineIcons size={size} name="arrow-left" color={color} style={styles.iconBack} />
    </TouchableOpacity>
  )
}

export default IconBack;