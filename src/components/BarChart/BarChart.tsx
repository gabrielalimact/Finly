import { TextStyled } from '@/components/TextStyled';
import { Colors } from '@/constants/Colors';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export interface BarChartData {
  label: string;
  income: number;
  expenses: number;
  month: number;
  year: number;
}

interface BarChartProps {
  data: BarChartData[];
  hideValues?: boolean;
  onBarPress?: (data: BarChartData) => void;
}

export const BarChart: React.FC<BarChartProps> = ({ data, hideValues = false, onBarPress }) => {
  if (!data || data.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Nenhum dado disponível</Text>
      </View>
    );
  }

  // Encontrar o valor máximo para normalizar as barras
  const maxValue = Math.max(
    ...data.map(item => Math.max(item.income, item.expenses))
  );

  const formatCurrency = (value: number) => {
    if (hideValues) return 'R$ ****';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getBarHeight = (value: number) => {
    if (maxValue === 0) return 0;
    return Math.max((value / maxValue) * 120, 2); // Altura mínima de 2px
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TextStyled 
          text="Evolução Mensal" 
          type="subtitle" 
          fontWeight="bold" 
          color={Colors.light.black} 
        />
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: Colors.light.green }]} />
            <Text style={styles.legendText}>Receitas</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: Colors.light.darkRed }]} />
            <Text style={styles.legendText}>Despesas</Text>
          </View>
        </View>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chartContainer}
      >
        {data.map((item, index) => (
          <TouchableOpacity
            key={`${item.year}-${item.month}`}
            style={styles.barContainer}
            onPress={() => onBarPress?.(item)}
            activeOpacity={0.7}
          >
            <View style={styles.barsWrapper}>
              {/* Barra de Receitas */}
              <View style={styles.barGroup}>
                <View
                  style={[
                    styles.bar,
                    {
                      height: getBarHeight(item.income),
                      backgroundColor: Colors.light.green,
                    }
                  ]}
                />
                {!hideValues && (
                  <Text style={[styles.barValue, styles.incomeValue]}>
                    {formatCurrency(item.income)}
                  </Text>
                )}
              </View>

              {/* Barra de Despesas */}
              <View style={styles.barGroup}>
                <View
                  style={[
                    styles.bar,
                    {
                      height: getBarHeight(item.expenses),
                      backgroundColor: Colors.light.darkRed,
                    }
                  ]}
                />
                {!hideValues && (
                  <Text style={[styles.barValue, styles.expenseValue]}>
                    {formatCurrency(item.expenses)}
                  </Text>
                )}
              </View>
            </View>

            {/* Label do mês */}
            <Text style={styles.monthLabel}>{item.label}</Text>
          </TouchableOpacity>
        ))}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  legend: {
    flexDirection: 'row',
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  emptyContainer: {
    backgroundColor: Colors.light.bgWhite,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyText: {
    color: Colors.light.textSecondary,
    fontSize: 14,
  },
  chartContainer: {
    paddingHorizontal: 8,
    gap: 16,
  },
  barContainer: {
    alignItems: 'center',
    minWidth: 60,
  },
  barsWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
    height: 140,
    marginBottom: 8,
  },
  barGroup: {
    alignItems: 'center',
    flex: 1,
  },
  bar: {
    width: 20,
    borderRadius: 4,
    minHeight: 2,
  },
  barValue: {
    fontSize: 10,
    marginTop: 4,
    textAlign: 'center',
  },
  incomeValue: {
    color: Colors.light.green,
  },
  expenseValue: {
    color: Colors.light.darkRed,
  },
  monthLabel: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    textAlign: 'center',
  },
});
