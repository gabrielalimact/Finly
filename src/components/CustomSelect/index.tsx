import { Colors } from '@/constants/Colors';
import React, { useState } from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';
import { TextStyled } from '../TextStyled';
import { styles } from './styles';


type Props = {
  data: string[];
}
export const CustomSelect = ({ data = [] }: Props) => {
  const [selected, setSelected] = useState('');
  const [modalVisible, setModalVisible] = useState(false);


  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.selectBox}>
        <TextStyled text={selected || 'Selecione uma opção'}
          color={selected ? Colors.light.black : Colors.light.textSecondary}
        />
      </TouchableOpacity>

      <Modal transparent visible={modalVisible} animationType="fade">
        <TouchableOpacity
          style={styles.modalBackground}
          activeOpacity={1}
          onPressOut={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            {data.map((item) => (
              <TouchableOpacity
                key={item}
                onPress={() => {
                  setSelected(item);
                  setModalVisible(false);
                }}
                style={styles.option}
              >
                <Text>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

