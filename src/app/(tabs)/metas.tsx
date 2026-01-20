import { MetaCard } from '@/components/MetaCard';
import { MetaModal } from '@/components/MetaModal';
import { TextStyled } from '@/components/TextStyled';
import { Colors } from '@/constants/Colors';
import {
  atualizarProgressoMetas,
  deletarMeta,
  IMeta,
  listarMetas,
} from '@/services/metas-service';
import { showMetaConcluida, showMultiplasMetasConcluidas } from '@/services/notification-service';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function MetasScreen() {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'ativa' | 'concluida' | 'vencida'>('all');
  const [metas, setMetas] = useState<IMeta[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [metaToEdit, setMetaToEdit] = useState<IMeta | undefined>();
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const loadMetas = async () => {
    try {
      setLoading(true);
      
      // Primeiro, atualiza o progresso das metas
      try {
        const resultado = await atualizarProgressoMetas();
        
        // Se houve metas concluídas, exibe notificações
        if (resultado.metasConcluidas && resultado.metasConcluidas.length > 0) {
          if (resultado.metasConcluidas.length === 1) {
            await showMetaConcluida(resultado.metasConcluidas[0]);
          } else {
            await showMultiplasMetasConcluidas(resultado.metasConcluidas);
          }
        }
      } catch (progressError) {
        console.warn('Erro ao atualizar progresso das metas:', progressError);
        // Continua mesmo se der erro na atualização do progresso
      }
      
      // Depois carrega as metas atualizadas
      const data = await listarMetas();
      setMetas(data);
      setLastUpdate(new Date()); // Marca horário da última atualização
    } catch (error) {
      console.error('Erro ao carregar metas:', error);
      Alert.alert(
        'Erro',
        error instanceof Error ? error.message : 'Erro ao carregar metas'
      );
      setMetas([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      
      // Primeiro, atualiza o progresso das metas
      try {
        const resultado = await atualizarProgressoMetas();
        
        // Se houve metas concluídas, exibe notificações
        if (resultado.metasConcluidas && resultado.metasConcluidas.length > 0) {
          if (resultado.metasConcluidas.length === 1) {
            await showMetaConcluida(resultado.metasConcluidas[0]);
          } else {
            await showMultiplasMetasConcluidas(resultado.metasConcluidas);
          }
        }
      } catch (progressError) {
        console.warn('Erro ao atualizar progresso das metas:', progressError);
      }

      const data = await listarMetas();
      setMetas(data);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Erro ao recarregar metas:', error);
      Alert.alert(
        'Erro',
        error instanceof Error ? error.message : 'Erro ao recarregar metas'
      );
    } finally {
      setRefreshing(false);
    }
  };

  const handleMetaPress = (meta: IMeta) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setMetaToEdit(meta);
    setModalVisible(true);
  };

  const handleCreateMeta = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setMetaToEdit(undefined);
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setMetaToEdit(undefined);
  };

  const handleMetaSave = () => {
    loadMetas();
  };

  const handleMetaDelete = async (meta: IMeta) => {
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
              await deletarMeta(meta.id);
              loadMetas();
            } catch (error) {
              console.error('Erro ao excluir meta:', error);
              Alert.alert(
                'Erro',
                error instanceof Error ? error.message : 'Erro ao excluir meta'
              );
            }
          },
        },
      ]
    );
  };


  useFocusEffect(
    useCallback(() => {
      loadMetas();
    }, [])
  );

  const filteredMetas = selectedFilter === 'all' 
    ? metas 
    : metas.filter(meta => meta.status === selectedFilter);

  const renderFilterButton = (filter: typeof selectedFilter, title: string, icon: string) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        selectedFilter === filter && styles.activeFilterButton
      ]}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setSelectedFilter(filter);
      }}
    >
      <Ionicons 
        name={icon as any} 
        size={16} 
        color={selectedFilter === filter ? Colors.light.bgWhite : Colors.light.textSecondary} 
      />
      <Text style={[
        styles.filterButtonText,
        selectedFilter === filter && styles.activeFilterButtonText
      ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  const renderMetaItem = ({ item }: { item: IMeta }) => {
    return (
      <MetaCard
        meta={item}
        onPress={handleMetaPress}
        onDelete={handleMetaDelete}
      />
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <FontAwesome name="bullseye" size={64} color={Colors.light.textSecondary} />
      <Text style={styles.emptyTitle}>Nenhuma meta encontrada</Text>
      <Text style={styles.emptyDescription}>
        {selectedFilter === 'all' 
          ? 'Que tal criar sua primeira meta financeira?'
          : `Nenhuma meta ${selectedFilter} encontrada.`
        }
      </Text>
    </View>
  );

  if (loading && metas.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TextStyled text="Metas" type="title" fontWeight="bold" size={28} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.light.green} />
          <Text style={styles.loadingText}>Carregando metas...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TextStyled text="Metas" type="title" fontWeight="bold" size={28} />
        <View style={styles.headerButtons}>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={handleCreateMeta}
          >
            <Ionicons name="add" size={24} color={Colors.light.bgWhite} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
        contentContainerStyle={styles.filterContainer}
      >
        {renderFilterButton('all', 'Todas', 'grid-outline')}
        {renderFilterButton('ativa', 'Ativas', 'play-circle-outline')}
        {renderFilterButton('concluida', 'Concluídas', 'checkmark-circle-outline')}
        {renderFilterButton('vencida', 'Vencidas', 'time-outline')}
      </ScrollView>


      {lastUpdate && (
        <View style={styles.lastUpdateContainer}>
          <Text style={styles.lastUpdateText}>
            Última atualização: {lastUpdate.toLocaleTimeString('pt-BR', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </Text>
        </View>
      )}

      <FlatList
        data={filteredMetas}
        renderItem={renderMetaItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={[
          styles.listContainer,
          filteredMetas.length === 0 && styles.emptyListContainer
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[Colors.light.green]}
            tintColor={Colors.light.green}
          />
        }
        ListEmptyComponent={renderEmptyState}
      />

      <MetaModal
        visible={modalVisible}
        onClose={handleModalClose}
        onSave={handleMetaSave}
        onDelete={handleMetaSave}
        meta={metaToEdit}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.bgPrimary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  addButton: {
    backgroundColor: Colors.light.green,
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  refreshButton: {
    backgroundColor: Colors.light.bgWhite,
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.light.green,
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  filterScroll: {
    maxHeight: 52,
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.light.bgWhite,
    borderWidth: 1,
    borderColor: Colors.light.border,
    gap: 6,
  },
  activeFilterButton: {
    backgroundColor: Colors.light.green,
    borderColor: Colors.light.green,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.light.textSecondary,
  },
  activeFilterButtonText: {
    color: Colors.light.bgWhite,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.light.textSecondary,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    gap: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.light.text,
  },
  emptyDescription: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 40,
  },
  lastUpdateContainer: {
    paddingHorizontal: 20,
    paddingBottom: 8,
    alignItems: 'center',
  },
  lastUpdateText: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    fontStyle: 'italic',
  },
  debugButton: {
    backgroundColor: Colors.light.bgWhite,
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.light.green,
  },
});
