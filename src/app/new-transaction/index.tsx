import Button from "@/components/Button";
import { CustomSelect } from "@/components/CustomSelect";
import { Input } from "@/components/Inputs/Input";
import { TextStyled } from "@/components/TextStyled";
import { NewTransactionHeader, TransactionTypeModal } from "@/modules/new-transaction/components";
import { styles } from "@/modules/new-transaction/components/styles";
import { router } from "expo-router";
import { useState } from "react";
import { Keyboard, Platform, TouchableWithoutFeedback, View } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
export default function NewTransactionScreen() {
  const [selectedType, setSelectedType] = useState<"income" | "expense">(
    "income"
  );
  const [openSelectType, setOpenSelectType] = useState(false);
  const [openSelectAccount, setOpenSelectAccount] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<string>("");

  const [date, setDate] = useState<Date | undefined>(undefined);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

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
          <TextStyled text="Nome" fontWeight="medium" padding={8}/>

          <Input id="nome-transacao" placeholder="Digite o nome da sua transação" />

          <TextStyled text="Conta" fontWeight="medium" padding={8}/>
          <CustomSelect /> 

          <TextStyled text="Data da Transação" fontWeight="medium" padding={8}/>
          <Button label={date ? date.toLocaleDateString() : "Selecionar Data"} onPress={() => setDatePickerVisibility(true)} variant="secondary" />

          <TextStyled text="Parcelada" fontWeight="medium" padding={8}/>
          
          <TextStyled text="Recorrente" fontWeight="medium" padding={8}/>

        </View>
        
        <TransactionTypeModal
          visible={openSelectType}
          onClose={() => setOpenSelectType(false)}
          onSelect={setSelectedType}
        />

        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          date={date}
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onConfirm={(selectedDate) => {
            setDate(selectedDate);
            setDatePickerVisibility(false);
          }}
          onCancel={() => setDatePickerVisibility(false)}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}
