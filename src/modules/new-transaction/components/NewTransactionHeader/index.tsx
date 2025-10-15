import { Input } from "@/components/Inputs/Input";
import { TextStyled } from "@/components/TextStyled";
import { Colors } from "@/constants/Colors";
import { AntDesign } from "@expo/vector-icons";
import { TouchableOpacity, View } from "react-native";
import { styles } from "./styles";

interface Props {
  selectedType: "income" | "expense";
  onClose: () => void;
  onOpenModal: () => void;
  onSave: () => void;
}

export const NewTransactionHeader = ({
  selectedType,
  onClose,
  onOpenModal,
  onSave,
}: Props) => {
  const isIncome = selectedType === "income";
  return (
    <View
      style={[
        styles.header,
        { backgroundColor: isIncome ? Colors.light.positiveBg : Colors.light.negativeBg },
      ]}
    >
      <View style={styles.headerIcons}>
        <TouchableOpacity onPress={onOpenModal} style={styles.flexRow}>
          <TextStyled
            fontWeight="bold"
            text={isIncome ? "Nova Receita" : "Nova Despesa"}
            color={isIncome ? Colors.light.iconGreen : "white"}
          />
          <AntDesign
            name="down"
            size={22}
            color={isIncome ? Colors.light.iconGreen : "white"}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.headerInput}>
        <Input
          type="money"
          placeholder="R$ 0,00"
          keyboardType="numeric"
          id="amount"
          style={styles.amountInput}
          placeholderTextColor={isIncome ? '' : 'gray'}
        />
      </View>
       
    </View>
  );
};
