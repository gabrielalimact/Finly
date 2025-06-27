import { CustomSelect } from "@/components/CustomSelect";
import { Input } from "@/components/Inputs/Input";
import { TextStyled } from "@/components/TextStyled";
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
  const [openSelectAccount, setOpenSelectAccount] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<string>("");

  const handleSelectAccount = (value: string) => {
    setSelectedAccount(value);
    setOpenSelectAccount(false);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <NewTransactionHeader
          selectedType={selectedType}
          onClose={() => router.back()}
          onOpenModal={() => setOpenSelectType(true)}
          onSave={() => router.back()}
        />
        <View style={styles.form}>
          <View style={styles.viewInput}>
            <View style={styles.labelColumn}>
              <TextStyled text="Nome" fontWeight="medium" />
            </View>
            <View style={styles.inputColumn}>
              <Input
                id='nome-transacao'
                type="text"
                placeholder="Digite o nome da sua transação"
              />
            </View>
          </View>

          <View style={styles.viewInput}>
            <View style={styles.labelColumn}>
              <TextStyled text="Conta" fontWeight="medium" />
            </View>
            <View style={styles.inputColumn}>
              <CustomSelect />
            </View>
          </View>

        </View>

        <TransactionTypeModal
          visible={openSelectType}
          onClose={() => setOpenSelectType(false)}
          onSelect={setSelectedType}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}
