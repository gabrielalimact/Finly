import { Colors } from '@/constants/Colors'
import { IUser } from '@/src/DTO/IUser'
import { Text, View } from 'react-native'
import Svg from 'react-native-svg'
import { VictoryPie } from 'victory-native'
import { styles } from './styles'

type PieChartHomeProps = {
  user: IUser
}
const PieChartHome = ({ user }: PieChartHomeProps) => {
  return (
    <View style={styles.chartContainer}>
      <Svg width={200} height={200}>
        <VictoryPie
          standalone={false}
          width={200}
          height={200}
          innerRadius={90}
          padding={20}
          data={[
            {
              x: 'Receitas',
              y: user.valorTotalReceitas,
              color: Colors.light.positiveBg
            },
            {
              x: 'Despesas',
              y: user.valorTotalDespesas,
              color: Colors.light.negativeBg
            }
          ]}
          cornerRadius={20}
          padAngle={2}
          style={{
            data: {
              fill: ({ datum }) => datum.color
            }
          }}
          labels={() => null}
        />
      </Svg>

      <View style={styles.chartContent}>
        <Text
          style={[
            styles.text,
            user.saldo >= 0 ? styles.positiveText : styles.negativeText
          ]}
        >
          {user.saldo.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          })}
        </Text>
      </View>
    </View>
  )
}

export default PieChartHome
