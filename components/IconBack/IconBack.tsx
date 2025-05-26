import { Colors } from "@/constants/Colors";
import { TouchableOpacity } from "react-native";
import { IconSymbol } from "../ui/IconSymbol";
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
}: IconBackProps ) => {
return (
    <TouchableOpacity onPress={onPress}>
      <IconSymbol size={size} name="arrow.backward" color={color}  style={styles.iconBack} />
    </TouchableOpacity> 
)
}

export default IconBack;