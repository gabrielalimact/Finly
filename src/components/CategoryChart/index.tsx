import { TextStyled } from '@/components/TextStyled';
import { Colors } from '@/constants/Colors';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export interface CategoryData {
  nome: string;
  totalReceitas: number;
  totalDespesas: number;
  total: number;
  percentage: number;
}

interface CategoryChartProps {
  data: CategoryData[];
  hideValues?: boolean;
  title?: string;
}

export const CategoryChart: React.FC<CategoryChartProps> = ({ 
  data, 
  hideValues = false, 
  title = "Gastos por Categoria" 
}) => {
  const formatCurrency = (value: number) => {
    if (hideValues) return 'R$ ****';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    if (hideValues) return '**%';
    return `${value.toFixed(1)}%`;
  };

  const getCategoryColor = (index: number) => {
    const colors = [
      Colors.light.green,
      Colors.light.darkRed,
      Colors.light.blue,
      Colors.light.yellow,
      Colors.light.pink,
      Colors.light.lightGreen,
      Colors.light.lightBlue,
      Colors.light.lightRed,
    ];
    return colors[index % colors.length];
  };

  if (!data || data.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <TextStyled 
          text={title} 
          type="subtitle" 
          fontWeight="bold" 
          color={Colors.light.black} 
        />
        <Text style={styles.emptyText}>Nenhum dado disponível</Text>
      </View>
    );
  }

  // Ordenar por valor (despesas) decrescente
  const sortedData = [...data]
    .filter(item => item.totalDespesas > 0)
    .sort((a, b) => b.totalDespesas - a.totalDespesas)
    .slice(0, 6); // Mostrar apenas top 6 categorias

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TextStyled 
          text={title} 
          type="subtitle" 
          fontWeight="bold" 
          color={Colors.light.black} 
        />
      </View>

      <ScrollView style={styles.categoriesList} showsVerticalScrollIndicator={false}>
        {sortedData.map((category, index) => {
          const color = getCategoryColor(index);
          
          return (
            <View key={category.nome} style={styles.categoryItem}>
              <View style={styles.categoryInfo}>
                <View style={styles.categoryHeader}>
                  <View style={[styles.categoryDot, { backgroundColor: color }]} />
                  <Text style={styles.categoryName} numberOfLines={1}>
                    {category.nome}
                  </Text>
                </View>
                
                <View style={styles.categoryValues}>
                  <Text style={styles.categoryAmount}>
                    {formatCurrency(category.totalDespesas)}
                  </Text>
                  <Text style={styles.categoryPercentage}>
                    {formatPercentage(category.percentage)}
                  </Text>
                </View>
              </View>

              {/* Barra de progresso */}
              <View style={styles.progressBarContainer}>
                <View
                  style={[
                    styles.progressBar,
                    {
                      backgroundColor: color,
                      width: `${category.percentage}%`,
                    }
                  ]}
                />
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.bgWhite,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  header: {
    marginBottom: 16,
  },
  emptyContainer: {
    backgroundColor: Colors.light.bgWhite,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  emptyText: {
    color: Colors.light.textSecondary,
    fontSize: 14,
  },
  categoriesList: {
    maxHeight: 300,
  },
  categoryItem: {
    marginBottom: 16,
  },
  categoryInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  categoryName: {
    fontSize: 14,
    color: Colors.light.black,
    fontWeight: '500',
    flex: 1,
  },
  categoryValues: {
    alignItems: 'flex-end',
  },
  categoryAmount: {
    fontSize: 14,
    color: Colors.light.black,
    fontWeight: 'bold',
  },
  categoryPercentage: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: Colors.light.bgGray,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 2,
  },
});
