import { NewTransactionHeader, TransactionTypeModal } from "@/modules/new-transaction/components";
import { styles } from "@/modules/new-transaction/components/styles";
import { router } from "expo-router";
import { useState } from "react";
import { Keyboard, TouchableWithoutFeedback, View } from "react-native";


export default function NewTransactionScreen() {
  const [selectedType, setSelectedType] = useState<"income" | "expense">(
    "income"
  );
  const [openSelectType, setOpenSelectType] = useState(false);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <NewTransactionHeader
          selectedType={selectedType}
          onClose={() => router.back()}
          onOpenModal={() => setOpenSelectType(true)}
          onSave={() => router.back()}
        />



        <TransactionTypeModal
          visible={openSelectType}
          onClose={() => setOpenSelectType(false)}
          onSelect={setSelectedType}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}
