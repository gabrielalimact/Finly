import { Colors } from "@/constants/Colors";
import { ActivityIndicator } from "react-native";

 const Spinner = () => {
  return (
      <ActivityIndicator size="large" color={Colors.light.positiveText} />
  )
}

export default Spinner;