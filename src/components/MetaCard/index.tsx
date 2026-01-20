import { Colors } from '@/constants/Colors';
import {
  IMeta,
  calcularDiasRestantes,
  formatarPorcentagem,
  formatarValorMeta,
  getCorStatusMeta,
  getStatusMetaTexto,
  getTipoMetaTexto,
  isMetaVencida,
} from '@/services/metas-service';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

interface MetaCardProps {
  meta: IMeta;
  onPress: (meta: IMeta) => void;
  onDelete: (meta: IMeta) => void;
}

export const MetaCard: React.FC<MetaCardProps> = ({ meta, onPress, onDelete }) => {
  const porcentagem = meta.porcentagemConcluida;
  const corStatus = getCorStatusMeta(meta.status);
  const diasRestantes = calcularDiasRestantes(meta.dataFim);
  const vencida = isMetaVencida(meta);

  return (
    <TouchableOpacity 
      style={styles.metaCard} 
      onPress={() => onPress(meta)}
      activeOpacity={0.7}
    >
      <View style={styles.metaHeader}>
        <View style={styles.metaInfo}>
          <Text style={styles.metaNome} numberOfLines={1}>{meta.nome}</Text>
          <Text style={styles.metaTipo}>{getTipoMetaTexto(meta.tipo)}</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={(e) => {
              e.stopPropagation();
              onDelete(meta);
            }}
            activeOpacity={0.7}
          >
            <Ionicons name="trash-outline" size={18} color={Colors.light.darkRed} />
          </TouchableOpacity>
          <View style={[styles.statusBadge, { backgroundColor: corStatus }]}>
            <Text style={styles.statusText}>{getStatusMetaTexto(meta.status)}</Text>
          </View>
        </View>
      </View>

      {meta.descricao && (
        <Text style={styles.metaDescricao} numberOfLines={2}>
          {meta.descricao}
        </Text>
      )}

      <View style={styles.metaValores}>
        <View style={styles.valorInfo}>
          <Text style={styles.valorLabel}>Atual</Text>
          <Text style={[styles.valorAtual, { color: corStatus }]}>
            R$ {formatarValorMeta(meta.valorAtual)}
          </Text>
        </View>
        <View style={styles.valorInfo}>
          <Text style={styles.valorLabel}>Meta</Text>
          <Text style={styles.valorMeta}>
            R$ {formatarValorMeta(meta.valorAlvo)}
          </Text>
        </View>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { 
                width: `${Math.min(porcentagem, 100)}%`,
                backgroundColor: corStatus
              }
            ]} 
          />
        </View>
        <Text style={[styles.progressText, { color: corStatus }]}>
          {formatarPorcentagem(porcentagem)}
        </Text>
      </View>

      <View style={styles.metaFooter}>
        {meta.categoria && (
          <View style={styles.categoriaContainer}>
            <FontAwesome name="tag" size={12} color={Colors.light.textSecondary} />
            <Text style={styles.categoriaText}>{meta.categoria.nome}</Text>
          </View>
        )}
        
        <View style={styles.diasContainer}>
          <Ionicons 
            name="calendar-outline" 
            size={14} 
            color={vencida ? Colors.light.darkRed : Colors.light.textSecondary} 
          />
          <Text style={[
            styles.diasText,
            vencida && styles.diasVencidos
          ]}>
            {diasRestantes > 0 
              ? `${diasRestantes} dias restantes` 
              : diasRestantes === 0 
              ? 'Vence hoje'
              : `Venceu há ${Math.abs(diasRestantes)} dias`
            }
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  metaCard: {
    backgroundColor: Colors.light.bgWhite,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  metaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  metaInfo: {
    flex: 1,
    marginRight: 12,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  deleteButton: {
    padding: 6,
    borderRadius: 12,
    backgroundColor: '#fee2e2', // light red background
    alignItems: 'center',
    justifyContent: 'center',
  },
  metaNome: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 4,
  },
  metaTipo: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.bgWhite,
  },
  metaDescricao: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  metaValores: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  valorInfo: {
    alignItems: 'center',
  },
  valorLabel: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginBottom: 4,
    fontWeight: '500',
  },
  valorAtual: {
    fontSize: 18,
    fontWeight: '700',
  },
  valorMeta: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: Colors.light.bgGray,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    minWidth: 40,
    textAlign: 'right',
  },
  metaFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoriaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  categoriaText: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    fontWeight: '500',
  },
  diasContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  diasText: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    fontWeight: '500',
  },
  diasVencidos: {
    color: Colors.light.darkRed,
    fontWeight: '600',
  },
});
