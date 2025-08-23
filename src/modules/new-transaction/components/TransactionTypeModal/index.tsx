import { TextStyled } from "@/components/TextStyled";
import { Modal, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { styles } from "./styles";

interface Props {
  visible: boolean;
  onClose: () => void;
  onSelect: (type: "income" | "expense") => void;
}

export const TransactionTypeModal = ({ visible, onClose, onSelect }: Props) => {
  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalBody}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              <TextStyled text="Selecione o tipo de transação" />

              <TouchableOpacity
                onPress={() => {
                  onSelect("income");
                  onClose();
                }}
                style={styles.buttonPositive}
              >
                <TextStyled text="Receita" fontWeight="bold" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  onSelect("expense");
                  onClose();
                }}
                style={styles.buttonNegative}
              >
                <TextStyled text="Despesa" fontWeight="bold" />
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
