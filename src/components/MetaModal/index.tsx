import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { Colors } from '../../constants/Colors';
import {
  ICreateMeta,
  IMeta,
  IUpdateMeta,
  TipoMeta,
  atualizarMeta,
  criarMeta,
  deletarMeta,
  validarDadosMeta,
} from '../../services/metas-service';
import { Input } from '../Inputs/Input';
import { TextStyled } from '../TextStyled';
import { styles } from './styles';

const { width, height } = Dimensions.get('window');

interface MetaModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: () => void;
  onDelete?: () => void; 
  meta?: IMeta; // Se fornecido, será edição; se não, será criação
}

interface Categoria {
  id: number;
  nome: string;
}

export const MetaModal: React.FC<MetaModalProps> = ({
  visible,
  onClose,
  onSave,
  onDelete,
  meta,
}) => {
  const [loading, setLoading] = useState(false);
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [valorAlvo, setValorAlvo] = useState('');
  const [tipo, setTipo] = useState<TipoMeta>(TipoMeta.PERSONALIZADA);
  const [dataInicio, setDataInicio] = useState(() => new Date().toLocaleDateString('pt-BR'));
  const [dataFim, setDataFim] = useState(() => {
    const futureDate = new Date();
    futureDate.setMonth(futureDate.getMonth() + 1); // Um mês no futuro
    return futureDate.toLocaleDateString('pt-BR');
  });
  const [categoriaId, setCategoriaId] = useState<number | undefined>();
  const [showTipoModal, setShowTipoModal] = useState(false);
  const [showCategoriaModal, setShowCategoriaModal] = useState(false);

  const isEditing = !!meta;

  // Mock de categorias - você pode substituir por uma chamada real à API
  const categorias: Categoria[] = [
    { id: 1, nome: 'Alimentação' },
    { id: 2, nome: 'Transporte' },
    { id: 3, nome: 'Lazer' },
    { id: 4, nome: 'Saúde' },
    { id: 5, nome: 'Educação' },
    { id: 6, nome: 'Casa' },
  ];

  const tiposMetaOptions = [
    { label: 'Meta Mensal', value: TipoMeta.MENSAL },
    { label: 'Meta Anual', value: TipoMeta.ANUAL },
    { label: 'Meta Personalizada', value: TipoMeta.PERSONALIZADA },
  ];

  const categoriaOptions = categorias.map(cat => ({
    label: cat.nome,
    value: cat.id.toString(),
  }));

  useEffect(() => {
    if (meta) {
      // Preenchendo dados para edição
      setNome(meta.nome);
      setDescricao(meta.descricao || '');
      setValorAlvo(meta.valorAlvo.toString());
      setTipo(meta.tipo);
      setDataInicio(formatDateForInput(meta.dataInicio));
      setDataFim(formatDateForInput(meta.dataFim));
      setCategoriaId(meta.categoria?.id);
    } else {
      // Limpando dados para criação
      clearForm();
    }
  }, [meta, visible]);

  const formatDateForInput = (date: Date | string): string => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${day}/${month}/${year}`;
  };

  const parseDateFromInput = (dateString: string): string => {
    const [day, month, year] = dateString.split('/');
    return `${year}-${month}-${day}`;
  };

  const clearForm = () => {
    setNome('');
    setDescricao('');
    setValorAlvo('');
    setTipo(TipoMeta.PERSONALIZADA);
    setDataInicio(new Date().toLocaleDateString('pt-BR'));
    const futureDate = new Date();
    futureDate.setMonth(futureDate.getMonth() + 1);
    setDataFim(futureDate.toLocaleDateString('pt-BR'));
    setCategoriaId(undefined);
  };

  const handleClose = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (!isEditing) {
      clearForm();
    }
    onClose();
  };

  const handleSave = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      const valorNumerico = parseFloat(valorAlvo.replace(',', '.'));
      
      const dadosMeta: ICreateMeta = {
        nome,
        descricao: descricao || undefined,
        valorAlvo: valorNumerico,
        tipo,
        dataInicio: parseDateFromInput(dataInicio),
        dataFim: parseDateFromInput(dataFim),
        categoriaId,
      };

      // Validação
      const erroValidacao = validarDadosMeta(dadosMeta);
      if (erroValidacao) {
        Alert.alert('Erro de Validação', erroValidacao);
        return;
      }

      setLoading(true);

      if (isEditing && meta) {
        const dadosUpdate: IUpdateMeta = {
          nome,
          descricao: descricao || undefined,
          valorAlvo: valorNumerico,
          tipo,
          dataInicio: parseDateFromInput(dataInicio),
          dataFim: parseDateFromInput(dataFim),
          categoriaId,
        };
        await atualizarMeta(meta.id, dadosUpdate);
      } else {
        await criarMeta(dadosMeta);
        clearForm();
      }

      onSave();
      onClose();
    } catch (error) {
      console.error('Erro ao salvar meta:', error);
      Alert.alert(
        'Erro',
        error instanceof Error ? error.message : 'Erro ao salvar meta'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!meta) return;
    
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza que deseja excluir esta meta? Esta ação não pode ser desfeita.',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await deletarMeta(meta.id);
              if (onDelete) {
                onDelete();
              }
              onSave();
              onClose();
            } catch (error) {
              console.error('Erro ao excluir meta:', error);
              Alert.alert(
                'Erro',
                error instanceof Error ? error.message : 'Erro ao excluir meta'
              );
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const formatMoney = (value: string): string => {
    const numericValue = value.replace(/[^\d,]/g, '');
    return numericValue;
  };

  const formatDate = (value: string): string => {
    const numericValue = value.replace(/\D/g, '');
    if (numericValue.length <= 2) {
      return numericValue;
    } else if (numericValue.length <= 4) {
      return `${numericValue.slice(0, 2)}/${numericValue.slice(2)}`;
    } else {
      return `${numericValue.slice(0, 2)}/${numericValue.slice(2, 4)}/${numericValue.slice(4, 8)}`;
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={styles.modalBody}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <View style={styles.headerLeft}>
                  <TextStyled
                    text={isEditing ? 'Editar Meta' : 'Nova Meta'}
                    type="subtitle"
                    fontWeight="bold"
                    size={24}
                  />
                </View>
                <View style={styles.headerRight}>
                  {isEditing && (
                    <TouchableOpacity 
                      onPress={handleDelete} 
                      style={styles.deleteButton}
                      disabled={loading}
                    >
                      <Ionicons name="trash-outline" size={20} color={Colors.light.darkRed} />
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                    <Ionicons name="close" size={24} color={Colors.light.textSecondary} />
                  </TouchableOpacity>
                </View>
              </View>

              <ScrollView
                contentContainerStyle={styles.formContainer}
                showsVerticalScrollIndicator={false}
              >
                  <Input
                    id="nome"
                    label="Nome da Meta"
                    placeholder="Ex: Economizar para viagem"
                    value={nome}
                  onChange={setNome}
                />
                <Input
                  id="descricao"
                  label="Descrição (opcional)"
                  placeholder="Descreva sua meta..."
                  value={descricao}
                  onChange={setDescricao}
                />

                <Input
                  id="valorAlvo"
                  label="Valor Alvo"
                  placeholder="0,00"
                  value={valorAlvo}
                  onChange={(value) => setValorAlvo(formatMoney(value))}
                  keyboardType="numeric"
                  type="money"
                />

                <View style={styles.selectContainer}>
                  <Text style={styles.selectLabel}>Tipo de Meta</Text>
                  <View style={styles.customSelectWrapper}>
                    <TouchableOpacity 
                      style={styles.customSelectButton}
                      onPress={() => setShowTipoModal(true)}
                    >
                      <TextStyled
                        text={tiposMetaOptions.find(opt => opt.value === tipo)?.label || 'Selecione o tipo'}
                        color={Colors.light.text}
                      />
                      <Ionicons name="chevron-down" size={20} color={Colors.light.textSecondary} />
                    </TouchableOpacity>
                  </View>
                </View>

                <Input
                  id="dataInicio"
                  label="Data de Início"
                  placeholder="DD/MM/AAAA"
                  value={dataInicio}
                  onChange={(value) => setDataInicio(formatDate(value))}
                  keyboardType="numeric"
                />

                <Input
                  id="dataFim"
                  label="Data de Fim"
                  placeholder="DD/MM/AAAA"
                  value={dataFim}
                  onChange={(value) => setDataFim(formatDate(value))}
                  keyboardType="numeric"
                />

                <View style={styles.selectContainer}>
                  <Text style={styles.selectLabel}>Categoria (opcional)</Text>
                  <View style={styles.customSelectWrapper}>
                    <TouchableOpacity 
                      style={styles.customSelectButton}
                      onPress={() => setShowCategoriaModal(true)}
                    >
                      <TextStyled
                        text={
                          categoriaId 
                            ? categorias.find(cat => cat.id === categoriaId)?.nome || 'Categoria não encontrada'
                            : 'Selecione uma categoria'
                        }
                        color={Colors.light.text}
                      />
                      <Ionicons name="chevron-down" size={20} color={Colors.light.textSecondary} />
                    </TouchableOpacity>
                  </View>
                </View>
              </ScrollView>

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={handleClose}
                  disabled={loading}
                >
                  <TextStyled
                    text="Cancelar"
                    fontWeight="medium"
                    color={Colors.light.textSecondary}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.saveButton, loading && styles.saveButtonDisabled]}
                  onPress={handleSave}
                  disabled={loading || !nome || !valorAlvo || !dataInicio || !dataFim}
                >
                  {loading ? (
                    <ActivityIndicator size="small" color={Colors.light.bgWhite} />
                  ) : (
                    <TextStyled
                      text={isEditing ? 'Atualizar' : 'Criar Meta'}
                      fontWeight="bold"
                      color={Colors.light.bgWhite}
                    />
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>

      {/* Modal para selecionar tipo de meta */}
      <Modal
        animationType="fade"
        transparent
        visible={showTipoModal}
        onRequestClose={() => setShowTipoModal(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowTipoModal(false)}>
          <View style={styles.modalBody}>
            <TouchableWithoutFeedback>
              <View style={styles.selectorModal}>
                <TextStyled
                  text="Selecionar Tipo de Meta"
                  fontWeight="bold"
                  size={18}
                />
                {tiposMetaOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.selectorOption,
                      tipo === option.value && styles.selectedOption
                    ]}
                    onPress={() => {
                      setTipo(option.value);
                      setShowTipoModal(false);
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }}
                  >
                    <TextStyled
                      text={option.label}
                      color={tipo === option.value ? Colors.light.green : Colors.light.text}
                      fontWeight={tipo === option.value ? "bold" : "normal"}
                    />
                    {tipo === option.value && (
                      <Ionicons name="checkmark" size={20} color={Colors.light.green} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Modal para selecionar categoria */}
      <Modal
        animationType="fade"
        transparent
        visible={showCategoriaModal}
        onRequestClose={() => setShowCategoriaModal(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowCategoriaModal(false)}>
          <View style={styles.modalBody}>
            <TouchableWithoutFeedback>
              <View style={styles.selectorModal}>
                <TextStyled
                  text="Selecionar Categoria"
                  fontWeight="bold"
                  size={18}
                />
                <TouchableOpacity
                  style={[
                    styles.selectorOption,
                    !categoriaId && styles.selectedOption
                  ]}
                  onPress={() => {
                    setCategoriaId(undefined);
                    setShowCategoriaModal(false);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                >
                  <TextStyled
                    text="Sem categoria"
                    color={!categoriaId ? Colors.light.green : Colors.light.text}
                    fontWeight={!categoriaId ? "bold" : "normal"}
                  />
                  {!categoriaId && (
                    <Ionicons name="checkmark" size={20} color={Colors.light.green} />
                  )}
                </TouchableOpacity>
                {categorias.map((categoria) => (
                  <TouchableOpacity
                    key={categoria.id}
                    style={[
                      styles.selectorOption,
                      categoriaId === categoria.id && styles.selectedOption
                    ]}
                    onPress={() => {
                      setCategoriaId(categoria.id);
                      setShowCategoriaModal(false);
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }}
                  >
                    <TextStyled
                      text={categoria.nome}
                      color={categoriaId === categoria.id ? Colors.light.green : Colors.light.text}
                      fontWeight={categoriaId === categoria.id ? "bold" : "normal"}
                    />
                    {categoriaId === categoria.id && (
                      <Ionicons name="checkmark" size={20} color={Colors.light.green} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </Modal>
  );
};

