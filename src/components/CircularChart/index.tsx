import { TextStyled } from '@/components/TextStyled';
import { Colors } from '@/constants/Colors';
import React from 'react';
import { View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { styles } from './styles';

interface CircularChartProps {
  income: number;
  expenses: number;
  hideValues?: boolean;
  selectedMonth?: number;
}

export const CircularChart = ({ income, expenses, hideValues = false, selectedMonth }: CircularChartProps) => {
  const total = income + expenses;
  const balance = income - expenses;
  
  const size = 200;
  const strokeWidth = 20;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  
  const incomePercentage = total > 0 ? (income / total) * 100 : 0;
  const expensePercentage = total > 0 ? (expenses / total) * 100 : 0;
  
  const incomeStrokeDasharray = `${(incomePercentage / 100) * circumference} ${circumference}`;
  const expenseStrokeDasharray = `${(expensePercentage / 100) * circumference} ${circumference}`;
  const expenseStrokeDashoffset = -((incomePercentage / 100) * circumference);

  const formatCurrency = (value: number) => {
    if (hideValues) return 'R$ ****,**';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = () => {
    const currentMonth = selectedMonth !== undefined ? selectedMonth : new Date().getMonth();
    const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
    return `${months[currentMonth]}/2026`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.chartContainer}>
        <Svg width={size} height={size} style={styles.svg}>
          {/* Círculo de fundo */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={Colors.light.bgGray}
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          
          {/* Círculo das receitas */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={Colors.light.positiveText}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={incomeStrokeDasharray}
            strokeDashoffset={0}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
          
          {/* Círculo das despesas */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={Colors.light.negativeText}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={expenseStrokeDasharray}
            strokeDashoffset={expenseStrokeDashoffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </Svg>
        
        {/* Informações centrais */}
        <View style={styles.centerInfo}>
          <TextStyled
            text="Saldo em"
            color={Colors.light.textSecondary}
            fontSize={12}
          />
          <TextStyled
            text={formatDate()}
            fontWeight="bold"
            color={Colors.light.textSecondary}
            fontSize={12}
          />
          <TextStyled
            text={formatCurrency(balance)}
            fontWeight="bold"
            color={balance >= 0 ? Colors.light.positiveText : Colors.light.negativeText}
            fontSize={18}
          />
        </View>
      </View>

      {/* Legenda personalizada */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: Colors.light.positiveText }]} />
          <View style={styles.legendText}>
            <TextStyled text="Receitas" fontSize={12} color={Colors.light.textSecondary} />
            <TextStyled 
              text={formatCurrency(income)} 
              fontWeight="bold" 
              fontSize={14}
              color={Colors.light.positiveText}
            />
          </View>
        </View>
        
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: Colors.light.negativeText }]} />
          <View style={styles.legendText}>
            <TextStyled text="Despesas" fontSize={12} color={Colors.light.textSecondary} />
            <TextStyled 
              text={formatCurrency(expenses)} 
              fontWeight="bold" 
              fontSize={14}
              color={Colors.light.negativeText}
            />
          </View>
        </View>
      </View>
    </View>
  );
};
